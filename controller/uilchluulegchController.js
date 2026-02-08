const uilchluulegchService = require("../service/uilchluulegchService");

exports.getJagsaalt = async (req, res, next) => {
  try {
    const queryParams = req.query;
    const result = await uilchluulegchService.getJagsaalt(queryParams, req.body.tukhainBaaziinKholbolt);
    res.send(result);
  } catch (error) {
    next(error);
  }
};