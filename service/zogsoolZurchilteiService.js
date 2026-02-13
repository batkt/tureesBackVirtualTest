const { db } = require("zevbackv2");
const {
  Parking,
  Uilchluulegch,
  ZurchilteiMashin,
} = require("parking-v2");
const { msgIlgeeye } = require("../controller/khariltsagch");
const MsgTuukh = require("../models/msgTuukh");

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
    var query = {
        baiguullagiinId: req.body.baiguullagiinId,
        barilgiinId: req.body.barilgiinId,
        gadnaZogsooliinId: { $exists: false },
        zurchulMsgeerSanuulakh: true,
    };
    var zogsool = await Parking(req.body.tukhainBaaziinKholbolt).findOne(
    query,
    );
    var msgnuud = [];
    if (!!zogsool && zogsool?.zurchilMsgilgeekhDugaar?.length > 0) {
        var match = {
            baiguullagiinId: req.body.baiguullagiinId,
            barilgiinId: req.body.barilgiinId,
            zogsooliinId: zogsool?._id?.toString(),
            mashiniiDugaar: req.body.mashiniiDugaar,
            tuluv: { $ne: 1 },
        };
        var query = [
            {
            $match: match,
            },
            {
            $group: {
                _id: "$mashiniiDugaar",
                dun: {
                $sum: "$niitDun",
                },
            },
            },
        ];
        var zurchiluud = await ZurchilteiMashin(
            req.body.tukhainBaaziinKholbolt,
        ).aggregate(query);
        if (zurchiluud?.length > 0) {
            for (const dugaar of zogsool?.zurchilMsgilgeekhDugaar) {
            var msg = new MsgTuukh(req.body.tukhainBaaziinKholbolt)();
            msg.baiguullagiinId = req.body.baiguullagiinId;
            msg.barilgiinId = req.body.barilgiinId;
            msg.mashiniiDugaar = zurchiluud[0]._id;
            msg.dugaar = dugaar;
            msg.turul = "zurchil";
            msg.msg =
                formatNumber(zurchiluud[0].dun, 0) +
                " zurchiltei " +
                (zurchiluud[0]._id || "") +
                " dugaartai mashin newterlee";
            msg.save();
            msgnuud.push({ to: dugaar, text: msg.msg });
            }
        }
        if (msgnuud?.length > 0) {
            var msgIlgeekhKey = "aa8e588459fdd9b7ac0b809fc29cfae3";
            var msgIlgeekhDugaar = "72002032";
            msgIlgeeye(
            msgnuud,
            msgIlgeekhKey,
            msgIlgeekhDugaar,
            [],
            0,
            req.body.tukhainBaaziinKholbolt,
            req.body.baiguullagiinId,
            );
        }
    }
    return msgnuud;
}
async function zurchiluudTulsunBolgoy(req) {
    await ZurchilteiMashin(req.body.tukhainBaaziinKholbolt).updateMany(
    { _id: { $in: req.body.utguud } },
    {
        $set: {
        tuluv: 1,
        tailbar: req.body.shaltgaan,
        },
    },
    );
    return "Amjilttai";
}
async function zogsooliinTuluuguiMashiniiTailanAvya(req) {
    var match = {
    baiguullagiinId: req.body.baiguullagiinId,
    barilgiinId: !!req.body.barilgiinId
        ? req.body.barilgiinId
        : { $exists: true },
    mashiniiDugaar: !!req.body.searchUtga
        ? { $regex: req.body.searchUtga, $options: "i" }
        : { $exists: true },
    tuluv: 0,
    createdAt: {
        $lte: new Date(moment(req.body.ognoo).format("YYYY-MM-DD 23:59:59")),
    },
    };
    var query = [
    {
        $match: match,
    },
    {
        $group: {
        _id: "$mashiniiDugaar",
        dun: {
            $sum: "$niitDun",
        },
        too: {
            $sum: 1,
        },
        },
    },
    ];
    var tailan = await ZurchilteiMashin(req.body.tukhainBaaziinKholbolt).aggregate(query);
    return tailan;
}

module.exports = { niitZurchilteiMashinOlokh, zurchilteiMashinMsgilgeekh, zurchiluudTulsunBolgoy, zogsooliinTuluuguiMashiniiTailanAvya };