const { Uilchluulegch, } = require("parking-v2");

exports.ajiltniiUdriinTailan = async (body) => {
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
