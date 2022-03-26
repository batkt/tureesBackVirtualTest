const express = require("express");
const router = express.Router();
const Geree = require("../models/geree");
const Talbai = require("../models/talbai");
const Khariltsagch = require("../models/khariltsagch");
const Dugaarlalt = require("../models/dugaarlalt");
const KhungulultiinTuukh = require("../models/khungulultiinTuukh");
const { gereeZasakhShalguur, guilgeeUstgakhShalguur } = require("../components/shalguur");
const multer = require("multer");
const storage = multer.memoryStorage();
const uploadFile = multer({ storage: storage });
//const { crud } = require("../components/crud");
//const khuudaslalt = require("../components/khuudaslalt");
//const { tokenShalgakh } = require("../middlewares/tokenShalgakh");
const UstsanBarimt = require("../models/ustsanBarimt");
const { tokenShalgakh, crud, khuudaslalt } = require("zevback");

const {
  gereeniiToololtAvya,
  guilgeeniiToololtAvya
} = require('../controller/toololt')

const {
  tulultOlnoorKhadgalya,
  baritsaaniiGuilgeeKhiie,
  tulultUstgaya,
  baritsaaniiGuilgeeUstgaya,
  tulultTaniya,
  gereeniiGuilgeeKhadgalya,
  uldegdelBodyo,
  tukhainOgnoogoorAvlagaBodojOruulya,
  gereenuudedZalruulgaOruulya,
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
router.route("/tulultOlnoorKhadgalya").post(tokenShalgakh, tulultOlnoorKhadgalya);
router.route("/baritsaaniiGuilgeeKhiie").post(tokenShalgakh, baritsaaniiGuilgeeKhiie);
router.route("/tulultUstgaya").post(tokenShalgakh, guilgeeUstgakhShalguur, tulultUstgaya);
router.route("/baritsaaniiGuilgeeUstgaya").post(tokenShalgakh, guilgeeUstgakhShalguur, baritsaaniiGuilgeeUstgaya);
router.route("/tukhainOgnoogoorAvlagaBodojOruulya").post(tokenShalgakh, tukhainOgnoogoorAvlagaBodojOruulya);
router.route("/gereenuudedZalruulgaOruulya").post(tokenShalgakh, gereenuudedZalruulgaOruulya);
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
        if (a.turul != "baritsaa")
          uldegdel = uldegdel + (x.tulukhDun ? x.tulukhDun : 0) - (x.tulsunDun ? x.tulsunDun : 0) - (x.khyamdral ? x.khyamdral : 0);
        a.uldegdel = uldegdel;
      });
      res.send(a)
    }
  }).catch((err) => {
    next(err);
  });
});
router.route("/baritsaaTulultAvya/:gereeniiId").get(tokenShalgakh, (req, res, next) => {
  Geree.findById(req.params.gereeniiId).select('avlaga').then((result) => {
    console.log("baritsaaTulultAvya", result)
    if (lodash.isArray(lodash.get(result, 'avlaga.baritsaa'))) {
      var a = lodash.get(result, 'avlaga.baritsaa');
      a = lodash.orderBy(a, ['ognoo'], ['asc']);
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

crud(router, "khungulultiinTuukh", KhungulultiinTuukh, UstsanBarimt)
crud(router, "geree", Geree, UstsanBarimt, async (req, res, next) => {
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
}, gereeZasakhShalguur);

router.route("/gereeKhadgalya").post(tokenShalgakh, gereeZasakhShalguur, async (req, res, next) => {
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
  var khariltsagchShalguur = await Khariltsagch.findOne({ register: khariltsagch.register, barilgiinId: req.body.barilgiinId });
  if (!khariltsagchShalguur)
    await khariltsagch.save();
  dugaarlalt.save();
  var geree = new Geree(req.body);
  geree.tuluv = 1;
  await geree.save().then((result) => {
    talbaiKhariltsagchiinTuluvUurchluy([result._id]);
  });
  res.send("Amjilttai");
})

router.route("/gereeSungaya").post(tokenShalgakh, gereeZasakhShalguur, async (req, res, next) => {
  var geree = await Geree.findById(req.body.gereeniiId).select({ "gereeniiTuukhuud": 1, "duusakhOgnoo": 1 });
  var tuukh = {
    umnukhDuusakhOgnoo: geree.duusakhOgnoo,
    shineDuusakhOgnoo: new Date(req.body.duusakhOgnoo),
    khiisenOgnoo: new Date(),
    turul: "Sungakh",
    ajiltniiNer: req.body.nevtersenAjiltniiToken.ner,
    ajiltniiId: req.body.nevtersenAjiltniiToken.id
  }
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

router.route("/gereeSergeeye").post(tokenShalgakh, gereeZasakhShalguur, async (req, res, next) => {
  try {
    var geree = await Geree.findById(req.body.gereeniiId).select({ "gereeniiTuukhuud": 1, "duusakhOgnoo": 1, "tuluv": 1 });
    if (geree.tuluv !== -1)
      throw new Error("Зөвхөн цуцалсан төлөвтэй гэрээг сэргээх боломжтой!");
    var tuukh = {
      umnukhDuusakhOgnoo: geree.duusakhOgnoo,
      sergeekhOgnoo: req.body.sergeekhOgnoo,
      shineDuusakhOgnoo: new Date(req.body.duusakhOgnoo),
      tailbar: tailbar,
      khiisenOgnoo: new Date(),
      turul: "Sergeekh",
      ajiltniiNer: req.body.nevtersenAjiltniiToken.ner,
      ajiltniiId: req.body.nevtersenAjiltniiToken.id
    }
    if (geree.gereeniiTuukhuud) {
      Geree.findOneAndUpdate({ "_id": req.body.gereeniiId }, {
        $push: {
          [`gereeniiTuukhuud`]: tuukh
        },
        $set: {
          "tuluv": 1
        }
      }).then((result) => {
        talbaiKhariltsagchiinTuluvUurchluy([geree._id]);
        res.send("Amjilttai");
      })
        .catch((err) => {
          next(err);
        });
    }
    else {
      tuukh = [tuukh]
      Geree.findOneAndUpdate({ "_id": req.body.gereeniiId }, {
        $set: {
          "tuluv": 1,
          "gereeniiTuukhuud": tuukh
        }
      }).then((result) => {
        talbaiKhariltsagchiinTuluvUurchluy([geree._id]);
        res.send("Amjilttai");
      })
        .catch((err) => {
          next(err);
        });
    }
  }
  catch (err) {
    next(err);
  }
});

async function talbaiKhariltsagchiinTuluvUurchluy(gereeniiIdnuud) {
  if (gereeniiIdnuud && gereeniiIdnuud.length > 0) {
    var talbainBulk = [];
    var khariltsagchiinBulk = [];
    for (const id of gereeniiIdnuud) {
      let geree = await Geree.findById(id);
      let busadGereenuud = await Geree.findOne({ "register": geree.register, barilgiinId: geree.barilgiinId, tuluv: { $ne: -1 } });
      let upsertTalbai = {
        'updateOne': {
          'filter': { 'kod': geree.talbainDugaar, 'barilgiinId': geree.barilgiinId },
          'update': {
            "idevkhiteiEsekh": (geree.tuluv == 1)
          }
        }
      };
      let upsertKhariltsagch = {
        'updateOne': {
          'filter': { 'register': geree.register, 'barilgiinId': geree.barilgiinId },
          'update': {
            "idevkhiteiEsekh": busadGereenuud ? true : false
          }
        }
      };
      talbainBulk.push(upsertTalbai);
      khariltsagchiinBulk.push(upsertKhariltsagch);
    }
    if (talbainBulk)
      Talbai.bulkWrite(talbainBulk)
        .then(bulkWriteOpResult => {
          console.log('BULK update OK', bulkWriteOpResult);
        })
        .catch(err => {
          console.log('BULK update error', err);
        });

    if (khariltsagchiinBulk)
      Khariltsagch.bulkWrite(khariltsagchiinBulk)
        .then(bulkWriteOpResult => {
          console.log('BULK update OK', bulkWriteOpResult);
        })
        .catch(err => {
          console.log('BULK update error', err);
        });
  }
}

router.route("/gereeTsutslaya").post(tokenShalgakh, gereeZasakhShalguur, async (req, res, next) => {
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
      talbaiKhariltsagchiinTuluvUurchluy([geree._id]);
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
      talbaiKhariltsagchiinTuluvUurchluy([geree._id]);
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
          'barilgiinId': req.body.barilgiinId,
          'tuluv': {
            $ne: -1
          }
        }
      },
      {
        '$lookup': {
          'from': 'talbai',
          'let': {
            "talbainDugaar": "$talbainDugaar",
            "baiguullagiinId": "$baiguullagiinId",
            "barilgiinId": "$barilgiinId"
          },
          'pipeline': [
            {
              '$match':
              {
                '$expr':
                {
                  '$and':
                    [
                      { '$eq': ["$kod", "$$talbainDugaar"] },
                      { '$eq': ["$baiguullagiinId", "$$baiguullagiinId"] },
                      { '$eq': ["$barilgiinId", "$$barilgiinId"] }
                    ]
                }
              }
            }
          ],
          'as': 'talbai'
        }
      }, {
        '$facet': {
          'umnukhSariinUrTulbur': [
            {
              '$match': {
                $or: [
                  {
                    'avlaga.guilgeenuud.ognoo': {
                      '$lte': new Date(req.body.ekhlekhOgnoo)
                    }
                  },
                  {
                    $and: [
                      {
                        'avlaga.guilgeenuud.ognoo': {
                          '$lte': new Date(req.body.nekhemjlekhAvakhOgnoo),
                          '$gte': new Date(req.body.ekhlekhOgnoo)
                        }
                      },
                      {
                        $or: [
                          {
                            'avlaga.guilgeenuud.undsenDun': {
                              $exists: false
                            }
                          },
                          {
                            'avlaga.guilgeenuud.undsenDun': 0
                          }
                        ]
                      }
                    ]
                  }
                ]
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
            },
            {
              '$unwind': {
                'path': "$talbai"
              }
            }, {
              '$group': {
                '_id': '$gereeniiDugaar',
                'niitAshiglaltiinZardal': {
                  '$max': '$talbai.niitAshiglaltiinZardal'
                },
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
                'niitAshiglaltiinZardal': '$niitAshiglaltiinZardal',
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
          ],
          'nekhemjlekhDeerGarakh': [
            {
              '$match': {
                'avlaga.guilgeenuud.ognoo': {
                  '$lte': new Date(req.body.duusakhOgnoo),
                  '$gte': new Date(req.body.ekhlekhOgnoo)
                },
                "avlaga.guilgeenuud.nekhemjlekhDeerKharagdakh": true
              }
            }, {
              '$project': {
                'gereeniiDugaar': '$gereeniiDugaar',
                "avlaga": "$avlaga.guilgeenuud"
              }
            },
            {
              $group: {
                "_id": "$gereeniiDugaar",
                "guilgeenuud": {
                  $push: "$avlaga"
                }
              }
            }
          ]
        }
      }
    ]

    var gereenuud = await Geree.aggregate(query);
    console.log("gereenuud");
    console.log(JSON.stringify(gereenuud, null, 4))

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
              x.niitAshiglaltiinZardal = (gereenuud[0].niitUldegdel.find(a => a._id == x.gereeniiDugaar)?.niitAshiglaltiinZardal || 0)
              x.nemeltNekhemjlekh = (gereenuud[0].nekhemjlekhDeerGarakh.find(a => a._id == x.gereeniiDugaar)?.guilgeenuud || [])

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

router.route("/gereeTulukhDunteiAvya").post(tokenShalgakh, async (req, res, next) => {
  try {
    const body = req.body.query;
    if (!!body?.khuudasniiDugaar) body.khuudasniiDugaar = Number(body.khuudasniiDugaar);
    if (!!body?.khuudasniiKhemjee) body.khuudasniiKhemjee = Number(body.khuudasniiKhemjee);
    if (!!body?.search) body.search = String(body.search);

    body.lean = true;
    khuudaslalt(Geree, body)
      .then(async (result) => {
        if (result && result.jagsaalt && result.jagsaalt.length > 0) {
          var idnuud = [];
          result.jagsaalt.forEach(a => idnuud.push(a._id));
          var query = [
            {
              '$match': {
                'baiguullagiinId': req.body.baiguullagiinId,
                'barilgiinId': req.body.barilgiinId,
                '_id': { $in: idnuud }
              }
            },
            {
              '$unwind': {
                'path': '$avlaga.guilgeenuud'
              }
            }, {
              '$facet': {
                'khariltsagch': [
                  {
                    "$lookup":
                    {
                      from: 'khariltsagch',
                      localField: 'register',
                      foreignField: 'register',
                      as: 'khariltsagch'
                    }
                  },
                  {
                    "$project": {
                      "_id": 1,
                      "register": 1,
                      "firebaseToken": 1,
                    }
                  },
                  {
                    "$set":
                    {
                      "token": {
                        $arrayElemAt: ["$khariltsagch.firebaseToken", 0]
                      },
                      "khariltsagchiinId": {
                        $arrayElemAt: ["$khariltsagch._id", 0]
                      },
                      "register": {
                        $arrayElemAt: ["$khariltsagch.register", 0]
                      }
                    }
                  }
                ],
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
          result.jagsaalt.forEach(x => {
            x.eneSardTulukhDun = (gereenuud[0].eneSardTulukhDun.find(a => a._id == x.gereeniiDugaar)?.uldegdel || 0)
            x.umnukhSariinUrTulbur = (gereenuud[0].umnukhSariinUrTulbur.find(a => a._id == x.gereeniiDugaar)?.uldegdel || 0)
            x.niitUldegdel = (gereenuud[0].niitUldegdel.find(a => a._id == x.gereeniiDugaar)?.uldegdel || 0)
            x.khariltsagchiinId = gereenuud[0].khariltsagch.find(a => a.register == x.register)?._id;
            x.firebaseToken = gereenuud[0].khariltsagch.find(a => a.register == x.register)?.token;
            if (x.umnukhSariinUrTulbur < 0)
              x.umnukhSariinUrTulbur = 0
            if (x.eneSardTulukhDun < 0)
              x.eneSardTulukhDun = 0
            if (x.niitUldegdel < 0)
              x.niitUldegdel = 0
          });
        }
        res.send(result);
      })
      .catch((err) => {
        next(err);
      });
  } catch (error) {
    next(error);
  }
});

router.route("/utasniiDugaaraarGereeAvya").post(tokenShalgakh, async (req, res, next) => {
  try {
    var geree = await Geree.findOne({ "utas": { $in: [req.body.utas] }, "baiguullagiinId": req.body.baiguullagiinId });
    if (geree)
      res.send(geree);
    else
      res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

router.route("/eneSardTuluuguiGereenuudAvya").post(tokenShalgakh, async (req, res, next) => {
  try {
    console.log("ene sard", req.body);
    var query = [
      {
        '$unwind': {
          'path': '$avlaga.guilgeenuud'
        }
      }, {
        '$match': {
          'baiguullagiinId': req.body.baiguullagiinId,
          'barilgiinId': req.body.barilgiinId,
          'tuluv': {
            $ne: -1
          }
        }
      }, {
        '$facet': {
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
          'eneSardTuluugui': [
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
                'tulsun': {
                  '$sum': '$avlaga.guilgeenuud.tulsunDun'
                }
              }
            }
          ]
        }
      }
    ]
    var gereenuud = await Geree.aggregate(query);
    console.log(gereenuud);
    if (gereenuud.length < 0 || gereenuud[0].eneSardTuluugui.length < 1)
      res.send(null);
    else {
      var turJagsaalt = [];
      gereenuud[0].eneSardTuluugui.forEach(x => {
        if (!x.tulsun || x.tulsun == 0)
          turJagsaalt.push(x._id)
      });
      const body = req.body.query;
      if (!!body?.khuudasniiDugaar) body.khuudasniiDugaar = Number(body.khuudasniiDugaar);
      if (!!body?.khuudasniiKhemjee) body.khuudasniiKhemjee = Number(body.khuudasniiKhemjee);
      if (!!body?.search) body.search = String(body.search);
      console.log("turJagsaalt", turJagsaalt);
      body.query["gereeniiDugaar"] = { $in: turJagsaalt };
      body.lean = true;

      console.log("body", body);
      khuudaslalt(Geree, body)
        .then((result) => {
          console.log("result", result);
          if (result && result.jagsaalt && result.jagsaalt.length > 0)
            result.jagsaalt.forEach(x => {
              x.eneSardTuluugui = (gereenuud[0].eneSardTuluugui.find(a => a._id == x.gereeniiDugaar)?.uldegdel || 0)
              x.niitUldegdel = (gereenuud[0].niitUldegdel.find(a => a._id == x.gereeniiDugaar)?.uldegdel || 0)
              if (x.eneSardTuluugui < 0)
                x.eneSardTuluugui = 0
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

router.route("/eneSardTuluuguiGereeniiTooAvya").post(tokenShalgakh, async (req, res, next) => {
  try {
    var query = [
      {
        '$unwind': {
          'path': '$avlaga.guilgeenuud'
        }
      }, {
        '$match': {
          'baiguullagiinId': req.body.baiguullagiinId,
          'barilgiinId': req.body.barilgiinId,
          'tuluv': {
            $ne: -1
          },
          'avlaga.guilgeenuud.ognoo': {
            '$lte': new Date(req.body.duusakhOgnoo),
            '$gte': new Date(req.body.ekhlekhOgnoo)
          }
        }
      }, {
        '$group': {
          '_id': '$gereeniiDugaar',
          'tulsun': {
            '$sum': '$avlaga.guilgeenuud.tulsunDun'
          }
        }
      }, {
        '$match': {
          'tulsun': 0
        }
      }, {
        '$group': {
          '_id': 'aa',
          'niit': {
            '$sum': 1
          }
        }
      }
    ]
    var gereenuud = await Geree.aggregate(query);
    tuluuguiToo = 0;
    if (gereenuud && gereenuud.length > 0)
      tuluuguiToo = gereenuud[0].niit
    res.send({ too: tuluuguiToo });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

