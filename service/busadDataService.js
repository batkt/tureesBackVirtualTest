const {
  Uilchluulegch,
} = require("parking-v2");
const EbarimtShine = require("../models/ebarimtShine");

async function turluurZogsoolIdOruulakh(req) {
    var match = {
        baiguullagiinId: req.body.baiguullagiinId,
        barilgiinId: req.body.barilgiinId,
        ebarimtAvsanEsekh: true,
        mashiniiDugaar: { $exists: true },
        "tuukh.tulbur.turul": req.body.turul,
    };
    if (!!req.body.mashiniiDugaar)
        match["mashiniiDugaar"] = req.body.mashiniiDugaar;
    var uilchluulegchuud = await Uilchluulegch(
    req.body.tukhainBaaziinKholbolt,
    true,
    ).find(match);
    var ebarimtuud = [];
    if (uilchluulegchuud?.length > 0) {
        for (const data of uilchluulegchuud) {
            ebarimtuud = await EbarimtShine(req.body.tukhainBaaziinKholbolt).find(
            {
                baiguullagiinId: req.body.baiguullagiinId,
                barilgiinId: req.body.barilgiinId,
                ustgasanOgnoo: { $exists: false },
                zogsooliinId: data?._id,
            },
            );
            if (ebarimtuud?.length === 0) {
                ebarimtuud = await EbarimtShine(
                    req.body.tukhainBaaziinKholbolt,
                ).find({
                    baiguullagiinId: req.body.baiguullagiinId,
                    barilgiinId: req.body.barilgiinId,
                    ustgasanOgnoo: { $exists: false },
                    mashiniiDugaar: data?.mashiniiDugaar,
                    createdAt: {
                    $gte: moment(data.tuukh[0]?.tulbur[0]?.ognoo).format(
                        "YYYY-MM-DD 00:00:00",
                    ),
                    $lte: moment(data.tuukh[0]?.tulbur[0]?.ognoo).format(
                        "YYYY-MM-DD 23:59:59",
                    ),
                    },
                });
                if (ebarimtuud?.length > 0) {
                    for (const saveEBarimt of ebarimtuud) {
                    saveEBarimt.zogsooliinId = data?._id;
                    await saveEBarimt.save();
                    }
                }
            }
        }
    }
    return ebarimtuud;
}
async function ebarimtAvsanDunOruulakh(req) {
    var match = {
        baiguullagiinId: req.body.baiguullagiinId,
        barilgiinId: req.body.barilgiinId,
        mashiniiDugaar: { $exists: true },
        zogsooliinId: { $exists: true },
    };
    var ebarimtuud = await EbarimtShine(req.body.tukhainBaaziinKholbolt).find(match,);
    if (ebarimtuud?.length > 0) {
        for (const ebarimt of ebarimtuud) {
            var update = {
            ebarimtAvsanDun: ebarimt.cashAmount || ebarimt.totalAmount,
            };
            Uilchluulegch(req.body.tukhainBaaziinKholbolt)
            .findByIdAndUpdate(ebarimt.zogsooliinId, update)
            .then((xariu) => {})
            .catch((err) => {
                next(err);
            });
        }
    }
    return "Амжилттай";
}
async function davkharBarimtZasakh(req) {
    var match = {
        baiguullagiinId: req.body.baiguullagiinId,
        barilgiinId: req.body.barilgiinId,
        mashiniiDugaar: { $exists: true },
        "tuukh.tulbur": { $size: req.body.count },
        "tuukh.tulbur.turul": req.body.turul,
    };
    if (!!req.body.mashiniiDugaar)
        match["mashiniiDugaar"] = req.body.mashiniiDugaar;
    var uilchluulegchuud = await Uilchluulegch(
        req.body.tukhainBaaziinKholbolt,
        true,
    ).find(match);
    if (uilchluulegchuud?.length > 0) {
        for (const data of uilchluulegchuud) {
        var filteredData = data.tuukh[0]?.tulbur?.filter(
            (a) => a.turul === req.body.turul,
        );
        if (filteredData?.length === req.body.count) {
            await Uilchluulegch(req.body.tukhainBaaziinKholbolt).updateOne(
            { _id: data._id },
            {
                "tuukh.0.tulbur": [filteredData[0]],
            },
            );
        }
        }
    }
    return "Амжилттай";
}
module.exports = { turluurZogsoolIdOruulakh, ebarimtAvsanDunOruulakh, davkharBarimtZasakh };