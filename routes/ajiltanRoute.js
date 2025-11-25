const express = require("express");
const router = express.Router();
const Ajiltan = require("../models/ajiltan");
const NevtreltiinTuukh = require("../models/nevtreltiinTuukh");
const BackTuukh = require("../models/backTuukh");
const Baiguullaga = require("../models/baiguullaga");
const KassCameraKhaalt = require("../models/kassCameraKhaalt");
const request = require("request");
//const UstsanBarimt = require("../models/ustsanBarimt");
const {
  tokenShalgakh,
  crudWithFile,
  crud,
  UstsanBarimt,
  db,
} = require("zevbackv2");
const {
  ajiltanNevtrey,
  backAvya,
  tokenoorAjiltanAvya,
  nuutsUgShalgakhAjiltan,
  zochiniiTokenAvya,
  erkhiinMedeelelAvya,
  khugatsaaguiTokenAvya,
  baiguullagaIdgaarAvya,
} = require("../controller/ajiltan");
const aldaa = require("../components/aldaa");
const session = require("../models/session");

crudWithFile(
  router,
  "ajiltan",
  Ajiltan,
  {
    fileZam: "./zurag/ajiltan",
    fileName: "zurag",
  },
  UstsanBarimt,
  async (req, res, next) => {
    try {
      const { db } = require("zevbackv2");
      var ajiltanModel = Ajiltan(db.erunkhiiKholbolt);
      if (req.params.id) {
        var ObjectId = require("mongodb").ObjectId;
        var ajiltan = await ajiltanModel.findOne({
          nevtrekhNer: req.body.nevtrekhNer,
          _id: { $ne: ObjectId(req.params.id) },
        });
        if (ajiltan) throw new Error("Нэвтрэх нэр давхардаж байна!");
      } else {
        if (req.body.nevtrekhNer) {
          var ajiltan = await ajiltanModel.findOne({
            nevtrekhNer: req.body.nevtrekhNer,
          });
          if (ajiltan) throw new Error("Нэвтрэх нэр давхардаж байна!");
        }
      }
      next();
    } catch (error) {
      next(error);
    }
  }
);
crud(router, "nevtreltiinTuukh", NevtreltiinTuukh, UstsanBarimt);
crud(router, "backTuukh", BackTuukh, UstsanBarimt);
crud(router, "session", session, UstsanBarimt);

router.get("/sessionAvya/:sessionId", async (req, res, next) => {
  try {
    const sessionId = req.params.sessionId;
    const { db } = require("zevbackv2");
    const sessionData = await session(db.erunkhiiKholbolt).findById(sessionId);

    if (!sessionData) {
      throw new aldaa("Session олдсонгүй");
    }
    res.send(sessionData);
  } catch (err) {
    next(err);
  }
});

router.route("/ajiltanNevtrey").post(ajiltanNevtrey);
router.route("/tokenoorAjiltanAvya").post(tokenoorAjiltanAvya);
router.route("/nuutsUgShalgakhAjiltan").post(nuutsUgShalgakhAjiltan);
router.route("/zochiniiTokenAvya/:baiguullagiinId").get(zochiniiTokenAvya);
router.route("/khugatsaaguiTokenAvya").post(khugatsaaguiTokenAvya);
router.route("/erkhiinMedeelelAvya").post(tokenShalgakh, erkhiinMedeelelAvya);
router
  .route("/baiguullagaIdgaarAvya")
  .post(tokenShalgakh, baiguullagaIdgaarAvya);
router.get("/ajiltniiZuragAvya/:baiguullaga/:ner", (req, res, next) => {
  const fileName = req.params.ner;
  const directoryPath = "zurag/ajiltan/" + req.params.baiguullaga + "/";
  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      next(err);
    }
  });
});

router.get("/ustsanBarimt", tokenShalgakh, async (req, res, next) => {
  try {
    const body = req.query;
    const {
      query = {},
      order,
      khuudasniiDugaar = 1,
      khuudasniiKhemjee = 10,
      search,
      collation = {},
      select = {},
    } = body;
    if (!!body?.query) body.query = JSON.parse(body.query);
    if (req.body.baiguullagiinId) {
      if (!body.query) body.query = {};
      body.query["baiguullagiinId"] = req.body.baiguullagiinId;
    }
    if (!!body?.order) body.order = JSON.parse(body.order);
    if (!!body?.select) body.select = JSON.parse(body.select);
    if (!!body?.collation) body.collation = JSON.parse(body.collation);
    if (!!body?.khuudasniiDugaar)
      body.khuudasniiDugaar = Number(body.khuudasniiDugaar);
    if (!!body?.khuudasniiKhemjee)
      body.khuudasniiKhemjee = Number(body.khuudasniiKhemjee);
    let jagsaalt = await UstsanBarimt(req.body.tukhainBaaziinKholbolt)
      .find(body.query)
      .sort(body.order)
      .collation(body.collation ? body.collation : {})
      .skip((body.khuudasniiDugaar - 1) * body.khuudasniiKhemjee)
      .limit(body.khuudasniiKhemjee);
    let niitMur = await UstsanBarimt(
      req.body.tukhainBaaziinKholbolt
    ).countDocuments(body.query);
    let niitKhuudas =
      niitMur % khuudasniiKhemjee == 0
        ? Math.floor(niitMur / khuudasniiKhemjee)
        : Math.floor(niitMur / khuudasniiKhemjee) + 1;
    if (jagsaalt != null) jagsaalt.forEach((mur) => (mur.key = mur._id));
    res.send({
      khuudasniiDugaar,
      khuudasniiKhemjee,
      jagsaalt,
      niitMur,
      niitKhuudas,
    });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/tsonkhniiErkhiinTooAvya",
  tokenShalgakh,
  async (req, res, next) => {
    try {
      const { db } = require("zevbackv2");
      if (req.body.erkhuud && req.body.erkhuud.length > 0)
        var moduluud = req.body.erkhuud;
      var baiguullaga = await Baiguullaga(db.erunkhiiKholbolt).findOne({
        register: req.body.register,
      });
      for await (const element of moduluud) {
        var queryAjiltan = {
          tsonkhniiErkhuud: element.zam,
          baiguullagiinId: baiguullaga._id,
        };
        var ajiltanErkhiinToo = await Ajiltan(
          db.erunkhiiKholbolt
        ).countDocuments(queryAjiltan);
        element.odoogiin = ajiltanErkhiinToo;
      }
      res.send(moduluud);
    } catch (error) {
      next(error);
    }
  }
);

router.post("/ajiltandTokenOnooyo", tokenShalgakh, (req, res, next) => {
  try {
    const { db } = require("zevbackv2");
    let filter = {
      _id: req.body.id,
    };
    let update = {
      firebaseToken: req.body.token,
    };
    Ajiltan(db.erunkhiiKholbolt)
      .updateOne(filter, update)
      .then((result) => {
        res.send("Amjilttai");
      })
      .catch((err) => {
        next(err);
      });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/ajiltniiTokhirgooZasya",
  tokenShalgakh,
  async (req, res, next) => {
    try {
      const { db } = require("zevbackv2");
      if (!!req.body) {
        const { turul, ajiltnuud } = req.body;
        for await (const ajiltan of ajiltnuud) {
          await Ajiltan(db.erunkhiiKholbolt)
            .updateOne(
              { _id: ajiltan._id },
              { $set: { [turul]: ajiltan.utga } }
            )
            .catch((err) => {
              next(err);
            });
        }
        res.send("Amjilttai");
      } else next(new aldaa("Засах боломжгүй байна"));
    } catch (error) {
      next(error);
    }
  }
);

router.post("/ajiltandErkhUgyu/:id", tokenShalgakh, async (req, res, next) => {
  try {
    const { db } = require("zevbackv2");
    if (!!req.body) {
 
      if (!req.body.baiguullagiinId) {
        return next(new aldaa("Ажилтанд барилгын тохиргоо хийгдээгүй байна"));
      }

      var baiguullaga = await Baiguullaga(db.erunkhiiKholbolt).findById(
        req.body.baiguullagiinId
      );

      if (!baiguullaga) {
        return next(new aldaa("Ажилтанд барилгын тохиргоо хийгдээгүй байна"));
      }

      var ajiltan = new Ajiltan(db.erunkhiiKholbolt)({
        _id: req.params.id,
        ...req.body,
      });
      await Ajiltan(db.erunkhiiKholbolt).updateOne(
        { _id: req.params.id },
        ajiltan
      );

      if (req.body.erkhuud && req.body.erkhuud.length > 0) {
        for await (const element of req.body.erkhuud) {
          var queryAjiltan = {
            tsonkhniiErkhuud: element.zam,
            baiguullagiinId: req.body.baiguullagiinId,
          };
          var ajiltanErkhiinToo = await Ajiltan(
            db.erunkhiiKholbolt
          ).countDocuments(queryAjiltan);
          element.too = ajiltanErkhiinToo;
        }

        var ilgeekhBody = {
          register: baiguullaga.register,
          erkhuud: req.body.erkhuud,
        };
        await request.post(
          "http://103.143.40.123:8282/erkhOruulya",
          { json: true, body: ilgeekhBody },
          (err, res1, body) => {
            if (err) next(err);
          }
        );
      }

      res.send("Amjilttai");
    } else {
      next(new aldaa("Засах боломжгүй байна"));
    }
  } catch (error) {
    next(error);
  }
});

router.post("/erkhteiEsekh", tokenShalgakh, async (req, res, next) => {
  try {
    const { db } = require("zevbackv2");
    if (!!req.body.zam) {
      const khariu = await Ajiltan(db.erunkhiiKholbolt)
        .countDocuments({
          _id: req.body.nevtersenAjiltniiToken?.id,
          $or: [{ tsonkhniiErkhuud: req.body.zam }, { erkh: "Admin" }],
        })
        .catch((err) => {
          next(err);
        });
      res.send(!!khariu);
    } else next(new aldaa("Засах боломжгүй байна"));
  } catch (error) {
    next(error);
  }
});

router.post("/backAvya", tokenShalgakh, backAvya);

router.get("/ustsanBarimtTurees", tokenShalgakh, async (req, res, next) => {
  try {
    const { db } = require("zevbackv2");
    const body = req.query;
    const {
      query = {},
      order,
      khuudasniiDugaar = 1,
      khuudasniiKhemjee = 10,
      search,
      collation = {},
      select = {},
    } = body;
    if (!!body?.query) body.query = JSON.parse(body.query);
    if (req.body.baiguullagiinId) {
      if (!body.query) body.query = {};
      body.query["baiguullagiinId"] = req.body.baiguullagiinId;
    }
    if (!!body?.order) body.order = JSON.parse(body.order);
    if (!!body?.select) body.select = JSON.parse(body.select);
    if (!!body?.collation) body.collation = JSON.parse(body.collation);
    if (!!body?.khuudasniiDugaar)
      body.khuudasniiDugaar = Number(body.khuudasniiDugaar);
    if (!!body?.khuudasniiKhemjee)
      body.khuudasniiKhemjee = Number(body.khuudasniiKhemjee);
    let jagsaalt = await UstsanBarimt(db.erunkhiiKholbolt)
      .find(body.query)
      .sort(body.order)
      .collation(body.collation ? body.collation : {})
      .skip((body.khuudasniiDugaar - 1) * body.khuudasniiKhemjee)
      .limit(body.khuudasniiKhemjee);
    let niitMur = await UstsanBarimt(db.erunkhiiKholbolt).countDocuments(
      body.query
    );
    let niitKhuudas =
      niitMur % khuudasniiKhemjee == 0
        ? Math.floor(niitMur / khuudasniiKhemjee)
        : Math.floor(niitMur / khuudasniiKhemjee) + 1;
    if (jagsaalt != null) jagsaalt.forEach((mur) => (mur.key = mur._id));
    res.send({
      khuudasniiDugaar,
      khuudasniiKhemjee,
      jagsaalt,
      niitMur,
      niitKhuudas,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/licenseOgnooAvya", tokenShalgakh, async (req, res, next) => {
  try {
    request.get(
      "http://103.143.40.123:8282/baiguullagiinDuusakhKhugatsaaAvya",
      { json: true, body: { register: req.body.register, system: "Turees" } },
      (err, res1, body) => {
        if (err) next(err);
        else {
          res.send(body);
        }
      }
    );
  } catch (error) {
    next(error);
  }
});

router.post(
  "/ekhniiNevtersenOgnooAvya",
  tokenShalgakh,
  async (req, res, next) => {
    try {
      const { db } = require("zevbackv2");

      const unuudurEhkelsenee = new Date();
      unuudurEhkelsenee.setHours(0, 0, 0, 0);
      const endOfToday = new Date(unuudurEhkelsenee);
      endOfToday.setDate(endOfToday.getDate() + 1);

      const {
        baiguullagiinId,
        ajiltniiId,
        barilgiinId,
        garsanCameraIp,
        zogsooliinId,
        tukhainBaaziinKholbolt,
        nevtersenOgnoo: huselteeNevtersenOgnoo,
      } = req.body;

      const Nevtreltiin = NevtreltiinTuukh(db.erunkhiiKholbolt);
      const Kass = KassCameraKhaalt(tukhainBaaziinKholbolt);

      const nevtreltiinJagsaalt = await Nevtreltiin.find({
        baiguullagiinId,
        ajiltniiId,
        ognoo: { $gte: unuudurEhkelsenee, $lt: endOfToday },
      })
        .sort({ ognoo: 1 })
        .select({ ognoo: 1, _id: 0 })
        .lean();

      const kassByNevtersenOgnoo = new Map();

      if (nevtreltiinJagsaalt.length > 0) {
        const kassJagsaalt = await Kass.find({
          baiguullagiinId,
          barilgiinId,
          ajiltniiId,
          garsanCameraIp,
          zogsooliinId,
          nevtersenOgnoo: { $in: nevtreltiinJagsaalt.map((it) => it.ognoo) },
        }).lean();

        for (const mur of kassJagsaalt) {
          const tulkhuur = new Date(mur.nevtersenOgnoo).getTime();
          if (!kassByNevtersenOgnoo.has(tulkhuur)) {
            kassByNevtersenOgnoo.set(tulkhuur, mur);
          }
        }
      }

      const MAX_DAVTALT = 50;
      const tsikliinMedeelel = [];

      let haikhTsesMs = unuudurEhkelsenee.getTime();
      let davtaltToo = 0;
      let maxDavtaltDavsan = false;

      for (const nevtrelt of nevtreltiinJagsaalt) {
        const nevtersenMs = new Date(nevtrelt.ognoo).getTime();
        if (nevtersenMs < haikhTsesMs) continue;

        const kassMur = kassByNevtersenOgnoo.get(nevtersenMs) ?? null;
        const odoogiinKhaaltOgnoo = kassMur?.khaaltOgnoo ?? null;

        tsikliinMedeelel.push({
          nevtreltiinTuukh: [{ ognoo: nevtrelt.ognoo }],
          kassCameraKhaalt: kassMur ? [kassMur] : [],
          nevtersenOgnoo: nevtrelt.ognoo,
          khaaltOgnoo: odoogiinKhaaltOgnoo,
        });

        if (!odoogiinKhaaltOgnoo) break;

        const daraagiinEhlel = new Date(odoogiinKhaaltOgnoo);
        daraagiinEhlel.setMilliseconds(daraagiinEhlel.getMilliseconds() + 1);
        haikhTsesMs = daraagiinEhlel.getTime();

        davtaltToo++;
        if (davtaltToo >= MAX_DAVTALT) {
          maxDavtaltDavsan = true;
          break;
        }
      }

      if (maxDavtaltDavsan) {
        return res.status(400).json({
          success: false,
          message: "Мөчлөг хэт урт байна (MAX_DAVTALT). Өгөгдлөө шалгана уу.",
        });
      }

      let nevtreltiinTuukh = [];
      let kassCameraKhaalt = [];
      let nevtersenOgnoo = null;
      let khaaltOgnoo = null;

      if (tsikliinMedeelel.length > 0) {
        let songogdsonTsig = null;

        if (huselteeNevtersenOgnoo) {
          const target = new Date(huselteeNevtersenOgnoo).getTime();
          if (!isNaN(target)) {
            songogdsonTsig = tsikliinMedeelel.find((it) => {
              const t = new Date(it.nevtersenOgnoo).getTime();
              return Math.abs(t - target) < 1000;
            });
          }
        }

        if (!songogdsonTsig) {
          songogdsonTsig = tsikliinMedeelel[tsikliinMedeelel.length - 1];
        }

        nevtreltiinTuukh = songogdsonTsig.nevtreltiinTuukh;
        kassCameraKhaalt = songogdsonTsig.kassCameraKhaalt;
        nevtersenOgnoo = songogdsonTsig.nevtersenOgnoo ?? null;
        khaaltOgnoo = songogdsonTsig.khaaltOgnoo ?? null;
      }

      res.json({
        success: true,
        data: {
          nevtreltiinTuukh,
          kassCameraKhaalt,
          nevtersenOgnoo,
          khaaltOgnoo,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
