const { db } = require("zevbackv2");
const { Uilchluulegch } = require("parking-v2");
const Baiguullaga = require("../models/baiguullaga");
const { handleEbarimt } = require("./tokiEbarimtService");

async function kioskEbarimtAvya(req) {
  var tukhainKholbolt = req.body.tukhainBaaziinKholbolt;
  var tukhainObject = await Uilchluulegch(tukhainKholbolt, true).findById(
    req.body.uilchluulegchiinId,
  );
  tukhainObject.niitDun = req.body.paid_amount;
  var baiguullaga = await Baiguullaga(db.erunkhiiKholbolt).findById(
    tukhainObject.baiguullagiinId,
  );
  var tuxainSalbar = baiguullaga?.barilguud?.find(
    (e) => e._id.toString() == tukhainObject.barilgiinId,
  )?.tokhirgoo;
  var nuatTulukhEsekh = baiguullaga.barilguud.find(
    (x) => x._id.toString() == tukhainObject.barilgiinId,
  )?.tokhirgoo?.nuatTulukhEsekh;
  if (nuatTulukhEsekh != false) nuatTulukhEsekh = true;
  const ebarimtResult = await handleEbarimt({
    tuxainSalbar,
    tukhainObject,
    tukhainKholbolt,
    req,
    nuatTulukhEsekh,
  });
  return {
    ...ebarimtResult,
    data: {
      ...ebarimtResult.data,
      eBarimtZogsoolNer: tuxainSalbar?.eBarimtZogsoolNer ?? "",
    },
  };
}
module.exports = { kioskEbarimtAvya };
