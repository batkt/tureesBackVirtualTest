const express = require("express");
const router = express.Router();
const Talbai = require("../models/talbai");
const Geree = require("../models/geree");
const multer = require("multer");
const storage = multer.memoryStorage();
//const { tokenShalgakh } = require("../middlewares/tokenShalgakh");
//const { crud } = require("../components/crud");
//const UstsanBarimt = require("../models/ustsanBarimt");
const { tokenShalgakh, crud, UstsanBarimt, Segment } = require("zevbackv2");
const moment = require("moment");
const uploadFile = multer({ storage: storage });
const ZassanBarimtShalgakh = require("../components/zassanBarimtShalgakh");
const Baiguullaga = require("../models/baiguullaga");

crud(router, "talbai", Talbai, UstsanBarimt, async (req, res, next) => {
  try {
    if (!req.body.kod) throw new Error("Талбайн дугаар бөглөнө үү!");
    else {
      var talbai = await Talbai(req.body.tukhainBaaziinKholbolt).findOne({
        kod: req.body.kod,
        baiguullagiinId: req.body.baiguullagiinId,
        barilgiinId: req.body.barilgiinId,
      });
      if (talbai) throw new Error("Талбайн дугаар давхардаж байна!");
    }
    next();
  } catch (error) {
    next(error);
  }
});
crud(router, "segment", Segment, UstsanBarimt);

const { talbaiTatya, talbainZagvarAvya } = require("../controller/excel");

router
  .route("/talbaiTatya")
  .post(uploadFile.single("file"), tokenShalgakh, talbaiTatya);
router.route("/talbainZagvarAvya").get(tokenShalgakh, talbainZagvarAvya);
router
  .route("/talbainSulEskhiigShalgay")
  .get(tokenShalgakh, async (req, res, next) => {
    try
    {
      var talbai = await Talbai(req.body.tukhainBaaziinKholbolt).findOne({
        kod: req.query.talbainDugaar,
        barilgiinId: req.query.barilgiinId,
      });
      console.log("talbai", talbai);
      var geree = await Geree(req.body.tukhainBaaziinKholbolt).findOne({
        talbainIdnuud: talbai._id,
        barilgiinId: req.query.barilgiinId,
        tuluv: 1,
        duusakhOgnoo: { $gte: new Date() },
      });
      if (geree) res.send(geree.gereeniiDugaar);
      else res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  });

router.route("/talbainTooAvya").get(tokenShalgakh, async (req, res, next) => {
  try {
    var barilgiinId= req.query.barilgiinId
    var match = {
      baiguullagiinId: req.body.baiguullagiinId,
    }
    if(!!barilgiinId)
      match["barilgiinId"] = barilgiinId
    let query = [
      {
        $match: match,
      },
      {
        $group: {
          _id: "$idevkhiteiEsekh",
          khemjee: {
            $sum: "$talbainKhemjee",
          },
          too: {
            $sum: 1,
          },
        },
      },
    ];
    var result = await Talbai(req.body.tukhainBaaziinKholbolt).aggregate(query);
    match = {
      baiguullagiinId: req.body.baiguullagiinId,
      niitiinTalbaiEsekh: true,
    }
    if(!!barilgiinId)
      match["barilgiinId"] = barilgiinId
    query = [
      {
        $match: match,
      },
      {
        $group: {
          _id: "niitiinTalbai",
          khemjee: {
            $sum: "$talbainKhemjee",
          },
          too: {
            $sum: 1,
          },
        },
      },
    ];
    var result1 = await Talbai(req.body.tukhainBaaziinKholbolt).aggregate(
      query
    );
    if (result1 && result1.length > 0) {
      if (result && result.length > 0) {
        result.push(result1[0]);
      } else result = result1;
    }
    res.send(result);
  } catch (err) {
    next(err);
  }
});

router
  .route("/davkharaarToololtAvya")
  .post(tokenShalgakh, async (req, res, next) => {
    try {
      var match = {
        barilgiinId: req.body.barilgiinId,
      };
      if (req.body.davkhar) match["davkhar"] = req.body.davkhar;
      let query = [
        {
          $match: match,
        },
        {
          $group: {
            _id: "$idevkhiteiEsekh",
            khemjee: {
              $sum: "$talbainKhemjee",
            },
            too: {
              $sum: 1,
            },
          },
        },
      ];
      var khariu = await Talbai(req.body.tukhainBaaziinKholbolt).aggregate(
        query
      );
      res.send(khariu);
    } catch (err) {
      next(err);
    }
  });

router.route("/talbaiUstgaya").post(tokenShalgakh, async (req, res, next) => {
  try {
    Talbai(req.body.tukhainBaaziinKholbolt)
      .findOne({
        _id: req.body.id,
      })
      .then(async (result) => {
        var geree = await Geree(req.body.tukhainBaaziinKholbolt).findOne({
          tuluv: { $ne: -1 },
          talbainIdnuud: result._id,
          barilgiinId: result.barilgiinId,
          baiguullagiinId: result.baiguullagiinId,
        });
        if (geree)
          throw new Error(
            "Тухайн талбай дээр идэвхитэй гэрээ байгаа тул устгах боломжгүй!"
          );
        var barimt = new UstsanBarimt(req.body.tukhainBaaziinKholbolt)();
        barimt.class = "Talbai";
        barimt.object = result;
        barimt.tailbar = req.body.tailbar;
        if (req.body.nevtersenAjiltniiToken) {
          barimt.ajiltniiNer = req.body.nevtersenAjiltniiToken.ner;
          barimt.ajiltniiId = req.body.nevtersenAjiltniiToken.id;
        }
        barimt.baiguullagiinId = req.body.baiguullagiinId;
        barimt.isNew = true;
        barimt.save();
        Talbai(req.body.tukhainBaaziinKholbolt)
          .deleteOne({
            _id: req.body.id,
          })
          .then((result1) => {
            res.send("Amjilttai");
          })
          .catch((err) => {
            next(err);
          });
      })
      .catch((err1) => {
        next(err1);
      });
  } catch (err2) {
    next(err2);
  }
});

function tooZasyaSync(too) {
  var zassanToo = Math.round((too + Number.EPSILON) * 100) / 100;
  return +zassanToo.toFixed(2);
}

router.route("/talbaiZasya").post(tokenShalgakh, async (req, res, next) => {
  try
  {
    var talbai = new Talbai(req.body.tukhainBaaziinKholbolt)(req.body);
    var khuuchinTalbai = await Talbai(req.body.tukhainBaaziinKholbolt).findById(
      req.body._id
    );
    console.log("khuuchinTalbai", khuuchinTalbai);
    if (
      talbai.talbainNiitUne != khuuchinTalbai.talbainNiitUne ||
      talbai.kod != khuuchinTalbai.kod
    ) {
      var gereenuud = await Geree(req.body.tukhainBaaziinKholbolt)
        .find({
          talbainDugaar: khuuchinTalbai.kod,
          barilgiinId: khuuchinTalbai.barilgiinId,
          baiguullagiinId: khuuchinTalbai.baiguullagiinId,
          tuluv: 1,
        })
        .select("+avlaga +gereeniiTuukhuud +khungulultuud");
      if (gereenuud)
        for await (const geree of gereenuud) {
          talbai.idevkhiteiEsekh = true;
          var tuukh = {
            talbainDugaar: khuuchinTalbai.kod,
            talbainNegjUne: khuuchinTalbai.talbainNegjUne,
            talbainNiitUne: khuuchinTalbai.talbainNiitUne,
            talbainKhemjee: khuuchinTalbai.talbainKhemjee,
            davkhar: khuuchinTalbai.davkhar,
            khiisenOgnoo: new Date(),
            turul: "TalbaiUurchlukh",
            ajiltniiNer: req.body.nevtersenAjiltniiToken?.ner,
            ajiltniiId: req.body.nevtersenAjiltniiToken?.id,
          };
          if (geree.gereeniiTuukhuud && geree.gereeniiTuukhuud.length > 0)
            geree.gereeniiTuukhuud.push(tuukh);
          else geree.gereeniiTuukhuud = [tuukh];
          var khuvaariud = geree.avlaga.guilgeenuud;
          khuvaariud = khuvaariud.filter(
            (x) =>
              x.ognoo < moment().startOf("month") || x.turul == "khyamdral" || !!x.guilgeeKhiisenAjiltniiId || !!x.guilgeeKhiisenOgnoo
          );
          var today = new Date();
          var unuudur = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            0,
            0,
            0
          );
          new Array((geree.khugatsaa || 0) + 12).fill("").map((mur, index) => {
            geree.tulukhUdur.forEach((udur) => {
              if (
                moment(unuudur).add(index, "month").set("date", udur) <=
                  moment(geree.duusakhOgnoo) &&
                moment(unuudur).add(index, "month").set("date", udur) >=
                  moment().startOf("month")
              ) {
                var tukhainUdur = moment(unuudur)
                  .add(index, "month")
                  .set("date", udur);
                //undsen tulultiin xuwaari)
                var baigaa = khuvaariud.find((a) => {
                  return (
                    a.turul == "khuvaari" &&
                    a.tulukhDun == talbai.talbainNiitUne &&
                    moment(a.ognoo).isSame(tukhainUdur, "day")
                  );
                });
                if (!baigaa && talbai.talbainNiitUne > 0)
                  khuvaariud.push({
                    ognoo: tukhainUdur,
                    khyamdral: 0,
                    turul: "khuvaari",
                    undsenDun: talbai.talbainNiitUne,
                    tulukhDun: talbai.talbainNiitUne,
                  });
                if (!!geree.zardluud && geree.zardluud.length > 0) {
                  geree.zardluud.forEach((zardal) => {
                    if (
                      zardal.turul == "1м3/талбай" &&
                      talbai.talbainKhemjeeMetrKube > 0
                    ) {
                      baigaa = khuvaariud.find((a) => {
                        return (
                          a.turul == "avlaga" &&
                          a.tulukhDun ==
                            tooZasyaSync(
                              zardal.tariff * talbai.talbainKhemjeeMetrKube
                            ) &&
                          moment(a.ognoo).isSame(tukhainUdur, "day") &&
                          a.tailbar == zardal.ner
                        );
                      });
                      if (!baigaa)
                        khuvaariud.push({
                          ognoo: tukhainUdur,
                          khyamdral: 0,
                          turul: "avlaga",
                          tailbar: zardal.ner,
                          tulukhDun: tooZasyaSync(
                            zardal.tariff * talbai.talbainKhemjeeMetrKube
                          ),
                        });
                    } else if (
                      zardal.turul == "1м2" &&
                      talbai.talbainKhemjee > 0
                    ) {
                      baigaa = khuvaariud.find((a) => {
                        return (
                          a.turul == "avlaga" &&
                          a.tulukhDun ==
                            tooZasyaSync(zardal.tariff * talbai.talbainKhemjee) &&
                          moment(a.ognoo).isSame(tukhainUdur, "day") &&
                          a.tailbar == zardal.ner
                        );
                      });
                      if (!baigaa)
                        khuvaariud.push({
                          ognoo: tukhainUdur,
                          khyamdral: 0,
                          turul: "avlaga",
                          tailbar: zardal.ner,
                          tulukhDun: tooZasyaSync(
                            zardal.tariff * talbai.talbainKhemjee
                          ),
                        });
                    } else if (zardal.turul == "Тогтмол") {
                      baigaa = khuvaariud.find((a) => {
                        return (
                          a.turul == "avlaga" &&
                          a.tulukhDun == zardal.tariff &&
                          moment(a.ognoo).isSame(tukhainUdur, "day") &&
                          a.tailbar == zardal.ner
                        );
                      });
                      if (!baigaa)
                        khuvaariud.push({
                          ognoo: tukhainUdur,
                          khyamdral: 0,
                          turul: "avlaga",
                          tailbar: zardal.ner,
                          tulukhDun: zardal.tariff,
                        });
                    }
                  });
                }
                if(geree?.khungulultuud?.length > 0)
                {
                  geree?.khungulultuud.forEach((data) => {
                    data.tulukhDun = talbai.talbainNiitUne;
                    data.khungulultiinDun = Math.round((((talbai.talbainNiitUne * data.khungulukhKhuvi) / 100) + Number.EPSILON) * 10000)/ 10000;
                    if (moment(tukhainUdur) >= moment(moment(data.ognoonuud[0]).format("YYYY-MM-DD 00:00:00")) && moment(tukhainUdur) <= moment(moment(data.ognoonuud[1]).format("YYYY-MM-DD 23:59:59"))) {
                      khuvaariud.push({
                        tulukhDun: 0,
                        ognoo: tukhainUdur,
                        turul: "khungulult",
                        khyamdral: data.khungulultiinDun,
                        nemeltTailbar: "Гэрээ",
                        tailbar: "Хөнгөлөлт",
                      });  
                    }
                  });            
                }
              }
            });
          });
          const { db } = require("zevbackv2");
          var baiguullaga = await Baiguullaga(db.erunkhiiKholbolt).findById(req.body.baiguullagiinId);
          var setMatch = {
            khungulultuud: geree?.khungulultuud,
            "avlaga.guilgeenuud": khuvaariud,
            talbainDugaar: talbai.kod,
            talbainNegjUne: talbai.talbainNegjUne,
            talbainNiitUne: talbai.talbainNiitUne,
            sariinTurees: talbai.talbainNiitUne,
            talbainKhemjee: talbai.talbainKhemjee,
            talbainKhemjeeMetrKube: talbai.talbainKhemjeeMetrKube,
            davkhar: talbai.davkhar,
          }
          if(baiguullaga?.tokhirgoo?.baritsaaUneAdiltgakhEsekh)
            setMatch["baritsaaAvakhDun"] = talbai.talbainNiitUne;
          await Geree(req.body.tukhainBaaziinKholbolt).findOneAndUpdate(
            { _id: geree._id },
            {
              $set: setMatch,
            }
          );
        }
      else {
        talbai.idevkhiteiEsekh = false;
      }
    }
    talbai.isNew = false;
    ZassanBarimtShalgakh.zassanBarimtShalgakh(khuuchinTalbai, talbai, talbai.kod, "Talbai", "Талбай", req.body);
    talbai.save();
    res.send("Amjilttai");
  } catch (err) {
    next(err);
  }
});

router
  .route("/tulultiinOgnooOlnoorUurchluy")
  .post(tokenShalgakh, async (req, res, next) => {
    try {
      if (!req.body.barilgiinId)
        throw new aldaa("barilgiinId buglugduugui baina!");
      var gereenuud = await Geree(req.body.tukhainBaaziinKholbolt)
        .find({
          barilgiinId: req.body.barilgiinId,
        })
        .select("+avlaga");
      if (gereenuud)
        for (const geree of gereenuud) {
          var khuvaariud = geree.avlaga.guilgeenuud;
          khuvaariud = khuvaariud.filter((x) => x.ognoo <= new Date());
          var today = new Date();
          var unuudur = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            0,
            0,
            0
          );
          new Array(geree.khugatsaa || 0).fill("").map((mur, index) => {
            geree.tulukhUdur.forEach((udur) => {
              if (
                moment(unuudur).add(index, "month").set("date", udur) <=
                  moment(geree.duusakhOgnoo) &&
                moment(unuudur).add(index, "month").set("date", udur) >
                  moment(new Date())
              )
                khuvaariud.push({
                  ognoo: moment(unuudur).add(index, "month").set("date", udur),
                  khyamdral: 0,
                  undsenDun: geree.talbainNiitUne,
                  tulukhDun: geree.talbainNiitUne,
                });
            });
          });
          await Geree(req.body.tukhainBaaziinKholbolt).findOneAndUpdate(
            { _id: geree._id },
            {
              $set: {
                "avlaga.guilgeenuud": khuvaariud,
              },
            }
          );
        }
      if (gereenuud && gereenuud.length > 0)
        res.send("Amjilttai" + gereenuud.length);
      else res.send("Amjilttai");
    } catch (err) {
      next(err);
    }
  });

router.route("/nasjiltinTailan").post(tokenShalgakh, async (req, res, next) => {
  try 
  {  
    var match = {
      baiguullagiinId: req.body.baiguullagiinId,
      barilgiinId: req.body.barilgiinId,
      tuluv: { $ne: -1 },
    }
    if(req.body.registeruud)
      match["register"] = { $in: req.body.registeruud }
    var query = [
      {
        $match: match,
      },
      {
        $unwind: {
          path: "$avlaga.guilgeenuud",
        },
      },
      {
        $match: {
          "avlaga.guilgeenuud.turul": { 
            $nin: ["baritsaa", "aldangi", "zalruulga"]
          },
        }
      },
      {
        $group: {
          _id: {
            gereeniiDugaar: "$gereeniiDugaar",
            talbainDugaar: "$talbainDugaar",
            ner: "$ner",
            register: "$register",
          },
          tulsunDun: {
            $sum: {
              $cond: [
                {
                  $and: [
                    {
                      $lte: ["$avlaga.guilgeenuud.ognoo", new Date(req.body.duusakhOgnoo)],
                    },
                  ],
                },
                "$avlaga.guilgeenuud.tulsunDun",
                0
              ]
            }
          },
          avalaga0: {
            $sum: {
              $cond: [
                {
                  $and: [
                    {
                      $gte: ["$avlaga.guilgeenuud.ognoo", new Date(moment(req.body.duusakhOgnoo).subtract(30, "days").startOf("day"))],
                    },
                    {
                      $lte: ["$avlaga.guilgeenuud.ognoo", new Date(moment(req.body.duusakhOgnoo).endOf("day"))],
                    },
                  ],
                },
                "$avlaga.guilgeenuud.tulukhDun",
                0
              ]
            }
          },
          avlaga31: {
            $sum: {
              $cond: [
                {
                  $and: [
                    {
                      $gte: ["$avlaga.guilgeenuud.ognoo", new Date(moment(req.body.duusakhOgnoo).subtract(60, "days").startOf("day"))],
                    },
                    {
                      $lte: ["$avlaga.guilgeenuud.ognoo", new Date(moment(req.body.duusakhOgnoo).subtract(31, "days").endOf("day"))],
                    },
                  ],
                },
                "$avlaga.guilgeenuud.tulukhDun",
                0
              ]
            }
          },
          avlaga61: {
            $sum: {
              $cond: [
                {
                  $and: [
                    {
                      $gte: ["$avlaga.guilgeenuud.ognoo", new Date(moment(req.body.duusakhOgnoo).subtract(90, "days").startOf("day"))],
                    },
                    {
                      $lte: ["$avlaga.guilgeenuud.ognoo", new Date(moment(req.body.duusakhOgnoo).subtract(61, "days").endOf("day"))],
                    },
                  ],
                },
                "$avlaga.guilgeenuud.tulukhDun",
                0
              ]
            }
          },
          avlaga91: {
            $sum: {
              $cond: [
                {
                  $and: [
                    {
                      $gte: ["$avlaga.guilgeenuud.ognoo", new Date(moment(req.body.duusakhOgnoo).subtract(120, "days").startOf("day"))],
                    },
                    {
                      $lte: ["$avlaga.guilgeenuud.ognoo", new Date(moment(req.body.duusakhOgnoo).subtract(91, "days").endOf("day"))],
                    },
                  ],
                },
                "$avlaga.guilgeenuud.tulukhDun",
                0
              ]
            }
          },
          avlaga120: {
            $sum: {
              $cond: [
                {
                  $and: [
                    {
                      $lte: ["$avlaga.guilgeenuud.ognoo", new Date(moment(req.body.duusakhOgnoo).subtract(121, "days").endOf("day"))],
                    },
                  ],
                },
                "$avlaga.guilgeenuud.tulukhDun",
                0
              ]
            }
          },
          uldegdel: {
            $sum: {
              $cond: [
                {
                  $and: [
                    {
                      $lte: ["$avlaga.guilgeenuud.ognoo", new Date(req.body.duusakhOgnoo)],
                    },
                  ],
                },
                "$avlaga.guilgeenuud.tulukhDun",
                0
              ]
            }
          },
        }
      },
      {
        $project: {
          gereeniiDugaar: "$_id.gereeniiDugaar",
          talbainDugaar: "$_id.talbainDugaar",
          ner: "$_id.ner",
          register: "$_id.register",
          avalaga0: "$avalaga0",
          avlaga31: "$avlaga31",
          avlaga61: "$avlaga61",
          avlaga91: "$avlaga91",
          avlaga120: "$avlaga120",
          tulsunDun: "$tulsunDun",
          niitDun: "$uldegdel",
          tulukhDun: {
            $subtract: [{ $ifNull: ["$uldegdel", 0] }, { $ifNull: ["$tulsunDun", 0] }],
          },
        },
      },
    ]
    var khariu = await Geree(req.body.tukhainBaaziinKholbolt).aggregate(query);
    res.send(khariu);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
