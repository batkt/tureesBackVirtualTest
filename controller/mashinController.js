const mashinService = require("../service/mashinService");

exports.mashinUpdate = async (req, res, next) => {
  try {
    const response = await mashinService.mashinUpdate(req);
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};
exports.mashiniiDugaarZasakh = async (req, res, next) => {
  try {
    const response = await mashinService.mashiniiDugaarZasakh(req);
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};
exports.mashiniiDugaarZaiArilgakh = async (req, res, next) => {
  try {
    const response = await mashinService.mashiniiDugaarZaiArilgakh(req);
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};