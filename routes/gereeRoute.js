const express = require("express");
const router = express.Router();
const Geree = require("../models/geree");
const Talbai = require("../models/talbai");
const Khariltsagch = require("../models/khariltsagch");
//const Dugaarlalt = require("../models/dugaarlalt");
const KhungulultiinTuukh = require("../models/khungulultiinTuukh");
const AshiglaltiinZardluud = require("../models/ashiglaltiinZardluud");
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
  talbainKubeOruulya,
  gereenuudZasya,
  fcZasvarKhiie,
  avlagaZasay,
} = require("../controller/tulbur");
router.route("/tulultTaniya").get(tulultTaniya);
const lodash = require("lodash");

const {
  gereeniiExcelAvya,
  gereeniiExcelTatya,
  tooluurZaaltZagvarAvya,
  tooluurZaaltOruulya,
} = require("../controller/excel");
const Baiguullaga = require("../models/baiguullaga");
const ZassanBarimt = require("../models/zassanBarimt");
const ZassanBarimtShalgakh = require("../components/zassanBarimtShalgakh");

crud(router, "zassanBarimt", ZassanBarimt);

router.route("/gereeniiToololtAvya").post(tokenShalgakh, gereeniiToololtAvya);
router
  .route("/guilgeeniiToololtAvya")
  .post(tokenShalgakh, guilgeeniiToololtAvya);
router.route("/fcZasvarKhiie").post(tokenShalgakh, fcZasvarKhiie);
router.route("/avlagaZasay").post(tokenShalgakh, avlagaZasay);

router.route("/gereeniiExcelAvya").get(tokenShalgakh, gereeniiExcelAvya);
router
  .route("/gereeniiExcelTatya")
  .post(uploadFile.single("file"), tokenShalgakh, gereeniiExcelTatya);
router
  .route("/tooluurZaaltZagvarAvya")
  .get(tokenShalgakh, tooluurZaaltZagvarAvya);
router
  .route("/tooluurZaaltOruulya")
  .post(uploadFile.single("file"), tokenShalgakh, tooluurZaaltOruulya);
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
router
  .route("/gereeniiTulultAvya/:gereeniiId")
  .get(tokenShalgakh, (req, res, next) => {
    Geree(req.body.tukhainBaaziinKholbolt)
      .findById(req.params.gereeniiId)
      .select("avlaga")
      .then((result) => {
        if (lodash.isArray(lodash.get(result, "avlaga.guilgeenuud"))) {
          var a = lodash
            .get(result, "avlaga.guilgeenuud")
            .filter(
              (a) =>
                a.ognoo < new Date(req.query.duusakhOgnoo) &&
                a.turul != "baritsaa" &&
                a.turul != "aldangi"
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
    Geree(req.body.tukhainBaaziinKholbolt)
      .findById(req.params.gereeniiId)
      .select("avlaga")
      .then((result) => {
        if (lodash.isArray(lodash.get(result, "avlaga.guilgeenuud"))) {
          var a = lodash
            .get(result, "avlaga.guilgeenuud")
            .filter(
              (a) =>
                a.ognoo < new Date(req.query.duusakhOgnoo) &&
                (a.turul === "aldangi" || a.turul === "bank")
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
    Geree(req.body.tukhainBaaziinKholbolt)
      .findById(req.params.gereeniiId)
      .select("avlaga")
      .then((result) => {
        console.log("baritsaaTulultAvya", result);
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
      console.log(ognoo);
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
  khariltsagch.id = khariltsagch.register ? khariltsagch.register : khariltsagch.customerTin;
  if(req.body.gereeniiDugaar === `ГД${moment(new Date()).format("YYMMDD")}`)
  {
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
  if(!!khariltsagch.register)
  {
    khariltsagchShalguur = await Khariltsagch(db.erunkhiiKholbolt).findOne({
      register: khariltsagch.register,
      barilgiinId: req.body.barilgiinId,
    });    
  }
  else if(!!khariltsagch.customerTin)
  {
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
    console.log("daraagiin tulukh ognoonii aldaa ==>", err);
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
      var geree = await Geree(req.body.tukhainBaaziinKholbolt)
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
            console.log("if orow ");
            uldegdel =
              uldegdel +
              (x.tulukhDun ? x.tulukhDun : 0) -
              (x.tulsunDun ? x.tulsunDun : 0) -
              (x.khyamdral ? x.khyamdral : 0);
            butsaakhJagsaalt = [{ ognoo: ekhlekhOgnoo, tulukhDun: uldegdel }];
          } else {
            console.log("else orow ");
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
      var gereeOld = await Geree(req.body.tukhainBaaziinKholbolt).findById(geree._id).select("+avlaga");
      if(gereeOld?.avlaga?.guilgeenuud?.length > 0)
      {
        if(geree?.avlaga?.guilgeenuud?.length > 0)
        {
          var filterTulsunDun = gereeOld?.avlaga?.guilgeenuud?.filter((a) => a.ekhniiUldegdelEsekh || a.tulsunDun > 0 || a.tulsunAldangi > 0 || a.khyamdral > 0 || a.suuliinZaalt > 0 || a.umnukhZaalt);
          if(filterTulsunDun?.length > 0)
            geree?.avlaga?.guilgeenuud?.push(...filterTulsunDun);
        }
        else
          geree?.avlaga?.guilgeenuud?.push(gereeOld?.avlaga?.guilgeenuud);
      }
      geree.tuluv = 1;
      await Geree(req.body.tukhainBaaziinKholbolt)
        .updateOne(
          {
            _id: geree._id,
          },
          geree,
        )
        .then((result) => {
          if(gereeOld?.talbainIdnuud?.length > 0)
          {
            var talbainBulk = [];
            gereeOld?.talbainIdnuud.forEach((a) => {
              const talbainId = geree?.talbainIdnuud?.filter((b) => b === a);
              if(talbainId?.length === 0)
              {
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
                .then((bulkWriteOpResult) => {
                  console.log("Talbai idevkhiteiEsekh OK ----", bulkWriteOpResult);
                })
                .catch((err) => {
                  console.log("Talbai BULK update error", err);
                });
          }
          talbaiKhariltsagchiinTuluvUurchluy(
            [geree._id],
            req.body.tukhainBaaziinKholbolt
          );
          ZassanBarimtShalgakh.zassanBarimtShalgakh(gereeOld, geree, geree.gereeniiDugaar, "Geree", "Гэрээ", req.body);
        });
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
      var geree = await Geree(req.body.tukhainBaaziinKholbolt).findById(req.body.gereeniiId).select("+avlaga");
      var val = geree.khugatsaa + req.body.sar;
      await Geree(req.body.tukhainBaaziinKholbolt).findByIdAndUpdate({ _id: req.body.gereeniiId }, {khugatsaa: val}).then((xariu) => {
        console.log(xariu);
      })
      .catch((err) => {
        console.log(err);
      });
      geree = await Geree(req.body.tukhainBaaziinKholbolt).findById(req.body.gereeniiId).select("+avlaga");
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
          x.ognoo <= new Date() || x.turul == "khyamdral" || x.khyamdral > 0
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
              moment(new Date())
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
            if (!baigaa && talbai?.talbainNiitUne > 0)
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
                } else if (zardal.turul == "1м2" && talbai?.talbainKhemjee > 0) {
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
      console.log(err);
    }
  });

router
  .route("/gereeSergeeye")
  .post(tokenShalgakh, gereeSergeekhShalguur, async (req, res, next) => {
    try {
      var geree = await Geree(req.body.tukhainBaaziinKholbolt)
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
      let geree = await Geree(tukhainBaaziinKholbolt).findById(id);
      let busadGereenuud;
      if(!!geree.register)
      {
        busadGereenuud = await Geree(tukhainBaaziinKholbolt).findOne({
          register: geree.register,
          barilgiinId: geree.barilgiinId,
          tuluv: { $ne: -1 },
        });
      }
      else if(!!geree.customerTin)
      {
        busadGereenuud = await Geree(tukhainBaaziinKholbolt).findOne({
          customerTin: geree.customerTin,
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
            tukhainBaaziinKholbolt
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
        if(!!geree.register)
        {
          upsertKhariltsagch = {
            updateOne: {
              filter: {
                register: geree.register,
                barilgiinId: geree.barilgiinId,
              },
              update: {
                idevkhiteiEsekh: busadGereenuud ? true : false,
              },
            },
          };
        }
        else if(!!geree.customerTin)
        {
          upsertKhariltsagch = {
            updateOne: {
              filter: {
                customerTin: geree.customerTin,
                barilgiinId: geree.barilgiinId,
              },
              update: {
                idevkhiteiEsekh: busadGereenuud ? true : false,
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
        .then((bulkWriteOpResult) => {
          console.log("BULK update OK", bulkWriteOpResult);
        })
        .catch((err) => {
          console.log("BULK update error", err);
        });

    if (khariltsagchiinBulk)
      Khariltsagch(db.erunkhiiKholbolt)
        .bulkWrite(khariltsagchiinBulk)
        .then((bulkWriteOpResult) => {
          console.log("BULK update OK", bulkWriteOpResult);
        })
        .catch((err) => {
          console.log("BULK update error", err);
        });
  }
}

router
  .route("/gereeTsutslaya")
  .post(tokenShalgakh, gereeTsutslakhShalguur, async (req, res, next) => {
    var geree = await Geree(req.body.tukhainBaaziinKholbolt)
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
    console.log(tuukh);
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
            $pull: { "avlaga.guilgeenuud": { ognoo: { $gt: new Date() } } },
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
      console.log(tuukh);
      Geree(req.body.tukhainBaaziinKholbolt)
        .findOneAndUpdate(
          { _id: req.body.gereeniiId },
          {
            $set: {
              gereeniiTuukhuud: tuukh,
              tsutsalsanOgnoo: new Date(),
              tuluv: -1,
            },
            $pull: { "avlaga.guilgeenuud": { ognoo: { $gt: new Date() } } },
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
  });

router
  .route("/eneSardTulukhJagsaaltAvya")
  .post(tokenShalgakh, async (req, res, next) => {
    try {
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
      khuudaslalt(Geree(req.body.tukhainBaaziinKholbolt), body)
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
                  niitUldegdel: [
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
                        "avlaga.guilgeenuud.turul": {
                          $in: ["avlaga", "khungulult", "zalruulga"],
                        },
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
                          tailbar: "$avlaga.tailbar",
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
                        khungulult: {
                          $sum: "$avlaga.khyamdral",
                        },
                        umnukhZaalt: {
                          $min: "$avlaga.umnukhZaalt",
                        },
                        suuliinZaalt: {
                          $max: "$avlaga.suuliinZaalt",
                        },
                      },
                    },
                  ],
                },
              },
            ];
            var gereenuud = await Geree(
              req.body.tukhainBaaziinKholbolt
            ).aggregate(query);
            if (result && result.jagsaalt && result.jagsaalt.length > 0) {
              result.jagsaalt = result.jagsaalt.filter((a) =>
                gereenuud[0].niitUldegdel.find((b) => b._id == a.gereeniiDugaar)
              );
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
                  gereenuud[0].niitUldegdel.find(
                    (a) => a._id == x.gereeniiDugaar
                  )?.uldegdel || 0;
                x.nemeltNekhemjlekh =
                  gereenuud[0].nekhemjlekhDeerGarakh.find(
                    (a) => a._id == x.gereeniiDugaar
                  )?.guilgeenuud || [];
                x.zardluud = gereenuud[0].zardluud.filter(
                  (a) => a._id.gereeniiDugaar == x.gereeniiDugaar
                );
                if (!!x.zardluud && x.zardluud.length > 0) {
                  x.zardluud.forEach((zardal) => {
                    zardal.tailbar = zardal._id.tailbar;
                    if (zardal.tailbar == "Түрээс")
                      x.khungulult = zardal.khungulult;
                  });
                }
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
            umnukhSariinUrTulbur: [
              {
                $match: {
                  $or: [
                    {
                      "avlaga.guilgeenuud.ognoo": {
                        $lt: new Date(req.body.ekhlekhOgnoo),
                      },
                    },
                    {
                      $and: [
                        {
                          "avlaga.guilgeenuud.ognoo": {
                            $lte: new Date(req.body.nekhemjlekhAvakhOgnoo),
                            $gte: new Date(req.body.ekhlekhOgnoo),
                          },
                        },
                        {
                          $or: [
                            {
                              "avlaga.guilgeenuud.nekhemjlekhDeerKharagdakh": {
                                $exists: false,
                              },
                            },
                            {
                              "avlaga.guilgeenuud.nekhemjlekhDeerKharagdakh": false,
                            },
                          ],
                        },
                        {
                          $or: [
                            {
                              "avlaga.guilgeenuud.undsenDun": {
                                $exists: false,
                              },
                            },
                            {
                              "avlaga.guilgeenuud.undsenDun": 0,
                            },
                          ],
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
            niitUldegdel: [
              {
                $match: {
                  "avlaga.guilgeenuud.ognoo": {
                    $lte: new Date(req.body.duusakhOgnoo),
                  },
                },
              },
              {
                $unwind: {
                  path: "$talbai",
                },
              },
              {
                $group: {
                  _id: "$gereeniiDugaar",
                  niitAshiglaltiinZardal: {
                    $max: "$talbai.niitAshiglaltiinZardal",
                  },
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
                  niitAshiglaltiinZardal: "$niitAshiglaltiinZardal",
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
      console.log("zadargaa query", JSON.stringify(query, null, 4));
      var gereenuud = await Geree(req.body.tukhainBaaziinKholbolt).aggregate(
        query
      );
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
      khuudaslalt(Geree(req.body.tukhainBaaziinKholbolt), body)
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
              req.body.tukhainBaaziinKholbolt
            ).aggregate(query);
            console.log("gereenuud", JSON.stringify(gereenuud, null, 4));
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
        $ne: "baritsaa",
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
    console.log(JSON.stringify(query, null, 4));
    var gereenuud = await Geree(tukhainBaaziinKholbolt).aggregate(query);
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
      console.log("orj irlee", req.params);
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
      khuudaslalt(Geree(req.body.tukhainBaaziinKholbolt), body)
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
      console.log("orj irlee", req.params);
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
            $ne: "baritsaa",
          },
        },
      };
      body.lean = true;
      khuudaslalt(Geree(req.body.tukhainBaaziinKholbolt), body)
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
      console.log("orj irlee", req.params);
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
      console.log("params", req.params);
      console.log(JSON.stringify(body, null, 4));
      body.lean = true;
      khuudaslalt(Geree(req.body.tukhainBaaziinKholbolt), body)
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
      var geree = await Geree(req.body.tukhainBaaziinKholbolt).findOne({
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
      console.log("ene sard", req.body);
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
                    $ne: "baritsaa",
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
                  $or: [
                    {
                      "avlaga.guilgeenuud.turul": {
                        $nin: ["baritsaa"],
                      },
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
                  tulukh: {
                    $subtract: ["$tulukh", "$khyamdral"],
                  },
                },
              },
            ],
          },
        },
      ];
      var gereenuud = await Geree(req.body.tukhainBaaziinKholbolt).aggregate(
        query
      );
      console.log(gereenuud);
      if (gereenuud.length < 0 || gereenuud[0].tuluvluguut.length < 1)
        res.send(null);
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
        console.log("turJagsaalt", turJagsaalt);
        body.query["gereeniiDugaar"] = { $in: turJagsaalt };
        body.lean = true;

        console.log("body", body);
        khuudaslalt(Geree(req.body.tukhainBaaziinKholbolt), body)
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
      var gereenuud = await Geree(req.body.tukhainBaaziinKholbolt).aggregate(
        query
      );
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
      var gereenuud = await Geree(req.body.tukhainBaaziinKholbolt).aggregate([
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
      console.log("zoloo aldaa garlaa ==> ", error);
    }
  });

router.route("/testKhiie").post(async (req, res, next) => {
  console.log("testKhiie");
  console.log("req.body", req.body);
  console.log("req.params", req.params);
  console.log("req.query", req.query);
  console.log("req.headers", req.headers);
  res.sendStatus(200);
});

router.route("/msgKhucheerIlgeeye").post(async (req, res, next) => {
  const { orlogiinMsgIlgeeye } = require("../controller/ajiltan");
  orlogiinMsgIlgeeye(req.body.tsag, req.body.id);
  res.sendStatus(200);
});

router
  .route("/dulaanZasya")
  .get(tokenShalgakh, async (req, res, next) => {
    try {
      var match = {
        "avlaga.guilgeenuud.tailbar": "Дулааны төлбөр", 
        baiguullagiinId: req.body.baiguullagiinId,
        barilgiinId: req.body.barilgiinId,          
      }
      if(!!req.body.gereeniiDugaar)
        match["gereeniiDugaar"] = req.body.gereeniiDugaar
      var gereenuud = await Geree(req.body.tukhainBaaziinKholbolt).find(match).select("+avlaga");
      var khariu = [];
      if(gereenuud?.length > 0)  
      {
        for (const geree of gereenuud)
        {
          var tariff = geree.zardluud.filter((c) => c.ner === "Дулаан")[0].tariff;
          var filterDulaan = geree.avlaga?.guilgeenuud?.filter((a) => a.tailbar === "Дулааны төлбөр");
          if(filterDulaan?.length > 0)
          {
            var objt = [];
            for ( const avlagaDulaan of filterDulaan)
            {
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
              console.log("result", result);
              khariu.push(result);
            });
        }
      }
      res.send(khariu);
    } catch (err) {
      next(err);
    }
  });

  router
  .route("/talbaiZasayNiit")
  .get(tokenShalgakh, async (req, res, next) => {
    try {
      var talbainuud = await Talbai(req.body.tukhainBaaziinKholbolt).find({
        baiguullagiinId: req.body.baiguullagiinId,
        barilgiinId: req.body.barilgiinId
      });
      var talbainBulk = [];
      for await (const talbai of talbainuud) {
        var niitUne = talbai.talbainKhemjee * talbai.talbainNegjUne;
        let upsertTalbai = {
          updateOne: {
              filter: { _id: talbai._id, baiguullagiinId: req.body.baiguullagiinId, barilgiinId: req.body.barilgiinId },
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
            .then((bulkWriteOpResult) => {
              console.log("Talbai BULK update OK", bulkWriteOpResult);
            })
            .catch((err) => {
              console.log("Talbai BULK update error", err);
              next(err);
            });
      res.send(talbainBulk);
    } catch (err) {
      next(err);
    }
  });  

router
.route("/khungulultZasya")  
.get(tokenShalgakh, async (req, res, next) => {
  try {
    const session =
      await req.body.tukhainBaaziinKholbolt.kholbolt.startSession();
    session.startTransaction();
    try {
      var khungulult = await KhungulultiinTuukh(req.body.tukhainBaaziinKholbolt).find({
        baiguullagiinId: req.body.baiguullagiinId,
        barilgiinId: req.body.barilgiinId
      });
      gereeniiDugaaruud = [];
      for (const x of khungulult)
      {
        x.khamaataiGereenuud.forEach((x) => {
          if (typeof x === "object") {
            gereeniiDugaaruud.push(x.gereeniiId);
          } else {
            gereeniiDugaaruud.push(x);
          }
        });
      }
      var gereenuud = await Geree(req.body.tukhainBaaziinKholbolt).find({
        _id: { $in: gereeniiDugaaruud },
      }).select("+avlaga");
      for await (const geree of gereenuud) {
        khyamdraluud = [];
        for (const x of khungulult)
        {
          var khungulultiinDun = x.khamaataiGereenuud?.find(
            (x) => x.gereeniiId == geree._id
          )?.khymdarsanDun;
          if(khungulultiinDun > 0)
          {
            for await (const ognoo of x.ognoonuud) {
              var filterGuilgeenuud = geree.avlaga?.guilgeenuud.filter((a) => a.turul === "khuvaari" && moment(a.ognoo).format("YYYY/MM") === moment(ognoo).format("YYYY/MM"));
              if(filterGuilgeenuud?.length > 0)
              {
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
      console.log("err1", err1);
      await session.abortTransaction();
      next(err1);
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
