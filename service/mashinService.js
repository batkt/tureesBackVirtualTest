const { db } = require("zevbackv2");
const {
  Uilchluulegch,
} = require("parking-v2");
const Baiguullaga = require("../models/baiguullaga");

async function mashinUpdate(req) {
    var baiguullaga = await Baiguullaga(db.erunkhiiKholbolt).findOne({
        register: req.body.register,
    });
    var tukhainKholbolt;
    tukhainKholbolt = db.kholboltuud.find(
        (a) => a.baiguullagiinId == baiguullaga._id,
    );
    var orsonTsag = new Date(new Date.getTime() - 15 * 60000);
    await Uilchluulegch(tukhainKholbolt).updateOne(
        {
        mashiniiDugaar: req.body.mashiniiDugaar,
        "tuukh.0.tuluv": { $ne: -2 },
        "tuukh.0.tsagiinTuukh.garsanTsag": { $exists: false },
        },
        {
        "tuukh.0.tsagiinTuukh.0.orsonTsag": orsonTsag,
        },
    );
    return "Amjilttai";
}
module.exports = { mashinUpdate };