const express = require("express");
const multer = require("multer");
const router = express.Router();
const Baiguullaga = require("../models/baiguullaga");
const Khariltsagch = require("../models/khariltsagch");
const Ajiltan = require("../models/ajiltan");
const khuudaslalt = require("../components/khuudaslalt");
const { crudWithFile, crud } = require("../components/crud");
const { tokenShalgakh } = require("../middlewares/tokenShalgakh");

crud(router, "baiguullaga", Baiguullaga);

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
  "/baiguullagaTokhirgooZasya",
  (req, res, next) => {
    try {
      if(!!req.body)
        {
          const {baiguullagiinId,tokhirgoo} = req.body
          Baiguullaga.findOneAndUpdate({_id:baiguullagiinId},{$set:tokhirgoo}).then(()=>res.send("Amjilttai"))
        }
      else
        next(new aldaa("Засах боломжгүй байна"))
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
