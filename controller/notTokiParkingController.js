const notTokiParkingService = require("../service/notTokiParkingService");

exports.notTokiParking = async (req, res, next) => {
  try {
    const result = await notTokiParkingService.notTokiParking(req);
    res.json(result);
  } catch (err) {
    next(err);
  }
};