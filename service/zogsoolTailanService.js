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
        "tuukh.tsagiinTuukh.garsanTsag": { $gte: ekhlekhOgnoo, $lte: duusakhOgnoo },
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
    { $group: { _id: "$tuukh.tulbur.turul", niitDun: { $sum: "$tuukh.tulbur.dun" }, niitToo: { $sum: 1 } } },
  ];

  const qrTypes = ["GadaaQR", "DotorQR", "bankQR", "toki", "киоск", "tseneglelt"];
  const qrDateMatch = { "tuukh.tulbur.ognoo": { $gte: ekhlekhOgnoo, $lte: duusakhOgnoo } };

  const qrMatch = { ...qrDateMatch, "tuukh.tulbur.turul": { $in: qrTypes } };
  if (body.garsanKhaalga) qrMatch["tuukh.garsanKhaalga"] = body.garsanKhaalga;

  const qrPipeline = [
    { $match: baseMatch },
    { $unwind: "$tuukh" },
    { $unwind: "$tuukh.tulbur" },
    { $match: qrMatch },
    { $group: { _id: "$tuukh.tulbur.turul", niitDun: { $sum: "$tuukh.tulbur.dun" }, niitToo: { $sum: 1 } } },
  ];

  const ajiltniiTailan = await Uilchluulegch(body.tukhainBaaziinKholbolt, true).aggregate(ajiltniiPipeline);

  let qrTailan = [];
  if (body.burtgesenAjiltaniiId) {
    qrTailan = await Uilchluulegch(body.tukhainBaaziinKholbolt, true).aggregate(qrPipeline);
  }

  let niilberTailan = Array.isArray(ajiltniiTailan) ? [...ajiltniiTailan] : [];
  if (Array.isArray(qrTailan) && qrTailan.length > 0) {
    const qrTypeSet = new Set(qrTypes);
    niilberTailan = niilberTailan.filter((row) => !qrTypeSet.has(row._id));
    niilberTailan.push(...qrTailan);
  }

  const garaltMatch = { "tuukh.tsagiinTuukh.garsanTsag": { $gte: ekhlekhOgnoo, $lte: duusakhOgnoo } };
  if (body.garsanKhaalga) garaltMatch["tuukh.garsanKhaalga"] = body.garsanKhaalga;
  if (body.burtgesenAjiltaniiId) garaltMatch["tuukh.burtgesenAjiltaniiId"] = body.burtgesenAjiltaniiId;

  const [zurchiltei, unegui] = await Promise.all([
    Uilchluulegch(body.tukhainBaaziinKholbolt, true).aggregate([
      { $match: baseMatch },
      { $unwind: "$tuukh" },
      { $match: { ...garaltMatch, "tuukh.tuluv": -2 } },
      { $group: { _id: "Зөрчилтэй", niitDun: { $sum: "$niitDun" }, ids: { $addToSet: "$_id" } } },
      { $project: { _id: 1, niitDun: 1, niitToo: { $size: "$ids" } } },
    ]),
    Uilchluulegch(body.tukhainBaaziinKholbolt, true).aggregate([
      { $match: baseMatch },
      { $unwind: "$tuukh" },
      { $match: { ...garaltMatch, "tuukh.uneguiGarsan": { $exists: true } } },
      { $group: { _id: "Үнэгүй", niitDun: { $sum: "$niitDun" }, niitToo: { $sum: 1 } } },
    ]),
  ]);

  if (Array.isArray(zurchiltei) && zurchiltei.length > 0) niilberTailan.push(zurchiltei[0]);
  if (Array.isArray(unegui) && unegui.length > 0) niilberTailan.push(unegui[0]);

  return niilberTailan;
};
async function udriinTailan({ body }) {
  const ekhlekhOgnoo = moment(body.ekhlekhOgnoo, "YYYY-MM-DD HH:mm:ss").toDate();
  const duusakhOgnoo = moment(body.duusakhOgnoo, "YYYY-MM-DD HH:mm:ss").toDate();
  const start = moment(ekhlekhOgnoo);
  const end = moment(duusakhOgnoo);
  const now = moment();

  const isMultiMonth = start.year() !== end.year() || start.month() !== end.month();

  const getCollectionName = (year, month) => `Uilchluulegch${year}${String(month + 1).padStart(2, "0")}`;

  // Collection-үүдийг тодорхойлох
  const collectionsToQuery = [{ name: null, startDate: ekhlekhOgnoo, endDate: duusakhOgnoo }];
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

  months.forEach((month) => {
    const collectionStart = moment.max(month.clone().startOf("month"), start);
    const collectionEnd = moment.min(month.clone().endOf("month"), end);
    const collectionName = getCollectionName(month.year(), month.month());
    collectionsToQuery.push({ name: collectionName, startDate: collectionStart.toDate(), endDate: collectionEnd.toDate() });
  });

  // Aggregation function
  const aggregateFromCollection = async (collectionName, dateStart, dateEnd) => {
    // Хэрэв collectionName байхгүй бол default collection авна
    const model = Uilchluulegch(body.tukhainBaaziinKholbolt, !collectionName, collectionName || undefined);
    const match = body.garsanKhaalga
      ? {
          "tuukh.garsanKhaalga": body.garsanKhaalga,
          "tuukh.tsagiinTuukh.garsanTsag": { $gte: dateStart, $lte: dateEnd },
        }
      : { "tuukh.tulbur.ognoo": { $gte: dateStart, $lte: dateEnd } };

    if (body.burtgesenAjiltaniiId) match["tuukh.burtgesenAjiltaniiId"] = body.burtgesenAjiltaniiId;

    const baseMatch = {
      baiguullagiinId: body.baiguullagiinId,
      barilgiinId: body.barilgiinId ? body.barilgiinId : { $exists: true },
    };

    const aggregatePipeline = (additionalMatch) => [
      { $match: baseMatch },
      { $unwind: "$tuukh" },
      { $unwind: "$tuukh.tulbur" },
      { $match: additionalMatch },
      { $group: { _id: "$tuukh.tulbur.turul", niitDun: { $sum: "$tuukh.tulbur.dun" }, niitToo: { $sum: 1 } } },
    ];

    const udriinTailan = await model.aggregate(aggregatePipeline(match));

    // Special cases
    const specialMatch = (status) => ({
      "tuukh.tsagiinTuukh.garsanTsag": { $gte: dateStart, $lte: dateEnd },
      ...(status === "Zurchiltei" && { "tuukh.tuluv": -2 }),
      ...(status === "Todorkhoigui" && { "tuukh.tuluv": -4 }),
      ...(status === "Unegui" && { "tuukh.uneguiGarsan": { $exists: true } }),
      ...(body.burtgesenAjiltaniiId && { "tuukh.burtgesenAjiltaniiId": body.burtgesenAjiltaniiId }),
    });

    const specialPipeline = (status) => [
      { $match: baseMatch },
      { $unwind: "$tuukh" },
      { $match: specialMatch(status) },
      {
        $group: {
          _id: status === "Zurchiltei" ? "Зөрчилтэй" : status === "Todorkhoigui" ? "Тодорхойгүй" : "Үнэгүй",
          niitDun: { $sum: "$niitDun" },
          ids: { $addToSet: "$_id" },
        },
      },
      {
        $project: {
          _id: 1,
          niitDun: 1,
          niitToo: status === "Zurchiltei" || status === "Todorkhoigui" ? { $size: "$ids" } : 1,
        },
      },
    ];

    const [zurchiltei, todorkhoigui, unegui] = await Promise.all([
      model.aggregate(specialPipeline("Zurchiltei")),
      model.aggregate(specialPipeline("Todorkhoigui")),
      model.aggregate(specialPipeline("Unegui")),
    ]);

    return { udriinTailan, zurchiltei, todorkhoigui, unegui };
  };

  // Бүх collection-үүдийг aggregate хийх
  const allResults = { udriinTailan: [], zurchiltei: [], todorkhoigui: [], unegui: [] };
  for (const collection of collectionsToQuery) {
    try {
      const result = await aggregateFromCollection(collection.name, collection.startDate, collection.endDate);
      allResults.udriinTailan.push(...result.udriinTailan);
      allResults.zurchiltei.push(...result.zurchiltei);
      allResults.todorkhoigui.push(...result.todorkhoigui);
      allResults.unegui.push(...result.unegui);
    } catch (err) {
      console.error(`Error querying collection ${collection.name}:`, err.message);
    }
  }

  // Merge results
  const mergeResults = (allResults) => {
    const merged = {};
    allResults.udriinTailan.forEach((item) => {
      merged[item._id] = merged[item._id]
        ? { ...merged[item._id], niitDun: merged[item._id].niitDun + item.niitDun, niitToo: merged[item._id].niitToo + item.niitToo }
        : { ...item };
    });

    const result = Object.values(merged);

    const mergeArray = (arr, id) =>
      arr.length
        ? arr.reduce((acc, item) => ({ _id: id, niitDun: acc.niitDun + item.niitDun, niitToo: acc.niitToo + item.niitToo }), { _id: id, niitDun: 0, niitToo: 0 })
        : null;

    [mergeArray(allResults.zurchiltei, "Зөрчилтэй"), mergeArray(allResults.todorkhoigui, "Тодорхойгүй"), mergeArray(allResults.unegui, "Үнэгүй")].forEach((item) => item && result.push(item));
    return result;
  };

  let finalResult = mergeResults(allResults);

  // Add Авлага from ZurchilteiMashin
  const zurchilteTailan = await ZurchilteiMashin(body.tukhainBaaziinKholbolt).aggregate([
    { $match: { baiguullagiinId: body.baiguullagiinId, barilgiinId: body.barilgiinId || { $exists: true }, tuluv: 0 } },
    { $group: { _id: "Авлага", niitDun: { $sum: "$niitDun" }, niitToo: { $sum: 1 } } },
  ]);

  if (zurchilteTailan?.length) finalResult.push(zurchilteTailan[0]);

  if (body.includeMetadata) {
    return { data: finalResult, archiveName: isMultiMonth ? "multi-month" : getCollectionName(start.year(), start.month()), collections: collectionsToQuery.map((c) => c.name) };
  }
  return finalResult;
};
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
