const express = require("express");
const router = express.Router();
const Geree = require("../models/geree");
const Khariltsagch = require("../models/khariltsagch");
const Dugaarlalt = require("../models/dugaarlalt");
const KhungulultiinTuukh = require("../models/khungulultiinTuukh");
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
  gereeniiGuilgeeKhadgalya,
  uldegdelBodyo,
  tukhainOgnoogoorAvlagaBodojOruulya,
  khungulultKhadgalya,
  khungulultUstgaya,
  tukhainOgnoogoorGuilgeegOruulya
} = require('../controller/tulbur')
router.route("/tulultTaniya").get(tulultTaniya);
const lodash = require('lodash')

const { gereeniiExcelAvya, gereeniiExcelTatya } = require("../controller/excel");

router.route("/gereeniiToololtAvya").post(tokenShalgakh, gereeniiToololtAvya);
router.route("/guilgeeniiToololtAvya").post(tokenShalgakh, guilgeeniiToololtAvya);

router.route("/gereeniiExcelAvya").get(gereeniiExcelAvya);
router.route("/gereeniiExcelTatya").post(uploadFile.single("file"), tokenShalgakh, gereeniiExcelTatya);
router.route("/tulultKhadgalya").post(tokenShalgakh, tulultKhadgalya);
router.route("/tulultUstgaya").post(tokenShalgakh, tulultUstgaya);
router.route("/tukhainOgnoogoorAvlagaBodojOruulya").post(tokenShalgakh, tukhainOgnoogoorAvlagaBodojOruulya);
router.route("/tukhainOgnoogoorGuilgeegOruulya").post(tokenShalgakh, tukhainOgnoogoorGuilgeegOruulya);
router.route("/khungulultKhadgalya").post(tokenShalgakh, khungulultKhadgalya);
router.route("/khungulultUstgaya").post(tokenShalgakh, khungulultUstgaya);
router.route("/uldegdelBodyo").post(tokenShalgakh, uldegdelBodyo);
router.route("/gereeniiGuilgeeKhadgalya").post(tokenShalgakh, gereeniiGuilgeeKhadgalya);
router.route("/gereeniiTulultAvya/:gereeniiId").get(tokenShalgakh, (req, res, next) => {
  Geree.findById(req.params.gereeniiId).select('avlaga').then((result) => {
    if (lodash.isArray(lodash.get(result, 'avlaga.guilgeenuud'))) {
      var a = lodash.get(result, 'avlaga.guilgeenuud').filter(a => a.ognoo < new Date(req.query.duusakhOgnoo));
      a = lodash.orderBy(a, ['ognoo'], ['asc']);
      var uldegdel = 0;
      a.forEach(x => {
        uldegdel = uldegdel + (x.tulukhDun ? x.tulukhDun : 0) - (x.tulsunDun ? x.tulsunDun : 0) - (x.khyamdral ? x.khyamdral : 0);
        a.uldegdel = uldegdel;
      });
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
      barilgiinId: req.body.barilgiinId,
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
      barilgiinId: req.body.barilgiinId,
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

crud(router, "khungulultiinTuukh", KhungulultiinTuukh)
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
      barilgiinId: req.body.barilgiinId,
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
      barilgiinId: req.body.barilgiinId,
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
          'baiguullagiinId': req.body.baiguullagiinId,
          'barilgiinId': req.body.barilgiinId
        }
      }, {
        '$facet': {
          'umnukhSariinUrTulbur': [
            {
              '$match': {
                'avlaga.guilgeenuud.ognoo': {
                  '$lt': new Date(req.body.ekhlekhOgnoo)
                }
              }
            }, {
              '$group': {
                '_id': '$gereeniiDugaar',
                'tulukh': {
                  '$sum': '$avlaga.guilgeenuud.tulukhDun'
                },
                'khyamdral': {
                  '$sum': '$avlaga.guilgeenuud.khyamdral'
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
                    '$tulukh', {
                      '$sum': [
                        '$tulsun', '$khyamdral'
                      ]
                    }
                  ]
                }
              }
            }
          ],
          'niitUldegdel': [
            {
              '$match': {
                'avlaga.guilgeenuud.ognoo': {
                  '$lte': new Date(req.body.duusakhOgnoo)
                }
              }
            }, {
              '$group': {
                '_id': '$gereeniiDugaar',
                'tulukh': {
                  '$sum': '$avlaga.guilgeenuud.tulukhDun'
                },
                'khyamdral': {
                  '$sum': '$avlaga.guilgeenuud.khyamdral'
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
                    '$tulukh', {
                      '$sum': [
                        '$tulsun', '$khyamdral'
                      ]
                    }
                  ]
                }
              }
            }
          ],
          'eneSardTulukhDun': [
            {
              '$match': {
                'avlaga.guilgeenuud.ognoo': {
                  '$lte': new Date(req.body.duusakhOgnoo),
                  '$gte': new Date(req.body.ekhlekhOgnoo)
                }
              }
            }, {
              '$group': {
                '_id': '$gereeniiDugaar',
                'tulukh': {
                  '$sum': '$avlaga.guilgeenuud.tulukhDun'
                },
                'khyamdral': {
                  '$sum': '$avlaga.guilgeenuud.khyamdral'
                }
              }
            }, {
              '$project': {
                'gereeniiDugaar': '$gereeniiDugaar',
                'uldegdel': {
                  '$subtract': [
                    '$tulukh', '$khyamdral'
                  ]
                }
              }
            }
          ]
        }
      }
    ]
    var gereenuud = await Geree.aggregate(query);
    console.log(gereenuud);
    if (gereenuud.length < 0 || gereenuud[0].eneSardTulukhDun.length < 1)
      res.send(null);
    else {
      var turJagsaalt = [];
      gereenuud[0].eneSardTulukhDun.forEach(x => {
        turJagsaalt.push(x._id)
      });
      const body = req.body.query;
      if (!!body?.khuudasniiDugaar) body.khuudasniiDugaar = Number(body.khuudasniiDugaar);
      if (!!body?.khuudasniiKhemjee) body.khuudasniiKhemjee = Number(body.khuudasniiKhemjee);
      if (!!body?.search) body.search = String(body.search);

      //if (!!body?.query) body.query = JSON.parse(body.query);
      body.query["gereeniiDugaar"] = { $in: turJagsaalt };
      body.lean = true;

      console.log("body", body);
      khuudaslalt(Geree, body)
        .then((result) => {
          console.log("result", result);
          if (result && result.jagsaalt && result.jagsaalt.length > 0)
            result.jagsaalt.forEach(x => {
              x.eneSardTulukhDun = (gereenuud[0].eneSardTulukhDun.find(a => a._id == x.gereeniiDugaar)?.uldegdel || 0)
              x.umnukhSariinUrTulbur = (gereenuud[0].umnukhSariinUrTulbur.find(a => a._id == x.gereeniiDugaar)?.uldegdel || 0)
              x.niitUldegdel = (gereenuud[0].niitUldegdel.find(a => a._id == x.gereeniiDugaar)?.uldegdel || 0)
              if (x.umnukhSariinUrTulbur < 0)
                x.umnukhSariinUrTulbur = 0
              if (x.eneSardTulukhDun < 0)
                x.eneSardTulukhDun = 0
              if (x.niitUldegdel < 0)
                x.niitUldegdel = 0
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

