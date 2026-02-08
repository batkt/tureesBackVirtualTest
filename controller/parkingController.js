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

module.exports = { getZogsooliinIpAvaya };
