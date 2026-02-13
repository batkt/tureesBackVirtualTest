const { db } = require("zevbackv2");
const {
  Uilchluulegch, Mashin
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
async function mashiniiDugaarZasakh(req) {
    var uilchluulegch = await Uilchluulegch(req.body.tukhainBaaziinKholbolt, true)
        .findOne({
        baiguullagiinId: req.body.baiguullagiinId,
        barilgiinId: req.body.barilgiinId,
        mashiniiDugaar: req.body.mashiniiDugaar,
        "tuukh.garsanKhaalga": { $exists: false },
        "tuukh.0.tsagiinTuukh.0.garsanTsag": { $exists: false },
        "tuukh.0.tuluv": { $ne: -2 },
        })
        .sort({ createdAt: -1 })
        .limit(1);
    if (!!uilchluulegch && !!uilchluulegch?._id && !!req.body.mashin) {
        await Uilchluulegch(req.body.tukhainBaaziinKholbolt).findByIdAndUpdate(
        uilchluulegch?._id.toString(),
        {
            $set: {
            turul: req.body.mashin?.turul,
            mashin: req.body.mashin,
            },
        },
        );
        return "Amjilttai";
    } else return "Amjiltgui";
}
async function mashiniiDugaarZaiArilgakh(req) {
    var mashinuud = await Mashin(req.body.tukhainBaaziinKholbolt).find({baiguullagiinId: req.body.baiguullagiinId});
    if (mashinuud?.length > 0) {
        for (const mashin of mashinuud) {
            await Mashin(req.body.tukhainBaaziinKholbolt).findByIdAndUpdate(
            mashin?._id.toString(),
            {
                $set: {
                dugaar: mashin.dugaar?.trim().replace(/\s/g, ""),
                },
            },
            );
        }
    }
    return "Амжилттай";
}
module.exports = { mashinUpdate, mashiniiDugaarZasakh, mashiniiDugaarZaiArilgakh };