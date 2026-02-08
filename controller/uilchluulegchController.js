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
exports.zogsoolUstgah = async (req, res, next) => {
  try {
    const result = await uilchluulegchService.zogsoolUstgah(
      req.body,
      req.body.tukhainBaaziinKholbolt
    );

    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
exports.orlogoGaraas = async (req, res, next) => {
  try {
    const utguud = req.body;
    const response = await uilchluulegchService.orlogoGaraasBurtgeh(utguud);
    res.status(200).send(response);
  } catch (error) {
    next(error);
  }
};
exports.tulburTulye = async (req, res, next) => {
  try {
    const response = await uilchluulegchService.tulburTulye(req.body);
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};
