const busadDataService = require("../service/busadDataService");

exports.turluurZogsoolIdOruulakh = async (req, res, next) => {
  try {
    const result = await busadDataService.turluurZogsoolIdOruulakh(req);
    res.json(result);
  } catch (err) {
    next(err);
  }
};