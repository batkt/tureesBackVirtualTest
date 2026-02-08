const parkingService = require("../service/parkingService");

async function getZogsooliinIpAvaya(req, res, next) {
  try {
    const { barilgiinId } = req.params;

    const ipList = await parkingService.getCameraIPsByBarilgiinId(req, barilgiinId);

    const yavuulakhData = {
      ip: ipList,
      baiguullagiinId: req.body.baiguullagiinId,
      barilgiinId: barilgiinId,
    };

    res.send(yavuulakhData);
  } catch (err) {
    next(err);
  }
}
async function mashiniiTooAvya(req, res, next) {
  try {
    const result = await parkingService.mashiniiTooAvakh({
      baiguullagiinId: req.body.baiguullagiinId,
      barilgiinId: req.body.barilgiinId,
      tukhainBaaziinKholbolt: req.body.tukhainBaaziinKholbolt,
    });

    res.send(result);
  } catch (err) {
    next(err);
  }
}
module.exports = { getZogsooliinIpAvaya, mashiniiTooAvya, };
