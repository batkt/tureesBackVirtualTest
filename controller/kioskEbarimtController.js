const kioskEbarimtService = require("../service/kioskEbarimtService");

exports.kioskEbarimtAvya = async (req, res, next) => {
  try {
    const response = await kioskEbarimtService.kioskEbarimtAvya(req);
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};
