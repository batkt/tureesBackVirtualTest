const { Uilchluulegch, ZurchilteiMashin } = require("parking-v2");
const moment = require("moment");

async function ajiltniiUdriinTailan({ body }) {
  const ekhlekhOgnoo = new Date(body.ekhlekhOgnoo);
  const duusakhOgnoo = new Date(body.duusakhOgnoo);

  const baseMatch = {
    baiguullagiinId: body.baiguullagiinId,
    barilgiinId: body.barilgiinId ? body.barilgiinId : { $exists: true },
  };

  const ajiltanDateMatch = body.garsanKhaalga
    ? {
        "tuukh.garsanKhaalga": body.garsanKhaalga,
        "tuukh.tsagiinTuukh.garsanTsag": {
          $gte: ekhlekhOgnoo,
          $lte: duusakhOgnoo,
        },
      }
    : { "tuukh.tulbur.ognoo": { $gte: ekhlekhOgnoo, $lte: duusakhOgnoo } };

  const ajiltniiNukhutsul = {};
  if (body.burtgesenAjiltaniiId) {
    ajiltniiNukhutsul["tuukh.burtgesenAjiltaniiId"] = body.burtgesenAjiltaniiId;
  }

  const ajiltniiPipeline = [
    { $match: baseMatch },
    { $unwind: "$tuukh" },
    { $unwind: "$tuukh.tulbur" },
    { $match: { ...ajiltanDateMatch, ...ajiltniiNukhutsul } },
    {
      $group: {
        _id: "$tuukh.tulbur.turul",
        niitDun: { $sum: "$tuukh.tulbur.dun" },
        niitToo: { $sum: 1 },
      },
    },
  ];

  const qrTypes = [
    "GadaaQR",
    "DotorQR",
    "bankQR",
    "toki",
    "киоск",
    "tseneglelt",
  ];
  const qrDateMatch = {
    "tuukh.tulbur.ognoo": { $gte: ekhlekhOgnoo, $lte: duusakhOgnoo },
  };

  const qrMatch = { ...qrDateMatch, "tuukh.tulbur.turul": { $in: qrTypes } };
  if (body.garsanKhaalga) qrMatch["tuukh.garsanKhaalga"] = body.garsanKhaalga;

  const qrPipeline = [
    { $match: baseMatch },
    { $unwind: "$tuukh" },
    { $unwind: "$tuukh.tulbur" },
    { $match: qrMatch },
    {
      $group: {
        _id: "$tuukh.tulbur.turul",
        niitDun: { $sum: "$tuukh.tulbur.dun" },
        niitToo: { $sum: 1 },
      },
    },
  ];

  const ajiltniiTailan = await Uilchluulegch(
    body.tukhainBaaziinKholbolt,
    true,
  ).aggregate(ajiltniiPipeline);

  let qrTailan = [];
  if (body.burtgesenAjiltaniiId) {
    qrTailan = await Uilchluulegch(body.tukhainBaaziinKholbolt, true).aggregate(
      qrPipeline,
    );
  }

  let niilberTailan = Array.isArray(ajiltniiTailan) ? [...ajiltniiTailan] : [];
  if (Array.isArray(qrTailan) && qrTailan.length > 0) {
    const qrTypeSet = new Set(qrTypes);
    niilberTailan = niilberTailan.filter((row) => !qrTypeSet.has(row._id));
    niilberTailan.push(...qrTailan);
  }

  const garaltMatch = {
    "tuukh.tsagiinTuukh.garsanTsag": {
      $gte: ekhlekhOgnoo,
      $lte: duusakhOgnoo,
    },
  };
  if (body.garsanKhaalga)
    garaltMatch["tuukh.garsanKhaalga"] = body.garsanKhaalga;
  if (body.burtgesenAjiltaniiId)
    garaltMatch["tuukh.burtgesenAjiltaniiId"] = body.burtgesenAjiltaniiId;

  const [zurchiltei, unegui] = await Promise.all([
    Uilchluulegch(body.tukhainBaaziinKholbolt, true).aggregate([
      { $match: baseMatch },
      { $unwind: "$tuukh" },
      { $match: { ...garaltMatch, "tuukh.tuluv": -2 } },
      {
        $group: {
          _id: "Зөрчилтэй",
          niitDun: { $sum: "$niitDun" },
          ids: { $addToSet: "$_id" },
        },
      },
      { $project: { _id: 1, niitDun: 1, niitToo: { $size: "$ids" } } },
    ]),
    Uilchluulegch(body.tukhainBaaziinKholbolt, true).aggregate([
      { $match: baseMatch },
      { $unwind: "$tuukh" },
      { $match: { ...garaltMatch, "tuukh.uneguiGarsan": { $exists: true } } },
      {
        $group: {
          _id: "Үнэгүй",
          niitDun: { $sum: "$niitDun" },
          niitToo: { $sum: 1 },
        },
      },
    ]),
  ]);

  if (Array.isArray(zurchiltei) && zurchiltei.length > 0)
    niilberTailan.push(zurchiltei[0]);
  if (Array.isArray(unegui) && unegui.length > 0) niilberTailan.push(unegui[0]);

  return niilberTailan;
}

async function udriinTailan({ body }) {
  const ekhlekhOgnoo = moment(
    body.ekhlekhOgnoo,
    "YYYY-MM-DD HH:mm:ss",
  ).toDate();
  const duusakhOgnoo = moment(
    body.duusakhOgnoo,
    "YYYY-MM-DD HH:mm:ss",
  ).toDate();
  const start = moment(ekhlekhOgnoo);
  const end = moment(duusakhOgnoo);
  const currentMonth = moment();

  const isMultiMonth =
    start.year() !== end.year() || start.month() !== end.month();

  const getCollectionName = (year, month) =>
    `Uilchluulegch${year}${String(month + 1).padStart(2, "0")}`;

  // Determine which months are involved
  const months = isMultiMonth
    ? (() => {
        const list = [];
        let current = start.clone().startOf("month");
        while (current.isSameOrBefore(end, "month")) {
          list.push(current.clone());
          current.add(1, "month");
        }
        return list;
      })()
    : [start.clone().startOf("month")];

  // Current month → null (live collection)
  // Past months → named archive collection
  // Never both for the same month to avoid double-counting
  const collectionsToQuery = [];
  months.forEach((month) => {
    const isCurrent =
      month.year() === currentMonth.year() &&
      month.month() === currentMonth.month();

    const collectionStart = moment.max(month.clone().startOf("month"), start);
    const collectionEnd = moment.min(month.clone().endOf("month"), end);

    if (isCurrent) {
      collectionsToQuery.push({
        name: null,
        startDate: collectionStart.toDate(),
        endDate: collectionEnd.toDate(),
      });
    } else {
      collectionsToQuery.push({
        name: getCollectionName(month.year(), month.month()),
        startDate: collectionStart.toDate(),
        endDate: collectionEnd.toDate(),
      });
    }
  });

  // Aggregation function per collection
  const aggregateFromCollection = async (
    collectionName,
    dateStart,
    dateEnd,
  ) => {
    const model = Uilchluulegch(
      body.tukhainBaaziinKholbolt,
      !collectionName,
      collectionName || undefined,
    );

    const baseMatch = {
      baiguullagiinId: body.baiguullagiinId,
      barilgiinId: body.barilgiinId ? body.barilgiinId : { $exists: true },
    };

    // DEBUG: log which collection and date range is being queried
    console.log("=== COLLECTION:", collectionName || "null(live)", "===");
    console.log("dateStart:", dateStart, "dateEnd:", dateEnd);

    const match = body.garsanKhaalga
      ? {
          "tuukh.garsanKhaalga": body.garsanKhaalga,
          "tuukh.tsagiinTuukh.garsanTsag": { $gte: dateStart, $lte: dateEnd },
        }
      : { "tuukh.tulbur.ognoo": { $gte: dateStart, $lte: dateEnd } };

    if (body.burtgesenAjiltaniiId)
      match["tuukh.burtgesenAjiltaniiId"] = body.burtgesenAjiltaniiId;

    const aggregatePipeline = (additionalMatch) => [
      { $match: baseMatch },
      { $unwind: "$tuukh" },
      { $unwind: "$tuukh.tulbur" },
      { $match: additionalMatch },
      {
        $group: {
          _id: "$tuukh.tulbur.turul",
          niitDun: { $sum: "$tuukh.tulbur.dun" },
          niitToo: { $sum: 1 },
        },
      },
    ];

    const udriinTailanResult = await model.aggregate(aggregatePipeline(match));

    // DEBUG: raw Tulburtei pipeline before dedup
    const tulburteiDebugPipeline = [
      { $match: baseMatch },
      { $unwind: "$tuukh" },
      { $unwind: "$tuukh.tsagiinTuukh" },
      {
        $match: {
          "tuukh.tsagiinTuukh.garsanTsag": { $gte: dateStart, $lte: dateEnd },
          "tuukh.tuluv": { $in: [0, -4] },
          "tuukh.tulukhDun": { $gt: 0 },
          "tuukh.tulbur": { $size: 0 },
          "tuukh.uneguiGarsan": { $exists: false },
          ...(body.garsanKhaalga && {
            "tuukh.garsanKhaalga": body.garsanKhaalga,
          }),
        },
      },
      // Show raw matched tuukh._id list before dedup
      {
        $group: {
          _id: "$tuukh._id",
          tulukhDun: { $first: "$tuukh.tulukhDun" },
          mashiniiDugaar: { $first: "$mashiniiDugaar" },
          count: { $sum: 1 }, // how many times this tuukh._id appears (should be 1 ideally)
        },
      },
    ];

    const tulburteiDebug = await model.aggregate(tulburteiDebugPipeline);
    console.log("=== TULBURTEI DEBUG (after dedup by tuukh._id) ===");
    console.log(JSON.stringify(tulburteiDebug, null, 2));
    console.log("=== TULBURTEI COUNT:", tulburteiDebug.length, "===");

    const specialPipeline = (status) => {
      if (status === "Tulburtei") {
        return [
          { $match: baseMatch },
          { $unwind: "$tuukh" },
          { $unwind: "$tuukh.tsagiinTuukh" },
          {
            $match: {
              "tuukh.tsagiinTuukh.garsanTsag": {
                $gte: dateStart,
                $lte: dateEnd,
              },
              "tuukh.tuluv": { $in: [0, -4] },
              "tuukh.tulukhDun": { $gt: 0 },
              "tuukh.tulbur": { $size: 0 },
              "tuukh.uneguiGarsan": { $exists: false },
              ...(body.garsanKhaalga && {
                "tuukh.garsanKhaalga": body.garsanKhaalga,
              }),
              ...(body.burtgesenAjiltaniiId && {
                "tuukh.burtgesenAjiltaniiId": body.burtgesenAjiltaniiId,
              }),
            },
          },
          {
            $group: {
              _id: "$tuukh._id",
              tulukhDun: { $first: "$tuukh.tulukhDun" },
            },
          },
          {
            $group: {
              _id: "Төлбөртэй",
              niitDun: { $sum: "$tulukhDun" },
              niitToo: { $sum: 1 },
            },
          },
        ];
      }

      const matchCondition = {
        "tuukh.tsagiinTuukh.garsanTsag": { $gte: dateStart, $lte: dateEnd },
        ...(status === "Zurchiltei" && { "tuukh.tuluv": -2 }),
        ...(status === "Unegui" && {
          "tuukh.uneguiGarsan": { $exists: true },
        }),
        ...(body.garsanKhaalga && {
          "tuukh.garsanKhaalga": body.garsanKhaalga,
        }),
        ...(body.burtgesenAjiltaniiId && {
          "tuukh.burtgesenAjiltaniiId": body.burtgesenAjiltaniiId,
        }),
      };

      return [
        { $match: baseMatch },
        { $unwind: "$tuukh" },
        { $match: matchCondition },
        {
          $group: {
            _id: status === "Zurchiltei" ? "Зөрчилтэй" : "Үнэгүй",
            niitDun: { $sum: "$niitDun" },
            ids: { $addToSet: "$_id" },
          },
        },
        {
          $project: {
            _id: 1,
            niitDun: 1,
            niitToo: { $size: "$ids" }, // fixed for both Зөрчилтэй and Үнэгүй
          },
        },
      ];
    };

    const [zurchiltei, tulburtei, unegui] = await Promise.all([
      model.aggregate(specialPipeline("Zurchiltei")),
      model.aggregate(specialPipeline("Tulburtei")),
      model.aggregate(specialPipeline("Unegui")),
    ]);

    console.log("=== TULBURTEI FINAL:", JSON.stringify(tulburtei));
    console.log(
      "=== collectionsToQuery:",
      JSON.stringify(collectionsToQuery.map((c) => c.name)),
    );

    return { udriinTailan: udriinTailanResult, zurchiltei, tulburtei, unegui };
  };

  // Query all collections
  const allResults = {
    udriinTailan: [],
    zurchiltei: [],
    tulburtei: [],
    unegui: [],
  };

  for (const collection of collectionsToQuery) {
    try {
      const result = await aggregateFromCollection(
        collection.name,
        collection.startDate,
        collection.endDate,
      );
      allResults.udriinTailan.push(...result.udriinTailan);
      allResults.zurchiltei.push(...result.zurchiltei);
      allResults.tulburtei.push(...result.tulburtei);
      allResults.unegui.push(...result.unegui);
    } catch (err) {
      console.error(
        `Error querying collection ${collection.name}:`,
        err.message,
      );
    }
  }

  // Merge results by _id, summing niitDun and niitToo
  const mergeResults = (allResults) => {
    const merged = {};
    allResults.udriinTailan.forEach((item) => {
      merged[item._id] = merged[item._id]
        ? {
            ...merged[item._id],
            niitDun: merged[item._id].niitDun + item.niitDun,
            niitToo: merged[item._id].niitToo + item.niitToo,
          }
        : { ...item };
    });

    const result = Object.values(merged);

    const mergeArray = (arr, id) =>
      arr.length
        ? arr.reduce(
            (acc, item) => ({
              _id: id,
              niitDun: acc.niitDun + item.niitDun,
              niitToo: acc.niitToo + item.niitToo,
            }),
            { _id: id, niitDun: 0, niitToo: 0 },
          )
        : null;

    [
      mergeArray(allResults.zurchiltei, "Зөрчилтэй"),
      mergeArray(allResults.tulburtei, "Төлбөртэй"),
      mergeArray(allResults.unegui, "Үнэгүй"),
    ].forEach((item) => item && result.push(item));

    return result;
  };

  let finalResult = mergeResults(allResults);

  // Add Авлага from ZurchilteiMashin
  const zurchilteTailan = await ZurchilteiMashin(
    body.tukhainBaaziinKholbolt,
  ).aggregate([
    {
      $match: {
        baiguullagiinId: body.baiguullagiinId,
        barilgiinId: body.barilgiinId || { $exists: true },
        tuluv: 0,
        createdAt: { $gte: ekhlekhOgnoo, $lte: duusakhOgnoo },
      },
    },
    {
      $group: {
        _id: "Авлага",
        niitDun: { $sum: "$niitDun" },
        niitToo: { $sum: 1 },
      },
    },
  ]);

  if (zurchilteTailan?.length) finalResult.push(zurchilteTailan[0]);

  if (body.includeMetadata) {
    return {
      data: finalResult,
      archiveName: isMultiMonth
        ? "multi-month"
        : getCollectionName(start.year(), start.month()),
      collections: collectionsToQuery.map((c) => c.name),
    };
  }

  return finalResult;
}

async function zogsoolUilchluulegchdiinDunAvakh({
  baiguullagiinId,
  barilgiinId,
  ekhlekhOgnoo,
  duusakhOgnoo,
  garakhKhaalgaIp,
  tukhainBaaziinKholbolt,
}) {
  const match = {
    baiguullagiinId,
    mashiniiDugaar: { $regex: "[a-z\u0400-\u04FF]" },
  };

  if (barilgiinId) match.barilgiinId = barilgiinId;

  const query = [
    { $match: match },
    { $unwind: "$tuukh" },
    {
      $unwind: {
        path: "$tuukh.tulbur",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $match: {
        "tuukh.tulbur.ognoo": {
          $gte: new Date(ekhlekhOgnoo),
          $lte: new Date(duusakhOgnoo),
        },
      },
    },
    {
      $group: {
        _id: {
          id: "$tuukh._id",
          tuluv: "$tuukh.tuluv",
          tulukhDun: "$tuukh.tulukhDun",
        },
        tulsunDun: {
          $sum: {
            $cond: [
              { $ne: ["$tuukh.tulbur.turul", "khungulult"] },
              { $ifNull: ["$tuukh.tulbur.dun", 0] },
              0,
            ],
          },
        },
        khungulult: {
          $sum: {
            $cond: [
              { $eq: ["$tuukh.tulbur.turul", "khungulult"] },
              { $ifNull: ["$tuukh.tulbur.dun", 0] },
              0,
            ],
          },
        },
      },
    },
    {
      $group: {
        _id: "id",
        dun: { $sum: "$tulsunDun" },
        garsanKhaalga: garakhKhaalgaIp
          ? {
              $sum: {
                $cond: [
                  { $eq: ["$garsanKhaalga", garakhKhaalgaIp] },
                  { $ifNull: ["$_id.tulukhDun", 0] },
                  0,
                ],
              },
            }
          : { $sum: 0 },
        niitDun: {
          $sum: { $ifNull: ["$_id.tulukhDun", 0] },
        },
        khungulsun: {
          $sum: { $ifNull: ["$khungulult", 0] },
        },
      },
    },
  ];

  return await Uilchluulegch(tukhainBaaziinKholbolt, true).aggregate(query);
}

module.exports = {
  zogsoolUilchluulegchdiinDunAvakh,
  udriinTailan,
  ajiltniiUdriinTailan,
};
