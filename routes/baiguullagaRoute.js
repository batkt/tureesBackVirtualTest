const express = require("express");
const router = express.Router();
const Baiguullaga = require("../models/baiguullaga");
const Ajiltan = require("../models/ajiltan");
//const { crudWithFile, crud } = require("../components/crud");
//const { tokenShalgakh } = require("../middlewares/tokenShalgakh");
//const UstsanBarimt = require("../models/ustsanBarimt");
const { tokenShalgakh, crud, UstsanBarimt } = require("zevback");

crud(router, "baiguullaga", Baiguullaga, UstsanBarimt);
router.post("/baiguullagaBurtgekh", async (req, res, next) => {
  try {
    console.log(req.body);
    const baiguullaga = new Baiguullaga(req.body);
    baiguullaga.isNew = !baiguullaga.zasakhEsekh;
    baiguullaga.save()
      .then((result) => {
        if (req.body.ajiltan) {
          let ajiltan = new Ajiltan(req.body.ajiltan);
          ajiltan.erkh = "Admin";
          ajiltan.baiguullagiinId = result._id;
          ajiltan.baiguullagiinNer = result.ner;
          ajiltan
            .save()
            .then((result1) => {
              res.send("Amjilttai");
            })
            .catch((err) => {
              res.send(err);
            });
        } else res.send("Amjilttai");
      })
      .catch((err) => {
        next(err);
      });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/khyanakhSambariinUgugdulAvya",
  tokenShalgakh,
  (req, res, next) => {
    res.send({});
  }
);

router.post(
  "/baiguullagaAvya",
  (req, res, next) => {
    Baiguullaga.findOne({
      "register": req.body.register,
    })
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        next(err);
      });
  }
);

router.post(
  "/baiguullagaTokhirgooZasya",
  tokenShalgakh,
  (req, res, next) => {
    try {
      if (!!req.body) {
        var update = {};
        for (var field in req.body) {
          if (field != "baiguullagiinId")
            update["tokhirgoo." + field] = req.body[field];
        }
        console.log("update", update);
        await Baiguullaga.findOneAndUpdate({ _id: req.body.baiguullagiinId }, update);
        res.send("Amjilttai");
      }
      else
        next(new aldaa("Засах боломжгүй байна"))
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
