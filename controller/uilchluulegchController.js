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

exports.zogsoolJagsaalt = async (req, res, next) => {
  try {
    const result = await uilchluulegchService.zogsoolJagsaalt(req.query, req.body?.tukhainBaaziinKholbolt);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
