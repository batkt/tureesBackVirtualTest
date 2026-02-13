const { db } = require("zevbackv2");
const { getParkingFind } = require("../middlewares/parkingMiddle");
const {
    Uilchluulegch
} = require("parking-v2");
const Baiguullaga = require("../models/baiguullaga");

async function notTokiParking(req) {
    var kholboltuud = db.kholboltuud;
    var localEsekh = !!req.body.baiguullagiinId;
    if (localEsekh) {
        kholboltuud = kholboltuud.filter(
        (a) => a.baiguullagiinId == req.body.baiguullagiinId,
        );
    }
    var result = [];
    if (kholboltuud) {
        var query = { tokiNer: { $exists: false } };
        if (!!req.body.baiguullagiinId)
        query["baiguullagiinId"] = req.body.baiguullagiinId;
        for (const kholbolt of kholboltuud) {
        var baiguullaga = await Baiguullaga(db.erunkhiiKholbolt).findById(
            kholbolt.baiguullagiinId,
        );
        var zogsooluud = await getParkingFind(
            kholbolt,
            kholbolt.baiguullagiinId,
            query,
        );
        if (zogsooluud?.length > 0)
            result.push({ ner: baiguullaga.ner, register: baiguullaga.register });
        }
    }
    return result;
}
async function zochinAjiltaniiIdTseverlekh(req) {
    var kholboltuud = db.kholboltuud;
    var localEsekh = !!req.body.baiguullagiinId;
    if (localEsekh) {
        kholboltuud = kholboltuud.filter(
        (a) => a.baiguullagiinId == req.body.baiguullagiinId,
        );
    }
    var result = [];
    if (kholboltuud) {
        var query = { "tuukh.burtgesenAjiltaniiId": "zochin" };
        if (!!req.body.baiguullagiinId)
            query["baiguullagiinId"] = req.body.baiguullagiinId;
        for (const kholbolt of kholboltuud) {
        var mashinuud = await Uilchluulegch(kholbolt, true).find(query);
        if (mashinuud?.length > 0) {
            for (const data of mashinuud) {
            await Uilchluulegch(kholbolt).findByIdAndUpdate(data._id, {
                $unset: {
                "tuukh.0.burtgesenAjiltaniiId": 1,
                },
            });
            result.push(data);
            }
        }
        }
    }
    return result;
}
module.exports = { notTokiParking, zochinAjiltaniiIdTseverlekh };

