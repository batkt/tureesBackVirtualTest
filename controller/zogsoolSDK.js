const zogsoolService = require("../service/zogsoolSDKService");

exports.zogsoolSdkService = async (req, res, next) => {
  try {
    const result = await zogsoolService.zogsoolSdkService(req);
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};
