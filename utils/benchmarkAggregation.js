/**
 * Benchmark script to compare khuudaslalt vs optimized aggregation
 * Measures performance on real data
 */

const { executeOptimizedAggregation } = require("./optimizedAggregation");
const { khuudaslalt } = require("zevbackv2");

/**
 * Benchmark both methods and compare results
 * @param {Model} model - Mongoose model
 * @param {Object} query - Query object
 * @param {Object} options - Options with pagination, sorting, etc.
 * @returns {Promise<Object>} Benchmark results
 */
async function benchmarkMethods(model, query = {}, options = {}) {
  const results = {
    khuudaslalt: null,
    optimizedAggregation: null,
    comparison: null,
  };

  // First, get document count
  try {
    const countQuery = { ...query };
    // Remove $or and tuukh conditions for count
    delete countQuery.$or;
    Object.keys(countQuery).forEach((key) => {
      if (key.startsWith("tuukh.")) {
        delete countQuery[key];
      }
    });

    const totalDocs = await model.countDocuments(countQuery);
    const khuudaslaltStart = Date.now();
    const memBeforeKhuudaslalt = process.memoryUsage();

    try {
      const khuudaslaltResult = await khuudaslalt(model, {
        query,
        ...options,
      });
      const khuudaslaltEnd = Date.now();
      const memAfterKhuudaslalt = process.memoryUsage();

      results.khuudaslalt = {
        success: true,
        duration: khuudaslaltEnd - khuudaslaltStart,
        durationSeconds: ((khuudaslaltEnd - khuudaslaltStart) / 1000).toFixed(2),
        memoryUsed: Math.round(
          (memAfterKhuudaslalt.heapUsed - memBeforeKhuudaslalt.heapUsed) /
            1024 /
            1024
        ),
        resultCount: khuudaslaltResult?.jagsaalt?.length || 0,
        totalCount: khuudaslaltResult?.niitMur || 0,
      };
    } catch (err) {
      results.khuudaslalt = {
        success: false,
        error: err.message,
        duration: Date.now() - khuudaslaltStart,
      };
    }


    // Wait a bit between tests
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Benchmark optimized aggregation
    const aggStart = Date.now();
    const memBeforeAgg = process.memoryUsage();

    try {
      const aggResult = await executeOptimizedAggregation(model, query, options);
      const aggEnd = Date.now();
      const memAfterAgg = process.memoryUsage();

      results.optimizedAggregation = {
        success: true,
        duration: aggEnd - aggStart,
        durationSeconds: ((aggEnd - aggStart) / 1000).toFixed(2),
        memoryUsed: Math.round(
          (memAfterAgg.heapUsed - memBeforeAgg.heapUsed) / 1024 / 1024
        ),
        resultCount: aggResult?.jagsaalt?.length || 0,
        totalCount: aggResult?.niitMur || 0,
      };
    } catch (err) {
      results.optimizedAggregation = {
        success: false,
        error: err.message,
        duration: Date.now() - aggStart,
      };
    }


    // Calculate comparison
    if (
      results.khuudaslalt.success &&
      results.optimizedAggregation.success
    ) {
      const speedup =
        results.khuudaslalt.duration / results.optimizedAggregation.duration;
      const memoryDiff =
        results.optimizedAggregation.memoryUsed -
        results.khuudaslalt.memoryUsed;
      const timeSaved = results.khuudaslalt.duration - results.optimizedAggregation.duration;

      results.comparison = {
        speedup: speedup.toFixed(2) + "x",
        timeSaved: `${(timeSaved / 1000).toFixed(2)}s`,
        timeSavedPercent: (
          (timeSaved / results.khuudaslalt.duration) *
          100
        ).toFixed(1) + "%",
        memoryDiff: `${memoryDiff > 0 ? "+" : ""}${memoryDiff}MB`,
        faster: speedup > 1,
      };
    }

    // Estimate for 200,000 documents
    if (totalDocs > 0 && results.optimizedAggregation.success) {
      const timePerDoc = results.optimizedAggregation.duration / totalDocs;
      const estimated200k = timePerDoc * 200000;
      const estimated200kSeconds = (estimated200k / 1000).toFixed(2);
    }

    return results;
  } catch (error) {
    console.error("❌ Benchmark error:", error);
    throw error;
  }
}

/**
 * Quick performance test - just measure current method
 * @param {Model} model - Mongoose model
 * @param {Object} query - Query object
 * @param {Object} options - Options
 * @returns {Promise<Object>} Performance metrics
 */
async function quickBenchmark(model, query = {}, options = {}) {
  
  const start = Date.now();
  const memBefore = process.memoryUsage();
  
  try {
    const result = await khuudaslalt(model, { query, ...options });
    const end = Date.now();
    const memAfter = process.memoryUsage();
    
    const duration = end - start;
    const memoryUsed = Math.round(
      (memAfter.heapUsed - memBefore.heapUsed) / 1024 / 1024
    );
    
    // Get document count
    const countQuery = { ...query };
    delete countQuery.$or;
    Object.keys(countQuery).forEach((key) => {
      if (key.startsWith("tuukh.")) {
        delete countQuery[key];
      }
    });
    const totalDocs = await model.countDocuments(countQuery);
    
    const timePerDoc = totalDocs > 0 ? duration / totalDocs : 0;
    const estimated200k = timePerDoc * 200000;
    
    return {
      duration,
      durationSeconds: (duration / 1000).toFixed(2),
      memoryUsed,
      totalDocs,
      resultCount: result?.jagsaalt?.length || 0,
      estimated200kSeconds: (estimated200k / 1000).toFixed(2),
      estimated200kMinutes: (estimated200k / 60000).toFixed(1),
    };
  } catch (error) {
    return {
      error: error.message,
      duration: Date.now() - start,
    };
  }
}

module.exports = {
  benchmarkMethods,
  quickBenchmark,
};
