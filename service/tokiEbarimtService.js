const { ebarimtDuudya } = require("./ebarimtDuudya");
const {
  zogsooloosEbarimtShineUusgye,
} = require("../routes/ebarimtRoute");
const Ebarimt = require("../models/ebarimt");
const EbarimtShine = require("../models/ebarimtShine");
const {
  Uilchluulegch,
} = require("parking-v2");

async function handleEbarimt({
  tuxainSalbar,
  tukhainObject,
  tukhainKholbolt,
  req,
  nuatTulukhEsekh,
}) {
  if (!tuxainSalbar?.eBarimtShine) {
    throw new Error("ИБаримт dll холболт хийгдээгүй байна!");
  }

  const ebarimtPayload = await zogsooloosEbarimtShineUusgye(
    tukhainObject,
    req.body.customerNo,
    req.body.customerTin,
    tuxainSalbar.merchantTin,
    tuxainSalbar.districtCode,
    tukhainKholbolt,
    nuatTulukhEsekh,
  );

  const response = await ebarimtDuudya(
    ebarimtPayload,
    tuxainSalbar.eBarimtShine
  );

  if (response?.status !== "SUCCESS" && !response?.success) {
    return {
      success: false,
      message: "И баримт амжилтгүй",
      data: response,
    };
  }

  let ebarimtModel;

  if (tuxainSalbar.eBarimtShine)
    ebarimtModel = new EbarimtShine(tukhainKholbolt)(response);
  else
    ebarimtModel = new Ebarimt(tukhainKholbolt)(response);

  ebarimtModel.zogsooliinId = tukhainObject._id;
  ebarimtModel.baiguullagiinId = tukhainObject.baiguullagiinId;
  ebarimtModel.barilgiinId = tukhainObject.barilgiinId;
  ebarimtModel.mashiniiDugaar = tukhainObject.mashiniiDugaar;

  await ebarimtModel.save();

  await Uilchluulegch(tukhainKholbolt).findByIdAndUpdate(
    tukhainObject._id,
    {
      ebarimtAvsanEsekh: true,
      ebarimtAvsanDun:
        ebarimtModel.cashAmount || ebarimtModel.totalAmount,
      ebarimtRegister: ebarimtModel.customerNo || req.body.customerNo,
    }
  );

  return {
    success: true,
    message: "Амжилттай",
    data: response,
  };
}

module.exports = { handleEbarimt };
