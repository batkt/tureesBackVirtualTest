const express = require("express");
const router = express.Router();
const Geree = require("../models/geree");
const AldangiinZassanTuukh = require("../models/aldangiinZassanTuukh");
const AldangiinTuukh = require("../models/aldangiinTuukh");
const Talbai = require("../models/talbai");
const Khariltsagch = require("../models/khariltsagch");
//const Dugaarlalt = require("../models/dugaarlalt");
const KhungulultiinTuukh = require("../models/khungulultiinTuukh");
const AshiglaltiinZardluud = require("../models/ashiglaltiinZardluud");
const AshiglaltiinExcel = require("../models/ashiglaltiinExcel");
const moment = require("moment");
const {
  gereeZasakhShalguur,
  gereeSungakhShalguur,
  gereeSergeekhShalguur,
  gereeTsutslakhShalguur,
  guilgeeUstgakhShalguur,
} = require("../components/shalguur");
const multer = require("multer");
const storage = multer.memoryStorage();
const uploadFile = multer({ storage: storage });
//const { crud } = require("../components/crud");
//const khuudaslalt = require("../components/khuudaslalt");
//const { tokenShalgakh } = require("../middlewares/tokenShalgakh");
//const UstsanBarimt = require("../models/ustsanBarimt");
const {
  tokenShalgakh,
  crud,
  khuudaslalt,
  Dugaarlalt,
  UstsanBarimt,
} = require("zevbackv2");

const {
  gereeniiToololtAvya,
  guilgeeniiToololtAvya,
} = require("../controller/toololt");

const {
  tulultOlnoorKhadgalya,
  baritsaaniiGuilgeeKhiie,
  tulultUstgaya,
  baritsaaniiGuilgeeUstgaya,
  tulultTaniya,
  gereeniiGuilgeeKhadgalya,
  khuvaariUusgey,
  uldegdelBodyo,
  tukhainOgnoogoorAvlagaBodojOruulya,
  tukhainOgnoogoorAvlagaZasajOruulya,
  tukhainOgnoogoorZardalBodojOruulya,
  talbainIdnuudOruulya,
  bankniiGuilgeegeerOruulya,
  aldaataiBankniiGuilgeeZasya,
  qpayGuilgeeGereeOnooyo,
  qpayGuilgeeTalbainDugaarOnooyo,
  tukhainOgnoogoorBukhAvlagaBodojOruulya,
  gereenuudedZalruulgaOruulya,
  tsutsalsanGereenuudedZalruulgaOruulya,
  tsutsalgdanGuilgeeZasya,
  khungulultKhadgalya,
  khungulultUstgaya,
  tukhainOgnoogoorGuilgeegOruulya,
  testiinBankniiGuilgee,
  testiinBankniiGuilgeeOruulya,
  tulukhOgnooZasya,
  gereenuudedAvlagaOruulya,
  khungulultNukhujOruulya,
  aldangiBodyo,
  aldangiTegBolgoy,
  talbainKubeOruulya,
  gereenuudZasya,
  fcZasvarKhiie,
  avlagaZasay,
  ashiglakhKhonogTootsoolokh,
  aldangiUstgayaa,
} = require("../controller/tulbur");
router.route("/tulultTaniya").get(tulultTaniya);
const lodash = require("lodash");

const {
  gereeniiExcelAvya,
  gereeniiExcelTatya,
  tooluurZaaltZagvarAvya,
  ekhniiUldegdelZagvarOruulya,
  tooluurZaaltOruulya,
  ekhniiUldegdelOruulya,
} = require("../controller/excel");
const Baiguullaga = require("../models/baiguullaga");
const ZassanBarimt = require("../models/zassanBarimt");
const ZassanBarimtShalgakh = require("../components/zassanBarimtShalgakh");
const testgeree = require("../models/testgeree");

crud(router, "zassanBarimt", ZassanBarimt);
crud(router, "aldangiinZassanTuukh", AldangiinZassanTuukh);
crud(router, "aldangiinTuukh", AldangiinTuukh);

router.route("/gereeniiToololtAvya").post(tokenShalgakh, gereeniiToololtAvya);
router
  .route("/guilgeeniiToololtAvya")
  .post(tokenShalgakh, guilgeeniiToololtAvya);
router.route("/fcZasvarKhiie").post(tokenShalgakh, fcZasvarKhiie);
router.route("/avlagaZasay").post(tokenShalgakh, avlagaZasay);
router
  .route("/ashiglakhKhonogTootsoolokh")
  .post(tokenShalgakh, ashiglakhKhonogTootsoolokh);

router
  .route("/gereeniiExcelAvya/:barilgiinId")
  .get(tokenShalgakh, gereeniiExcelAvya);
router
  .route("/gereeniiExcelTatya")
  .post(uploadFile.single("file"), tokenShalgakh, gereeniiExcelTatya);
router
  .route("/tooluurZaaltZagvarAvya")
  .get(tokenShalgakh, tooluurZaaltZagvarAvya);
router
  .route("/ekhniiUldegdelZagvarOruulya")
  .get(tokenShalgakh, ekhniiUldegdelZagvarOruulya);
router
  .route("/tooluurZaaltOruulya")
  .post(uploadFile.single("file"), tokenShalgakh, tooluurZaaltOruulya);
router
  .route("/ekhniiUldegdelOruulya")
  .post(uploadFile.single("file"), tokenShalgakh, ekhniiUldegdelOruulya);
router
  .route("/tulultOlnoorKhadgalya")
  .post(tokenShalgakh, tulultOlnoorKhadgalya);
router
  .route("/baritsaaniiGuilgeeKhiie")
  .post(tokenShalgakh, baritsaaniiGuilgeeKhiie);
router
  .route("/tulultUstgaya")
  .post(tokenShalgakh, guilgeeUstgakhShalguur, tulultUstgaya);
router
  .route("/baritsaaniiGuilgeeUstgaya")
  .post(tokenShalgakh, guilgeeUstgakhShalguur, baritsaaniiGuilgeeUstgaya);
router
  .route("/tukhainOgnoogoorAvlagaBodojOruulya")
  .post(tokenShalgakh, tukhainOgnoogoorAvlagaBodojOruulya);

router
  .route("/tukhainOgnoogoorAvlagaZasajOruulya")
  .post(tokenShalgakh, tukhainOgnoogoorAvlagaZasajOruulya);
router
  .route("/tukhainOgnoogoorZardalBodojOruulya")
  .post(tokenShalgakh, tukhainOgnoogoorZardalBodojOruulya);
router.route("/talbainIdnuudOruulya").post(tokenShalgakh, talbainIdnuudOruulya);
router
  .route("/bankniiGuilgeegeerOruulya")
  .post(tokenShalgakh, bankniiGuilgeegeerOruulya);
router
  .route("/aldaataiBankniiGuilgeeZasya")
  .post(tokenShalgakh, aldaataiBankniiGuilgeeZasya);
router
  .route("/qpayGuilgeeGereeOnooyo")
  .post(tokenShalgakh, qpayGuilgeeGereeOnooyo);
router
  .route("/qpayGuilgeeTalbainDugaarOnooyo")
  .post(tokenShalgakh, qpayGuilgeeTalbainDugaarOnooyo);
router
  .route("/tukhainOgnoogoorBukhAvlagaBodojOruulya")
  .post(tokenShalgakh, tukhainOgnoogoorBukhAvlagaBodojOruulya);
router
  .route("/gereenuudedZalruulgaOruulya")
  .post(tokenShalgakh, gereenuudedZalruulgaOruulya);
router
  .route("/tsutsalsanGereenuudedZalruulgaOruulya")
  .post(tokenShalgakh, tsutsalsanGereenuudedZalruulgaOruulya);
router
  .route("/gereenuudedAvlagaOruulya")
  .post(tokenShalgakh, gereenuudedAvlagaOruulya);
router
  .route("/khungulultNukhujOruulya")
  .post(tokenShalgakh, khungulultNukhujOruulya);
router
  .route("/tsutsalgdanGuilgeeZasya")
  .post(tokenShalgakh, tsutsalgdanGuilgeeZasya);
router
  .route("/tukhainOgnoogoorGuilgeegOruulya")
  .post(tokenShalgakh, tukhainOgnoogoorGuilgeegOruulya);
router
  .route("/testiinBankniiGuilgee")
  .post(tokenShalgakh, testiinBankniiGuilgee);
router
  .route("/testiinBankniiGuilgeeOruulya")
  .post(tokenShalgakh, testiinBankniiGuilgeeOruulya);
router.route("/tulukhOgnooZasya").post(tokenShalgakh, tulukhOgnooZasya);
router.route("/khungulultKhadgalya").post(tokenShalgakh, khungulultKhadgalya);
router.route("/khungulultUstgaya").post(tokenShalgakh, khungulultUstgaya);
router.route("/talbainKubeOruulya").post(tokenShalgakh, talbainKubeOruulya);
router.route("/gereenuudZasya").post(tokenShalgakh, gereenuudZasya);
router.route("/uldegdelBodyo").post(tokenShalgakh, uldegdelBodyo);
router
  .route("/gereeniiGuilgeeKhadgalya")
  .post(tokenShalgakh, gereeniiGuilgeeKhadgalya);
router.route("/khuvaariUusgey").post(tokenShalgakh, khuvaariUusgey);
router.route("/aldangiBodyo").post(tokenShalgakh, async (req, res, next) => {
  await aldangiBodyo(req.body.baiguullagiinId);
  res.send("Amjilttai");
});
router.route("/aldangiUstgayaa").post(tokenShalgakh, aldangiUstgayaa);
router
  .route("/aldangiTegBolgoy")
  .post(tokenShalgakh, async (req, res, next) => {
    await aldangiTegBolgoy(req.body.baiguullagiinId);
    res.send("Amjilttai");
  });
router
  .route("/gereeniiTulultAvya/:gereeniiId")
  .get(tokenShalgakh, (req, res, next) => {
    Geree(req.body.tukhainBaaziinKholbolt, true)
      .findById(req.params.gereeniiId)
      .select("avlaga")
      .then((result) => {
        if (lodash.isArray(lodash.get(result, "avlaga.guilgeenuud"))) {
          var a = lodash
            .get(result, "avlaga.guilgeenuud")
            .filter(
              (a) =>
                (a.ognoo < new Date(req.query.duusakhOgnoo) &&
                  a.turul != "baritsaa" &&
                  (a.tulsunDun != 0 || a.tulukhDun != 0 || a.khyamdral != 0) &&
                  a.turul != "aldangi") ||
                (a.turul === "baritsaa" && a.tulsunDun > 0)
            );
          if (!!req.query.shineOgnoo) {
            const { endOgnoo, startOgnoo } = JSON.parse(req.query.shineOgnoo);
            if (endOgnoo && startOgnoo) {
              a = a.filter(
                (data) =>
                  data.ognoo < new Date(endOgnoo) &&
                  data.ognoo >= new Date(startOgnoo)
              );
            }
          }
          a = lodash.orderBy(a, ["ognoo"], ["asc"]);
          var uldegdel = 0;
          a.forEach((x) => {
            uldegdel =
              uldegdel +
              (x.tulukhDun ? x.tulukhDun : 0) -
              (x.tulsunDun ? x.tulsunDun : 0) -
              (x.khyamdral ? x.khyamdral : 0);
            a.uldegdel = uldegdel;
          });
          res.send(a);
        }
      })
      .catch((err) => {
        next(err);
      });
  });
router
  .route("/gereeniiAldangiTulultAvya/:gereeniiId")
  .get(tokenShalgakh, (req, res, next) => {
    Geree(req.body.tukhainBaaziinKholbolt, true)
      .findById(req.params.gereeniiId)
      .select("avlaga")
      .then((result) => {
        if (lodash.isArray(lodash.get(result, "avlaga.guilgeenuud"))) {
          var a = lodash
            .get(result, "avlaga.guilgeenuud")
            .filter(
              (a) =>
                a.ognoo < new Date(req.query.duusakhOgnoo) &&
                (a.turul === "aldangi" ||
                  (a.turul === "bank" && a.tulsunAldangi > 0))
            );
          if (!!req.query.shineOgnoo) {
            const { endOgnoo, startOgnoo } = JSON.parse(req.query.shineOgnoo);
            if (endOgnoo && startOgnoo) {
              a = a.filter(
                (data) =>
                  data.ognoo < new Date(endOgnoo) &&
                  data.ognoo >= new Date(startOgnoo)
              );
            }
          }
          a = lodash.orderBy(a, ["ognoo"], ["asc"]);
          res.send(a);
        }
      })
      .catch((err) => {
        next(err);
      });
  });

router
  .route("/baritsaaTulultAvya/:gereeniiId")
  .get(tokenShalgakh, (req, res, next) => {
    Geree(req.body.tukhainBaaziinKholbolt, true)
      .findById(req.params.gereeniiId)
      .select("avlaga")
      .then((result) => {
        if (lodash.isArray(lodash.get(result, "avlaga.baritsaa"))) {
          var a = lodash.get(result, "avlaga.baritsaa");
          a = lodash.orderBy(a, ["ognoo"], ["asc"]);
          res.send(a);
        }
      })
      .catch((err) => {
        next(err);
      });
  });

router
  .route("/nekhemjlekhiinDugaarlaltAvya")
  .get(tokenShalgakh, async (req, res, next) => {
    try {
      var maxDugaar = 1;
      var ognoo = {
        $gte: new Date(new Date().getFullYear(), 0, 1),
        $lte: new Date(new Date().getFullYear(), 11, 31),
      };
      await Dugaarlalt(req.body.tukhainBaaziinKholbolt)
        .find({
          baiguullagiinId: req.body.baiguullagiinId,
          barilgiinId: req.body.barilgiinId,
          turul: "nekhemjlekh",
          ognoo: ognoo,
        })
        .sort({
          dugaar: -1,
        })
        .limit(1)
        .then((result) => {
          if (result != 0) maxDugaar = result[0].dugaar + 1;
        });
      res.send(maxDugaar.toString());
    } catch (err) {
      next(err);
    }
  });

router
  .route("/nekhemjlekhiinDugaarlaltKhadgalya")
  .post(tokenShalgakh, async (req, res, next) => {
    try {
      var dugaarlalt = new Dugaarlalt(req.body.tukhainBaaziinKholbolt)({
        baiguullagiinId: req.body.baiguullagiinId,
        barilgiinId: req.body.barilgiinId,
        dugaar: req.body.dugaar,
        turul: "nekhemjlekh",
        ognoo: new Date(),
        isNew: true,
      });
      dugaarlalt.save();
      res.send("Amjilttai");
    } catch (err) {
      next(err);
    }
  });

crud(router, "khungulultiinTuukh", KhungulultiinTuukh, UstsanBarimt);
crud(router, "ashiglaltiinZardluud", AshiglaltiinZardluud, UstsanBarimt);
crud(
  router,
  "geree",
  Geree,
  UstsanBarimt,
  async (req, res, next) => {
    try {
      const { db } = require("zevbackv2");
      const khariltsagch = new Khariltsagch(db.erunkhiiKholbolt)(req.body);
      khariltsagch.id = khariltsagch.register;
      var unuudur = new Date();
      unuudur = new Date(
        unuudur.getFullYear(),
        unuudur.getMonth(),
        unuudur.getDate()
      );
      var maxDugaar = 1;
      await Dugaarlalt(req.body.tukhainBaaziinKholbolt)
        .find({
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
      var dugaarlalt = new Dugaarlalt(req.body.tukhainBaaziinKholbolt)({
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
  },
  gereeZasakhShalguur
);

router.route("/gereeKhadgalya").post(tokenShalgakh, async (req, res, next) => {
  const { db } = require("zevbackv2");
  const khariltsagch = new Khariltsagch(db.erunkhiiKholbolt)(req.body);
  khariltsagch.id = khariltsagch.register
    ? khariltsagch.register
    : khariltsagch.customerTin;
  if (req.body.gereeniiDugaar === `ГД${moment(new Date()).format("YYMMDD")}`) {
    var unuudur = new Date();
    unuudur = new Date(
      unuudur.getFullYear(),
      unuudur.getMonth(),
      unuudur.getDate()
    );
    var maxDugaar = 1;
    await Dugaarlalt(req.body.tukhainBaaziinKholbolt)
      .find({
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
    var dugaarlalt = new Dugaarlalt(req.body.tukhainBaaziinKholbolt)({
      baiguullagiinId: req.body.baiguullagiinId,
      barilgiinId: req.body.barilgiinId,
      dugaar: maxDugaar,
      turul: "geree",
      ognoo: unuudur,
      isNew: true,
    });
    req.body.gereeniiDugaar = req.body.gereeniiDugaar + maxDugaar;
    dugaarlalt.save();
  }

  var khariltsagchShalguur;
  if (!!khariltsagch.register) {
    khariltsagchShalguur = await Khariltsagch(db.erunkhiiKholbolt).findOne({
      register: khariltsagch.register,
      barilgiinId: req.body.barilgiinId,
    });
  } else if (!!khariltsagch.customerTin) {
    khariltsagchShalguur = await Khariltsagch(db.erunkhiiKholbolt).findOne({
      customerTin: khariltsagch.customerTin,
      barilgiinId: req.body.barilgiinId,
    });
  }
  if (!khariltsagchShalguur) await khariltsagch.save();
  var geree = new Geree(req.body.tukhainBaaziinKholbolt)(req.body);
  var daraagiinTulukhOgnoo = geree.duusakhOgnoo;
  try {
    if (geree.avlaga.guilgeenuud && geree.avlaga.guilgeenuud.length > 0)
      daraagiinTulukhOgnoo = geree.avlaga.guilgeenuud[0].ognoo;
  } catch (err) {
    if (!!next) next(err);
  }
  geree.daraagiinTulukhOgnoo = daraagiinTulukhOgnoo;
  geree.tuluv = 1;
  await geree.save().then((result) => {
    talbaiKhariltsagchiinTuluvUurchluy(
      [result._id],
      req.body.tukhainBaaziinKholbolt
    );
  });
  res.send("Amjilttai");
});

router
  .route("/khariltsagchGereeniiKhuulgaAvya/:id")
  .get(tokenShalgakh, async (req, res, next) => {
    try {
      const { db } = require("zevbackv2");
      var geree = await Geree(req.body.tukhainBaaziinKholbolt, true)
        .findById(req.params.id)
        .select("+avlaga");
      if (lodash.isArray(lodash.get(geree, "avlaga.guilgeenuud"))) {
        var baiguullaga = await Baiguullaga(db.erunkhiiKholbolt).findById(
          geree.baiguullagiinId
        );
        var ekhlekhOgnoo = null;
        if (
          baiguullaga &&
          baiguullaga.tokhirgoo &&
          baiguullaga.tokhirgoo.khereglegchEkhlekhOgnoo
        )
          ekhlekhOgnoo = baiguullaga.tokhirgoo.khereglegchEkhlekhOgnoo;
        var butsaakhJagsaalt = [];
        var shuugdsenJagsaalt = lodash
          .get(geree, "avlaga.guilgeenuud")
          .filter((a) => a.ognoo < new Date() && a.turul != "baritsaa");
        shuugdsenJagsaalt = lodash.orderBy(
          shuugdsenJagsaalt,
          ["ognoo"],
          ["asc"]
        );
        var uldegdel = 0;
        for (const x of shuugdsenJagsaalt) {
          /*if (a.turul != "baritsaa")
          uldegdel = uldegdel + (x.tulukhDun ? x.tulukhDun : 0) - (x.tulsunDun ? x.tulsunDun : 0) - (x.khyamdral ? x.khyamdral : 0);
        a.uldegdel = uldegdel;*/
          if (ekhlekhOgnoo && x.ognoo < ekhlekhOgnoo) {
            uldegdel =
              uldegdel +
              (x.tulukhDun ? x.tulukhDun : 0) -
              (x.tulsunDun ? x.tulsunDun : 0) -
              (x.khyamdral ? x.khyamdral : 0);
            butsaakhJagsaalt = [{ ognoo: ekhlekhOgnoo, tulukhDun: uldegdel }];
          } else {
            butsaakhJagsaalt.push(x);
          }
        }
        res.send(butsaakhJagsaalt);
      } else res.send([]);
    } catch (err) {
      next(err);
    }
  });

router
  .route("/gereeZasya")
  .post(tokenShalgakh, gereeZasakhShalguur, async (req, res, next) => {
    try {
      var geree = new Geree(req.body.tukhainBaaziinKholbolt)(req.body);
      var gereeOld = await Geree(req.body.tukhainBaaziinKholbolt, true)
        .findById(geree._id)
        .select("+avlaga");
      var khuvaariud = gereeOld?.avlaga?.guilgeenuud;
      khuvaariud = khuvaariud.filter(
        (x) =>
          x.ognoo < moment().startOf("month") ||
          x.turul == "khyamdral" ||
          !!x.guilgeeKhiisenAjiltniiId ||
          !!x.guilgeeKhiisenOgnoo
      );
      if (geree?.avlaga?.baritsaa?.length === 0)
        geree?.avlaga?.baritsaa.push(...gereeOld?.avlaga?.baritsaa);
      geree?.avlaga?.guilgeenuud.push(...khuvaariud);
      geree.tuluv = 1;

      await Geree(req.body.tukhainBaaziinKholbolt)
        .updateOne(
          {
            _id: geree._id,
          },
          geree
        )
        .then((result) => {
          if (gereeOld?.talbainIdnuud?.length > 0) {
            var talbainBulk = [];
            gereeOld?.talbainIdnuud.forEach((a) => {
              const talbainId = geree?.talbainIdnuud?.filter((b) => b === a);
              if (talbainId?.length === 0) {
                let upsertTalbai = {
                  updateOne: {
                    filter: { _id: a },
                    update: {
                      idevkhiteiEsekh: false,
                    },
                  },
                };
                talbainBulk.push(upsertTalbai);
              }
            });
            if (talbainBulk)
              Talbai(req.body.tukhainBaaziinKholbolt)
                .bulkWrite(talbainBulk)
                .then((bulkWriteOpResult) => {})
                .catch((err) => {
                  next(err);
                });
          }
          talbaiKhariltsagchiinTuluvUurchluy(
            [geree._id],
            req.body.tukhainBaaziinKholbolt
          );
          ZassanBarimtShalgakh.zassanBarimtShalgakh(
            gereeOld,
            geree,
            geree.gereeniiDugaar,
            "Geree",
            "Гэрээ",
            req.body
          );
        });
      res.send("Amjilttai");
    } catch (err) {
      next(err);
    }
  });

router
  .route("/gereeZasyaDavkhardsan")
  .post(tokenShalgakh, async (req, res, next) => {
    try {
      var gereeOld = await Geree(req.body.tukhainBaaziinKholbolt, true)
        .findById(req.body.gereeniiId)
        .select("+avlaga");
      var ustgakhJagsaalt = [];
      var changedUpdate = [];
      var oldAvlaga = [];
      oldAvlaga.push(...gereeOld?.avlaga?.guilgeenuud);
      if (oldAvlaga) {
        for await (const item of oldAvlaga) {
          await Geree(req.body.tukhainBaaziinKholbolt)
            .updateOne(
              {
                _id: gereeOld._id,
              },
              {
                $pull: {
                  ["avlaga.guilgeenuud"]: {
                    _id: item._id,
                  },
                },
              }
            )
            .then((result) => {});
          if (ustgakhJagsaalt.includes(JSON.stringify(item._id))) continue;
          ustgakhJagsaalt.push(JSON.stringify(item._id));
        }
        if (!!ustgakhJagsaalt) {
          for await (const key of ustgakhJagsaalt) {
            var filterAvlaga = oldAvlaga.filter(
              (e) => JSON.stringify(e._id) === key
            );
            changedUpdate.push(filterAvlaga[0]);
          }
        }
      }
      if (changedUpdate)
        await Geree(req.body.tukhainBaaziinKholbolt)
          .updateOne(
            {
              _id: gereeOld._id,
            },
            {
              $push: {
                ["avlaga.guilgeenuud"]: changedUpdate,
              },
            }
          )
          .then((result) => {});
      res.send("Amjilttai");
    } catch (err) {
      next(err);
    }
  });

function tooZasyaSync(too) {
  var zassanToo = Math.round((too + Number.EPSILON) * 100) / 100;
  return +zassanToo.toFixed(2);
}

router
  .route("/gereeSungaya")
  .post(tokenShalgakh, gereeSungakhShalguur, async (req, res, next) => {
    try {
      var geree = await Geree(req.body.tukhainBaaziinKholbolt, true)
        .findById(req.body.gereeniiId)
        .select("+avlaga");
      var val = geree.khugatsaa + req.body.sar;
      await Geree(req.body.tukhainBaaziinKholbolt)
        .findByIdAndUpdate({ _id: req.body.gereeniiId }, { khugatsaa: val })
        .then((xariu) => {})
        .catch((err) => {
          next(err);
        });
      geree = await Geree(req.body.tukhainBaaziinKholbolt, true)
        .findById(req.body.gereeniiId)
        .select("+avlaga");
      var shineDuusakhOgnoo = new Date(req.body.duusakhOgnoo);
      if (shineDuusakhOgnoo < new Date())
        throw new Error("Сунгах огноо өнөөдрөөс хойш байх шаардлагатай!");
      var tuukh = {
        umnukhDuusakhOgnoo: geree.duusakhOgnoo,
        shineDuusakhOgnoo: new Date(req.body.duusakhOgnoo),
        khiisenOgnoo: new Date(),
        turul: "Sungakh",
        ajiltniiNer: req.body.nevtersenAjiltniiToken.ner,
        ajiltniiId: req.body.nevtersenAjiltniiToken.id,
      };
      var ashiglaltiinZardluud = await AshiglaltiinZardluud(
        req.body.tukhainBaaziinKholbolt
      ).find({
        baiguullagiinId: req.body.baiguullagiinId,
      });
      var talbai = await Talbai(req.body.tukhainBaaziinKholbolt).findOne({
        baiguullagiinId: geree.baiguullagiinId,
        kod: geree.talbainDugaar,
      });

      if (geree.turGereeEsekh) {
        if (!talbai) talbai = {};
        talbai.talbainKhemjee = geree.talbainKhemjee;
        talbai.talbainKhemjeeMetrKube = geree.talbainKhemjeeMetrKube;
        talbai.talbainNiitUne = geree.sariinTurees;
      }

      if (!!geree.zardluud && !!ashiglaltiinZardluud) {
        for await (const zardal of geree.zardluud) {
          var tukhainZardal = ashiglaltiinZardluud.find(
            (x) => x.ner == zardal.ner
          );
          if (!!tukhainZardal) {
            zardal.turul = tukhainZardal.turul;
            zardal.tariff = tukhainZardal.tariff;
            zardal.suuriKhuraamj = tukhainZardal.suuriKhuraamj;
          }
        }
      }

      var khuvaariud = geree.avlaga.guilgeenuud;
      khuvaariud = khuvaariud.filter(
        (x) =>
          x.ognoo <= geree.duusakhOgnoo ||
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
              moment(new Date(req.body.duusakhOgnoo)) &&
            moment(unuudur).add(index, "month").set("date", udur) >
              moment(geree.duusakhOgnoo)
          ) {
            var tukhainUdur = moment(unuudur)
              .add(index, "month")
              .set("date", udur);
            //undsen tulultiin xuwaari)
            var baigaa = khuvaariud.find((a) => {
              return (
                a.turul == "khuvaari" &&
                a.tulukhDun ==
                  (geree.turGereeEsekh
                    ? geree.sariinTurees
                    : talbai.talbainNiitUne) &&
                moment(a.ognoo).isSame(tukhainUdur, "day")
              );
            });
            if (
              !baigaa &&
              (geree.turGereeEsekh
                ? geree.sariinTurees
                : talbai?.talbainNiitUne) > 0
            )
              khuvaariud.push({
                ognoo: tukhainUdur,
                khyamdral: 0,
                turul: "khuvaari",
                undsenDun: geree.turGereeEsekh
                  ? geree.sariinTurees
                  : talbai.talbainNiitUne,
                tulukhDun: geree.turGereeEsekh
                  ? geree.sariinTurees
                  : talbai.talbainNiitUne,
              });
            if (!!geree.zardluud && geree.zardluud.length > 0) {
              geree.zardluud.forEach((zardal) => {
                if (
                  zardal.turul == "1м3/талбай" &&
                  (geree.turGereeEsekh
                    ? geree.talbainKhemjeeMetrKube
                    : talbai.talbainKhemjeeMetrKube) > 0
                ) {
                  baigaa = khuvaariud.find((a) => {
                    return (
                      a.turul == "avlaga" &&
                      a.tulukhDun ==
                        tooZasyaSync(
                          zardal.tariff *
                            (geree.turGereeEsekh
                              ? geree.talbainKhemjeeMetrKube
                              : talbai.talbainKhemjeeMetrKube)
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
                        zardal.tariff *
                          (geree.turGereeEsekh
                            ? geree.talbainKhemjeeMetrKube
                            : talbai.talbainKhemjeeMetrKube)
                      ),
                    });
                } else if (
                  zardal.turul == "1м2" &&
                  (geree.turGereeEsekh
                    ? geree.talbainKhemjee
                    : talbai?.talbainKhemjee) > 0
                ) {
                  baigaa = khuvaariud.find((a) => {
                    return (
                      a.turul == "avlaga" &&
                      a.tulukhDun ==
                        tooZasyaSync(
                          zardal.tariff *
                            (geree.turGereeEsekh
                              ? geree.talbainKhemjee
                              : talbai.talbainKhemjee)
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
                        zardal.tariff *
                          (geree.turGereeEsekh
                            ? geree.talbainKhemjee
                            : talbai.talbainKhemjee)
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
          }
        });
      });

      if (geree.gereeniiTuukhuud) {
        Geree(req.body.tukhainBaaziinKholbolt)
          .findOneAndUpdate(
            { _id: req.body.gereeniiId },
            {
              $push: {
                [`gereeniiTuukhuud`]: tuukh,
              },
              $set: {
                duusakhOgnoo: req.body.duusakhOgnoo,
                "avlaga.guilgeenuud": khuvaariud,
              },
            }
          )
          .then((result) => {
            res.send("Amjilttai");
          })
          .catch((err) => {
            next(err);
          });
      } else {
        tuukh = [tuukh];
        Geree(req.body.tukhainBaaziinKholbolt)
          .findOneAndUpdate(
            { _id: req.body.gereeniiId },
            {
              $set: {
                duusakhOgnoo: req.body.duusakhOgnoo,
                gereeniiTuukhuud: tuukh,
                "avlaga.guilgeenuud": khuvaariud,
              },
            }
          )
          .then((result) => {
            res.send("Amjilttai");
          })
          .catch((err) => {
            next(err);
          });
      }
    } catch (err) {
      next(err);
    }
  });

router
  .route("/gereeSergeeye")
  .post(tokenShalgakh, gereeSergeekhShalguur, async (req, res, next) => {
    try {
      var geree = await Geree(req.body.tukhainBaaziinKholbolt, true)
        .findById(req.body.gereeniiId)
        .select({
          gereeniiTuukhuud: 1,
          duusakhOgnoo: 1,
          tuluv: 1,
        });
      if (geree.tuluv !== -1)
        throw new Error("Зөвхөн цуцалсан төлөвтэй гэрээг сэргээх боломжтой!");
      var tuukh = {
        umnukhDuusakhOgnoo: geree.duusakhOgnoo,
        sergeekhOgnoo: req.body.sergeekhOgnoo,
        shineDuusakhOgnoo: new Date(req.body.duusakhOgnoo),
        tailbar: req.body.tailbar,
        khiisenOgnoo: new Date(),
        turul: "Sergeekh",
        ajiltniiNer: req.body.nevtersenAjiltniiToken.ner,
        ajiltniiId: req.body.nevtersenAjiltniiToken.id,
      };

      var khuvaariud = [];
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
              undsenDun: talbai.talbainNiitUne,
              tulukhDun: talbai.talbainNiitUne,
            });
        });
      });
      if (geree.gereeniiTuukhuud) {
        Geree(req.body.tukhainBaaziinKholbolt)
          .findOneAndUpdate(
            { _id: req.body.gereeniiId },
            {
              $push: {
                [`gereeniiTuukhuud`]: tuukh,
                [`avlaga.guilgeenuud`]: khuvaariud,
              },
              $set: {
                tsutsalsanOgnoo: null,
                tuluv: 1,
              },
            }
          )
          .then((result) => {
            talbaiKhariltsagchiinTuluvUurchluy(
              [geree._id],
              req.body.tukhainBaaziinKholbolt
            );
            res.send("Amjilttai");
          })
          .catch((err) => {
            next(err);
          });
      } else {
        tuukh = [tuukh];
        Geree(req.body.tukhainBaaziinKholbolt)
          .findOneAndUpdate(
            { _id: req.body.gereeniiId },
            {
              $push: {
                [`avlaga.guilgeenuud`]: khuvaariud,
              },
              $set: {
                tsutsalsanOgnoo: null,
                tuluv: 1,
                gereeniiTuukhuud: tuukh,
              },
            }
          )
          .then((result) => {
            talbaiKhariltsagchiinTuluvUurchluy(
              [geree._id],
              req.body.tukhainBaaziinKholbolt
            );
            res.send("Amjilttai");
          })
          .catch((err) => {
            next(err);
          });
      }
    } catch (err) {
      next(err);
    }
  });

async function talbaiKhariltsagchiinTuluvUurchluy(
  gereeniiIdnuud,
  tukhainBaaziinKholbolt
) {
  const { db } = require("zevbackv2");
  if (gereeniiIdnuud && gereeniiIdnuud.length > 0) {
    var talbainBulk = [];
    var khariltsagchiinBulk = [];
    for await (const id of gereeniiIdnuud) {
      let geree = await Geree(tukhainBaaziinKholbolt, true).findById(id);
      let busadGereenuud;
      if (!!geree.customerTin) {
        busadGereenuud = await Geree(tukhainBaaziinKholbolt, true).find({
          customerTin: geree.customerTin,
          barilgiinId: geree.barilgiinId,
          tuluv: { $ne: -1 },
        });
      } else if (!!geree.register) {
        busadGereenuud = await Geree(tukhainBaaziinKholbolt, true).find({
          register: geree.register,
          barilgiinId: geree.barilgiinId,
          tuluv: { $ne: -1 },
        });
      }
      var talbainuud = await Talbai(tukhainBaaziinKholbolt).find({
        _id: { $in: geree.talbainIdnuud },
      });
      for await (const talbai of talbainuud) {
        if (talbai.niitiinTalbaiEsekh) {
          let tukhainTalbainGereenuud = await Geree(
            tukhainBaaziinKholbolt,
            true
          ).find({
            barilgiinId: geree.barilgiinId,
            tuluv: { $ne: -1 },
            talbainIdnuud: talbai._id,
          });
          var niitIdevkhiteiTalbai = lodash.sumBy(
            tukhainTalbainGereenuud,
            function (object) {
              return object.talbainKhemjee;
            }
          );
          var sulKhemjee = talbai.talbainKhemjee - niitIdevkhiteiTalbai;
          if (sulKhemjee < 0) sulKhemjee = 0;
          let upsertTalbai = {
            updateOne: {
              filter: { _id: talbai._id },
              update: {
                idevkhiteiEsekh: geree.tuluv == 1,
                sulKhemjee: sulKhemjee,
              },
            },
          };
          talbainBulk.push(upsertTalbai);
        } else {
          let upsertTalbai = {
            updateOne: {
              filter: { _id: talbai._id },
              update: {
                idevkhiteiEsekh: geree.tuluv == 1,
              },
            },
          };
          talbainBulk.push(upsertTalbai);
        }
        let upsertKhariltsagch;
        if (!!geree.customerTin) {
          upsertKhariltsagch = {
            updateOne: {
              filter: {
                customerTin: geree.customerTin,
                barilgiinId: geree.barilgiinId,
              },
              update: {
                idevkhiteiEsekh: busadGereenuud?.length > 0 || geree.tuluv == 1,
              },
            },
          };
        } else if (!!geree.register) {
          upsertKhariltsagch = {
            updateOne: {
              filter: {
                register: geree.register,
                barilgiinId: geree.barilgiinId,
              },
              update: {
                idevkhiteiEsekh: busadGereenuud?.length > 0 || geree.tuluv == 1,
              },
            },
          };
        }
        khariltsagchiinBulk.push(upsertKhariltsagch);
      }
    }
    if (talbainBulk)
      Talbai(tukhainBaaziinKholbolt)
        .bulkWrite(talbainBulk)
        .then((bulkWriteOpResult) => {})
        .catch((err) => {
          throw err;
        });

    if (khariltsagchiinBulk)
      Khariltsagch(db.erunkhiiKholbolt)
        .bulkWrite(khariltsagchiinBulk)
        .then((bulkWriteOpResult) => {})
        .catch((err) => {
          throw err;
        });
  }
}

router
  .route("/gereeTsutslaya")
  .post(tokenShalgakh, gereeTsutslakhShalguur, async (req, res, next) => {
    try {
      var geree = await Geree(req.body.tukhainBaaziinKholbolt, true)
        .findById(req.body.gereeniiId)
        .select({
          gereeniiTuukhuud: 1,
          duusakhOgnoo: 1,
        });
      var tuukh = {
        umnukhDuusakhOgnoo: geree.duusakhOgnoo,
        tsutslasanShaltgaan: req.body.shaltgaan,
        khiisenOgnoo: new Date(),
        turul: "Tsutslakh",
        ajiltniiNer: req.body.nevtersenAjiltniiToken.ner,
        ajiltniiId: req.body.nevtersenAjiltniiToken.id,
      };
      var avlagaMatch = req.body.udruurBodokhEsekh
        ? {
            ognoo: {
              $gte: new Date(moment(req.body.tsutslakhOgnoo).startOf("month")),
            },
            tulukhDun: { $gt: 0 },
          }
        : { ognoo: { $gt: new Date() } };
      if (geree.gereeniiTuukhuud) {
        Geree(req.body.tukhainBaaziinKholbolt)
          .findOneAndUpdate(
            { _id: req.body.gereeniiId },
            {
              $push: {
                [`gereeniiTuukhuud`]: tuukh,
              },
              $set: {
                tsutsalsanOgnoo: new Date(),
                tuluv: -1,
              },
              $pull: { "avlaga.guilgeenuud": avlagaMatch },
            }
          )
          .then((result) => {
            talbaiKhariltsagchiinTuluvUurchluy(
              [geree._id],
              req.body.tukhainBaaziinKholbolt
            );
            res.send("Amjilttai");
          })
          .catch((err) => {
            next(err);
          });
      } else {
        tuukh = [tuukh];
        Geree(req.body.tukhainBaaziinKholbolt)
          .findOneAndUpdate(
            { _id: req.body.gereeniiId },
            {
              $set: {
                gereeniiTuukhuud: tuukh,
                tsutsalsanOgnoo: new Date(),
                tuluv: -1,
              },
              $pull: { "avlaga.guilgeenuud": avlagaMatch },
            }
          )
          .then((result) => {
            talbaiKhariltsagchiinTuluvUurchluy(
              [geree._id],
              req.body.tukhainBaaziinKholbolt
            );
            res.send("Amjilttai");
          })
          .catch((err) => {
            next(err);
          });
      }
      if (
        req.body.udruurBodokhEsekh &&
        req.body.suuliinSariinAvlaguud &&
        req.body.suuliinSariinAvlaguud?.length > 0
      ) {
        var suuliinSariinAvlaguud = req.body.suuliinSariinAvlaguud;
        for (const savlaga of suuliinSariinAvlaguud)
          savlaga.tailbar =
            (savlaga.turul === "khuvaari"
              ? "Түрээсийн төлбөр"
              : savlaga.tailbar) +
            " " +
            req.body.shaltgaan;
        console.log(
          "avlaguud -------------->>>" + JSON.stringify(suuliinSariinAvlaguud)
        );
        Geree(req.body.tukhainBaaziinKholbolt)
          .findOneAndUpdate(
            { _id: req.body.gereeniiId },
            {
              $push: {
                "avlaga.guilgeenuud": {
                  $each: suuliinSariinAvlaguud,
                },
              },
            }
          )
          .then((result) => {})
          .catch((err) => {
            next(err);
          });
      }
    } catch (error) {
      next(error);
    }
  });

router
  .route("/eneSardTulukhJagsaaltAvya")
  .post(tokenShalgakh, async (req, res, next) => {
    try {
      if (
        moment(req.body.nekhemjlekhAvakhOgnoo).format("YYYY-MM-DD") ==
        moment(req.body.ekhlekhOgnoo).format("YYYY-MM-DD")
      )
        req.body.nekhemjlekhAvakhOgnoo = req.body.ekhlekhOgnoo;
      const body = req.body.query;
      if (!!body?.khuudasniiDugaar)
        body.khuudasniiDugaar = Number(body.khuudasniiDugaar);
      if (!!body?.khuudasniiKhemjee)
        body.khuudasniiKhemjee = Number(body.khuudasniiKhemjee);
      if (!!body?.search) body.search = String(body.search);
      if (req.body.barilgiinId) {
        if (!body.query) body.query = { barilgiinId: req.body.barilgiinId };
        else body.query["barilgiinId"] = req.body.barilgiinId;
      }
      if (body.query)
        body.query["tuluv"] = {
          $ne: -1,
        };
      body.lean = true;
      const isFoodCity = req.body.baiguullagiinId === "63c0f31efe522048bf02086d";
      khuudaslalt(Geree(req.body.tukhainBaaziinKholbolt, true), body)
        .then(async (result) => {
          if (result && result.jagsaalt && result.jagsaalt.length > 0) {
            var idnuud = [];
            result.jagsaalt.forEach((a) => idnuud.push(a._id));
            
            const umnukhSariinUrTulburGroup = {
              _id: "$gereeniiDugaar",
              tulukh: {
                $sum: {
                  $ifNull: ["$avlaga.guilgeenuud.tulukhDun", 0],
                },
              },
              khyamdral: {
                $sum: {
                  $ifNull: ["$avlaga.guilgeenuud.khyamdral", 0],
                },
              },
            };
            if (isFoodCity) {
              umnukhSariinUrTulburGroup.tulsun = {
                $sum: {
                  $ifNull: ["$avlaga.guilgeenuud.tulsunDun", 0],
                },
              };
            }
            
            const umnukhSariinUrTulburProject = {
              gereeniiDugaar: "$gereeniiDugaar",
              uldegdel: isFoodCity
                ? {
                    $subtract: [
                      "$tulukh",
                      {
                        $sum: ["$khyamdral", "$tulsun"],
                      },
                    ],
                  }
                : {
                    $subtract: ["$tulukh", "$khyamdral"],
                  },
            };
            
            var query = [
              {
                $match: {
                  baiguullagiinId: req.body.baiguullagiinId,
                  barilgiinId: req.body.barilgiinId,
                  _id: { $in: idnuud },
                  tuluv: {
                    $ne: -1,
                  },
                },
              },
              {
                $facet: {
                  khariltsagch: [
                    {
                      $lookup: {
                        from: "khariltsagch",
                        let: {
                          register: "$register",
                          baiguullagiinId: "$baiguullagiinId",
                          barilgiinId: "$barilgiinId",
                        },
                        pipeline: [
                          {
                            $match: {
                              $expr: {
                                $and: [
                                  { $eq: ["$register", "$$register"] },
                                  {
                                    $eq: [
                                      "$baiguullagiinId",
                                      "$$baiguullagiinId",
                                    ],
                                  },
                                  { $eq: ["$barilgiinId", "$$barilgiinId"] },
                                ],
                              },
                            },
                          },
                        ],
                        as: "khariltsagch",
                      },
                    },
                    {
                      $set: {
                        token: {
                          $arrayElemAt: ["$khariltsagch.firebaseToken", 0],
                        },
                        khariltsagchiinId: {
                          $arrayElemAt: ["$khariltsagch._id", 0],
                        },
                        register: {
                          $arrayElemAt: ["$khariltsagch.register", 0],
                        },
                      },
                    },
                    {
                      $project: {
                        khariltsagchiinId: 1,
                        token: 1,
                        register: 1,
                      },
                    },
                  ],
                  umnukhSariinTulsun: [
                    {
                      $unwind: {
                        path: "$avlaga.guilgeenuud",
                      },
                    },
                    {
                      $match: {
                        "avlaga.guilgeenuud.ognoo": {
                          $lt: new Date(req.body.nekhemjlekhAvakhOgnoo),
                        },
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
                        _id: "$gereeniiDugaar",
                        tulsun: {
                          $sum: {
                            $ifNull: ["$avlaga.guilgeenuud.tulsunDun", 0],
                          },
                        },
                      },
                    },
                    {
                      $project: {
                        gereeniiDugaar: "$gereeniiDugaar",
                        uldegdel: "$tulsun",
                      },
                    },
                  ],
                  umnukhSariinUrTulbur: [
                    {
                      $unwind: {
                        path: "$avlaga.guilgeenuud",
                      },
                    },
                    {
                      $match: {
                        "avlaga.guilgeenuud.turul": {
                          $nin: ["baritsaa"],
                        },
                        "avlaga.guilgeenuud.ognoo": {
                          $lt: new Date(req.body.ekhlekhOgnoo),
                        },
                      },
                    },
                    {
                      $group: umnukhSariinUrTulburGroup,
                    },
                    {
                      $project: umnukhSariinUrTulburProject,
                    },
                  ],
                  umnukhSariinTureesUrTulbur: [
                    {
                      $unwind: {
                        path: "$avlaga.guilgeenuud",
                      },
                    },
                    {
                      $match: {
                        "avlaga.guilgeenuud.ognoo": {
                          $lt: new Date(req.body.ekhlekhOgnoo),
                        },
                        $or: [
                          {
                            "avlaga.guilgeenuud.turul": { $in: ["khuvaari"] },
                          },
                          {
                            $and: [
                              {
                                "avlaga.guilgeenuud.turul": {
                                  $in: ["khungulult"],
                                },
                              },
                              {
                                "avlaga.guilgeenuud.tailbar": {
                                  $in: ["Хөнгөлөлт"],
                                },
                              },
                            ],
                          },
                        ],
                      },
                    },
                    {
                      $group: {
                        _id: "$gereeniiDugaar",
                        tulukh: {
                          $sum: {
                            $ifNull: ["$avlaga.guilgeenuud.tulukhDun", 0],
                          },
                        },
                        khyamdral: {
                          $sum: {
                            $ifNull: ["$avlaga.guilgeenuud.khyamdral", 0],
                          },
                        },
                      },
                    },
                    {
                      $project: {
                        gereeniiDugaar: "$gereeniiDugaar",
                        uldegdel: {
                          $subtract: ["$tulukh", "$khyamdral"],
                        },
                      },
                    },
                  ],
                  umnukhSariinAshiglaltUrTulbur: [
                    {
                      $unwind: {
                        path: "$avlaga.guilgeenuud",
                      },
                    },
                    {
                      $match: {
                        "avlaga.guilgeenuud.ognoo": {
                          $lt: new Date(req.body.ekhlekhOgnoo),
                        },
                        $or: [
                          {
                            "avlaga.guilgeenuud.turul": { $in: ["avlaga"] },
                          },
                          {
                            $and: [
                              {
                                "avlaga.guilgeenuud.turul": {
                                  $in: ["khungulult"],
                                },
                              },
                              {
                                "avlaga.guilgeenuud.tailbar": {
                                  $nin: ["Хөнгөлөлт"],
                                },
                              },
                            ],
                          },
                        ],
                      },
                    },
                    {
                      $group: {
                        _id: "$gereeniiDugaar",
                        tulukh: {
                          $sum: {
                            $ifNull: ["$avlaga.guilgeenuud.tulukhDun", 0],
                          },
                        },
                        khyamdral: {
                          $sum: {
                            $ifNull: ["$avlaga.guilgeenuud.khyamdral", 0],
                          },
                        },
                      },
                    },
                    {
                      $project: {
                        gereeniiDugaar: "$gereeniiDugaar",
                        uldegdel: {
                          $subtract: ["$tulukh", "$khyamdral"],
                        },
                      },
                    },
                  ],
                  niitUldegdel: [
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
                        "avlaga.guilgeenuud.ognoo": {
                          $lte: new Date(req.body.duusakhOgnoo),
                        },
                      },
                    },
                    {
                      $group: {
                        _id: "$gereeniiDugaar",
                        tulukh: {
                          $sum: {
                            $ifNull: ["$avlaga.guilgeenuud.tulukhDun", 0],
                          },
                        },
                        khyamdral: {
                          $sum: {
                            $ifNull: ["$avlaga.guilgeenuud.khyamdral", 0],
                          },
                        },
                        tulsun: {
                          $sum: {
                            $ifNull: ["$avlaga.guilgeenuud.tulsunDun", 0],
                          },
                        },
                      },
                    },
                    {
                      $project: {
                        gereeniiDugaar: "$gereeniiDugaar",
                        uldegdel: {
                          $subtract: [
                            "$tulukh",
                            {
                              $sum: ["$tulsun", "$khyamdral"],
                            },
                          ],
                        },
                      },
                    },
                  ],
                  eneSardTulukhDun: [
                    {
                      $unwind: {
                        path: "$avlaga.guilgeenuud",
                      },
                    },
                    {
                      $match: {
                        "avlaga.guilgeenuud.turul": {
                          $nin: ["baritsaa"],
                        },
                        "avlaga.guilgeenuud.ognoo": {
                          $lte: new Date(req.body.duusakhOgnoo),
                          $gte: new Date(req.body.ekhlekhOgnoo),
                        },
                      },
                    },
                    {
                      $group: {
                        _id: "$gereeniiDugaar",
                        tulukh: {
                          $sum: {
                            $ifNull: ["$avlaga.guilgeenuud.tulukhDun", 0],
                          },
                        },
                        khyamdral: {
                          $sum: {
                            $ifNull: ["$avlaga.guilgeenuud.khyamdral", 0],
                          },
                        },
                      },
                    },
                    {
                      $project: {
                        gereeniiDugaar: "$gereeniiDugaar",
                        uldegdel: {
                          $subtract: ["$tulukh", "$khyamdral"],
                        },
                      },
                    },
                  ],
                  nekhemjlekhDeerGarakh: [
                    {
                      $unwind: {
                        path: "$avlaga.guilgeenuud",
                      },
                    },
                    {
                      $match: {
                        "avlaga.guilgeenuud.ognoo": {
                          $lte: new Date(req.body.duusakhOgnoo),
                          $gte: new Date(req.body.ekhlekhOgnoo),
                        },
                        "avlaga.guilgeenuud.nekhemjlekhDeerKharagdakh": true,
                      },
                    },
                    {
                      $project: {
                        gereeniiDugaar: "$gereeniiDugaar",
                        avlaga: "$avlaga.guilgeenuud",
                      },
                    },
                    {
                      $group: {
                        _id: "$gereeniiDugaar",
                        guilgeenuud: {
                          $push: "$avlaga",
                        },
                      },
                    },
                  ],
                  tukhainSariinTureesiinTulukhDun: [
                    {
                      $unwind: {
                        path: "$avlaga.guilgeenuud",
                      },
                    },
                    {
                      $match: {
                        "avlaga.guilgeenuud.turul": {
                          $in: ["khuvaari"],
                        },
                        "avlaga.guilgeenuud.zardliinTurul": { $exists: false },
                        "avlaga.guilgeenuud.ognoo": {
                          $lte: new Date(req.body.duusakhOgnoo),
                          $gte: new Date(req.body.ekhlekhOgnoo),
                        },
                      },
                    },
                    {
                      $group: {
                        _id: "$gereeniiDugaar",
                        tulukh: {
                          $sum: {
                            $ifNull: ["$avlaga.guilgeenuud.tulukhDun", 0],
                          },
                        },
                      },
                    },
                    {
                      $project: {
                        gereeniiDugaar: "$gereeniiDugaar",
                        tulukh: "$tulukh",
                      },
                    },
                  ],
                  zardluud: [
                    {
                      $unwind: {
                        path: "$avlaga.guilgeenuud",
                      },
                    },
                    {
                      $match: {
                        "avlaga.guilgeenuud.ognoo": {
                          $lte: new Date(req.body.duusakhOgnoo),
                          $gte: new Date(req.body.ekhlekhOgnoo),
                        },
                        $or: [
                          {
                            "avlaga.guilgeenuud.turul": {
                              $in: ["avlaga", "khungulult", "torguuli"],
                            },
                          },
                          {
                            $and: [
                              {
                                "avlaga.guilgeenuud.turul": {
                                  $in: ["khuvaari"],
                                },
                              },
                              {
                                "avlaga.guilgeenuud.zardliinTurul": {
                                  $in: ["turees"],
                                },
                              },
                            ],
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
                      $project: {
                        gereeniiDugaar: "$gereeniiDugaar",
                        avlaga: "$avlaga.guilgeenuud",
                      },
                    },
                    {
                      $group: {
                        _id: {
                          gereeniiDugaar: "$gereeniiDugaar",
                          tooluuriinDugaar: {
                            $ifNull: ["$avlaga.tooluuriinDugaar", ""],
                          },
                          tailbar: {
                            $cond: [
                              {
                                $eq: ["$avlaga.zardliinTurul", "turees"],
                              },
                              "Түрээсийн төлбөр нэмэлт",
                              {
                                $cond: [
                                  {
                                    $eq: [
                                      "$avlaga.zardliinTurul",
                                      "management",
                                    ],
                                  },
                                  "Менежментийн төлбөр нэмэлт",
                                  {
                                    $cond: [
                                      {
                                        $eq: [
                                          "$avlaga.zardliinTurul",
                                          "dulaan",
                                        ],
                                      },
                                      "Дулаан нэмэлт",
                                      {
                                        $cond: [
                                          {
                                            $eq: [
                                              "$avlaga.zardliinTurul",
                                              "khulaanUs",
                                            ],
                                          },
                                          "Халуун ус нэмэлт",
                                          {
                                            $cond: [
                                              {
                                                $eq: [
                                                  "$avlaga.zardliinTurul",
                                                  "khuitenUs",
                                                ],
                                              },
                                              "Хүйтэн ус нэмэлт",
                                              {
                                                $cond: [
                                                  {
                                                    $eq: [
                                                      "$avlaga.zardliinTurul",
                                                      "tsakhilgaan",
                                                    ],
                                                  },
                                                  "Цахилгаан нэмэлт",
                                                  {
                                                    $cond: [
                                                      {
                                                        $eq: [
                                                          "$avlaga.turul",
                                                          "baritsaa",
                                                        ],
                                                      },
                                                      "Барьцаа ашигласан",
                                                      {
                                                        $cond: [
                                                          {
                                                            $eq: [
                                                              "$avlaga.turul",
                                                              "torguuli",
                                                            ],
                                                          },
                                                          "торгууль",
                                                          {
                                                            $ifNull: [
                                                              "$avlaga.zardliinNer",
                                                              "$avlaga.tailbar",
                                                            ],
                                                          },
                                                        ],
                                                      },
                                                    ],
                                                  },
                                                ],
                                              },
                                            ],
                                          },
                                        ],
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                        },
                        khemjikhNegj: { $max: "$avlaga.khemjikhNegj" },
                        negj: {
                          $max: "$avlaga.negj",
                        },
                        tariff: {
                          $max: "$avlaga.tariff",
                        },
                        tulukhDun: {
                          $sum: {
                            $subtract: [
                              {
                                $ifNull: ["$avlaga.tulukhDun", 0],
                              },
                              {
                                $ifNull: ["$avlaga.tulsunDun", 0],
                              },
                            ],
                          },
                        },
                        tulukhNUAT: {
                          $sum: {
                            $ifNull: ["$avlaga.tulukhNUAT", 0],
                          },
                        },
                        tulukhNuatgui: {
                          $sum: {
                            $ifNull: ["$avlaga.tulukhNuatgui", 0],
                          },
                        },
                        tsekhDun: {
                          $sum: {
                            $ifNull: ["$avlaga.tsekhDun", 0],
                          },
                        },
                        chadalDun: {
                          $sum: {
                            $ifNull: ["$avlaga.chadalDun", 0],
                          },
                        },
                        sekhDemjikhTulburDun: {
                          $sum: {
                            $ifNull: ["$avlaga.sekhDemjikhTulburDun", 0],
                          },
                        },
                        khungulult: {
                          $sum: "$avlaga.khyamdral",
                        },
                        umnukhZaalt: {
                          $min: "$avlaga.umnukhZaalt",
                        },
                        suuliinZaalt: {
                          $max: "$avlaga.suuliinZaalt",
                        },
                        nuatBodokh: {
                          $sum: {
                            $cond: [
                              {
                                $eq: ["$avlaga.nuatBodokhEsekh", true],
                              },
                              1,
                              0,
                            ],
                          },
                        },
                      },
                    },
                  ],
                },
              },
            ];
            var gereenuud = await Geree(
              req.body.tukhainBaaziinKholbolt,
              true
            ).aggregate(query);
            if (result && result.jagsaalt && result.jagsaalt.length > 0) {
              result.jagsaalt = result.jagsaalt.filter((a) =>
                gereenuud[0].niitUldegdel.find((b) => b._id == a.gereeniiDugaar)
              );
              result.jagsaalt.forEach((x) => {
                x.tukhainSariinTureesiinTulukhDun =
                  gereenuud[0].tukhainSariinTureesiinTulukhDun.find(
                    (a) => a._id == x.gereeniiDugaar
                  )?.tulukh || 0;
                x.eneSardTulukhDun =
                  gereenuud[0].eneSardTulukhDun.find(
                    (a) => a._id == x.gereeniiDugaar
                  )?.uldegdel || 0;
                x.umnukhSariinTulsun =
                  gereenuud[0].umnukhSariinTulsun?.find(
                    (a) => a._id == x.gereeniiDugaar
                  )?.uldegdel || 0;
                x.umnukhSariinTureesUrTulbur =
                  gereenuud[0].umnukhSariinTureesUrTulbur?.find(
                    (a) => a._id == x.gereeniiDugaar
                  )?.uldegdel || 0;
                x.umnukhSariinAshiglaltUrTulbur =
                  gereenuud[0].umnukhSariinAshiglaltUrTulbur?.find(
                    (a) => a._id == x.gereeniiDugaar
                  )?.uldegdel || 0;
                x.umnukhSariinTureesUrTulbur =
                  x.umnukhSariinTureesUrTulbur - x.umnukhSariinTulsun;
                if (x.umnukhSariinTureesUrTulbur < 0)
                  x.umnukhSariinAshiglaltUrTulbur =
                    x.umnukhSariinAshiglaltUrTulbur +
                    x.umnukhSariinTureesUrTulbur;
                x.umnukhSariinUrTulbur =
                  gereenuud[0].umnukhSariinUrTulbur.find(
                    (a) => a._id == x.gereeniiDugaar
                  )?.uldegdel || 0;
                if (!isFoodCity) {
                  x.umnukhSariinUrTulbur =
                    x.umnukhSariinUrTulbur - x.umnukhSariinTulsun;
                }
                x.niitUldegdel =
                  gereenuud[0].niitUldegdel.find(
                    (a) => a._id == x.gereeniiDugaar
                  )?.uldegdel || 0;
                x.niitAvlagaUldegdel =
                  x.niitUldegdel + (x.aldangiinUldegdel || 0);
                
                // FoodCity template fields - map to frontend expected field names
                if (isFoodCity) {
                  // niitDun = Initial balance + Current month charges
                  x.niitDun = (x.umnukhSariinUrTulbur || 0) + (x.eneSardTulukhDun || 0);
                  // umnukhSariinTulsunDun = Previous month payments (for display only)
                  x.umnukhSariinTulsunDun = x.umnukhSariinTulsun || 0;
                  // garaasBodsonNiitDun = Total balance after payments
                  x.garaasBodsonNiitDun = x.niitUldegdel || 0;
                }
                x.nemeltNekhemjlekh =
                  gereenuud[0].nekhemjlekhDeerGarakh.find(
                    (a) => a._id == x.gereeniiDugaar
                  )?.guilgeenuud || [];
                x.zardluud = gereenuud[0].zardluud.filter(
                  (a) => a._id.gereeniiDugaar == x.gereeniiDugaar
                );
                if (!!x.zardluud && x.zardluud.length > 0) {
                  x.zardluud.forEach((zardal) => {
                    console.log("------- 1 -------<" + zardal.tailbar);
                    zardal.tailbar =
                      zardal._id.tailbar +
                      (zardal._id.tooluuriinDugaar
                        ? " " + zardal._id.tooluuriinDugaar
                        : "");
                    console.log("-------- 2 -------<" + zardal.tailbar);
                    if (
                      zardal.tailbar == "Түрээс" ||
                      zardal.tailbar == "Хөнгөлөлт"
                    )
                      x.khungulult = zardal.khungulult;
                  });
                }
                x.khariltsagchiinId = gereenuud[0].khariltsagch.find(
                  (a) => a.register == x.register
                )?.khariltsagchiinId;
                x.firebaseToken = gereenuud[0].khariltsagch.find(
                  (a) => a.register == x.register
                )?.token;
                //if (x.umnukhSariinUrTulbur < 0) x.umnukhSariinUrTulbur = 0;
                if (x.eneSardTulukhDun < 0) x.eneSardTulukhDun = 0;
                // if (x.niitUldegdel < 0) x.niitUldegdel = 0;
                x.sariinTurees = x.tukhainSariinTureesiinTulukhDun;
                x.talbainNiitUne = x.tukhainSariinTureesiinTulukhDun;
                if (req.body.olnoorSaraarEsekh) {
                  // olon saraar nekhemjlekh
                  let diffMonth = moment(req.body.duusakhOgnoo).diff(
                    moment(),
                    "months"
                  );
                  if (diffMonth) {
                    x.sariinTurees = (diffMonth + 1) * x.sariinTurees;
                    x.talbainNiitUne = (diffMonth + 1) * x.talbainNiitUne;
                    x.diffMonth = diffMonth;
                  }
                }
              });
            }
          }
          res.send(result);
        })
        .catch((err1) => {
          next(err1);
        });
      /*
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
                    '$lt': new Date(req.body.ekhlekhOgnoo)
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
                          "avlaga.guilgeenuud.nekhemjlekhDeerKharagdakh": {
                            $exists: false
                          }
                        },
                        {
                          "avlaga.guilgeenuud.nekhemjlekhDeerKharagdakh": false
                        }
                      ]
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
                '$sum':
                {
                  "$ifNull": ['$avlaga.guilgeenuud.tulukhDun', 0]
                }
              },
              'khyamdral': {
                '$sum':
                {
                  "$ifNull": ['$avlaga.guilgeenuud.khyamdral', 0]
                }
              },
              'tulsun': {
                '$sum':
                {
                  "$ifNull": ['$avlaga.guilgeenuud.tulsunDun', 0]
                }
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
                '$sum':
                {
                  "$ifNull": ['$avlaga.guilgeenuud.tulukhDun', 0]
                }
              },
              'khyamdral': {
                '$sum':
                {
                  "$ifNull": ['$avlaga.guilgeenuud.khyamdral', 0]
                }
              },
              'tulsun': {
                '$sum':
                {
                  "$ifNull": ['$avlaga.guilgeenuud.tulsunDun', 0]
                }
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
                '$sum':
                {
                  "$ifNull": ['$avlaga.guilgeenuud.tulukhDun', 0]
                }
              },
              'khyamdral': {
                '$sum':
                {
                  "$ifNull": ['$avlaga.guilgeenuud.khyamdral', 0]
                }
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
  
        khuudaslalt(Geree, body)
          .then((result) => {
            if (result && result.jagsaalt && result.jagsaalt.length > 0)
              result.jagsaalt.forEach(x => {
              });
            res.send(result);
          })
          .catch((err) => {
            next(err);
          });
      }*/
    } catch (error) {
      next(error);
    }
  });

router
  .route("/tulburiinZadargaaAvya")
  .post(tokenShalgakh, async (req, res, next) => {
    try {
      var mongoose = require("mongoose");
      var id = mongoose.Types.ObjectId(req.body.id);
      var query = [
        {
          $match: {
            _id: id,
          },
        },
        {
          $unwind: {
            path: "$avlaga.guilgeenuud",
          },
        },
        {
          $lookup: {
            from: "talbai",
            let: {
              talbainDugaar: "$talbainDugaar",
              baiguullagiinId: "$baiguullagiinId",
              barilgiinId: "$barilgiinId",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$kod", "$$talbainDugaar"] },
                      { $eq: ["$baiguullagiinId", "$$baiguullagiinId"] },
                      { $eq: ["$barilgiinId", "$$barilgiinId"] },
                    ],
                  },
                },
              },
            ],
            as: "talbai",
          },
        },
        {
          $facet: {
            baritsaaAshiglasanDun: [
              {
                $unwind: {
                  path: "$avlaga.guilgeenuud",
                },
              },
              {
                $match: {
                  "avlaga.guilgeenuud.ognoo": {
                    $gte: new Date(req.body.ekhlekhOgnoo),
                    $lt: new Date(req.body.nekhemjlekhAvakhOgnoo),
                  },
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
              },
              {
                $group: {
                  _id: "$gereeniiDugaar",
                  tulsun: {
                    $sum: {
                      $ifNull: ["$avlaga.guilgeenuud.tulsunDun", 0],
                    },
                  },
                },
              },
              {
                $project: {
                  gereeniiDugaar: "$gereeniiDugaar",
                  uldegdel: "$tulsun",
                },
              },
            ],
            umnukhSariinTulsun: [
              {
                $unwind: {
                  path: "$avlaga.guilgeenuud",
                },
              },
              {
                $match: {
                  "avlaga.guilgeenuud.ognoo": {
                    $lt: new Date(req.body.nekhemjlekhAvakhOgnoo),
                  },
                  $or: [
                    {
                      "avlaga.guilgeenuud.turul": {
                        $nin: ["baritsaa"],
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
                  _id: "$gereeniiDugaar",
                  tulsun: {
                    $sum: {
                      $ifNull: ["$avlaga.guilgeenuud.tulsunDun", 0],
                    },
                  },
                },
              },
              {
                $project: {
                  gereeniiDugaar: "$gereeniiDugaar",
                  uldegdel: "$tulsun",
                },
              },
            ],
            umnukhSariinUrTulbur: [
              {
                $unwind: {
                  path: "$avlaga.guilgeenuud",
                },
              },
              {
                $match: {
                  "avlaga.guilgeenuud.turul": {
                    $nin: ["baritsaa"],
                  },
                  "avlaga.guilgeenuud.ognoo": {
                    $lt: new Date(req.body.ekhlekhOgnoo),
                  },
                },
              },
              {
                $group: {
                  _id: "$gereeniiDugaar",
                  tulukh: {
                    $sum: {
                      $ifNull: ["$avlaga.guilgeenuud.tulukhDun", 0],
                    },
                  },
                  khyamdral: {
                    $sum: {
                      $ifNull: ["$avlaga.guilgeenuud.khyamdral", 0],
                    },
                  },
                },
              },
              {
                $project: {
                  gereeniiDugaar: "$gereeniiDugaar",
                  uldegdel: {
                    $subtract: ["$tulukh", "$khyamdral"],
                  },
                },
              },
            ],
            niitUldegdel: [
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
                        $nin: ["baritsaa"],
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
                  "avlaga.guilgeenuud.ognoo": {
                    $lte: new Date(req.body.duusakhOgnoo),
                  },
                },
              },
              {
                $group: {
                  _id: "$gereeniiDugaar",
                  tulukh: {
                    $sum: {
                      $ifNull: ["$avlaga.guilgeenuud.tulukhDun", 0],
                    },
                  },
                  khyamdral: {
                    $sum: {
                      $ifNull: ["$avlaga.guilgeenuud.khyamdral", 0],
                    },
                  },
                  tulsun: {
                    $sum: {
                      $ifNull: ["$avlaga.guilgeenuud.tulsunDun", 0],
                    },
                  },
                },
              },
              {
                $project: {
                  gereeniiDugaar: "$gereeniiDugaar",
                  uldegdel: {
                    $subtract: [
                      "$tulukh",
                      {
                        $sum: ["$tulsun", "$khyamdral"],
                      },
                    ],
                  },
                },
              },
            ],
            eneSardTulukhDun: [
              {
                $match: {
                  "avlaga.guilgeenuud.ognoo": {
                    $lte: new Date(req.body.duusakhOgnoo),
                    $gte: new Date(req.body.ekhlekhOgnoo),
                  },
                },
              },
              {
                $group: {
                  _id: "$gereeniiDugaar",
                  tulukh: {
                    $sum: {
                      $ifNull: ["$avlaga.guilgeenuud.tulukhDun", 0],
                    },
                  },
                  khyamdral: {
                    $sum: {
                      $ifNull: ["$avlaga.guilgeenuud.khyamdral", 0],
                    },
                  },
                },
              },
              {
                $project: {
                  gereeniiDugaar: "$gereeniiDugaar",
                  uldegdel: {
                    $subtract: ["$tulukh", "$khyamdral"],
                  },
                },
              },
            ],
            nekhemjlekhDeerGarakh: [
              {
                $match: {
                  "avlaga.guilgeenuud.ognoo": {
                    $lte: new Date(req.body.duusakhOgnoo),
                    $gte: new Date(req.body.ekhlekhOgnoo),
                  },
                  "avlaga.guilgeenuud.nekhemjlekhDeerKharagdakh": true,
                },
              },
              {
                $project: {
                  gereeniiDugaar: "$gereeniiDugaar",
                  avlaga: "$avlaga.guilgeenuud",
                },
              },
              {
                $group: {
                  _id: "$gereeniiDugaar",
                  guilgeenuud: {
                    $push: "$avlaga",
                  },
                },
              },
            ],
          },
        },
      ];
      var gereenuud = await Geree(
        req.body.tukhainBaaziinKholbolt,
        true
      ).aggregate(query);
      res.send(gereenuud);
    } catch (error) {
      next(error);
    }
  });

router
  .route("/gereeTulukhDunteiAvya")
  .post(tokenShalgakh, async (req, res, next) => {
    try {
      const body = req.body.query;
      if (!!body?.khuudasniiDugaar)
        body.khuudasniiDugaar = Number(body.khuudasniiDugaar);
      if (!!body?.khuudasniiKhemjee)
        body.khuudasniiKhemjee = Number(body.khuudasniiKhemjee);
      if (!!body?.search) body.search = String(body.search);

      body.lean = true;
      khuudaslalt(Geree(req.body.tukhainBaaziinKholbolt, true), body)
        .then(async (result) => {
          if (result && result.jagsaalt && result.jagsaalt.length > 0) {
            var idnuud = [];
            result.jagsaalt.forEach((a) => idnuud.push(a._id));
            var query = [
              {
                $match: {
                  baiguullagiinId: req.body.baiguullagiinId,
                  barilgiinId: req.body.barilgiinId,
                  _id: { $in: idnuud },
                },
              },
              {
                $unwind: {
                  path: "$avlaga.guilgeenuud",
                },
              },
              {
                $facet: {
                  khariltsagch: [
                    {
                      $lookup: {
                        from: "khariltsagch",
                        let: {
                          register: "$register",
                          baiguullagiinId: "$baiguullagiinId",
                          barilgiinId: "$barilgiinId",
                        },
                        pipeline: [
                          {
                            $match: {
                              $expr: {
                                $and: [
                                  { $eq: ["$register", "$$register"] },
                                  {
                                    $eq: [
                                      "$baiguullagiinId",
                                      "$$baiguullagiinId",
                                    ],
                                  },
                                  { $eq: ["$barilgiinId", "$$barilgiinId"] },
                                ],
                              },
                            },
                          },
                        ],
                        as: "khariltsagch",
                      },
                    },
                    {
                      $set: {
                        token: {
                          $arrayElemAt: ["$khariltsagch.firebaseToken", 0],
                        },
                        khariltsagchiinId: {
                          $arrayElemAt: ["$khariltsagch._id", 0],
                        },
                        register: {
                          $arrayElemAt: ["$khariltsagch.register", 0],
                        },
                      },
                    },
                    {
                      $project: {
                        khariltsagchiinId: 1,
                        token: 1,
                        register: 1,
                      },
                    },
                  ],
                  umnukhSariinUrTulbur: [
                    {
                      $match: {
                        "avlaga.guilgeenuud.ognoo": {
                          $lt: new Date(req.body.ekhlekhOgnoo),
                        },
                      },
                    },
                    {
                      $group: {
                        _id: "$gereeniiDugaar",
                        tulukh: {
                          $sum: "$avlaga.guilgeenuud.tulukhDun",
                        },
                        khyamdral: {
                          $sum: "$avlaga.guilgeenuud.khyamdral",
                        },
                        tulsun: {
                          $sum: "$avlaga.guilgeenuud.tulsunDun",
                        },
                      },
                    },
                    {
                      $project: {
                        gereeniiDugaar: "$gereeniiDugaar",
                        uldegdel: {
                          $subtract: [
                            "$tulukh",
                            {
                              $sum: ["$tulsun", "$khyamdral"],
                            },
                          ],
                        },
                      },
                    },
                  ],
                  niitUldegdel: [
                    {
                      $match: {
                        "avlaga.guilgeenuud.ognoo": {
                          $lte: new Date(req.body.duusakhOgnoo),
                        },
                      },
                    },
                    {
                      $group: {
                        _id: "$gereeniiDugaar",
                        tulukh: {
                          $sum: "$avlaga.guilgeenuud.tulukhDun",
                        },
                        khyamdral: {
                          $sum: "$avlaga.guilgeenuud.khyamdral",
                        },
                        tulsun: {
                          $sum: "$avlaga.guilgeenuud.tulsunDun",
                        },
                      },
                    },
                    {
                      $project: {
                        gereeniiDugaar: "$gereeniiDugaar",
                        uldegdel: {
                          $subtract: [
                            "$tulukh",
                            {
                              $sum: ["$tulsun", "$khyamdral"],
                            },
                          ],
                        },
                      },
                    },
                  ],
                  eneSardTulukhDun: [
                    {
                      $match: {
                        "avlaga.guilgeenuud.ognoo": {
                          $lte: new Date(req.body.duusakhOgnoo),
                          $gte: new Date(req.body.ekhlekhOgnoo),
                        },
                      },
                    },
                    {
                      $group: {
                        _id: "$gereeniiDugaar",
                        tulukh: {
                          $sum: "$avlaga.guilgeenuud.tulukhDun",
                        },
                        khyamdral: {
                          $sum: "$avlaga.guilgeenuud.khyamdral",
                        },
                      },
                    },
                    {
                      $project: {
                        gereeniiDugaar: "$gereeniiDugaar",
                        uldegdel: {
                          $subtract: ["$tulukh", "$khyamdral"],
                        },
                      },
                    },
                  ],
                },
              },
            ];
            var gereenuud = await Geree(
              req.body.tukhainBaaziinKholbolt,
              true
            ).aggregate(query);
            result.jagsaalt.forEach((x) => {
              x.eneSardTulukhDun =
                gereenuud[0].eneSardTulukhDun.find(
                  (a) => a._id == x.gereeniiDugaar
                )?.uldegdel || 0;
              x.umnukhSariinUrTulbur =
                gereenuud[0].umnukhSariinUrTulbur.find(
                  (a) => a._id == x.gereeniiDugaar
                )?.uldegdel || 0;
              x.niitUldegdel =
                gereenuud[0].niitUldegdel.find((a) => a._id == x.gereeniiDugaar)
                  ?.uldegdel || 0;
              x.khariltsagchiinId = gereenuud[0].khariltsagch.find(
                (a) => a.register == x.register
              )?.khariltsagchiinId;
              x.firebaseToken = gereenuud[0].khariltsagch.find(
                (a) => a.register == x.register
              )?.token;
              if (x.umnukhSariinUrTulbur < 0) x.umnukhSariinUrTulbur = 0;
              if (x.eneSardTulukhDun < 0) x.eneSardTulukhDun = 0;
              if (x.niitUldegdel < 0) x.niitUldegdel = 0;
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

async function turluurDunBugluy(
  jagsaalt,
  ekhlekhOgnoo,
  duusakhOgnoo,
  turul,
  tukhainBaaziinKholbolt
) {
  if (jagsaalt && jagsaalt.length > 0) {
    var idnuud = [];
    var matchQuery = {
      "avlaga.guilgeenuud.ognoo": {
        $lte: new Date(duusakhOgnoo),
        $gte: new Date(ekhlekhOgnoo),
      },
      "avlaga.guilgeenuud.turul": {
        $lte: new Date(duusakhOgnoo),
        $gte: new Date(ekhlekhOgnoo),
      },
    };
    var groupQuery = {
      _id: "$gereeniiDugaar",
    };

    if (turul == "voucher") {
      matchQuery["avlaga.guilgeenuud.turul"] = "voucher";
    } else
      matchQuery["avlaga.guilgeenuud.turul"] = {
        $nin: ["baritsaa", "aldangi", "zalruulga"],
      };

    if (turul == "khungulult") {
      matchQuery["avlaga.guilgeenuud.khyamdral"] = {
        $gt: 0,
      };
      groupQuery["khyamdral"] = {
        $sum: "$avlaga.guilgeenuud.khyamdral",
      };
    } else {
      matchQuery["avlaga.guilgeenuud.tulsunDun"] = {
        $gt: 0,
      };
      groupQuery["tulsun"] = {
        $sum: "$avlaga.guilgeenuud.tulsunDun",
      };
    }
    jagsaalt.forEach((a) => idnuud.push(a._id));
    var query = [
      {
        $match: {
          _id: { $in: idnuud },
        },
      },
      {
        $unwind: {
          path: "$avlaga.guilgeenuud",
        },
      },
      {
        $match: matchQuery,
      },
      {
        $group: groupQuery,
      },
    ];
    var gereenuud = await Geree(tukhainBaaziinKholbolt, true).aggregate(query);
    jagsaalt.forEach((x) => {
      if (turul == "voucher")
        x.voucherDun =
          gereenuud.find((a) => a._id == x.gereeniiDugaar)?.tulsun || 0;
      else if (turul == "khungulult")
        x.khungulult =
          gereenuud.find((a) => a._id == x.gereeniiDugaar)?.khyamdral || 0;
      else
        x.tulsunDun =
          gereenuud.find((a) => a._id == x.gereeniiDugaar)?.tulsun || 0;
    });
  }
  return jagsaalt;
}

router
  .route("/vouchertaiJagsaaltAvya/:ekhlekhOgnoo/:duusakhOgnoo")
  .get(tokenShalgakh, async (req, res, next) => {
    try {
      const body = req.query;
      if (!!body?.query) body.query = JSON.parse(body.query);
      if (!!body?.order) body.order = JSON.parse(body.order);
      if (!!body?.select) body.select = JSON.parse(body.select);
      if (!!body?.collation) body.collation = JSON.parse(body.collation);
      if (!!body?.khuudasniiDugaar)
        body.khuudasniiDugaar = Number(body.khuudasniiDugaar);
      if (!!body?.khuudasniiKhemjee)
        body.khuudasniiKhemjee = Number(body.khuudasniiKhemjee);
      if (!!body?.search) body.search = String(body.search);
      if (!body.query) body.query = {};
      body.query["avlaga.guilgeenuud"] = {
        $elemMatch: {
          ognoo: {
            $gte: new Date(req.params.ekhlekhOgnoo),
            $lte: new Date(req.params.duusakhOgnoo),
          },
          tulsunDun: {
            $gt: 0,
          },
          turul: "voucher",
        },
      };
      body.lean = true;
      khuudaslalt(Geree(req.body.tukhainBaaziinKholbolt, true), body)
        .then(async (result) => {
          butsaakhJagsaalt = await turluurDunBugluy(
            result.jagsaalt,
            req.params.ekhlekhOgnoo,
            req.params.duusakhOgnoo,
            "voucher",
            req.body.tukhainBaaziinKholbolt
          );
          res.send(result);
        })
        .catch((err) => {
          next(err);
        });
    } catch (error) {
      next(error);
    }
  });

router
  .route("/guitsetgelteiJagsaaltAvya/:ekhlekhOgnoo/:duusakhOgnoo")
  .get(tokenShalgakh, async (req, res, next) => {
    try {
      const body = req.query;
      if (!!body?.query) body.query = JSON.parse(body.query);
      if (!!body?.order) body.order = JSON.parse(body.order);
      if (!!body?.select) body.select = JSON.parse(body.select);
      if (!!body?.collation) body.collation = JSON.parse(body.collation);
      if (!!body?.khuudasniiDugaar)
        body.khuudasniiDugaar = Number(body.khuudasniiDugaar);
      if (!!body?.khuudasniiKhemjee)
        body.khuudasniiKhemjee = Number(body.khuudasniiKhemjee);
      if (!!body?.search) body.search = String(body.search);
      if (!body.query) body.query = {};
      body.query["avlaga.guilgeenuud"] = {
        $elemMatch: {
          ognoo: {
            $gte: new Date(req.params.ekhlekhOgnoo),
            $lte: new Date(req.params.duusakhOgnoo),
          },
          tulsunDun: {
            $gt: 0,
          },
          turul: {
            $nin: ["baritsaa", "aldangi", "zalruulga"],
          },
        },
      };
      body.lean = true;
      khuudaslalt(Geree(req.body.tukhainBaaziinKholbolt, true), body)
        .then(async (result) => {
          butsaakhJagsaalt = await turluurDunBugluy(
            result.jagsaalt,
            req.params.ekhlekhOgnoo,
            req.params.duusakhOgnoo,
            null,
            req.body.tukhainBaaziinKholbolt
          );
          res.send(result);
        })
        .catch((err) => {
          next(err);
        });
    } catch (error) {
      next(error);
    }
  });

router
  .route("/khungulultteiJagsaaltAvya/:ekhlekhOgnoo/:duusakhOgnoo")
  .get(tokenShalgakh, async (req, res, next) => {
    try {
      const body = req.query;
      if (!!body?.query) body.query = JSON.parse(body.query);
      if (!!body?.order) body.order = JSON.parse(body.order);
      if (!!body?.select) body.select = JSON.parse(body.select);
      if (!!body?.collation) body.collation = JSON.parse(body.collation);
      if (!!body?.khuudasniiDugaar)
        body.khuudasniiDugaar = Number(body.khuudasniiDugaar);
      if (!!body?.khuudasniiKhemjee)
        body.khuudasniiKhemjee = Number(body.khuudasniiKhemjee);
      if (!!body?.search) body.search = String(body.search);
      if (!body.query) body.query = {};
      body.query["avlaga.guilgeenuud"] = {
        $elemMatch: {
          ognoo: {
            $gte: new Date(req.params.ekhlekhOgnoo),
            $lte: new Date(req.params.duusakhOgnoo),
          },
          khyamdral: {
            $gt: 0,
          },
        },
      };
      body.query["tuluv"] = {
        $ne: -1,
      };
      body.lean = true;
      khuudaslalt(Geree(req.body.tukhainBaaziinKholbolt, true), body)
        .then(async (result) => {
          butsaakhJagsaalt = await turluurDunBugluy(
            result.jagsaalt,
            req.params.ekhlekhOgnoo,
            req.params.duusakhOgnoo,
            "khungulult",
            req.body.tukhainBaaziinKholbolt
          );
          res.send(result);
        })
        .catch((err) => {
          next(err);
        });
    } catch (error) {
      next(error);
    }
  });

router
  .route("/utasniiDugaaraarGereeAvya")
  .post(tokenShalgakh, async (req, res, next) => {
    try {
      var geree = await Geree(req.body.tukhainBaaziinKholbolt, true).findOne({
        utas: { $in: [req.body.utas] },
        baiguullagiinId: req.body.baiguullagiinId,
      });
      if (geree) res.send(geree);
      else res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  });

router
  .route("/eneSardTuluuguiGereenuudAvya")
  .post(tokenShalgakh, async (req, res, next) => {
    try {
      var query = [
        {
          $match: {
            baiguullagiinId: req.body.baiguullagiinId,
            barilgiinId: req.body.barilgiinId,
            tuluv: {
              $ne: -1,
            },
          },
        },
        {
          $unwind: {
            path: "$avlaga.guilgeenuud",
          },
        },
        {
          $facet: {
            niitUldegdel: [
              {
                $match: {
                  "avlaga.guilgeenuud.ognoo": {
                    $lte: new Date(req.body.duusakhOgnoo),
                  },
                  "avlaga.guilgeenuud.turul": {
                    $nin: ["baritsaa", "aldangi"],
                  },
                },
              },
              {
                $group: {
                  _id: "$gereeniiDugaar",
                  tulukh: {
                    $sum: {
                      $ifNull: ["$avlaga.guilgeenuud.tulukhDun", 0],
                    },
                  },
                  khyamdral: {
                    $sum: {
                      $ifNull: ["$avlaga.guilgeenuud.khyamdral", 0],
                    },
                  },
                  tulsun: {
                    $sum: {
                      $ifNull: ["$avlaga.guilgeenuud.tulsunDun", 0],
                    },
                  },
                },
              },
              {
                $project: {
                  gereeniiDugaar: "$gereeniiDugaar",
                  uldegdel: {
                    $subtract: [
                      "$tulukh",
                      {
                        $sum: ["$tulsun", "$khyamdral"],
                      },
                    ],
                  },
                },
              },
            ],
            tuluvluguut: [
              {
                $match: {
                  "avlaga.guilgeenuud.ognoo": {
                    $lte: new Date(req.body.duusakhOgnoo),
                    $gte: new Date(req.body.ekhlekhOgnoo),
                  },
                  "avlaga.guilgeenuud.turul": {
                    $nin: ["baritsaa", "aldangi"],
                  },
                },
              },
              {
                $group: {
                  _id: "$gereeniiDugaar",
                  tulukh: {
                    $sum: {
                      $ifNull: ["$avlaga.guilgeenuud.tulukhDun", 0],
                    },
                  },
                  khyamdral: {
                    $sum: {
                      $ifNull: ["$avlaga.guilgeenuud.khyamdral", 0],
                    },
                  },
                },
              },
              {
                $project: {
                  tulukh: {
                    $subtract: ["$tulukh", "$khyamdral"],
                  },
                },
              },
            ],
          },
        },
      ];
      var gereenuud = await Geree(
        req.body.tukhainBaaziinKholbolt,
        true
      ).aggregate(query);
      if (gereenuud.length < 0 || gereenuud[0].tuluvluguut.length < 1)
        res.send([]);
      else {
        var turJagsaalt = [];
        gereenuud[0].tuluvluguut.forEach((x) => {
          if (!x.tulsun || x.tulsun == 0) turJagsaalt.push(x._id);
        });
        const body = req.body.query;
        if (!!body?.khuudasniiDugaar)
          body.khuudasniiDugaar = Number(body.khuudasniiDugaar);
        if (!!body?.khuudasniiKhemjee)
          body.khuudasniiKhemjee = Number(body.khuudasniiKhemjee);
        if (!!body?.search) body.search = String(body.search);
        body.query["gereeniiDugaar"] = { $in: turJagsaalt };
        (body.query["tuluv"] = { $ne: -1 }), (body.lean = true);

        khuudaslalt(Geree(req.body.tukhainBaaziinKholbolt, true), body)
          .then((result) => {
            if (result && result.jagsaalt && result.jagsaalt.length > 0)
              result.jagsaalt.forEach((x) => {
                x.tuluvluguut =
                  gereenuud[0].tuluvluguut.find(
                    (a) => a._id == x.gereeniiDugaar
                  )?.tulukh || 0;
                x.niitUldegdel =
                  gereenuud[0].niitUldegdel.find(
                    (a) => a._id == x.gereeniiDugaar
                  )?.uldegdel || 0;
                if (x.tuluvluguut < 0) x.tuluvluguut = 0;
                if (x.niitUldegdel < 0) x.niitUldegdel = 0;
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

router
  .route("/eneSardTuluuguiGereeniiTooAvya")
  .post(tokenShalgakh, async (req, res, next) => {
    try {
      var query = [
        {
          $unwind: {
            path: "$avlaga.guilgeenuud",
          },
        },
        {
          $match: {
            baiguullagiinId: req.body.baiguullagiinId,
            barilgiinId: req.body.barilgiinId,
            tuluv: {
              $ne: -1,
            },
            "avlaga.guilgeenuud.ognoo": {
              $lte: new Date(req.body.duusakhOgnoo),
              $gte: new Date(req.body.ekhlekhOgnoo),
            },
          },
        },
        {
          $group: {
            _id: "$gereeniiDugaar",
            tulsun: {
              $sum: "$avlaga.guilgeenuud.tulsunDun",
            },
          },
        },
        {
          $match: {
            tulsun: 0,
          },
        },
        {
          $group: {
            _id: "aa",
            niit: {
              $sum: 1,
            },
          },
        },
      ];
      var gereenuud = await Geree(
        req.body.tukhainBaaziinKholbolt,
        true
      ).aggregate(query);
      tuluuguiToo = 0;
      if (gereenuud && gereenuud.length > 0) tuluuguiToo = gereenuud[0].niit;
      res.send({ too: tuluuguiToo });
    } catch (error) {
      next(error);
    }
  });

router
  .route("/zoloodDataGargajUgye")
  .post(tokenShalgakh, async (req, res, next) => {
    try {
      var ognoo = new Date(req.body.ognoo);
      const { db } = require("zevbackv2");
      var baiguullaga = await Baiguullaga(db.erunkhiiKholbolt).findById(
        req.body.baiguullagiinId
      );
      var gereenuud = await Geree(
        req.body.tukhainBaaziinKholbolt,
        true
      ).aggregate([
        {
          $match: {
            baiguullagiinId: req.body.baiguullagiinId,
            tuluv: 1,
          },
        },
        {
          $unwind: {
            path: "$avlaga.guilgeenuud",
          },
        },
        {
          $match: {
            "avlaga.guilgeenuud.ognoo": {
              $lte: ognoo,
            },
            "avlaga.guilgeenuud.turul": {
              $nin: ["baritsaa"],
            },
          },
        },
        {
          $group: {
            _id: {
              _id: "$_id",
              barilgiinId: "$barilgiinId",
              ner: "$ner",
              register: "$register",
              sariinTulbur: "$sariinTurees",
              zoriulalt: "$zoriulalt",
              davkhar: "$davkhar",
              talbai: "$talbainKhemjee",
              talbainDugaar: "$talbainDugaar",
              daraagiinTulukhOgnoo: "$daraagiinTulukhOgnoo",
            },
            tulukh: {
              $sum: "$avlaga.guilgeenuud.tulukhDun",
            },
            khyamdral: {
              $sum: "$avlaga.guilgeenuud.khyamdral",
            },
            tulsun: {
              $sum: "$avlaga.guilgeenuud.tulsunDun",
            },
          },
        },
        {
          $project: {
            barilgiinId: "$_id.barilgiinId",
            ner: "$_id.ner",
            register: "$_id.register",
            sariinTulbur: "$_id.sariinTulbur",
            zoriulalt: "$_id.zoriulalt",
            davkhar: "$_id.davkhar",
            talbai: "$_id.talbai",
            talbainDugaar: "$_id.talbainDugaar",
            daraagiinTulukhOgnoo: "$_id.daraagiinTulukhOgnoo",
            khugatsaaKhetersen: {
              $dateDiff: {
                startDate: "$_id.daraagiinTulukhOgnoo",
                endDate: ognoo,
                unit: "day",
              },
            },
            uldegdel: {
              $subtract: [
                "$tulukh",
                {
                  $sum: ["$tulsun", "$khyamdral"],
                },
              ],
            },
          },
        },
      ]);
      for await (const a of gereenuud) {
        try {
          delete a._id;
          if (a.khugatsaaKhetersen < 0) a.khugatsaaKhetersen = 0;
          if (a.uldegdel < 0) a.uldegdel = 0;
          a.barilgiinNer = baiguullaga.barilguud.find(
            (x) => x._id == a.barilgiinId
          ).ner;
        } catch (aldaa) {}
      }
      res.send(gereenuud);
    } catch (error) {
      if (!!next) next(err);
    }
  });

router.route("/testKhiie").post(async (req, res, next) => {
  res.sendStatus(200);
});

router.route("/msgKhucheerIlgeeye").post(async (req, res, next) => {
  const { orlogiinMsgIlgeeye } = require("../controller/ajiltan");
  orlogiinMsgIlgeeye(req.body.tsag, req.body.id);
  res.sendStatus(200);
});

router.route("/dulaanZasya").get(tokenShalgakh, async (req, res, next) => {
  try {
    var match = {
      "avlaga.guilgeenuud.tailbar": "Дулааны төлбөр",
      baiguullagiinId: req.body.baiguullagiinId,
      barilgiinId: req.body.barilgiinId,
    };
    if (!!req.body.gereeniiDugaar)
      match["gereeniiDugaar"] = req.body.gereeniiDugaar;
    var gereenuud = await Geree(req.body.tukhainBaaziinKholbolt, true)
      .find(match)
      .select("+avlaga");
    var khariu = [];
    if (gereenuud?.length > 0) {
      for (const geree of gereenuud) {
        var tariff = geree.zardluud.filter((c) => c.ner === "Дулаан")[0].tariff;
        var filterDulaan = geree.avlaga?.guilgeenuud?.filter(
          (a) => a.tailbar === "Дулааны төлбөр"
        );
        if (filterDulaan?.length > 0) {
          var objt = [];
          for (const avlagaDulaan of filterDulaan) {
            var object = {
              tulukhDun: (geree.talbainKhemjeeMetrKube * tariff).toFixed(2),
              ognoo: avlagaDulaan.ognoo,
              negj: geree.talbainKhemjeeMetrKube,
              tariff: tariff,
              tailbar: "Дулаан",
              turul: avlagaDulaan.turul,
            };
            objt.push(object);
          }
        }
        await Geree(req.body.tukhainBaaziinKholbolt)
          .updateOne(
            { gereeniiDugaar: geree.gereeniiDugaar, tuluv: 1 },
            {
              $push: {
                ["avlaga.guilgeenuud"]: objt,
              },
            }
          )
          .then(async (result) => {
            khariu.push(result);
          });
      }
    }
    res.send(khariu);
  } catch (err) {
    next(err);
  }
});

router.route("/talbaiZasayNiit").get(tokenShalgakh, async (req, res, next) => {
  try {
    var talbainuud = await Talbai(req.body.tukhainBaaziinKholbolt).find({
      baiguullagiinId: req.body.baiguullagiinId,
      barilgiinId: req.body.barilgiinId,
    });
    var talbainBulk = [];
    for await (const talbai of talbainuud) {
      var niitUne = talbai.talbainKhemjee * talbai.talbainNegjUne;
      let upsertTalbai = {
        updateOne: {
          filter: {
            _id: talbai._id,
            baiguullagiinId: req.body.baiguullagiinId,
            barilgiinId: req.body.barilgiinId,
          },
          update: {
            talbainNiitUne: niitUne,
            tureesiinTulbur: niitUne,
          },
        },
      };
      talbainBulk.push(upsertTalbai);
    }
    if (talbainBulk)
      Talbai(req.body.tukhainBaaziinKholbolt)
        .bulkWrite(talbainBulk)
        .then((bulkWriteOpResult) => {})
        .catch((err) => {
          next(err);
        });
    res.send(talbainBulk);
  } catch (err) {
    next(err);
  }
});

router.route("/khungulultZasya").get(tokenShalgakh, async (req, res, next) => {
  try {
    const session =
      await req.body.tukhainBaaziinKholbolt.kholbolt.startSession();
    session.startTransaction();
    try {
      var khungulult = await KhungulultiinTuukh(
        req.body.tukhainBaaziinKholbolt
      ).find({
        baiguullagiinId: req.body.baiguullagiinId,
        barilgiinId: req.body.barilgiinId,
      });
      gereeniiDugaaruud = [];
      for (const x of khungulult) {
        x.khamaataiGereenuud.forEach((x) => {
          if (typeof x === "object") {
            gereeniiDugaaruud.push(x.gereeniiId);
          } else {
            gereeniiDugaaruud.push(x);
          }
        });
      }
      var gereenuud = await Geree(req.body.tukhainBaaziinKholbolt, true)
        .find({
          _id: { $in: gereeniiDugaaruud },
        })
        .select("+avlaga");
      for await (const geree of gereenuud) {
        khyamdraluud = [];
        for (const x of khungulult) {
          var khungulultiinDun = x.khamaataiGereenuud?.find(
            (x) => x.gereeniiId == geree._id
          )?.khymdarsanDun;
          if (khungulultiinDun > 0) {
            for await (const ognoo of x.ognoonuud) {
              var filterGuilgeenuud = geree.avlaga?.guilgeenuud.filter(
                (a) =>
                  a.turul === "khuvaari" &&
                  moment(a.ognoo).format("YYYY/MM") ===
                    moment(ognoo).format("YYYY/MM")
              );
              if (filterGuilgeenuud?.length > 0) {
                khyamdral = {
                  tulukhDun: 0,
                  ognoo: filterGuilgeenuud[0].ognoo,
                  turul: "khungulult",
                  khyamdral: khungulultiinDun,
                  nemeltTailbar: x.shaltgaan,
                  tailbar: "Түрээс",
                  khyamdraliinId: x._id,
                  guilgeeKhiisenOgnoo: new Date(),
                  guilgeeKhiisenAjiltniiNer: x.guilgeeKhiisenAjiltniiNer,
                  guilgeeKhiisenAjiltniiId: x.guilgeeKhiisenAjiltniiId,
                };
                khyamdraluud.push(khyamdral);
              }
            }
          }
        }
        await Geree(req.body.tukhainBaaziinKholbolt).updateOne(
          { _id: geree._id },
          { $push: { "avlaga.guilgeenuud": { $each: khyamdraluud } } }
        );
      }
      await session.commitTransaction();
      session.endSession();
      res.send("Amjilttai");
    } catch (err1) {
      await session.abortTransaction();
      next(err1);
    }
  } catch (err) {
    next(err);
  }
});

router.route("/gereeUneZasya").post(tokenShalgakh, async (req, res, next) => {
  var oldGeree = await testgeree(req.body.tukhainBaaziinKholbolt)
    .find({
      baiguullagiinId: req.body.baiguullagiinId,
      barilgiinId: req.body.barilgiinId,
      gereeniiDugaar: req.body.gereeniiDugaarOld,
      //tuluv: { $ne: -1 }
    })
    .select("+avlaga");
  if (oldGeree?.length > 0) {
    if (req.body.baritsaaInsert && oldGeree[0]?.avlaga?.baritsaa?.length > 0) {
      await Geree(req.body.tukhainBaaziinKholbolt).updateOne(
        {
          baiguullagiinId: req.body.baiguullagiinId,
          barilgiinId: req.body.barilgiinId,
          gereeniiDugaar: req.body.gereeniiDugaar,
          tuluv: { $ne: -1 },
        },
        {
          $push: {
            "avlaga.baritsaa": { $each: oldGeree[0]?.avlaga?.baritsaa },
          },
        }
      );
    }
    var tempGeree = oldGeree[0]?.avlaga?.guilgeenuud.filter(
      (e) =>
        e.turul !== "khuvaari" &&
        e.ognoo <
          new Date(moment(req.body.ekhlekhOgnoo).format("YYYY-MM-DD 23:59:59"))
    );
    if (tempGeree?.length > 0) {
      await Geree(req.body.tukhainBaaziinKholbolt).findOneAndUpdate(
        {
          baiguullagiinId: req.body.baiguullagiinId,
          barilgiinId: req.body.barilgiinId,
          gereeniiDugaar: req.body.gereeniiDugaar,
          tuluv: { $ne: -1 },
        },
        {
          $pull: {
            "avlaga.guilgeenuud": {
              turul: { $ne: "khuvaari" },
              ognoo: {
                $lt: new Date(
                  moment(req.body.ekhlekhOgnoo).format("YYYY-MM-DD 23:59:59")
                ),
              },
            },
          },
        }
      );
      await Geree(req.body.tukhainBaaziinKholbolt).updateOne(
        {
          baiguullagiinId: req.body.baiguullagiinId,
          barilgiinId: req.body.barilgiinId,
          gereeniiDugaar: req.body.gereeniiDugaar,
          tuluv: { $ne: -1 },
        },
        { $push: { "avlaga.guilgeenuud": { $each: tempGeree } } }
      );
    }
    var tempGeree1 = oldGeree[0]?.avlaga?.guilgeenuud.filter(
      (e) =>
        e.turul === "khuvaari" &&
        e.ognoo <
          new Date(moment(req.body.khuvaariOgnoo).format("YYYY-MM-DD 23:59:59"))
    );
    if (tempGeree1?.length > 0) {
      await Geree(req.body.tukhainBaaziinKholbolt).findOneAndUpdate(
        {
          baiguullagiinId: req.body.baiguullagiinId,
          barilgiinId: req.body.barilgiinId,
          gereeniiDugaar: req.body.gereeniiDugaar,
          tuluv: { $ne: -1 },
        },
        {
          $pull: {
            "avlaga.guilgeenuud": {
              turul: "khuvaari",
              ognoo: {
                $lt: new Date(
                  moment(req.body.khuvaariOgnoo).format("YYYY-MM-DD 23:59:59")
                ),
              },
            },
          },
        }
      );
      await Geree(req.body.tukhainBaaziinKholbolt).updateOne(
        {
          baiguullagiinId: req.body.baiguullagiinId,
          barilgiinId: req.body.barilgiinId,
          gereeniiDugaar: req.body.gereeniiDugaar,
          tuluv: { $ne: -1 },
        },
        { $push: { "avlaga.guilgeenuud": { $each: tempGeree1 } } }
      );
    }
    res.send("Amjilttai");
  } else res.send("Amjiltgui");
});

router
  .route("/garaasTuluvUurchluyZasya")
  .post(tokenShalgakh, async (req, res, next) => {
    var gereenuud = await Geree(req.body.tukhainBaaziinKholbolt, true).find({
      tuluv: 1,
    });
    if (gereenuud?.length > 0) {
      for await (const geree of gereenuud) {
        talbaiKhariltsagchiinTuluvUurchluy(
          [geree._id],
          req.body.tukhainBaaziinKholbolt
        );
      }
    }
    res.send("Amjilttai");
  });
router
  .route("/tooluurMedeelelTatya")
  .post(tokenShalgakh, async (req, res, next) => {
    try {
      var talbainuud = await Talbai(req.body.tukhainBaaziinKholbolt).find({
        tooluuriinDugaar: { $exists: true },
      });
      const crypto = require("crypto");
      if (talbainuud != null && talbainuud.length > 0) {
        var talbainDugaaruud = [];
        var tooluuriinDugaaruud = "";
        var tatakhOgnoo = new Date(req.body.ognoo);
        talbainuud.forEach((a) => {
          tooluuriinDugaaruud = tooluuriinDugaaruud + a.tooluuriinDugaar + ",";
          talbainDugaaruud.push(a.kod);
        });
        tooluuriinDugaaruud = tooluuriinDugaaruud.slice(0, -1);
        //talbainDugaaruud = "241008002701,241008002702,241008002703";
        var key1 = "Ski452Doodjfqef".padEnd(32, "\0");
        const iv = "1MMNT20240126ECM"; // 16 bytes
        function encrypt(plainText) {
          const cipher = crypto.createCipheriv(
            "aes-256-cbc",
            Buffer.from(key1, "utf8"),
            Buffer.from(iv, "utf8")
          );
          let encrypted = cipher.update(plainText, "utf8", "hex");
          encrypted += cipher.final("hex");
          return encrypted;
        }
        function getFormattedDate(mode, ognoo) {
          const now = ognoo;

          const year = now.getFullYear();
          const month = String(now.getMonth() + 1).padStart(2, "0");
          const day = String(now.getDate()).padStart(2, "0");
          const hour = String(now.getHours()).padStart(2, "0");

          if (mode === 1) {
            return `${year}${month}${day}${hour}`;
          } else if (mode === 2) {
            return `${year}-${month}-${day}`;
          }
        }
        var xariu = await encrypt(getFormattedDate(1, new Date()));
        var dateFormatted = getFormattedDate(2, tatakhOgnoo);
        const axios = require("axios");
        let config = {
          method: "get",
          maxBodyLength: Infinity,
          url:
            "http://66.181.165.175:56033/service.ashx?name=energy&apikey=" +
            xariu +
            "&numbers=" +
            tooluuriinDugaaruud +
            "&date=" +
            dateFormatted +
            "&token=oivcf4e0h4u03Mao8w8Db80mDG44u1OAKgEgwl8SLYXKkIwmjp",
          headers: {},
        };

        var khariu = await axios.request(config).catch((error) => {
          throw new Error(error.message);
        });
        butsaakhJagsaalt = [];
        var niitGereenuud = await Geree(req.body.tukhainBaaziinKholbolt, true)
          .find({
            talbainDugaar: { $in: talbainDugaaruud },
            tuluv: 1,
          })
          .select("+avlaga");
        talbainuud.forEach((x) => {
          var tukhainMur = khariu.data.find(
            (a) => a.meter_id == x.tooluuriinDugaar
          );
          if (!!tukhainMur) {
            var umnukhZaalt = 0;
            var guidliinKoep = 1;
            var geree = niitGereenuud.find((a) => a.talbainDugaar == x.kod);
            if (!!geree) {
              var suuliinGuilgee = geree.avlaga.guilgeenuud.filter((x) => {
                return x.tailbar?.includes("Цахилгаан");
              });
              if (!!suuliinGuilgee && suuliinGuilgee.length > 0) {
                suuliinGuilgee = lodash.orderBy(
                  suuliinGuilgee,
                  ["ognoo"],
                  ["asc"]
                );
                suuliinGuilgee = suuliinGuilgee[suuliinGuilgee.length - 1];
              }
              if (!!suuliinGuilgee?.suuliinZaalt)
                umnukhZaalt = suuliinGuilgee.suuliinZaalt;
              if (!!suuliinGuilgee?.guidliinKoep)
                guidliinKoep = suuliinGuilgee.guidliinKoep;
            }
            butsaakhJagsaalt.push({
              talbainId: x._id,
              talbainDugaar: x.kod,
              tooluuriinDugaar: x.tooluuriinDugaar,
              suuliinZaalt: tukhainMur.tariffs,
              guidliinKoep,
              umnukhZaalt,
            });
          }
        });
        res.send(butsaakhJagsaalt);
      } else {
        throw new Error("Талбайн мэдээлэл олдсонгүй!");
      }
    } catch (err) {
      next(err);
    }
  });

router
  .route("/zaaltOlnoorOruulya")
  .post(tokenShalgakh, async (req, res, next) => {
    try {
      const { db } = require("zevbackv2");
      var baiguullaga = await Baiguullaga(db.erunkhiiKholbolt).findById(
        req.body.baiguullagiinId
      );
      var ashiglaltiinZardal = await AshiglaltiinZardluud(
        req.body.tukhainBaaziinKholbolt
      ).findById(req.body.ashiglaltiinId);
      const jagsaalt = req.body.jagsaalt;
      var talbainDugaaruud = [];
      for await (const mur of jagsaalt) {
        talbainDugaaruud.push(mur.talbainId);
      }
      var niitGereenuud = [];
      var oldooguiGeree = [];
      var aldaaniiMsg = "";
      if (talbainDugaaruud.length > 0) {
        gereenuud = await Geree(req.body.tukhainBaaziinKholbolt, true)
          .find({
            talbainIdnuud: { $in: talbainDugaaruud },
            barilgiinId: req.body.barilgiinId,
            tuluv: 1,
          })
          .select("+avlaga");
        if (!!gereenuud) {
          oldooguiGeree = [];
          talbainDugaaruud.forEach((a) => {
            var oldsonGeree = gereenuud.find((b) =>
              b.talbainIdnuud.includes(a)
            );
            if (!oldsonGeree)
              oldooguiGeree.push(
                jagsaalt.find((x) => x.talbainId == a).talbainDugaar
              );
          });
          if (oldooguiGeree.length > 0) {
            aldaaniiMsg =
              aldaaniiMsg +
              " Дараах талбайн дугаартай гэрээнүүд олдсонгүй! " +
              oldooguiGeree.toString();
          } else niitGereenuud.push(...gereenuud);
        }
      }
      var bulkOps = [];
      var updateObject;
      if (niitGereenuud.length > 0) {
        for await (const tukhainZardal of jagsaalt) {
          var geree = niitGereenuud.find((x) =>
            x.talbainIdnuud.includes(tukhainZardal.talbainId)
          );
          updateObject = {};
          if (
            ashiglaltiinZardal.turul == "кВт" ||
            ashiglaltiinZardal.turul == "1м3" ||
            ashiglaltiinZardal.turul === "кг"
          ) {
            var umnukhZaalt = 0;
            var suuliinGuilgee = geree.avlaga.guilgeenuud.filter((x) => {
              return (
                x.khemjikhNegj == ashiglaltiinZardal.turul &&
                x.tailbar == ashiglaltiinZardal.ner &&
                (!x.tooluuriinDugaar ||
                  tukhainZardal.tooluuriinDugaar == x.tooluuriinDugaar)
              );
            });
            if (!!suuliinGuilgee && suuliinGuilgee.length > 0) {
              suuliinGuilgee = lodash.orderBy(
                suuliinGuilgee,
                ["ognoo"],
                ["asc"]
              );
              suuliinGuilgee = suuliinGuilgee[suuliinGuilgee.length - 1];
            }
            if (!!suuliinGuilgee?.suuliinZaalt) {
              umnukhZaalt = suuliinGuilgee.suuliinZaalt;
            }
          }
          var zoruuDun = tukhainZardal.suuliinZaalt - umnukhZaalt;
          var tsakhilgaanDun = 0;
          var tsakhilgaanKBTST = 0;
          var chadalDun = 0;
          var tsekhDun = 0;
          var sekhDemjikhTulburDun = 0;
          if (baiguullaga?.tokhirgoo?.guidelBuchiltKhonogEsekh) {
            tsakhilgaanKBTST =
              zoruuDun *
              (ashiglaltiinZardal.tsakhilgaanUrjver || 1) *
              (tukhainZardal.guidliinKoep || 1);
            chadalDun =
              baiguullaga?.tokhirgoo?.bichiltKhonog > 0 && tsakhilgaanKBTST > 0
                ? (tsakhilgaanKBTST /
                    baiguullaga?.tokhirgoo?.bichiltKhonog /
                    12) *
                  (req.body.baiguullagiinId === "679aea9032299b7ba8462a77"
                    ? 11520
                    : 15500)
                : 0;
            tsekhDun = ashiglaltiinZardal.tariff * tsakhilgaanKBTST;
            if (baiguullaga?.tokhirgoo?.sekhDemjikhTulburAvakhEsekh) {
              // URANGAN iknayd
              sekhDemjikhTulburDun =
                zoruuDun * (ashiglaltiinZardal.tsakhilgaanUrjver || 1) * 23.79;
              tsakhilgaanDun = chadalDun + tsekhDun + sekhDemjikhTulburDun;
            } else tsakhilgaanDun = chadalDun + tsekhDun;
          } else
            tsakhilgaanDun =
              ashiglaltiinZardal.tariff *
              (ashiglaltiinZardal.tsakhilgaanUrjver || 1) *
              (zoruuDun || 0);
          var tempDun =
            (ashiglaltiinZardal.ner?.includes("Хүйтэн ус") ||
              ashiglaltiinZardal.ner?.includes("Халуун ус")) &&
            ashiglaltiinZardal.bodokhArga === "Khatuu"
              ? ashiglaltiinZardal.tseverUsDun * zoruuDun +
                ashiglaltiinZardal.bokhirUsDun * zoruuDun +
                (ashiglaltiinZardal.ner?.includes("Халуун ус")
                  ? ashiglaltiinZardal.usKhalaasniiDun * zoruuDun
                  : 0)
              : tsakhilgaanDun;
          updateObject = {
            turul: "avlaga",
            tulsunDun: 0,
            tulukhDun: !!req.body.nuatBodokhEsekh
              ? ((ashiglaltiinZardal.suuriKhuraamj || 0) + tempDun) * 1.1
              : (ashiglaltiinZardal.suuriKhuraamj || 0) + tempDun,
            negj: zoruuDun && zoruuDun,
            khemjikhNegj: ashiglaltiinZardal.turul,
            tariff: ashiglaltiinZardal.tariff,
            tseverUsDun: ashiglaltiinZardal.tseverUsDun * zoruuDun || 0,
            bokhirUsDun: ashiglaltiinZardal.bokhirUsDun * zoruuDun || 0,
            usKhalaasanDun: ashiglaltiinZardal.ner?.includes("Халуун ус")
              ? ashiglaltiinZardal.usKhalaasniiDun * zoruuDun
              : 0,
            suuriKhuraamj: ashiglaltiinZardal.suuriKhuraamj || 0,
            tsakhilgaanUrjver: ashiglaltiinZardal.tsakhilgaanUrjver || 1,
            tsakhilgaanKBTST: tsakhilgaanKBTST || 0,
            guidliinKoep: tukhainZardal.guidliinKoep || 0,
            bichiltKhonog: baiguullaga?.tokhirgoo?.bichiltKhonog || 0,
            chadalDun: chadalDun || 0,
            tsekhDun: tsekhDun || 0,
            sekhDemjikhTulburDun: sekhDemjikhTulburDun || 0,
            ognoo: tukhainZardal.ognoo,
            gereeniiId: geree._id,
            tailbar: ashiglaltiinZardal.ner,
            nuatBodokhEsekh: req.body.nuatBodokhEsekh,
            tooluuriinDugaar: tukhainZardal.tooluuriinDugaar,
          };
          if (
            ashiglaltiinZardal.turul === "кВт" ||
            ashiglaltiinZardal.turul === "1м3" ||
            ashiglaltiinZardal.turul === "кг"
          ) {
            updateObject["suuliinZaalt"] = tukhainZardal.suuliinZaalt;
            updateObject["umnukhZaalt"] = umnukhZaalt;
          }
          updateObject["guilgeeKhiisenOgnoo"] = new Date();
          if (req.body.nevtersenAjiltniiToken) {
            updateObject["guilgeeKhiisenAjiltniiNer"] =
              req.body.nevtersenAjiltniiToken.ner;
            updateObject["guilgeeKhiisenAjiltniiId"] =
              req.body.nevtersenAjiltniiToken.id;
          }
          tukhainZardal.gereeniiId = geree._id;
          tukhainZardal.zoruu = ashiglaltiinZardal.zoruuDun;
          tukhainZardal.niitDun = tempDun;
          if (updateObject.tulukhDun > 0) {
            let upsertDoc = {
              updateOne: {
                filter: { _id: geree._id },
                update: {
                  $push: {
                    "avlaga.guilgeenuud": updateObject,
                  },
                },
              },
            };
            bulkOps.push(upsertDoc);
          }
        }
      }
      if (aldaaniiMsg) throw new Error(aldaaniiMsg);
      if (bulkOps && bulkOps.length > 0)
        await Geree(req.body.tukhainBaaziinKholbolt)
          .bulkWrite(bulkOps)
          .then((bulkWriteOpResult) => {
            AshiglaltiinExcel(req.body.tukhainBaaziinKholbolt).insertMany(
              jagsaalt
            );
            res.status(200).send("Amjilttai");
          })
          .catch((err) => {
            next(err);
          });
    } catch (err) {
      next(err);
    }
  });

router.route("/zaaltTegBolgoy").post(tokenShalgakh, async (req, res, next) => {
  try {
    var match = {
      baiguullagiinId: req.body.baiguullagiinId,
      barilgiinId: req.body.barilgiinId,
    };
    if (!!req.body.gereeniiDugaar)
      match["gereeniiDugaar"] = req.body.gereeniiDugaar;
    var gereenuud = await Geree(req.body.tukhainBaaziinKholbolt, true)
      .find(match)
      .select("+avlaga");
    if (gereenuud?.length > 0) {
      for await (const geree of gereenuud) {
        var lastAvlaga = geree?.avlaga?.guilgeenuud.filter(
          (a) =>
            a.ognoo < new Date(req.body.ognoo) &&
            a.tailbar === "Цахилгаан" &&
            a.turul === "avlaga" &&
            a.suuliinZaalt >= 0
        );
        if (!!lastAvlaga && lastAvlaga?.length > 0) {
          lastAvlaga = lodash.orderBy(lastAvlaga, ["ognoo"], ["desc"]);
          lastAvlaga = lastAvlaga[0];
        }
        if (!!lastAvlaga && lastAvlaga?._id) {
          var avlagaMatch = { _id: lastAvlaga?._id };
          await Geree(req.body.tukhainBaaziinKholbolt).findByIdAndUpdate(
            { _id: geree?._id },
            {
              $pull: { "avlaga.guilgeenuud": avlagaMatch },
            }
          );
          lastAvlaga.suuliinZaalt = 0;
          await Geree(req.body.tukhainBaaziinKholbolt).findByIdAndUpdate(
            { _id: geree?._id },
            {
              $push: { "avlaga.guilgeenuud": lastAvlaga },
            }
          );
        }
      }
    }
    res.send("Amjilttai");
  } catch (err) {
    next(err);
  }
});
router
  .route("/baritsaaOlnoorOruulakh")
  .post(tokenShalgakh, async (req, res, next) => {
    try {
      var match = {
        baiguullagiinId: req.body.baiguullagiinId,
        barilgiinId: req.body.barilgiinId,
        "avlaga.baritsaa": [],
      };
      if (!!req.body.gereeniiDugaar)
        match["gereeniiDugaar"] = req.body.gereeniiDugaar;
      var gereenuud = await Geree(req.body.tukhainBaaziinKholbolt, true)
        .find(match)
        .select("+avlaga");
      if (gereenuud?.length > 0) {
        for await (const geree of gereenuud) {
          var dun =
            (geree.baritsaaAvakhDun || 0) - (geree.baritsaaniiUldegdel || 0);
          var baritsaa = {
            ognoo: geree.gereeniiOgnoo,
            orlogo: dun,
            zarlaga: 0,
            tailbar: "",
            guilgeeKhiisenOgnoo: new Date(),
            guilgeeKhiisenAjiltniiNer: "Булган",
            guilgeeKhiisenAjiltniiId: "64e855ce37fdc9b105f936e2",
          };
          await Geree(req.body.tukhainBaaziinKholbolt).findByIdAndUpdate(
            { _id: geree?._id.toString() },
            {
              $push: {
                [`avlaga.baritsaa`]: baritsaa,
              },
              $set: { baritsaaniiUldegdel: dun },
            }
          );
        }
      }
      res.send("Amjilttai");
    } catch (err) {
      next(err);
    }
  });

async function sarBuriinKhungulultBodoy() {
  try {
    const { db } = require("zevbackv2");
    var kholboltuud = db.kholboltuud;
    var baiguullaguud = await Baiguullaga(db.erunkhiiKholbolt).find({
      "barilguud.tokhirgoo.sarBurAutoKhungulultOruulakhEsekh": true,
    });
    for await (const baiguullaga of baiguullaguud) {
      var kholbolt = kholboltuud.find(
        (a) => a.baiguullagiinId == baiguullaga._id.toString()
      );
      for await (const barilga of baiguullaga?.barilguud) {
        var mainMatch = {
          baiguullagiinId: baiguullaga._id.toString(),
          barilgiinId: barilga?._id.toString(),
          tuluv: {
            $ne: -1,
          },
        };
        var match = {
          $or: [
            {
              "avlaga.guilgeenuud.turul": {
                $nin: ["aldangi", "baritsaa"],
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
          "avlaga.guilgeenuud.ognoo": {
            $lte: new Date(
              moment()
                .subtract(1, "month")
                .endOf("month")
                .format("YYYY-MM-DD 23:59:59")
            ),
          },
        };
        var query = [
          {
            $match: mainMatch,
          },
          {
            $unwind: {
              path: "$avlaga.guilgeenuud",
            },
          },
          {
            $match: match,
          },
          {
            $group: {
              _id: "$_id",
              tulukh: {
                $sum: {
                  $ifNull: ["$avlaga.guilgeenuud.tulukhDun", 0],
                },
              },
              khyamdral: {
                $sum: {
                  $ifNull: ["$avlaga.guilgeenuud.khyamdral", 0],
                },
              },
              tulsun: {
                $sum: {
                  $ifNull: ["$avlaga.guilgeenuud.tulsunDun", 0],
                },
              },
            },
          },
          {
            $project: {
              uldegdel: {
                $subtract: [
                  "$tulukh",
                  {
                    $sum: ["$tulsun", "$khyamdral"],
                  },
                ],
              },
            },
          },
          {
            $match: {
              uldegdel: {
                $lte: barilga?.tokhirgoo?.khungulukhSarBuriinShalguurDun || 0,
              },
            },
          },
        ];
        var ekhlekhOgnoo = moment()
          .set(
            "date",
            barilga?.tokhirgoo?.khungulukhSarBuriinTulburEkhlekhUdur || 1
          )
          .format("YYYY-MM-DD 00:00:00");
        var duusakhOgnoo = moment()
          .set(
            "date",
            barilga?.tokhirgoo?.khungulukhSarBuriinTulburDuusakhUdur || 1
          )
          .format("YYYY-MM-DD 23:59:59");
        var khariu = await Geree(kholbolt, true).aggregate(query);
        mainMatch["gereeniiOgnoo"] = {
          $gte: new Date(moment().startOf("month")),
          $lte: new Date(moment().endOf("month")),
        };
        var gereenuud = await Geree(kholbolt, true).find(mainMatch);
        if (gereenuud?.length > 0) {
          for await (const geree of gereenuud)
            khariu.push({ _id: geree._id, uldegdel: 0 });
        }
        if (khariu?.length > 0) {
          for await (const data of khariu) {
            var geree = await Geree(kholbolt, true)
              .findById(data._id)
              .select("+avlaga");

            var filteredTulsunDun = geree?.avlaga?.guilgeenuud.filter(
              (e) =>
                e.ognoo <= moment(duusakhOgnoo) &&
                e.ognoo >= moment(ekhlekhOgnoo) &&
                e.tulsunDun > 0
            );
            var tulsunDun =
              filteredTulsunDun?.length > 0
                ? filteredTulsunDun?.reduce((a, b) => a + b?.tulsunDun, 0)
                : 0;
            var ognoo = moment()
              .set("date", geree?.tulukhUdur[0])
              .format("YYYY-MM-DD 00:00:00");
            var niitDun = 0;
            if (barilga?.tokhirgoo?.tureesiinDungeesKhungulukhEsekh) {
              var filteredTurees = geree?.avlaga?.guilgeenuud.filter(
                (b) =>
                  moment(b.ognoo).format("YYYY-MM") ===
                    moment(ognoo).format("YYYY-MM") &&
                  b.turul === "khuvaari" &&
                  b.tulukhDun > 0
              );
              var tureesDun =
                filteredTurees?.length > 0
                  ? filteredTurees?.reduce((a, b) => a + b?.tulukhDun, 0)
                  : 0;
              tulsunDun +=
                (tureesDun * barilga?.tokhirgoo?.khungulukhSarBuriinUtga) / 100;
              niitDun += tureesDun;
              tulsunDun -= tureesDun;
            }
            if (barilga?.tokhirgoo?.ashiglaltDungeesKhungulukhEsekh) {
              var filteredAvlaga = geree?.avlaga?.guilgeenuud.filter(
                (b) =>
                  moment(b.ognoo).format("YYYY-MM") ===
                    moment(ognoo).format("YYYY-MM") &&
                  b.turul === "avlaga" &&
                  b.tulukhDun > 0
              );
              var avlagaDun =
                filteredAvlaga?.length > 0
                  ? filteredAvlaga?.reduce((a, b) => a + b?.tulukhDun, 0)
                  : 0;
              niitDun += avlagaDun;
              tulsunDun -= avlagaDun;
            }
            var filteredData = geree?.avlaga?.guilgeenuud.filter(
              (a) =>
                moment(a.ognoo).format("YYYY-MM") ===
                  moment().format("YYYY-MM") &&
                a.turul === "khungulult" &&
                a.sarBurAutoKhungulultOruulakhEsekh
            );
            if (filteredData?.length > 0) {
              for await (const avlagaData of filteredData) {
                await Geree(kholbolt).findByIdAndUpdate(
                  { _id: geree?._id.toString() },
                  {
                    $pull: {
                      [`avlaga.guilgeenuud`]: {
                        _id: avlagaData?._id.toString(),
                      },
                    },
                  }
                );
              }
            }
            if (
              barilga?.tokhirgoo?.sarBurAutoKhungulultOruulakhEsekh &&
              tulsunDun >= 0 &&
              filteredTulsunDun?.length > 0
            ) {
              var khungulultiinDun = 0;
              if (barilga?.tokhirgoo?.khungulukhSarBuriinTurul === "khuvi") {
                khungulultiinDun =
                  (niitDun * barilga?.tokhirgoo?.khungulukhSarBuriinUtga) / 100;
              } else {
                khungulultiinDun = barilga?.tokhirgoo?.khungulukhSarBuriinUtga;
              }
              var khyamdral = {
                tulukhDun: 0,
                ognoo: new Date(duusakhOgnoo),
                turul: "khungulult",
                khyamdral: khungulultiinDun,
                nemeltTailbar: "системээс автомат хөнгөлөлт",
                tailbar: "Хөнгөлөлт",
                khyamdraliinId: geree?._id,
                guilgeeKhiisenOgnoo: new Date(),
                sarBurAutoKhungulultOruulakhEsekh:
                  barilga?.tokhirgoo?.sarBurAutoKhungulultOruulakhEsekh,
                khungulukhSarBuriinShalguurDun:
                  barilga?.tokhirgoo?.khungulukhSarBuriinShalguurDun,
                khungulukhSarBuriinTurul:
                  barilga?.tokhirgoo?.khungulukhSarBuriinTurul,
                khungulukhSarBuriinUtga:
                  barilga?.tokhirgoo?.khungulukhSarBuriinUtga,
                khungulukhSarBuriinTulburEkhlekhUdur:
                  barilga?.tokhirgoo?.khungulukhSarBuriinTulburEkhlekhUdur,
                khungulukhSarBuriinTulburDuusakhUdur:
                  barilga?.tokhirgoo?.khungulukhSarBuriinTulburDuusakhUdur,
                tureesiinDungeesKhungulukhEsekh:
                  barilga?.tokhirgoo?.tureesiinDungeesKhungulukhEsekh,
                ashiglaltDungeesKhungulukhEsekh:
                  barilga?.tokhirgoo?.ashiglaltDungeesKhungulukhEsekh,
                guilgeeKhiisenAjiltniiNer: "систем",
                guilgeeKhiisenAjiltniiId: 1,
              };
              await Geree(kholbolt).findByIdAndUpdate(
                { _id: geree?._id.toString() },
                {
                  $push: {
                    [`avlaga.guilgeenuud`]: khyamdral,
                  },
                }
              );
            }
          }
        }
      }
    }
  } catch (error) {
    throw error;
  }
}

async function duusakhGereeAutomataarTalbainTulburNemekh() {
  try {
    const { db } = require("zevbackv2");
    var kholboltuud = db.kholboltuud;
    var baiguullaguud = await Baiguullaga(db.erunkhiiKholbolt).find({
      "barilguud.tokhirgoo.gereeDuusakhTalbaiTulburNemekhEsekh": true,
    });
    for await (const baiguullaga of baiguullaguud) {
      var kholbolt = kholboltuud.find(
        (a) => a.baiguullagiinId == baiguullaga._id.toString()
      );
      for await (const barilga of baiguullaga?.barilguud) {
        if (
          barilga.tokhirgoo?.gereeDuusakhTalbaiTulburNemekhEsekh &&
          barilga.tokhirgoo?.gereeDuusakhTulbur > 0
        ) {
          var mainMatch = {
            baiguullagiinId: baiguullaga._id.toString(),
            barilgiinId: barilga?._id.toString(),
            tuluv: {
              $ne: -1,
            },
            duusakhOgnoo: {
              $gte: new Date(moment().startOf("day")),
              $lte: new Date(moment().endOf("day")),
            },
          };
          var gereenuud = await Geree(kholbolt, true).find(mainMatch);
          if (gereenuud?.length > 0) {
            for await (const geree of gereenuud) {
              if (geree.talbainIdnuud?.length > 0) {
                for await (const talbainId of geree.talbainIdnuud) {
                  var khuuchinTalbai = await Talbai(kholbolt).findById(
                    talbainId
                  );
                }
              }
            }
          }
        }
      }
    }
  } catch (error) {
    throw error;
  }
}

async function jilBurAutomataarTalbainTulburNemekh() {
  try {
    const { db } = require("zevbackv2");
    var kholboltuud = db.kholboltuud;
    var baiguullaguud = await Baiguullaga(db.erunkhiiKholbolt).find({
      "barilguud.tokhirgoo.jilBurTalbaiTulburNemekhEsekh": true,
    });
    for await (const baiguullaga of baiguullaguud) {
      var kholbolt = kholboltuud.find(
        (a) => a.baiguullagiinId == baiguullaga._id.toString()
      );
      for await (const barilga of baiguullaga?.barilguud) {
        if (
          barilga.tokhirgoo?.jilBurTalbaiTulburNemekhEsekh &&
          barilga.tokhirgoo?.jilBurTulbur > 0
        ) {
          var khuuchinTalbai = await Talbai(kholbolt).findById(talbainId);
        }
      }
    }
  } catch (error) {
    throw error;
  }
}

router
  .route("/gereeAshiglakhguiSaruud")
  .post(tokenShalgakh, async (req, res, next) => {
    try {
      // var zardalAvlaga = req.body.zardal;
      // if (!!zardalAvlaga) {
      //   var gereenuud = await Geree(req.body.tukhainBaaziinKholbolt)
      //     .find({
      //       baiguullagiinId: req.body.baiguullagiinId,
      //       barilgiinId: req.body.barilgiinId,
      //       tuluv: 1,
      //       "zardluud._id": zardalAvlaga._id.toString(),
      //     })
      //     .select("+avlaga");
      //   if (gereenuud?.length > 0) {
      //     for await (const geree of gereenuud) {
      //       var ekhlekhOgnoo;
      //       var today = new Date();
      //       if (geree.baiguullagiinId === "63c0f31efe522048bf02086d") {
      //         var foodcityEkhlekhOgnoo = new Date(
      //           moment("2024-09-30").format("YYYY-MM-DD 00:00:00")
      //         );
      //         var tempEkhlekhOgnoo = new Date(
      //           moment(
      //             moment(geree.gereeniiOgnoo) >
      //               moment(
      //                 today.getFullYear() +
      //                   "-" +
      //                   (today.getMonth() > 9 ? "" : "0") +
      //                   today.getMonth() +
      //                   "-01"
      //               ).startOf("month")
      //               ? geree.gereeniiOgnoo
      //               : moment(today.getFullYear() + "-04-01").startOf("month")
      //           ).format("YYYY-MM-DD 00:00:00")
      //         );
      //         ekhlekhOgnoo = new Date(
      //           foodcityEkhlekhOgnoo > tempEkhlekhOgnoo
      //             ? foodcityEkhlekhOgnoo
      //             : tempEkhlekhOgnoo
      //         );
      //       } else
      //         ekhlekhOgnoo = new Date(
      //           moment(geree.gereeniiOgnoo) >
      //           moment(today.getFullYear() + "-04-01").startOf("month")
      //             ? geree.gereeniiOgnoo
      //             : moment(today.getFullYear() + "-04-01").startOf("month")
      //         );
      //       var khuvaariud = geree.avlaga.guilgeenuud;
      //       khuvaariud = khuvaariud.filter(
      //         (x) =>
      //           x.ognoo < ekhlekhOgnoo ||
      //           x.turul == "khyamdral" ||
      //           !!x.guilgeeKhiisenAjiltniiId ||
      //           !!x.guilgeeKhiisenOgnoo
      //       );
      //       var unuudur = new Date(
      //         today.getFullYear(),
      //         today.getMonth(),
      //         today.getDate(),
      //         0,
      //         0,
      //         0
      //       );
      //       var ognoo = new Date(ekhlekhOgnoo);
      //       var turOgnoo;
      //       var tukhainSar = new Date(moment(ognoo).set("date", 1));
      //       var suuliinUdur;
      //       var duussanEsekh = false;
      //       new Array((geree.khugatsaa || 0) + 1).fill("").map((mur, index) => {
      //         geree.tulukhUdur.forEach((udur) => {
      //           if (!duussanEsekh) {
      //             suuliinUdur = moment(tukhainSar).endOf("month").date();
      //             if (suuliinUdur < udur) {
      //               turOgnoo = new Date(
      //                 moment(tukhainSar).set("date", suuliinUdur)
      //               );
      //             } else {
      //               turOgnoo = new Date(moment(tukhainSar).set("date", udur));
      //             }
      //             if (turOgnoo >= ekhlekhOgnoo) {
      //               if (
      //                 turOgnoo.getMonth() == geree.duusakhOgnoo.getMonth() &&
      //                 turOgnoo.getFullYear() == geree.duusakhOgnoo.getFullYear()
      //               )
      //                 duussanEsekh = true;
      //               //undsen tulultiin xuwaari)
      //               var baigaa = khuvaariud.find((a) => {
      //                 return (
      //                   a.turul == "khuvaari" &&
      //                   a.tulukhDun == geree.talbainNiitUne &&
      //                   moment(a.ognoo).isSame(turOgnoo, "day")
      //                 );
      //               });
      //               if (!baigaa && geree.talbainNiitUne > 0)
      //                 khuvaariud.push({
      //                   ognoo: turOgnoo,
      //                   khyamdral: 0,
      //                   turul: "khuvaari",
      //                   undsenDun: geree.talbainNiitUne,
      //                   tulukhDun: geree.talbainNiitUne,
      //                 });
      //               if (!!geree.zardluud && geree.zardluud.length > 0) {
      //                 geree.zardluud.forEach((zardal) => {
      //                   if (
      //                     zardal &&
      //                     (!zardal.ner?.includes("Цахилгаан") ||
      //                       (zardal.ner?.includes("Цахилгаан") &&
      //                         zardal.turul == "Тогтмол"))
      //                   ) {
      //                     if (
      //                       zardalAvlaga.ognoonuud?.length > 0 &&
      //                       zardal._id == zardalAvlaga._id &&
      //                       moment(turOgnoo).format("MM") >
      //                         moment(zardalAvlaga.ognoonuud[0]).format("MM") &&
      //                       moment(turOgnoo).format("MM") <
      //                         moment(zardalAvlaga.ognoonuud[1]).format("MM")
      //                     )
      //                       return;
      //                     var tulukhDun = 0;
      //                     if (
      //                       zardal.turul == "1м3/талбай" &&
      //                       geree.talbainKhemjeeMetrKube > 0
      //                     )
      //                       tulukhDun = tooZasyaSync(
      //                         zardal.tariff * geree.talbainKhemjeeMetrKube
      //                       );
      //                     else if (
      //                       zardal.turul == "1м2" &&
      //                       geree.talbainKhemjee > 0
      //                     )
      //                       tulukhDun = tooZasyaSync(
      //                         zardal.tariff * geree.talbainKhemjee
      //                       );
      //                     else if (zardal.turul == "Тогтмол")
      //                       tulukhDun = zardal.tariff;
      //                     if (
      //                       zardalAvlaga.ognoonuud?.length > 0 &&
      //                       zardal._id.toString() ==
      //                         zardalAvlaga._id.toString() &&
      //                       moment(zardalAvlaga.ognoonuud[0]).format("MM") ==
      //                         moment(turOgnoo).format("MM")
      //                     ) {
      //                       var khonog = parseFloat(
      //                         moment(zardalAvlaga.ognoonuud[0]).format("DD")
      //                       );
      //                       if (khonog == 1) return;
      //                       var niitKhonog = parseFloat(
      //                         moment(zardalAvlaga.ognoonuud[0])
      //                           .endOf("month")
      //                           .format("DD")
      //                       );
      //                       tulukhDun =
      //                         (tulukhDun * khonog) / (niitKhonog || 1);
      //                     }
      //                     if (
      //                       zardalAvlaga.ognoonuud?.length > 0 &&
      //                       zardal._id == zardalAvlaga._id &&
      //                       moment(zardalAvlaga.ognoonuud[0]).format("MM") !=
      //                         moment(zardalAvlaga.ognoonuud[1]).format("MM") &&
      //                       moment(zardalAvlaga.ognoonuud[1]).format("MM") ==
      //                         moment(turOgnoo).format("MM")
      //                     ) {
      //                       var niitKhonog = parseFloat(
      //                         moment(zardalAvlaga.ognoonuud[1])
      //                           .endOf("month")
      //                           .format("DD")
      //                       );
      //                       var khonog =
      //                         niitKhonog -
      //                         parseFloat(
      //                           moment(zardalAvlaga.ognoonuud[1]).format("DD")
      //                         );
      //                       tulukhDun =
      //                         (tulukhDun * khonog) / (niitKhonog || 1);
      //                     }
      //                     if (tulukhDun > 0)
      //                       khuvaariud.push({
      //                         ognoo: turOgnoo,
      //                         khyamdral: 0,
      //                         turul: "avlaga",
      //                         tailbar: zardal.ner,
      //                         tulukhDun: tulukhDun,
      //                       });
      //                   }
      //                 });
      //               }
      //               if (geree?.khungulultuud?.length > 0) {
      //                 geree?.khungulultuud.forEach((data) => {
      //                   data.tulukhDun = geree.talbainNiitUne;
      //                   data.khungulultiinDun =
      //                     Math.round(
      //                       ((geree.talbainNiitUne * data.khungulukhKhuvi) /
      //                         100 +
      //                         Number.EPSILON) *
      //                         10000
      //                     ) / 10000;
      //                   if (
      //                     moment(turOgnoo) >=
      //                       moment(
      //                         moment(data.ognoonuud[0]).format(
      //                           "YYYY-MM-DD 00:00:00"
      //                         )
      //                       ) &&
      //                     moment(turOgnoo) <=
      //                       moment(
      //                         moment(data.ognoonuud[1]).format(
      //                           "YYYY-MM-DD 23:59:59"
      //                         )
      //                       )
      //                   ) {
      //                     khuvaariud.push({
      //                       tulukhDun: 0,
      //                       ognoo: turOgnoo,
      //                       turul: "khungulult",
      //                       khyamdral: data.khungulultiinDun,
      //                       nemeltTailbar: "Гэрээ",
      //                       tailbar: "Хөнгөлөлт",
      //                     });
      //                   }
      //                 });
      //               }
      //             }
      //             ognoo = new Date(turOgnoo);
      //           }
      //         });
      //         tukhainSar = new Date(moment(tukhainSar).add(1, "month"));
      //       });
      //       if (khuvaariud?.length > 0) {
      //         await Geree(req.body.tukhainBaaziinKholbolt).findOneAndUpdate(
      //           { _id: geree._id },
      //           {
      //             $set: {
      //               [`avlaga.guilgeenuud`]: khuvaariud,
      //             },
      //           }
      //         );
      //       }
      //       await Geree(req.body.tukhainBaaziinKholbolt).findOneAndUpdate(
      //         { _id: geree._id },
      //         {
      //           $pull: { zardluud: { _id: zardalAvlaga._id.toString() } },
      //         }
      //       );
      //       await Geree(req.body.tukhainBaaziinKholbolt).findOneAndUpdate(
      //         { _id: geree._id },
      //         {
      //           $push: { zardluud: zardalAvlaga },
      //         }
      //       );
      //     }
      //   }
      // }
      res.send("Amjilttai");
    } catch (error) {
      if (next) next(error);
    }
  });

router.route("/menejmentZasay").post(tokenShalgakh, async (req, res, next) => {
  try {
    var match = {
      baiguullagiinId: req.body.baiguullagiinId,
      barilgiinId: req.body.barilgiinId,
      tuluv: 1,
    };
    if (req.body.gereeniiDugaar)
      match["gereeniiDugaar"] = req.body.gereeniiDugaar;
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
          "avlaga.guilgeenuud.ognoo": {
            $gte: new Date(req.body.ekhlekhOgnoo),
            $lte: new Date(req.body.ekhlekhOgnoo),
          },
          "avlaga.guilgeenuud.turul": {
            $in: ["avlaga"],
          },
          "avlaga.guilgeenuud.tailbar": "Менежментийн төлбөр",
        },
      },
      {
        $project: {
          id: "$_id",
          gereeniiDugaar: "$gereeniiDugaar",
          ognoo: "$avlaga.guilgeenuud.ognoo",
          tulukhDun: "$avlaga.guilgeenuud.tulukhDun",
          tailbar: "$avlaga.guilgeenuud.tailbar",
          turul: "$avlaga.guilgeenuud.turul",
        },
      },
    ];
    var gereenuud = await Geree(
      req.body.tukhainBaaziinKholbolt,
      true
    ).aggregate(query);
    if (gereenuud?.length > 0) {
      for await (const geree of gereenuud) {
        var avlagaMatch = {
          ognoo: {
            $gte: new Date(req.body.duusakhOgnoo),
            $lte: new Date(req.body.duusakhOgnoo),
          },
          tailbar: { $regex: req.body.tailbar, $options: "i" },
          turul: "avlaga",
        };
        await Geree(req.body.tukhainBaaziinKholbolt).findByIdAndUpdate(
          { _id: geree?.id },
          {
            $pull: { "avlaga.guilgeenuud": avlagaMatch },
          }
        );
        var lastAvlaga = {
          ognoo: new Date(req.body.duusakhOgnoo),
          tulukhDun: geree.tulukhDun,
          tailbar: geree.tailbar,
          turul: geree.turul,
        };
        await Geree(req.body.tukhainBaaziinKholbolt).findByIdAndUpdate(
          { _id: geree?.id },
          {
            $push: { "avlaga.guilgeenuud": lastAvlaga },
          }
        );
      }
    }
    res.send("Amjilttai");
  } catch (error) {
    if (next) next(error);
  }
});

router
  .route("/gereeniiAldangiZasya")
  .post(tokenShalgakh, async (req, res, next) => {
    try {
      await Geree(req.body.tukhainBaaziinKholbolt).findByIdAndUpdate(
        { _id: req.body.gereeniiId },
        {
          $set: { aldangiinUldegdel: req.body.aldangiDun },
        }
      );
      var aldangi = {
        baiguullagiinId: req.body.baiguullagiinId,
        barilgiinId: req.body.barilgiinId,
        gereeniiId: req.body.gereeniiId,
        gereeniiDugaar: req.body.gereeniiDugaar,
        tailbar: req.body.tailbar,
        aldangiDun: req.body.aldangiDun,
        khuuchinAldangiDun: req.body.khuuchinAldangiDun,
        ajiltniiNer: req.body.nevtersenAjiltniiToken.ner,
        ajiltniiId: req.body.nevtersenAjiltniiToken.id,
        ognoo: new Date(),
        turul: "aldangi",
      };
      await AldangiinZassanTuukh(req.body.tukhainBaaziinKholbolt).insertMany(
        aldangi
      );
      var uurchlult = [];
      var tempData = {
        talbar: "aldangiinUldegdel",
        talbarNer: "Алдангийн үлдэгдэл",
        umnukhUtga: req.body.khuuchinAldangiDun,
        shineUtga: req.body.aldangiDun,
        utganiiTurul: "string",
      };
      uurchlult.push(tempData);
      var barimt = new ZassanBarimt(req.body.tukhainBaaziinKholbolt)();
      barimt.baiguullagiinId = aldangi.baiguullagiinId;
      barimt.barilgiinId = aldangi.barilgiinId;
      barimt.classId = aldangi.gereeniiId;
      barimt.classDugaar = aldangi.gereeniiDugaar;
      barimt.classOgnoo = aldangi.ognoo;
      barimt.classType = "Aldangi";
      barimt.className = "Алданги";
      barimt.uurchlult = uurchlult;
      barimt.ajiltniiId = req.body.nevtersenAjiltniiToken.id;
      barimt.ajiltniiNer = req.body.nevtersenAjiltniiToken.ner;
      await barimt.save();
      if (!req.body.aldangiDun || req.body.aldangiDun == 0) {
        var ustsanBarimt = new UstsanBarimt(req.body.tukhainBaaziinKholbolt)();
        ustsanBarimt.class = "gereeniiGuilgee";
        ustsanBarimt.tailbar = req.body.tailbar;
        ustsanBarimt.object = aldangi;
        if (req.body.nevtersenAjiltniiToken) {
          ustsanBarimt.ajiltniiNer = req.body.nevtersenAjiltniiToken.ner;
          ustsanBarimt.ajiltniiId = req.body.nevtersenAjiltniiToken.id;
        }
        ustsanBarimt.baiguullagiinId = req.body.baiguullagiinId;
        ustsanBarimt.barilgiinId = req.body.barilgiinId;
        await ustsanBarimt.save();
      }
      res.send("Amjilttai");
    } catch (error) {
      if (next) next(error);
    }
  });

router
  .route("/gereeniiDugaarZasya")
  .post(tokenShalgakh, async (req, res, next) => {
    try {
      var gereenuud = await Geree(req.body.tukhainBaaziinKholbolt, true).find({
        baiguullagiinId: req.body.baiguullagiinId,
        gereeniiDugaar: { $regex: /\s+/ },
      });
      if (gereenuud?.length > 0) {
        for await (const geree of gereenuud) {
          await Geree(req.body.tukhainBaaziinKholbolt).findByIdAndUpdate(
            { _id: geree?._id },
            {
              $set: {
                gereeniiDugaar: geree.gereeniiDugaar.trim().replace(/\s/g, "-"),
              },
            }
          );
        }
      }
      res.send("Amjilttai");
    } catch (error) {
      if (next) next(error);
    }
  });

router
  .route("/niitTulsunAldangiBodoy")
  .post(tokenShalgakh, async (req, res, next) => {
    try {
      var aldangiTulsunDunguud = await Geree(
        req.body.tukhainBaaziinKholbolt,
        true
      ).aggregate([
        {
          $unwind: {
            path: "$avlaga.guilgeenuud",
          },
        },
        {
          $match: {
            "avlaga.guilgeenuud.turul": {
              $in: ["bank", "aldangi"],
            },
            "avlaga.guilgeenuud.tulsunAldangi": {
              $gt: 0,
            },
          },
        },
        {
          $group: {
            _id: "$_id",
            dun: {
              $sum: "$avlaga.guilgeenuud.tulsunAldangi",
            },
          },
        },
      ]);
      for await (const geree of aldangiTulsunDunguud) {
        await Geree(req.body.tukhainBaaziinKholbolt).findByIdAndUpdate(
          { _id: geree?._id },
          {
            $set: { niitTulsunAldangi: geree.dun || 0 },
          }
        );
      }
      res.send("Amjilttai");
    } catch (error) {
      if (next) next(error);
    }
  });

router
  .route("/gereeniiZurguudKhadgalakh")
  .post(tokenShalgakh, async (req, res, next) => {
    try {
      if (!req.body.gereeniiId) throw new Error("Гэрээ олдсонгүй!");
      if (!Array.isArray(req.body.zurguud))
        throw new Error("Зургууд массив хэлбэртэй байх ёстой!");
      if (req.body.zurguud.length > 5)
        throw new Error("Зургуудын тоо 5-с их байж болохгүй!");
      await Geree(req.body.tukhainBaaziinKholbolt).findByIdAndUpdate(
        { _id: req.body.gereeniiId },
        {
          $set: { zurguud: req.body.zurguud || [] },
        }
      );
      res.send("Amjilttai");
    } catch (error) {
      if (next) next(error);
    }
  });

router.route("/aldangiButsaakh").post(tokenShalgakh, async (req, res, next) => {
  try {
    var match = {
      baiguullagiinId: req.body.baiguullagiinId,
      barilgiinId: req.body.barilgiinId,
      createdAt: { $gte: new Date(req.body.ekhlekhOgnoo) },
    };
    if (req.body.gereeniiDugaar)
      match["gereeniiDugaar"] = req.body.gereeniiDugaar;
    const aldangiinTuukh = await AldangiinTuukh(
      req.body.tukhainBaaziinKholbolt
    ).aggregate([
      {
        $match: match,
      },
      {
        $group: {
          _id: {
            gereeniiId: "$gereeniiId",
            gereeniiDugaar: "$gereeniiDugaar",
          },
          aldangi: {
            $sum: { $ifNull: ["$aldangi", 0] },
          },
        },
      },
    ]);
    const bulkOps = [];
    const gereenuudIds = [];
    if (aldangiinTuukh?.length > 0) {
      for await (const aldangiData of aldangiinTuukh) {
        gereenuudIds.push(aldangiData._id.gereeniiId);
        bulkOps.push({
          updateOne: {
            filter: { _id: aldangiData._id.gereeniiId },
            update: [
              {
                $set: {
                  aldangiinUldegdel: {
                    $subtract: [
                      { $ifNull: ["$aldangiinUldegdel", 0] },
                      aldangiData.aldangi,
                    ],
                  },
                },
              },
            ],
          },
        });
      }
      if (bulkOps.length > 0)
        await Geree(req.body.tukhainBaaziinKholbolt).bulkWrite(bulkOps);
      if (gereenuudIds.length > 0)
        await AldangiinTuukh(req.body.tukhainBaaziinKholbolt).deleteMany({
          baiguullagiinId: req.body.baiguullagiinId,
          barilgiinId: req.body.barilgiinId,
          createdAt: { $gte: new Date(req.body.ekhlekhOgnoo) },
          gereeniiId: { $in: gereenuudIds },
        });
    }
    res.send(aldangiinTuukh);
  } catch (error) {
    if (next) next(error);
  }
});

module.exports = router;
module.exports.sarBuriinKhungulultBodoy = sarBuriinKhungulultBodoy;
module.exports.duusakhGereeAutomataarTalbainTulburNemekh =
  duusakhGereeAutomataarTalbainTulburNemekh;
module.exports.jilBurAutomataarTalbainTulburNemekh =
  jilBurAutomataarTalbainTulburNemekh;
