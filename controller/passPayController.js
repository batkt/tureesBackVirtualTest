const passPayService = require("../service/passPayService");

exports.passPay = async (req, res, next) => {
  try {
    const result = await passPayService.passPay(req);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
