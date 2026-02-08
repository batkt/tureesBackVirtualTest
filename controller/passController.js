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
