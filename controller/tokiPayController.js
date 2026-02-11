const tokiPayService = require("../service/tokiPayService");

exports.tokiPay = async (req, res, next) => {
  try {
    const result = await tokiPayService.tokiPay(req);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

