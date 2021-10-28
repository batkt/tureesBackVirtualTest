const express = require("express");
const router = express.Router();
const Geree = require("../models/geree");
const Khariltsagch = require("../models/khariltsagch");
const Dugaarlalt = require("../models/dugaarlalt");
const multer = require("multer");
const storage = multer.memoryStorage();
const uploadFile = multer({
  storage: storage,
});
const { crud } = require("../components/crud");
const {
  tokenShalgakh
} = require("../middlewares/tokenShalgakh");

const {
  gereeniiToololtAvya
} = require('../controller/toololt')

const {
  tulultKhadgalya,
  tulultUstgaya,
  tulultTaniya
} = require('../controller/tulbur')
router.route("/tulultTaniya").get(tulultTaniya);
const lodash = require('lodash')

const { gereeniiExcelAvya, gereeniiExcelTatya } = require("../controller/excel");

router.route("/gereeniiToololtAvya").get(tokenShalgakh, gereeniiToololtAvya);

router.route("/gereeniiExcelAvya").get(gereeniiExcelAvya);
router.route("/gereeniiExcelTatya").post(uploadFile.single("file"), tokenShalgakh, gereeniiExcelTatya);
router.route("/tulultKhadgalya").post(tokenShalgakh, tulultKhadgalya);
router.route("/tulultUstgaya").post(tokenShalgakh, tulultUstgaya);
router.route("/gereeniiTulultAvya/:gereeniiId").get(tokenShalgakh, (req, res, next) => {
  Geree.findById(req.params.gereeniiId).select('avlaga').then((result) => {
    if (lodash.isArray(lodash.get(result, 'avlaga.guilgeenuud'))) {
      var a = lodash.get(result, 'avlaga.guilgeenuud').filter(a => a.ognoo < new Date());
      res.send(a)
    }
  }).catch((err) => {
    next(err);
  });
});
crud(router, "geree", Geree, async (req, res, next) => {
  try {
    const khariltsagch = new Khariltsagch(req.body);
    khariltsagch.id = khariltsagch.register;
    var unuudur = new Date();
    unuudur = new Date(
      unuudur.getFullYear(),
      unuudur.getMonth(),
      unuudur.getDate()
    );
    var maxDugaar = 1;
    await Dugaarlalt.find({
      baiguullagiinId: req.body.baiguullagiinId,
      ognoo: unuudur,
    })
      .sort({
        dugaar: -1,
      })
      .limit(1)
      .then((result) => {
        if (result != 0) maxDugaar = result[0].dugaar + 1;
      });
    var dugaarlalt = new Dugaarlalt({
      baiguullagiinId: req.body.baiguullagiinId,
      dugaar: maxDugaar,
      ognoo: unuudur,
      isNew: true,
    });
    req.body.gereeniiDugaar = req.body.gereeniiDugaar + maxDugaar;
    khariltsagch
      .save()
      .then((result) => {
        dugaarlalt.save();
        next();
      })
      .catch((err) => {
        next(err);
      });
  } catch (error) {
    next(error);
  }
});

router.route("/gereeSungaya").post(tokenShalgakh, async (req, res, next) => {
  var geree = await Geree.findById(req.body.gereeniiId).select({ "gereeniiTuukhuud": 1, "duusakhOgnoo": 1 });
  var tuukh = {
    umnukhDuusakhOgnoo: geree.duusakhOgnoo,
    shineDuusakhOgnoo: new Date(req.body.duusakhOgnoo),
    khiisenOgnoo: new Date(),
    turul: "Sungakh",
    ajiltniiNer: req.body.nevtersenAjiltniiToken.ner,
    ajiltniiId: req.body.nevtersenAjiltniiToken.id
  }
  console.log(tuukh);
  if (geree.gereeniiTuukhuud) {
    Geree.findOneAndUpdate({ "_id": req.body.gereeniiId }, {
      $push: {
        [`gereeniiTuukhuud`]: tuukh
      },
      $set: {
        "duusakhOgnoo": req.body.duusakhOgnoo
      }
    }).then((result) => {
      res.send("Amjilttai");
    })
      .catch((err) => {
        next(err);
      });
  }
  else {
    tuukh = [tuukh]
    console.log(tuukh);
    Geree.findOneAndUpdate({ "_id": req.body.gereeniiId }, {
      $set: {
        "duusakhOgnoo": req.body.duusakhOgnoo,
        "gereeniiTuukhuud": tuukh
      }
    }).then((result) => {
      res.send("Amjilttai");
    })
      .catch((err) => {
        next(err);
      });
  }
});

router.route("/gereeTsutslaya").post(tokenShalgakh, async (req, res, next) => {
  var geree = await Geree.findById(req.body.gereeniiId).select({ "gereeniiTuukhuud": 1, "duusakhOgnoo": 1 });
  var tuukh = {
    umnukhDuusakhOgnoo: geree.duusakhOgnoo,
    tsutslasanShaltgaan: req.body.shaltgaan,
    khiisenOgnoo: new Date(),
    turul: "Tsutslakh",
    ajiltniiNer: req.body.nevtersenAjiltniiToken.ner,
    ajiltniiId: req.body.nevtersenAjiltniiToken.id
  }
  console.log(tuukh);
  if (geree.gereeniiTuukhuud) {
    Geree.findOneAndUpdate({ "_id": req.body.gereeniiId }, {
      $push: {
        [`gereeniiTuukhuud`]: tuukh
      },
      $set: {
        "tuluv": -1
      }
    }).then((result) => {
      res.send("Amjilttai");
    })
      .catch((err) => {
        next(err);
      });
  }
  else {
    tuukh = [tuukh]
    console.log(tuukh);
    Geree.findOneAndUpdate({ "_id": req.body.gereeniiId }, {
      $set: {
        "gereeniiTuukhuud": tuukh,
        "tuluv": -1
      }
    }).then((result) => {
      res.send("Amjilttai");
    })
      .catch((err) => {
        next(err);
      });
  }
});


module.exports = router;

