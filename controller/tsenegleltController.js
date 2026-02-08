// controllers/tsenegleltController.js
const tsenegleltService = require("../service/tsenegleltService");

async function tsenegleltKhiiy(req, res, next) {
  try {
    await tsenegleltService.tsenegleltKhiikh({
      baiguullagiinId: req.body.baiguullagiinId,
      barilgiinId: req.body.barilgiinId,
      mashiniiId: req.body.mashiniiId,
      tseneglekhDun: req.body.dun,
      tukhainBaaziinKholbolt: req.body.tukhainBaaziinKholbolt,
    });

    res.status(200).send("Amjilttai");
  } catch (err) {
    next(err);
  }
}

module.exports = {
  tsenegleltKhiiy,
};
