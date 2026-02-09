const passService = require("../service/passService");

exports.getPassZogsool = async (req, res, next) => {
  try {
    const data = await passService.getPassZogsool(req.body);

    res.send({
      success: true,
      message: "Amjilttai",
      data: data.length > 0 ? data : undefined,
    });
  } catch (err) {
    next(err);
  }
};
exports.mashinKhaikh = async (req, res, next) => {
  try {
    const { dugaar } = req.params;
    const { freeze } = req.query;
    const result = await passService.mashinKhaikhService(dugaar, freeze);
    res.send(result);
  } catch (err) {
    next(err);
  }
};
