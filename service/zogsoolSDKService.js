const uneguiMashin = require("../models/uneguiMashin");
const Khariltsagch = require("../models/khariltsagch");
const {
  Uilchluulegch,
  sdkData,
} = require("parking-v2");
const { db, } = require("zevbackv2");
const { sendFirebase, } = require("./notificationService");     
const { buildMessage } = require("../utils/buildMessage");

exports.zogsoolSdkService = async (req) => {
  const body = req.body;
  if (body.mashiniiDugaar) {
    body.mashiniiDugaar = body.mashiniiDugaar.replace(/\0/g, "");
  }
  await checkUneguiMashin(body);
  return await sdkData(req, medegdelFactory(req));
};

const medegdelFactory = (req) => {
  return async (uilchluulegch, khariltsagchiinId) => {
    if (!khariltsagchiinId) return;

    const khariltsagch = await Khariltsagch(
      req.body.tukhainBaaziinKholbolt
    ).findById(khariltsagchiinId);

    if (!khariltsagch?.firebaseToken) return;

    const medeelel = buildMessage(uilchluulegch);

    await sendFirebase(
      khariltsagch.firebaseToken,
      medeelel,
      req,
      khariltsagchiinId
    );
  };
};

const checkUneguiMashin = async (body) => {
  const oldson = await uneguiMashin(db.erunkhiiKholbolt).findOne({
    mashiniiDugaar: body.mashiniiDugaar,
    "zogsool.baiguullagiinId": body.baiguullagiinId,
  });

  if (!oldson) return;

  const randomMinutes = Math.floor(Math.random() * 15) + 1;
  const orsonTsag = new Date(Date.now() - randomMinutes * 60000);

  const model = Uilchluulegch(body.tukhainBaaziinKholbolt);

  const uilchluulegch = await model.findOne({
    mashiniiDugaar: body.mashiniiDugaar,
    "tuukh.0.tuluv": 0,
    "tuukh.0.garsanKhaalga": { $exists: false },
  }).sort({ createdAt: -1 });

  if (!uilchluulegch) return;

  await model.updateOne(
    { _id: uilchluulegch._id },
    { $set: { "tuukh.0.tsagiinTuukh.0.orsonTsag": orsonTsag } }
  );
};
