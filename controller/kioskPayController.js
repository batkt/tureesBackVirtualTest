const kioskPayService = require("../service/kioskPayService");

exports.kioskPay = async (req, res, next) => {
  try {
    const response = await kioskPayService.kioskPay(req);
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};
