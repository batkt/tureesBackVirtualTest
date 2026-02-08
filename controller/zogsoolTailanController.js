const zogsoolTailanService = require("../service/zogsoolTailanService");

exports.ajiltniiUdriinTailan = async (req, res, next) => {
  try {
    const response = await zogsoolTailanService.ajiltniiUdriinTailan(req.body);
    res.status(200).send(response);
  } catch (error) {
    next(error);
  }
};
exports.udriinTailan = async (req, res, next) => {
  try {
    const response = await zogsoolTailanService.udriinTailan(req.body);
    res.status(200).send(response);
  } catch (error) {
    next(error);
  }
};
exports.zogsoolUilchluulegchdiinDunAvay = async (req, res, next) => {
  try {
    const khariu = await zogsoolTailanService.zogsoolUilchluulegchdiinDunAvakh({
      baiguullagiinId: req.body.baiguullagiinId,
      barilgiinId: req.body.barilgiinId,
      ekhlekhOgnoo: req.body.ekhlekhOgnoo,
      duusakhOgnoo: req.body.duusakhOgnoo,
      garakhKhaalgaIp: req.body.garakhKhaalgaIp,
      tukhainBaaziinKholbolt: req.body.tukhainBaaziinKholbolt,
    });

    res.send(khariu);
  } catch (err) {
    next(err);
  }
}

