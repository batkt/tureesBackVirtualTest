const express = require("express");
const router = express.Router();
const Geree = require("../models/geree");
const Khariltsagch = require("../models/khariltsagch");
const Dugaarlalt = require("../models/dugaarlalt");
const khuudaslalt = require("../components/khuudaslalt");
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
  gereeniiToololtAvya,
  guilgeeniiToololtAvya
} = require('../controller/toololt')

const {
  tulultKhadgalya,
  tulultUstgaya,
  tulultTaniya,
  gereeniiGuilgeeKhadgalya
} = require('../controller/tulbur')
router.route("/tulultTaniya").get(tulultTaniya);
const lodash = require('lodash')

const { gereeniiExcelAvya, gereeniiExcelTatya } = require("../controller/excel");

router.route("/gereeniiToololtAvya").get(tokenShalgakh, gereeniiToololtAvya);
router.route("/guilgeeniiToololtAvya").post(tokenShalgakh, guilgeeniiToololtAvya);

router.route("/gereeniiExcelAvya").get(gereeniiExcelAvya);
router.route("/gereeniiExcelTatya").post(uploadFile.single("file"), tokenShalgakh, gereeniiExcelTatya);
router.route("/tulultKhadgalya").post(tokenShalgakh, tulultKhadgalya);
router.route("/tulultUstgaya").post(tokenShalgakh, tulultUstgaya);
router.route("/gereeniiGuilgeeKhadgalya").post(tokenShalgakh, gereeniiGuilgeeKhadgalya);
router.route("/gereeniiTulultAvya/:gereeniiId").get(tokenShalgakh, (req, res, next) => {
  Geree.findById(req.params.gereeniiId).select('avlaga').then((result) => {
    if (lodash.isArray(lodash.get(result, 'avlaga.guilgeenuud'))) {
      var a = lodash.get(result, 'avlaga.guilgeenuud').filter(a => a.ognoo < new Date(req.query.duusakhOgnoo));
      res.send(a)
    }
  }).catch((err) => {
    next(err);
  });
});

router.route("/nekhemjlekhiinDugaarlaltAvya").get(tokenShalgakh, async (req, res, next) => {
  try {
    var maxDugaar = 1;
    var ognoo = {
      $gte: new Date(
        (new Date).getFullYear(),
        0,
        1),
      $lte: new Date(
        (new Date).getFullYear(),
        11,
        31)
    }
    console.log(ognoo);
    await Dugaarlalt.find({
      baiguullagiinId: req.body.baiguullagiinId,
      turul: "nekhemjlekh",
      ognoo: ognoo
    })
      .sort({
        dugaar: -1,
      })
      .limit(1)
      .then((result) => {
        if (result != 0) maxDugaar = result[0].dugaar + 1;
      });
    res.send(maxDugaar.toString());
  }
  catch (err) {
    next(err);
  }
});

router.route("/nekhemjlekhiinDugaarlaltKhadgalya").post(tokenShalgakh, async (req, res, next) => {
  try {
    var dugaarlalt = new Dugaarlalt({
      baiguullagiinId: req.body.baiguullagiinId,
      dugaar: req.body.dugaar,
      turul: "nekhemjlekh",
      ognoo: new Date(),
      isNew: true,
    });
    dugaarlalt.save();
    res.send("Amjilttai");
  }
  catch (err) {
    next(err);
  }
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
      turul: "geree",
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
      turul: "geree",
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

router.route("/eneSardTulukhJagsaaltAvya").post(tokenShalgakh, async (req, res, next) => {

  try {
    var query = [
      {
        '$unwind': {
          'path': '$avlaga.guilgeenuud'
        }
      }, {
        '$match': {
          'avlaga.guilgeenuud.ognoo': {
            '$lt': new Date(req.body.ognoo)
          }
        }
      }, {
        '$group': {
          '_id': '$gereeniiDugaar',
          'tulukh': {
            '$sum': '$avlaga.guilgeenuud.tulukhDun'
          },
          'tulsun': {
            '$sum': '$avlaga.guilgeenuud.tulsunDun'
          }
        }
      }, {
        '$project': {
          'gereeniiDugaar': '$gereeniiDugaar',
          'uldegdel': {
            '$subtract': [
              '$tulukh', '$tulsun'
            ]
          }
        }
      }, {
        '$match': {
          'uldegdel': {
            '$gt': 0
          }
        }
      }
    ]
    var gereenuud = await Geree.aggregate(query);
    console.log(gereenuud);
    if (gereenuud.length < 1)
      res.send(null);
    else {
      var turJagsaalt = [];
      gereenuud.forEach(x => {
        turJagsaalt.push(x._id)
      });
      const body = req.body.query;
      console.log("body", body);
      if (!!body?.khuudasniiDugaar) body.khuudasniiDugaar = Number(body.khuudasniiDugaar);
      console.log("body3");
      if (!!body?.khuudasniiKhemjee) body.khuudasniiKhemjee = Number(body.khuudasniiKhemjee);
      console.log("body4");
      if (!!body?.search) body.search = String(body.search);

      body.query["gereeniiDugaar"] = turJagsaalt;
      console.log("body.query", body.query);
      body.lean = true;
      khuudaslalt(Geree, body)
        .then((result) => {
          if (result && result.jagsaalt && result.jagsaalt.length > 0)
            result.jagsaalt.forEach(x => {
              x.eneSardTulukhDun = gereenuud.find(a => a._id == x.gereeniiDugaar).uldegdel
              x.umnukhSariinUrTulbur = x.eneSardTulukhDun - x.uldegdel
            });
          res.send(result);
        })
        .catch((err) => {
          next(err);
        });
    }
  } catch (error) {
    next(error);
  }
});


module.exports = router;

