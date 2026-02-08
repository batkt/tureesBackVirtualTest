// controller/uilchluulegchController.js
const zogsoolTulburService = require("../service/zogsoolTulburService");

exports.tulburOrjIrlee = async (req, res, next) => {
  try {
    await zogsoolTulburService.tulburOrjIrlee(req, req.body, next);
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};
