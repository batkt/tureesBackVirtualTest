const {
  Uilchluulegch,
} = require("parking-v2");

async function dotorZogsoolDavhkardsanMashin(req) {
    var match = {
        baiguullagiinId: req.body.baiguullagiinId,
        barilgiinId: req.body.barilgiinId,
        tuukh: { $size: req.body.size },
        "tuukh.zogsooliinId": req.body.zogsooliinId,
        "tuukh.orsonKhaalga": req.body.cameraIP,
        "tuukh.tsagiinTuukh.garsanTsag": { $exists: true },
    };
    if (req.body.mashiniiDugaar)
        match["mashiniiDugaar"] = req.body.mashiniiDugaar;
    var mashinuud = await Uilchluulegch(
    req.body.tukhainBaaziinKholbolt,
    true,
    ).find(match);
    var result = [];
    for (const data of mashinuud) {
    var tuukh = data.tuukh?.filter(
        (e) => e.orsonKhaalga === req.body.cameraIPGadna,
    );
    var filtered = data.tuukh?.filter(
        (e) => e.orsonKhaalga === req.body.cameraIP,
    );
    tuukh.push(filtered[0]);
    data.tuukh = tuukh;
    await Uilchluulegch(req.body.tukhainBaaziinKholbolt).findByIdAndUpdate(
        data._id,
        {
        $set: {
            tuukh: tuukh,
        },
        },
    );
    result.push(data);
    }
    return result;
}
module.exports = { dotorZogsoolDavhkardsanMashin };