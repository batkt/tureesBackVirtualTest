const Ajiltan = require("../models/ajiltan");
const { db } = require("zevbackv2");

async function gereeZasakhShalguur(req, res, next) {
  if (req.body.nevtersenAjiltniiToken && req.body.barilgiinId) {
    var ajiltan = await Ajiltan(db.erunkhiiKholbolt).findById(
      req.body.nevtersenAjiltniiToken.id
    );
    if (
      ajiltan.erkh == "Admin" ||
      (ajiltan.tokhirgoo &&
        ajiltan.tokhirgoo.gereeZasakhErkh &&
        ajiltan.tokhirgoo.gereeZasakhErkh.length > 0 &&
        ajiltan.tokhirgoo.gereeZasakhErkh.includes(req.body.barilgiinId))
    ) {
      next();
    } else next(new Error("Энэ үйлдлийн эрхгүй байна!"));
  } else next(new Error("Энэ үйлдлийн эрхгүй байна!"));
}

async function guilgeeUstgakhShalguur(req, res, next) {
  if (req.body.nevtersenAjiltniiToken && req.body.barilgiinId) {
    var ajiltan = await Ajiltan(db.erunkhiiKholbolt).findById(
      req.body.nevtersenAjiltniiToken.id
    );
    if (
      ajiltan.erkh == "Admin" ||
      (ajiltan.tokhirgoo &&
        ajiltan.tokhirgoo.guilgeeUstgakhErkh &&
        ajiltan.tokhirgoo.guilgeeUstgakhErkh.length > 0 &&
        ajiltan.tokhirgoo.guilgeeUstgakhErkh.includes(req.body.barilgiinId))
    ) {
      next();
    } else next(new Error("Энэ үйлдлийн эрхгүй байна!"));
  } else next(new Error("Энэ үйлдлийн эрхгүй байна!"));
}

module.exports = {
  gereeZasakhShalguur,
  guilgeeUstgakhShalguur,
};
