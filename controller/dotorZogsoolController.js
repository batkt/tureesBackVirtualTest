const dotorZogsoolService = require("../service/dotorZogsoolService");

exports.dotorZogsoolDavhkardsanMashin = async (req, res, next) => {
  try {
    const result = await dotorZogsoolService.dotorZogsoolDavhkardsanMashin(req);
    res.json(result);
  } catch (err) {
    next(err);
  }
};