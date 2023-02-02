const express = require("express");
const Ajiltan = require("../models/ajiltan");
const { tokenShalgakh } = require("zevbackv2");
router.post(
  "/sankhuugiinGuilgeeTatya",
  tokenShalgakh,
  async (req, res, next) => {
    try {
      var { nevtrekhNer, nuutsUg, turul } = req.body;
      const ajiltan = await Ajiltan.findOne()
        .select("+nuutsUg")
        .where("nevtrekhNer")
        .equals(nevtrekhNer)
        .catch((err) => {
          next(err);
        });
      if (!ajiltan)
        throw new Error("Хэрэглэгчийн нэр эсвэл нууц үг буруу байна!");
      if (ajiltan.nuutsUg != nuutsUg)
        throw new Error("Хэрэглэгчийн нэр эсвэл нууц үг буруу байна!");
      if (turul == "1") {
      }
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
