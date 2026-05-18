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
const AldangiinTuukh = require("../models/aldangiinTuukh");

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
    try {
      var talbai = await Talbai(req.body.tukhainBaaziinKholbolt).findOne({
        kod: req.query.talbainDugaar,
        barilgiinId: req.query.barilgiinId,
      });
      var geree = await Geree(req.body.tukhainBaaziinKholbolt, true).findOne({
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
    var barilgiinId = req.query.barilgiinId;
    var match = {
      baiguullagiinId: req.body.baiguullagiinId,
    };
    if (!!barilgiinId) match["barilgiinId"] = barilgiinId;
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
    };
    if (!!barilgiinId) match["barilgiinId"] = barilgiinId;
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
        var geree = await Geree(req.body.tukhainBaaziinKholbolt, true).findOne({
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
  try {
    var talbaiShalgakh = await Talbai(req.body.tukhainBaaziinKholbolt).find({
      kod: req.body.kod,
      baiguullagiinId: req.body.baiguullagiinId,
      barilgiinId: req.body.barilgiinId,
      _id: { $ne: req.body._id },
    });
    if (talbaiShalgakh?.length > 0)
      throw new Error("Талбайн дугаар давхардаж байна!");
    const updateData = { ...req.body };
    delete updateData.tukhainBaaziinKholbolt;
    delete updateData.erunkhiiKholbolt;
    delete updateData.nevtersenAjiltniiToken;
    var talbai = new Talbai(req.body.tukhainBaaziinKholbolt)(updateData);
    var khuuchinTalbai = await Talbai(req.body.tukhainBaaziinKholbolt).findById(
      req.body._id
    );
    if (
      talbai.talbainNiitUne != khuuchinTalbai.talbainNiitUne ||
      talbai.kod != khuuchinTalbai.kod
    ) {
      var gereenuud = await Geree(req.body.tukhainBaaziinKholbolt, true)
        .find({
          talbainDugaar: khuuchinTalbai.kod,
          barilgiinId: khuuchinTalbai.barilgiinId,
          baiguullagiinId: khuuchinTalbai.baiguullagiinId,
          tuluv: 1,
        })
        .select("+avlaga +gereeniiTuukhuud +khungulultuud");
      if (gereenuud)
        for (const geree of gereenuud) {
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
              x.ognoo < moment().startOf("month") ||
              x.turul == "khyamdral" ||
              !!x.guilgeeKhiisenAjiltniiId ||
              !!x.guilgeeKhiisenOgnoo
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
                            tooZasyaSync(
                              zardal.tariff * talbai.talbainKhemjee
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
                if (geree?.khungulultuud?.length > 0) {
                  geree?.khungulultuud.forEach((data) => {
                    data.tulukhDun = talbai.talbainNiitUne;
                    data.khungulultiinDun =
                      Math.round(
                        ((talbai.talbainNiitUne * data.khungulukhKhuvi) / 100 +
                          Number.EPSILON) *
                          10000
                      ) / 10000;
                    if (
                      moment(tukhainUdur) >=
                        moment(
                          moment(data.ognoonuud[0]).format(
                            "YYYY-MM-DD 00:00:00"
                          )
                        ) &&
                      moment(tukhainUdur) <=
                        moment(
                          moment(data.ognoonuud[1]).format(
                            "YYYY-MM-DD 23:59:59"
                          )
                        )
                    ) {
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
          var baiguullaga = await Baiguullaga(db.erunkhiiKholbolt).findById(
            req.body.baiguullagiinId
          );
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
          };
          if (baiguullaga?.tokhirgoo?.baritsaaUneAdiltgakhEsekh)
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
    ZassanBarimtShalgakh.zassanBarimtShalgakh(
      khuuchinTalbai,
      talbai,
      talbai.kod,
      "Talbai",
      "Талбай",
      req.body
    );
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
      var gereenuud = await Geree(req.body.tukhainBaaziinKholbolt, true)
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
  try {
    var match = {
      baiguullagiinId: req.body.baiguullagiinId,
      barilgiinId: req.body.barilgiinId,
      tuluv: { $ne: -1 },
    };
    if (req.body.query) match["$or"] = req.body.query["$or"];
    if (req.body.$and) match["$and"] = req.body.$and;
    
    if (req.body.songogdsonTurul) {
      const talbaiMatch = await Talbai(req.body.tukhainBaaziinKholbolt).find({
        baiguullagiinId: req.body.baiguullagiinId,
        barilgiinId: req.body.barilgiinId,
        $or: [
          { turul: req.body.songogdsonTurul },
          { segment: req.body.songogdsonTurul },
          { yalgal: req.body.songogdsonTurul },
          { "segmentuud.ner": req.body.songogdsonTurul },
          { "segmentuud.utga": req.body.songogdsonTurul }
        ]
      }, { kod: 1, _id: 1 });
      const talbaiKods = talbaiMatch.map((t) => t.kod);
      const talbaiIds = talbaiMatch.map((t) => t._id.toString());

      match["$and"] = match["$and"] || [];
      match["$and"].push({
        $or: [
          { turul: req.body.songogdsonTurul },
          { segment: req.body.songogdsonTurul },
          { yalgal: req.body.songogdsonTurul },
          { "segmentuud.ner": req.body.songogdsonTurul },
          { "segmentuud.utga": req.body.songogdsonTurul },
          { talbainDugaar: { $in: talbaiKods } },
          { talbainIdnuud: { $in: talbaiIds } }
        ]
      });
    }
    if (req.body.registeruud) match["register"] = { $in: req.body.registeruud };
    var duusakhOgnoo = moment(req.body.duusakhOgnoo)
      .endOf("month")
      .format("YYYY-MM-DD 23:59:59");
    var duusakhOgnoo30 = moment(req.body.duusakhOgnoo)
      .subtract(1, "month")
      .endOf("month")
      .format("YYYY-MM-DD 23:59:59");
    var duusakhOgnoo60 = moment(req.body.duusakhOgnoo)
      .subtract(2, "month")
      .endOf("month")
      .format("YYYY-MM-DD 23:59:59");
    var duusakhOgnoo90 = moment(req.body.duusakhOgnoo)
      .subtract(3, "month")
      .endOf("month")
      .format("YYYY-MM-DD 23:59:59");
    var duusakhOgnoo120 = moment(req.body.duusakhOgnoo)
      .subtract(4, "month")
      .endOf("month")
      .format("YYYY-MM-DD 23:59:59");

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
          $or: [
            {
              "avlaga.guilgeenuud.turul": {
                $nin: ["baritsaa", "aldangi"],
              },
            },
            {
              $and: [
                {
                  "avlaga.guilgeenuud.turul": {
                    $in: ["baritsaa"],
                  },
                },
                {
                  "avlaga.guilgeenuud.tulsunDun": {
                    $gt: 0,
                  },
                },
              ],
            },
          ],
        },
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
                      $lte: [
                        "$avlaga.guilgeenuud.ognoo",
                        new Date(duusakhOgnoo),
                      ],
                    },
                  ],
                },
                {
                  $ifNull: ["$avlaga.guilgeenuud.tulsunDun", 0],
                },
                0,
              ],
            },
          },
          avalaga0: {
            $sum: {
              $cond: [
                {
                  $and: [
                    {
                      $gt: [
                        "$avlaga.guilgeenuud.ognoo",
                        new Date(duusakhOgnoo30),
                      ],
                    },
                    {
                      $lte: [
                        "$avlaga.guilgeenuud.ognoo",
                        new Date(duusakhOgnoo),
                      ],
                    },
                  ],
                },
                {
                  $subtract: [
                    {
                      $ifNull: ["$avlaga.guilgeenuud.tulukhDun", 0],
                    },
                    {
                      $add: [
                        {
                          $ifNull: ["$avlaga.guilgeenuud.tulsunDun", 0],
                        },
                        {
                          $ifNull: ["$avlaga.guilgeenuud.khyamdral", 0],
                        },
                      ],
                    },
                  ],
                },
                0,
              ],
            },
          },
          avlaga31: {
            $sum: {
              $cond: [
                {
                  $and: [
                    {
                      $gt: [
                        "$avlaga.guilgeenuud.ognoo",
                        new Date(duusakhOgnoo60),
                      ],
                    },
                    {
                      $lte: [
                        "$avlaga.guilgeenuud.ognoo",
                        new Date(duusakhOgnoo30),
                      ],
                    },
                  ],
                },
                {
                  $subtract: [
                    {
                      $ifNull: ["$avlaga.guilgeenuud.tulukhDun", 0],
                    },
                    {
                      $add: [
                        {
                          $ifNull: ["$avlaga.guilgeenuud.tulsunDun", 0],
                        },
                        {
                          $ifNull: ["$avlaga.guilgeenuud.khyamdral", 0],
                        },
                      ],
                    },
                  ],
                },
                0,
              ],
            },
          },
          avlaga61: {
            $sum: {
              $cond: [
                {
                  $and: [
                    {
                      $gt: [
                        "$avlaga.guilgeenuud.ognoo",
                        new Date(duusakhOgnoo90),
                      ],
                    },
                    {
                      $lte: [
                        "$avlaga.guilgeenuud.ognoo",
                        new Date(duusakhOgnoo60),
                      ],
                    },
                  ],
                },
                {
                  $subtract: [
                    {
                      $ifNull: ["$avlaga.guilgeenuud.tulukhDun", 0],
                    },
                    {
                      $add: [
                        {
                          $ifNull: ["$avlaga.guilgeenuud.tulsunDun", 0],
                        },
                        {
                          $ifNull: ["$avlaga.guilgeenuud.khyamdral", 0],
                        },
                      ],
                    },
                  ],
                },
                0,
              ],
            },
          },
          avlaga91: {
            $sum: {
              $cond: [
                {
                  $and: [
                    {
                      $gt: [
                        "$avlaga.guilgeenuud.ognoo",
                        new Date(duusakhOgnoo120),
                      ],
                    },
                    {
                      $lte: [
                        "$avlaga.guilgeenuud.ognoo",
                        new Date(duusakhOgnoo90),
                      ],
                    },
                  ],
                },
                {
                  $subtract: [
                    {
                      $ifNull: ["$avlaga.guilgeenuud.tulukhDun", 0],
                    },
                    {
                      $add: [
                        {
                          $ifNull: ["$avlaga.guilgeenuud.tulsunDun", 0],
                        },
                        {
                          $ifNull: ["$avlaga.guilgeenuud.khyamdral", 0],
                        },
                      ],
                    },
                  ],
                },
                0,
              ],
            },
          },
          avlaga120: {
            $sum: {
              $cond: [
                {
                  $and: [
                    {
                      $lte: [
                        "$avlaga.guilgeenuud.ognoo",
                        new Date(duusakhOgnoo120),
                      ],
                    },
                  ],
                },
                {
                  $subtract: [
                    {
                      $ifNull: ["$avlaga.guilgeenuud.tulukhDun", 0],
                    },
                    {
                      $add: [
                        {
                          $ifNull: ["$avlaga.guilgeenuud.tulsunDun", 0],
                        },
                        {
                          $ifNull: ["$avlaga.guilgeenuud.khyamdral", 0],
                        },
                      ],
                    },
                  ],
                },
                0,
              ],
            },
          },
          avlaga: {
            $sum: {
              $cond: [
                {
                  $and: [
                    {
                      $lte: [
                        "$avlaga.guilgeenuud.ognoo",
                        new Date(req.body.duusakhOgnoo),
                      ],
                    },
                  ],
                },
                "$avlaga.guilgeenuud.tulukhDun",
                0,
              ],
            },
          },
          khungulult: {
            $sum: {
              $cond: [
                {
                  $and: [
                    {
                      $lte: [
                        "$avlaga.guilgeenuud.ognoo",
                        new Date(req.body.duusakhOgnoo),
                      ],
                    },
                  ],
                },
                "$avlaga.guilgeenuud.khyamdral",
                0,
              ],
            },
          },
        },
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
          niitDun: "$avlaga",
          khungulult: "$khungulult",
          tulukhDun: {
            $subtract: [
              {
                $ifNull: ["$avlaga", 0],
              },
              {
                $add: [
                  {
                    $ifNull: ["$tulsunDun", 0],
                  },
                  {
                    $ifNull: ["$khungulult", 0],
                  },
                ],
              },
            ],
          },
        },
      },
    ];
    var khariu = await Geree(req.body.tukhainBaaziinKholbolt, true).aggregate(query);
    res.send(khariu);
  } catch (err) {
    next(err);
  }
});

router.route("/sankhuuShinjilgee").post(tokenShalgakh, async (req, res, next) => {
  try {
    var match = {
      baiguullagiinId: req.body.baiguullagiinId,
      barilgiinId: req.body.barilgiinId,
    };
    if (req.body.query) match["$or"] = req.body.query["$or"];
    if (req.body.registeruud) match["register"] = { $in: req.body.registeruud };

    // Эхлэх огноо: 2025-01 сараас
    var ehlehOgnoo = moment("2025-01-01").startOf("month").toDate();
    // Дуусах огноо: request-оор ирсэн эсвэл өнөөдрийн сүүлийн өдөр, ГЭХДЭЭ 2026-01 сараас хэтрэхгүй
    var requestDuusakh = moment(req.body.duusakhOgnoo || new Date()).endOf(
      "month"
    );
    var maxDuusakh = moment("2026-01-01").endOf("month");
    var duusakhOgnoo = moment.min(requestDuusakh, maxDuusakh).toDate();

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
          "avlaga.guilgeenuud.ognoo": { $gte: ehlehOgnoo, $lte: duusakhOgnoo },
          $or: [
            {
              "avlaga.guilgeenuud.turul": {
                $nin: ["baritsaa", "aldangi"],
              },
            },
            {
              $and: [
                {
                  "avlaga.guilgeenuud.turul": {
                    $in: ["baritsaa"],
                  },
                },
                {
                  "avlaga.guilgeenuud.tulsunDun": {
                    $gt: 0,
                  },
                },
              ],
            },
          ],
        },
      },
      // Сарыг салгаж авах
      {
        $addFields: {
          "avlaga.guilgeenuud.yearMonth": {
            $dateToString: {
              format: "%Y-%m",
              date: "$avlaga.guilgeenuud.ognoo",
            },
          },
        },
      },
      // Гэрээ + сар бүрээр бүлэглэх
      {
        $group: {
          _id: {
            gereeniiDugaar: "$gereeniiDugaar",
            talbainDugaar: "$talbainDugaar",
            ner: "$ner",
            register: "$register",
            gereeniiOgnoo: "$gereeniiOgnoo",
            duusakhOgnoo: "$duusakhOgnoo",
            khugatsaa: "$khugatsaa",
            turul: "$turul",
            davkhar: "$davkhar",
            tuluv: "$tuluv",
            sariinTurees: "$sariinTurees",
            talbainNegjUne: "$talbainNegjUne",
            talbainNiitUne: "$talbainNiitUne",
            talbainKhemjee: "$talbainKhemjee",
            talbainKhemjeeMetrKube: "$talbainKhemjeeMetrKube",
            baritsaaAvakhDun: "$baritsaaAvakhDun",
            baritsaaniiAvsan: "$baritsaaniiUldegdel",
            baritsaaAvakhKhugatsaa: "$baritsaaAvakhKhugatsaa",
            aldangiinUldegdel: "$aldangiinUldegdel",
            niitTulsunAldangi: "$niitTulsunAldangi",
            zoriulalt: "$zoriulalt",
            tusgaiZoriulalt: "$tusgaiZoriulalt",
            khariltsagchiinNershil: "$khariltsagchiinNershil",
            sar: "$avlaga.guilgeenuud.yearMonth",
          },
          sariinTulukhDun: {
            $sum: {
              $ifNull: ["$avlaga.guilgeenuud.tulukhDun", 0],
            },
          },
          sariinTulsunDun: {
            $sum: {
              $ifNull: ["$avlaga.guilgeenuud.tulsunDun", 0],
            },
          },
          sariinKhungulult: {
            $sum: {
              $ifNull: ["$avlaga.guilgeenuud.khyamdral", 0],
            },
          },
        },
      },
      {
        $project: {
          gereeniiDugaar: "$_id.gereeniiDugaar",
          talbainDugaar: "$_id.talbainDugaar",
          ner: "$_id.ner",
          register: "$_id.register",  
          gereeniiOgnoo: "$_id.gereeniiOgnoo",
          duusakhOgnoo: "$_id.duusakhOgnoo",
          khugatsaa: "$_id.khugatsaa",
          turul: "$_id.turul",
          davkhar: "$_id.davkhar",
          tuluv: "$_id.tuluv",
          tuluvText: {
            $cond: [
              { $eq: ["$_id.tuluv", -1] },
              "цуцалсан",
              "идэвхтэй",
            ],
          },
          sariinTurees: "$_id.sariinTurees",
          talbainNegjUne: "$_id.talbainNegjUne",
          talbainNiitUne: "$_id.talbainNiitUne",
          talbainKhemjee: "$_id.talbainKhemjee",
          talbainKhemjeeMetrKube: "$_id.talbainKhemjeeMetrKube",
          baritsaaAvakhDun: "$_id.baritsaaAvakhDun",
          baritsaaniiAvsan: "$_id.baritsaaniiAvsan",
          baritsaaAvakhKhugatsaa: "$_id.baritsaaAvakhKhugatsaa",
          baritsaaniiUldegdel: {
            $subtract: [
              { $ifNull: ["$_id.baritsaaAvakhDun", 0] },
              { $ifNull: ["$_id.baritsaaniiAvsan", 0] },
            ],
          },
          aldangiinUldegdel: "$_id.aldangiinUldegdel",
          niitTulsunAldangi: "$_id.niitTulsunAldangi", 
          zoriulalt: "$_id.zoriulalt",
          tusgaiZoriulalt: "$_id.tusgaiZoriulalt",
          khariltsagchiinNershil: "$_id.khariltsagchiinNershil",
          sar: "$_id.sar", // жишээ: "2025-01"
          sariinTulukhDun: 1,
          sariinTulsunDun: 1,
          sariinKhungulult: 1,
          // Сарын үлдэгдэл = төлөх - (төлсөн + хөнгөлөлт)
          sariinUldegdel: {
            $subtract: [
              { $ifNull: ["$sariinTulukhDun", 0] },
              {
                $add: [
                  { $ifNull: ["$sariinTulsunDun", 0] },
                  { $ifNull: ["$sariinKhungulult", 0] },
                ],
              },
            ],
          },
        },
      },
      {
        $sort: {
          "register": 1,
          "gereeniiDugaar": 1,
          sar: 1,
        },
      },
    ];
    var khariu = await Geree(req.body.tukhainBaaziinKholbolt, true).aggregate(
      query
    );
    res.send(khariu);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

 
router.route("/avlagaTovchoo").post(tokenShalgakh, async (req, res, next) => {
  try {
    const ekhlekhOgnoo = req.body.ekhlekhOgnoo
      ? new Date(req.body.ekhlekhOgnoo)
      : new Date(moment().startOf("month").format("YYYY-MM-DD 00:00:00"));
    const duusakhOgnoo = req.body.duusakhOgnoo
      ? new Date(req.body.duusakhOgnoo)
      : new Date(moment().endOf("month").format("YYYY-MM-DD 23:59:59"));

    var match = {
      baiguullagiinId: req.body.baiguullagiinId,
      barilgiinId: req.body.barilgiinId,
    };
    if (req.body.khariltsagchiinId && req.body.khariltsagchiinId.length > 0)
      match["register"] = { $in: req.body.khariltsagchiinId };
    if (req.body.gereeniiDugaaruud && req.body.gereeniiDugaaruud.length > 0)
      match["gereeniiDugaar"] = { $in: req.body.gereeniiDugaaruud };
    if (req.body.$or) match["$or"] = req.body.$or;

    const guilgeeFilter = {
      $or: [
        { "avlaga.guilgeenuud.turul": { $nin: ["baritsaa", "aldangi"] } },
        {
          $and: [
            { "avlaga.guilgeenuud.turul": { $in: ["baritsaa"] } },
            { "avlaga.guilgeenuud.tulsunDun": { $gt: 0 } },
          ],
        },
      ],
    };

   
    const ekhniiQuery = [
      { $match: match },
      { $unwind: { path: "$avlaga.guilgeenuud" } },
      {
        $match: {
          "avlaga.guilgeenuud.ognoo": { $lt: ekhlekhOgnoo },
          $or: [
            { "avlaga.guilgeenuud.turul": { $nin: ["baritsaa", "aldangi"] } },
            {
              $and: [
                { "avlaga.guilgeenuud.turul": { $in: ["baritsaa"] } },
                { "avlaga.guilgeenuud.tulsunDun": { $gt: 0 } },
              ],
            },
          ],
        }
      },
      {
        $group: {
          _id: "$gereeniiDugaar",
          ner: { $first: "$ner" },
          register: { $first: "$register" },
          talbainDugaar: { $first: "$talbainDugaar" },
          barilgiiinNer: { $first: "$barilgiiinNer" },
          talbainKhemjee: { $first: "$talbainKhemjee" },
          tuluv: { $first: "$tuluv" },
          tulukh: { $sum: { $ifNull: ["$avlaga.guilgeenuud.tulukhDun", 0] } },
          tulsun: { $sum: { $ifNull: ["$avlaga.guilgeenuud.tulsunDun", 0] } },
          khyamdral: { $sum: { $ifNull: ["$avlaga.guilgeenuud.khyamdral", 0] } },
        },
      },
      {
        $project: {
          ner: 1, register: 1, talbainDugaar: 1, barilgiiinNer: 1, talbainKhemjee: 1, tuluv: 1,
          ekhniiUldegdel: { $subtract: ["$tulukh", { $add: ["$tulsun", "$khyamdral"] }] },
        },
      },
    ];


    const periodQuery = [
      { $match: match },
      {
        $project: {
          gereeniiDugaar: 1,
          ner: 1, register: 1, talbainDugaar: 1, barilgiiinNer: 1, talbainKhemjee: 1, tuluv: 1,
          guilgeenuud: {
            $concatArrays: [
              { $ifNull: ["$avlaga.guilgeenuud", []] },
              {
                $map: {
                  input: { $ifNull: ["$avlaga.baritsaa", []] },
                  as: "b",
                  in: {
                    ognoo: "$$b.ognoo",
                    tulukhDun: 0,
                    tulsunDun: { $add: [{ $ifNull: ["$$b.tulsunDun", 0] }, { $ifNull: ["$$b.orlogo", 0] }] },
                    khyamdral: 0,
                    turul: "baritsaa",
                    tailbar: "Барьцаа"
                  }
                }
              }
            ]
          }
        }
      },
      { $unwind: { path: "$guilgeenuud" } },
      {
        $match: {
          "guilgeenuud.ognoo": { $gte: ekhlekhOgnoo, $lte: duusakhOgnoo },
          $or: [
            { "guilgeenuud.turul": { $nin: ["baritsaa", "aldangi"] } },
            {
              $and: [
                { "guilgeenuud.turul": { $in: ["baritsaa"] } },
                { "guilgeenuud.tulsunDun": { $gt: 0 } },
              ],
            },
          ],
        }
      },
      {
        $group: {
          _id: "$gereeniiDugaar",
          ner: { $first: "$ner" },
          register: { $first: "$register" },
          talbainDugaar: { $first: "$talbainDugaar" },
          barilgiiinNer: { $first: "$barilgiiinNer" },
          talbainKhemjee: { $first: "$talbainKhemjee" },
          tuluv: { $first: "$tuluv" },
          niitDt: { $sum: { $ifNull: ["$guilgeenuud.tulukhDun", 0] } },
          niitTulsun: { $sum: { $ifNull: ["$guilgeenuud.tulsunDun", 0] } },
          niitKhyamdralTurees: {
            $sum: {
              $cond: [
                { $eq: ["$guilgeenuud.turul", "khuvaari"] },
                { $ifNull: ["$guilgeenuud.khyamdral", 0] },
                0,
              ],
            },
          },
          niitKhyamdralAshiglalt: {
            $sum: {
              $cond: [
                { $ne: ["$guilgeenuud.turul", "khuvaari"] },
                { $ifNull: ["$guilgeenuud.khyamdral", 0] },
                0,
              ],
            },
          },
        },
      },
    ];

    const [ekhniiData, periodData] = await Promise.all([
      Geree(req.body.tukhainBaaziinKholbolt, true).aggregate(ekhniiQuery),
      Geree(req.body.tukhainBaaziinKholbolt, true).aggregate(periodQuery),
    ]);


    const periodMap = {};
    periodData.forEach((p) => { periodMap[p._id] = p; });

    const result = ekhniiData.map((e) => {
      const p = periodMap[e._id] || {};
      const ekh = e.ekhniiUldegdel || 0;
      const dt = p.niitDt || 0;
      const tulsun = p.niitTulsun || 0;
      const khyamdralTurees = p.niitKhyamdralTurees || 0;
      const khyamdralAshiglalt = p.niitKhyamdralAshiglalt || 0;
      const kt = tulsun + khyamdralTurees + khyamdralAshiglalt;
      return {
        gereeniiDugaar: e._id,
        ner: e.ner || p.ner,
        register: e.register || p.register,
        talbainDugaar: e.talbainDugaar || p.talbainDugaar,
        barilgiiinNer: e.barilgiiinNer || p.barilgiiinNer,
        talbainKhemjee: e.talbainKhemjee || p.talbainKhemjee,
        ekhniiUldegdel: ekh,
        niitDt: dt,
        niitTulsun: tulsun,
        niitKhyamdralTurees: khyamdralTurees,
        niitKhyamdralAshiglalt: khyamdralAshiglalt,
        niitKt: kt,
        etssiinUldegdel: ekh + dt - kt,
        tuluv: e.tuluv !== undefined ? e.tuluv : p.tuluv,
      };
    });

    // Contracts that ONLY have transactions in the period (no history before period start)
    periodData.forEach((p) => {
      if (!ekhniiData.find((e) => e._id === p._id)) {
        const tulsun = p.niitTulsun || 0;
        const khyamdralTurees = p.niitKhyamdralTurees || 0;
        const khyamdralAshiglalt = p.niitKhyamdralAshiglalt || 0;
        const kt = tulsun + khyamdralTurees + khyamdralAshiglalt;
        result.push({
          gereeniiDugaar: p._id,
          ner: p.ner,
          register: p.register,
          talbainDugaar: p.talbainDugaar,
          barilgiiinNer: p.barilgiiinNer,
          talbainKhemjee: p.talbainKhemjee,
          ekhniiUldegdel: 0,
          niitDt: p.niitDt || 0,
          niitTulsun: tulsun,
          niitKhyamdralTurees: khyamdralTurees,
          niitKhyamdralAshiglalt: khyamdralAshiglalt,
          niitKt: kt,
          etssiinUldegdel: (p.niitDt || 0) - kt,
          tuluv: p.tuluv,
        });
      }
    });

    const canceledMatch = {
      baiguullagiinId: req.body.baiguullagiinId,
      barilgiinId: req.body.barilgiinId,
      tuluv: -1,
    };
    if (req.body.khariltsagchiinId && req.body.khariltsagchiinId.length > 0) {
      canceledMatch["register"] = { $in: req.body.khariltsagchiinId };
    }
    if (req.body.gereeniiDugaaruud && req.body.gereeniiDugaaruud.length > 0) {
      canceledMatch["gereeniiDugaar"] = { $in: req.body.gereeniiDugaaruud };
    }

    const canceledWithBalance = await Geree(req.body.tukhainBaaziinKholbolt, true)
      .find(canceledMatch)
      .select("gereeniiDugaar ner register talbainDugaar barilgiiinNer talbainKhemjee uldegdel")
      .lean();

    const existingGereeniiDugaaruud = new Set(result.map((r) => r.gereeniiDugaar));
    canceledWithBalance.forEach((c) => {
      const uld = Number(c.uldegdel) || 0;
      if (uld > 0 && !existingGereeniiDugaaruud.has(c.gereeniiDugaar)) {
        result.push({
          gereeniiDugaar: c.gereeniiDugaar,
          ner: c.ner,
          register: c.register,
          talbainDugaar: c.talbainDugaar,
          barilgiiinNer: c.barilgiiinNer,
          talbainKhemjee: c.talbainKhemjee,
          ekhniiUldegdel: uld,
          niitDt: 0,
          niitTulsun: 0,
          niitKhyamdralTurees: 0,
          niitKhyamdralAshiglalt: 0,
          niitKt: 0,
          etssiinUldegdel: uld,
          tuluv: -1, 
        });
      }
    });

    const khuudasniiDugaar = req.body.khuudasniiDugaar || 1;
    const khuudasniiKhemjee = req.body.khuudasniiKhemjee || 200;
    const niitMur = result.length;
    const jagsaalt = result.slice(
      (khuudasniiDugaar - 1) * khuudasniiKhemjee,
      khuudasniiDugaar * khuudasniiKhemjee
    );

    res.json({ khuudasniiDugaar, khuudasniiKhemjee, niitMur, jagsaalt });
  } catch (err) {
    next(err);
  }
});

router.route("/avlagaTovchooGereeAvya").post(tokenShalgakh, async (req, res, next) => {
  try {
    const ekhlekhOgnoo = req.body.ekhlekhOgnoo
      ? new Date(req.body.ekhlekhOgnoo)
      : new Date(moment().startOf("month").format("YYYY-MM-DD 00:00:00"));
    const duusakhOgnoo = req.body.duusakhOgnoo
      ? new Date(req.body.duusakhOgnoo)
      : new Date(moment().endOf("month").format("YYYY-MM-DD 23:59:59"));

    const geree = await Geree(req.body.tukhainBaaziinKholbolt, true)
      .findOne({ gereeniiDugaar: req.body.gereeniiDugaar })
      .select("+avlaga baritsaaAvakhDun baritsaaniiUldegdel aldangiinUldegdel niitTulsunAldangi");

    if (!geree) return res.json({ aldangiGuilgeenuud: [], baritsaaGuilgeenuud: [] });


    const aldangiGuilgeenuud = await AldangiinTuukh(req.body.tukhainBaaziinKholbolt)
      .find({
        gereeniiId: geree._id.toString(),
        aldangiBodsonOgnoo: { $gte: ekhlekhOgnoo, $lte: duusakhOgnoo },
      })
      .sort({ aldangiBodsonOgnoo: 1 })
      .lean();

   
    const baritsaaGuilgeenuud = (geree.avlaga?.baritsaa || [])
      .filter(
        (g) =>
          new Date(g.ognoo) >= ekhlekhOgnoo &&
          new Date(g.ognoo) <= duusakhOgnoo
      )
      .sort((a, b) => new Date(a.ognoo) - new Date(b.ognoo));

    res.json({
      aldangiGuilgeenuud,
      baritsaaGuilgeenuud,
      aldangiinUldegdel: geree.aldangiinUldegdel || 0,
      niitTulsunAldangi: geree.niitTulsunAldangi || 0,
      baritsaaAvakhDun: geree.baritsaaAvakhDun || 0,
      baritsaaniiUldegdel: geree.baritsaaniiUldegdel || 0,
    });
  } catch (err) {
    next(err);
  }
});


router.route("/avlagaTovchooDelgerengui").post(tokenShalgakh, async (req, res, next) => {
  try {
    const ekhlekhOgnoo = req.body.ekhlekhOgnoo
      ? new Date(req.body.ekhlekhOgnoo)
      : new Date(moment().startOf("month").format("YYYY-MM-DD 00:00:00"));
    const duusakhOgnoo = req.body.duusakhOgnoo
      ? new Date(req.body.duusakhOgnoo)
      : new Date(moment().endOf("month").format("YYYY-MM-DD 23:59:59"));

    const geree = await Geree(req.body.tukhainBaaziinKholbolt, true)
      .findOne({ gereeniiDugaar: req.body.gereeniiDugaar })
      .select("+avlaga");

    if (!geree) return res.json({ guilgeenuud: [], ekhniiUldegdel: 0 });

    const guilgeenuud = (geree.avlaga?.guilgeenuud || []).filter(
      (g) =>
        g.turul !== "aldangi" &&
        (g.turul !== "baritsaa" || (g.tulsunDun || 0) > 0)
    );

    const guilgeenuudBeforeStart = guilgeenuud.filter(
      (g) => new Date(g.ognoo) < ekhlekhOgnoo
    );
    const ekhniiUldegdel = guilgeenuudBeforeStart.reduce(
      (s, g) => s + (g.tulukhDun || 0) - (g.tulsunDun || 0) - (g.khyamdral || 0),
      0
    );

    const periodGuilgeenuud = guilgeenuud
      .filter(
        (g) =>
          new Date(g.ognoo) >= ekhlekhOgnoo &&
          new Date(g.ognoo) <= duusakhOgnoo
      )
      .sort((a, b) => new Date(a.ognoo) - new Date(b.ognoo));

    const etssiinUldegdel = periodGuilgeenuud.reduce(
      (s, g) => s + (g.tulukhDun || 0) - (g.tulsunDun || 0) - (g.khyamdral || 0),
      ekhniiUldegdel
    );

    res.json({
      ekhniiUldegdel,
      etssiinUldegdel,
      talbainKhemjee: geree.talbainKhemjee,
      guilgeenuud: periodGuilgeenuud,
    });
  } catch (err) {
    next(err);
  }
});

