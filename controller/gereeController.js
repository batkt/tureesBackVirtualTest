const gereeService = require("../service/gereeService");

exports.gereeAshiglakhguiSaruud = async (req, res, next) => {
  try {
    const result = await gereeService.gereeAshiglakhguiSaruud(
      req,
      req.body.zardal,
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
};
