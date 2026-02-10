const tokiPayService = require("../service/tokiPayService");

exports.tokiPay = async (req, res, next) => {
  try {
    const result = await tokiPayService.tokiPay(req, res, next);
    if (result && !res.headersSent) {
      res.send(result);
    }
  } catch (err) {
    next(err);
  }
};
