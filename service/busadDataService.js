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
module.exports = { turluurZogsoolIdOruulakh };