const zogsoolTailanService = require("../service/zogsoolTailanService");

exports.ajiltniiUdriinTailan = async (req, res, next) => {
  try {
    const response = await zogsoolTailanService.ajiltniiUdriinTailan(req.body);
    res.status(200).send(response);
  } catch (error) {
    next(error);
  }
};
