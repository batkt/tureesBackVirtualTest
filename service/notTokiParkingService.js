const { db } = require("zevbackv2");
const { getParkingFind } = require("../middlewares/parkingMiddle");
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
module.exports = { notTokiParking };

