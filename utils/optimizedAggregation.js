/**
 * Optimized aggregation pipeline for Uilchluulegch queries
 * Replaces slow find() queries with efficient aggregation
 * Handles complex $or conditions with nested tuukh array fields
 */

/**
 * Execute optimized aggregation query for Uilchluulegch
 * Optimized for queries with $or conditions on tuukh fields
 * @param {Model} model - Mongoose model
 * @param {Object} query - MongoDB query object (can include $or with tuukh conditions)
 * @param {Object} options - Options including pagination, sorting, search
 * @returns {Promise<Object>} Result with jagsaalt, niitMur, niitKhuudas
 */
async function executeOptimizedAggregation(model, query = {}, options = {}) {
  try {
    const {
      khuudasniiDugaar = 1,
      khuudasniiKhemjee = 500,
      order = {},
      search = null,
    } = options;

    const pipeline = [];

    // Stage 1: Initial $match - filter by most selective fields first
    const baseMatch = {};

    // Always include baiguullagiinId and barilgiinId if present (highly selective)
    if (query.baiguullagiinId) {
      baseMatch.baiguullagiinId = query.baiguullagiinId;
    }
    if (query.barilgiinId) {
      baseMatch.barilgiinId = query.barilgiinId;
    }

    // Handle createdAt date range (wider range for month filtering)
    if (query.createdAt) {
      baseMatch.createdAt = query.createdAt;
    }

    // Add other direct field matches (excluding $or, $and, and tuukh fields)
    Object.keys(query).forEach((key) => {
      if (
        key !== "baiguullagiinId" &&
        key !== "barilgiinId" &&
        key !== "createdAt" &&
        key !== "$or" &&
        key !== "$and" &&
        !key.startsWith("tuukh.")
      ) {
        baseMatch[key] = query[key];
      }
    });

    if (Object.keys(baseMatch).length > 0) {
      pipeline.push({ $match: baseMatch });
    }

    // Check if we actually need to process tuukh array
    // If query has no tuukh-related conditions, we can skip the complex unwinding
    const hasTuukhConditions =
      (query.$or &&
        query.$or.some(
          (or) =>
            or["tuukh.0.garsanKhaalga"] !== undefined ||
            or["tuukh.tsagiinTuukh.garsanTsag"] ||
            or["tuukh.0.tsagiinTuukh.0.garsanTsag"]
        )) ||
      query["tuukh.0.garsanKhaalga"] !== undefined ||
      query["tuukh.tsagiinTuukh.garsanTsag"] ||
      query["tuukh.0.tsagiinTuukh.0.garsanTsag"] ||
      (order &&
        Object.keys(order).some(
          (k) => k.includes("tuukh") || k.includes("tsagiinTuukh")
        ));

    // If no tuukh conditions, use simpler pipeline
    if (!hasTuukhConditions) {
      // Simple case: no tuukh filtering needed, just paginate and sort
      if (search) {
        pipeline.push({
          $match: {
            $or: [{ mashiniiDugaar: { $regex: search, $options: "i" } }],
          },
        });
      }

      // Sort
      if (order && Object.keys(order).length > 0) {
        pipeline.push({ $sort: order });
      } else {
        pipeline.push({ $sort: { createdAt: -1 } });
      }

      // Pagination with facet
      const facetPipeline = [
        {
          $facet: {
            total: [{ $count: "count" }],
            data: [
              { $skip: (khuudasniiDugaar - 1) * khuudasniiKhemjee },
              { $limit: khuudasniiKhemjee },
            ],
          },
        },
        {
          $project: {
            jagsaalt: "$data",
            niitMur: { $ifNull: [{ $arrayElemAt: ["$total.count", 0] }, 0] },
          },
        },
      ];

      const finalPipeline = [...pipeline, ...facetPipeline];
      const result = await model
        .aggregate(finalPipeline)
        .allowDiskUse(false)
        .exec();

      if (result && result.length > 0) {
        const data = result[0];
        const niitKhuudas = Math.ceil(data.niitMur / khuudasniiKhemjee);

        return {
          jagsaalt: data.jagsaalt || [],
          niitMur: data.niitMur || 0,
          niitKhuudas: niitKhuudas,
          khuudasniiDugaar: khuudasniiDugaar,
          khuudasniiKhemjee: khuudasniiKhemjee,
        };
      }

      return {
        jagsaalt: [],
        niitMur: 0,
        niitKhuudas: 0,
        khuudasniiDugaar: khuudasniiDugaar,
        khuudasniiKhemjee: khuudasniiKhemjee,
      };
    }

    // Stage 2: Store original tuukh array before unwinding and handle missing tuukh
    pipeline.push({
      $addFields: {
        originalTuukh: {
          $cond: {
            if: { $isArray: "$tuukh" },
            then: "$tuukh",
            else: [], // Default to empty array if tuukh is not an array
          },
        },
      },
    });

    // Stage 3: Filter out documents without tuukh array or with empty tuukh
    // Only process documents that have tuukh array with at least one element
    pipeline.push({
      $match: {
        originalTuukh: { $exists: true, $ne: [], $type: "array" },
      },
    });

    // Stage 4: Unwind tuukh array to work with nested fields efficiently
    pipeline.push({
      $unwind: {
        path: "$tuukh",
        preserveNullAndEmptyArrays: false, // Only keep documents with tuukh
      },
    });

    // Stage 5: Early filtering on tuukh level - filter out irrelevant tuukh elements BEFORE further processing
    // This significantly reduces the number of documents we process
    const earlyTuukhFilter = {};

    // If query has specific tuukh conditions, apply them early
    if (query["tuukh.0.garsanKhaalga"] !== undefined) {
      earlyTuukhFilter["tuukh.garsanKhaalga"] = query["tuukh.0.garsanKhaalga"];
    }

    // Filter out tuukh without garsanKhaalga if that's what we're looking for
    if (query.$or) {
      const hasGarsanKhaalgaCondition = query.$or.some(
        (or) => or["tuukh.0.garsanKhaalga"] !== undefined
      );
      const hasNoGarsanKhaalgaCondition = query.$or.some(
        (or) =>
          or["tuukh.0.garsanKhaalga"] === null ||
          (or["tuukh.0.garsanKhaalga"] &&
            typeof or["tuukh.0.garsanKhaalga"] === "object" &&
            or["tuukh.0.garsanKhaalga"].$exists === false)
      );

      // If we have both conditions in $or, we can't filter early
      // But if we only have one, we can filter
      if (hasGarsanKhaalgaCondition && !hasNoGarsanKhaalgaCondition) {
        // Only keep tuukh with garsanKhaalga
        earlyTuukhFilter["tuukh.garsanKhaalga"] = { $exists: true, $ne: null };
      }
    }

    // Apply early filter if we have conditions
    if (Object.keys(earlyTuukhFilter).length > 0) {
      pipeline.push({ $match: earlyTuukhFilter });
    }

    // Stage 6: Check if we need to unwind tsagiinTuukh based on query
    const needsTsagiinTuukhUnwind =
      (query.$or &&
        query.$or.some(
          (or) =>
            or["tuukh.tsagiinTuukh.garsanTsag"] ||
            or["tuukh.0.tsagiinTuukh.0.garsanTsag"]
        )) ||
      query["tuukh.tsagiinTuukh.garsanTsag"] ||
      query["tuukh.0.tsagiinTuukh.0.garsanTsag"] ||
      (order &&
        Object.keys(order).some((k) => k.includes("tsagiinTuukh.garsanTsag")));

    if (needsTsagiinTuukhUnwind) {
      // Only unwind tsagiinTuukh if query needs it
      // Use preserveNullAndEmptyArrays: true to keep tuukh without tsagiinTuukh
      pipeline.push({
        $unwind: {
          path: "$tuukh.tsagiinTuukh",
          preserveNullAndEmptyArrays: true, // Keep tuukh even if tsagiinTuukh doesn't exist
        },
      });

      // Filter tsagiinTuukh early if we have date conditions
      if (query.$or) {
        query.$or.forEach((or) => {
          if (or["tuukh.tsagiinTuukh.garsanTsag"]) {
            pipeline.push({
              $match: {
                "tuukh.tsagiinTuukh.garsanTsag":
                  or["tuukh.tsagiinTuukh.garsanTsag"],
              },
            });
          }
        });
      }
    }

    // Stage 7: Match on tuukh-specific conditions (after unwind, much more efficient)
    const tuukhMatch = {};

    // Handle $or conditions - convert nested paths to unwound paths
    if (query.$or && Array.isArray(query.$or)) {
      const tuukhOrConditions = [];

      query.$or.forEach((orCondition) => {
        const condition = {};

        // Handle first branch: tuukh.0.garsanKhaalga with tuukh.tsagiinTuukh.garsanTsag
        if (orCondition["tuukh.0.garsanKhaalga"] !== undefined) {
          condition["tuukh.garsanKhaalga"] =
            orCondition["tuukh.0.garsanKhaalga"];
        }
        if (orCondition["tuukh.tsagiinTuukh.garsanTsag"]) {
          condition["tuukh.tsagiinTuukh.garsanTsag"] =
            orCondition["tuukh.tsagiinTuukh.garsanTsag"];
        }

        // Handle second branch: tuukh.0.garsanKhaalga doesn't exist with createdAt
        // Check for $exists: false or null
        if (
          orCondition["tuukh.0.garsanKhaalga"] === null ||
          (orCondition["tuukh.0.garsanKhaalga"] &&
            typeof orCondition["tuukh.0.garsanKhaalga"] === "object" &&
            orCondition["tuukh.0.garsanKhaalga"].$exists === false)
        ) {
          condition["tuukh.garsanKhaalga"] = { $exists: false };
        }
        if (orCondition.createdAt && !baseMatch.createdAt) {
          // Add createdAt to condition if not already in baseMatch
          condition.createdAt = orCondition.createdAt;
        }

        if (Object.keys(condition).length > 0) {
          tuukhOrConditions.push(condition);
        }
      });

      if (tuukhOrConditions.length > 0) {
        if (tuukhOrConditions.length === 1) {
          Object.assign(tuukhMatch, tuukhOrConditions[0]);
        } else {
          tuukhMatch.$or = tuukhOrConditions;
        }
      }
    }

    // Handle direct tuukh field queries (if not in $or)
    if (query["tuukh.0.garsanKhaalga"] !== undefined) {
      tuukhMatch["tuukh.garsanKhaalga"] = query["tuukh.0.garsanKhaalga"];
    }
    if (query["tuukh.tsagiinTuukh.garsanTsag"]) {
      tuukhMatch["tuukh.tsagiinTuukh.garsanTsag"] =
        query["tuukh.tsagiinTuukh.garsanTsag"];
    }

    if (Object.keys(tuukhMatch).length > 0) {
      pipeline.push({ $match: tuukhMatch });
    }

    // Stage 8: Group back to reconstruct documents
    // Use $first to preserve all root fields and collect matched tuukh
    pipeline.push({
      $group: {
        _id: "$_id",
        // Preserve all root-level fields
        baiguullagiinId: { $first: "$baiguullagiinId" },
        barilgiinId: { $first: "$barilgiinId" },
        mashiniiDugaar: { $first: "$mashiniiDugaar" },
        createdAt: { $first: "$createdAt" },
        updatedAt: { $first: "$updatedAt" },
        __v: { $first: "$__v" },
        // Preserve original tuukh array (before unwinding)
        originalTuukh: { $first: "$originalTuukh" },
        // Collect matched tuukh IDs
        matchedTuukhIds: { $addToSet: "$tuukh._id" },
        // Store sort value for later (handle missing tsagiinTuukh)
        sortValue: {
          $first: {
            $ifNull: ["$tuukh.tsagiinTuukh.garsanTsag", "$createdAt"],
          },
        },
      },
    });

    // Stage 9: Reconstruct document with original structure
    pipeline.push({
      $project: {
        // Preserve all fields
        _id: 1,
        baiguullagiinId: 1,
        barilgiinId: 1,
        mashiniiDugaar: 1,
        createdAt: 1,
        updatedAt: 1,
        __v: 1,
        // Filter original tuukh array to keep only matched elements
        tuukh: {
          $cond: {
            if: {
              $and: [
                { $isArray: "$originalTuukh" },
                { $gt: [{ $size: "$originalTuukh" }, 0] },
              ],
            },
            then: {
              $filter: {
                input: "$originalTuukh",
                as: "t",
                cond: {
                  $or: [
                    // Match by _id (if _id exists)
                    {
                      $and: [
                        { $ne: ["$$t._id", null] },
                        { $in: ["$$t._id", "$matchedTuukhIds"] },
                      ],
                    },
                    // Or if garsanKhaalga doesn't exist (for second $or branch)
                    {
                      $or: [
                        { $eq: [{ $type: "$$t.garsanKhaalga" }, "missing"] },
                        { $eq: ["$$t.garsanKhaalga", null] },
                      ],
                    },
                  ],
                },
              },
            },
            else: [], // If not an array or empty, return empty array
          },
        },
        // Store sort value for sorting
        _sortValue: "$sortValue",
      },
    });

    // Stage 10: Filter out documents with empty tuukh arrays
    pipeline.push({
      $match: {
        tuukh: { $exists: true, $ne: [] },
      },
    });

    // Stage 11: Search filter (if provided)
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { mashiniiDugaar: { $regex: search, $options: "i" } },
            // Add other searchable fields as needed
          ],
        },
      });
    }

    // Stage 12: Sort - optimize to avoid disk usage
    // Use allowDiskUse: false in aggregation options to prevent disk sorting
    // But first, try to sort on indexed fields
    if (order && Object.keys(order).length > 0) {
      const sortField = Object.keys(order)[0];
      const sortOrder = order[sortField];

      // Handle nested sort fields like "tuukh.0.tsagiinTuukh.0.garsanTsag"
      if (sortField.includes("tuukh.0.tsagiinTuukh.0.garsanTsag")) {
        // Use the stored sort value
        pipeline.push({ $sort: { _sortValue: sortOrder } });
      } else if (sortField === "createdAt") {
        // createdAt is indexed, use it directly
        pipeline.push({ $sort: { createdAt: sortOrder } });
      } else {
        pipeline.push({ $sort: { [sortField]: sortOrder } });
      }
    } else {
      // Default sort by createdAt descending (indexed field)
      pipeline.push({ $sort: { createdAt: -1 } });
    }

    // Limit before facet to reduce memory usage
    // But we need to be careful - we need total count too
    // So we'll keep facet but optimize it

    // Stage 13: Remove temporary sort field
    pipeline.push({
      $project: {
        _sortValue: 0, // Remove temporary field
      },
    });

    // Stage 14: Use facet for efficient pagination and counting
    // Optimize: Get count first, then paginate
    const facetPipeline = [
      {
        $facet: {
          // Get total count (cheaper operation)
          total: [{ $count: "count" }],
          // Get paginated data
          data: [
            { $skip: (khuudasniiDugaar - 1) * khuudasniiKhemjee },
            { $limit: khuudasniiKhemjee },
          ],
        },
      },
      {
        $project: {
          jagsaalt: "$data",
          niitMur: { $ifNull: [{ $arrayElemAt: ["$total.count", 0] }, 0] },
        },
      },
    ];

    // Combine main pipeline with facet
    const finalPipeline = [...pipeline, ...facetPipeline];

    // Execute aggregation with options to prevent disk usage if possible
    // Note: allowDiskUse might be needed for large sorts, but we'll try without first
    const result = await model
      .aggregate(finalPipeline)
      .allowDiskUse(false)
      .exec();

    if (result && result.length > 0) {
      const data = result[0];
      const niitKhuudas = Math.ceil(data.niitMur / khuudasniiKhemjee);

      return {
        jagsaalt: data.jagsaalt || [],
        niitMur: data.niitMur || 0,
        niitKhuudas: niitKhuudas,
        khuudasniiDugaar: khuudasniiDugaar,
        khuudasniiKhemjee: khuudasniiKhemjee,
      };
    }

    return {
      jagsaalt: [],
      niitMur: 0,
      niitKhuudas: 0,
      khuudasniiDugaar: khuudasniiDugaar,
      khuudasniiKhemjee: khuudasniiKhemjee,
    };
  } catch (error) {
    console.error("Aggregation error:", error);
    throw error;
  }
}

module.exports = {
  executeOptimizedAggregation,
};
