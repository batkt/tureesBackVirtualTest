const zogsoolZurchilteiService = require("../service/zogsoolZurchilteiService");

exports.niitZurchilteiMashinOlokh = async (req, res, next) => {
  try {
    const result = await zogsoolZurchilteiService.niitZurchilteiMashinOlokh(req);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
exports.zurchilteiMashinMsgilgeekh = async (req, res, next) => {
  try {
    const result = await zogsoolZurchilteiService.zurchilteiMashinMsgilgeekh(req);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
exports.zurchiluudTulsunBolgoy = async (req, res, next) => {
  try {
    const result = await zogsoolZurchilteiService.zurchiluudTulsunBolgoy(req);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
exports.zogsooliinTuluuguiMashiniiTailanAvya = async (req, res, next) => {
  try {
    const result = await zogsoolZurchilteiService.zogsooliinTuluuguiMashiniiTailanAvya(req);
    res.json(result);
  } catch (err) {
    next(err);
  }
};