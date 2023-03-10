const express = require("express");
const router = express.Router();
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

router.post("/diamondGuilgeeTatya", async (req, res, next) => {
  try {
    const { db } = require("zevbackv2");
    var { nevtrekhNer, nuutsUg, turul, ognoo } = req.body;
    const ajiltan = await Ajiltan(db.erunkhiiKholbolt)
      .findOne()
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
    var butsaakhUtga = {};
    if (turul == "1") {
      var butsaakhUtga = {
        guilgeeniiUtga: "Тоглоомын төвийн гүйлгээ",
        ognoo: ognoo,
        zadargaa: [
          {
            dansniiDugaar: "3402-00-000-000",
            dansniiNer: "НӨАТ өглөг",
            dun: 10000,
            debit: false,
          },
          {
            dansniiDugaar: "5102-00-000-007",
            dansniiNer: "Тоглоомын төвийн үйлчилгээний орлого",
            dun: 100000,
            debit: false,
          },
          {
            dansniiDugaar: "1201-00-000-016",
            dansniiNer: "Тоглоомын төвийн авлага",
            dun: 11000,
            debit: true,
          },
        ],
        tuslakhuud: [
          {
            register: "AB12345678",
            dun: 100000,
          },
        ],
      };
    } else if (turul == "2") {
      var butsaakhUtga = {
        guilgeeniiUtga: "Зогсоолын орлого",
        ognoo: ognoo,
        zadargaa: [
          {
            dansniiDugaar: "3402-00-000-000",
            dansniiNer: "НӨАТ өглөг",
            dun: 10000,
            debit: false,
          },
          {
            dansniiDugaar: "5101-00-000-002",
            dansniiNer: "Дулаан зогсоолын өдрийн үйлчилгээний орлого",
            dun: 100000,
            debit: false,
          },
          {
            dansniiDugaar: "1201-00-000-300",
            dansniiNer: "Тоглоомын төвийн авлага",
            dun: 11000,
            debit: true,
          },
        ],
        tuslakhuud: [
          {
            register: "AB12345678",
            dun: 100000,
          },
        ],
      };
    }
    res.send(butsaakhUtga);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
