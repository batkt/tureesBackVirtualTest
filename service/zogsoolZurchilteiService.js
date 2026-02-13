const { db } = require("zevbackv2");
const {
  Parking,
  Uilchluulegch,
  ZurchilteiMashin,
} = require("parking-v2");

async function niitZurchilteiMashinOlokh(req) {
    var query = {
        baiguullagiinId: req.body.baiguullagiinId,
        barilgiinId: req.body.barilgiinId,
        gadnaZogsooliinId: { $exists: false },
        zurchulMsgeerSanuulakh: true,
    };
    var zogsool = await Parking(req.body.tukhainBaaziinKholbolt).findOne(
    query,
    );
    if (zogsool?.zurchulMsgeerSanuulakh) {
    const zurchilteiUilchluulegch = await Uilchluulegch(
        req.body.tukhainBaaziinKholbolt,
        true,
    ).find({
        baiguullagiinId: zogsool?.baiguullagiinId,
        barilgiinId: zogsool.barilgiinId,
        "tuukh.zogsooliinId": zogsool?._id.toString(),
        "tuukh.tulbur": [],
        "tuukh.tsagiinTuukh.garsanTsag": { $exists: true },
        "tuukh.garsanKhaalga": { $exists: true },
        niitDun: { $gt: zogsool?.tulburiinLimitDun || 0 },
    });
    if (zurchilteiUilchluulegch?.length > 0) {
        for (const zurchil of zurchilteiUilchluulegch) {
        const zurchilteiData = await ZurchilteiMashin(
            req.body.tukhainBaaziinKholbolt,
        ).findOne({
            baiguullagiinId: zurchil?.baiguullagiinId,
            barilgiinId: zurchil?.barilgiinId,
            uilchluulegchiinId: zurchil?._id.toString(),
            zogsooliinId: zurchil?.tuukh[0]?.zogsooliinId,
            mashiniiDugaar: zurchil?.mashiniiDugaar,
        });
        if (!zurchilteiData) {
            const zurchilModel = new ZurchilteiMashin(
            req.body.tukhainBaaziinKholbolt,
            )();
            zurchilModel.baiguullagiinId = zurchil?.baiguullagiinId;
            zurchilModel.barilgiinId = zurchil?.barilgiinId;
            zurchilModel.uilchluulegchiinId = zurchil?._id.toString();
            zurchilModel.mashiniiDugaar = zurchil?.mashiniiDugaar;
            zurchilModel.zogsooliinId = zurchil?.tuukh[0]?.zogsooliinId;
            zurchilModel.niitKhugatsaa = zurchil?.niitKhugatsaa;
            zurchilModel.orsonKhaalga = zurchil?.tuukh[0].orsonKhaalga;
            zurchilModel.garsanKhaalga = zurchil?.tuukh[0].garsanKhaalga;
            zurchilModel.orsonTsag =
            zurchil?.tuukh[0].tsagiinTuukh[0].orsonTsag;
            zurchilModel.garsanTsag =
            zurchil?.tuukh[0].tsagiinTuukh[0].garsanTsag;
            zurchilModel.niitDun = zurchil?.niitDun;
            zurchilModel.turul = zurchil?.turul;
            zurchilModel.tuluv = 0;
            zurchilModel.save();
        }
        }
    }
    }
    return "Amjilttai";
}

async function zurchilteiMashinMsgilgeekh(req) {

}

module.exports = { niitZurchilteiMashinOlokh, zurchilteiMashinMsgilgeekh };