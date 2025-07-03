const express = require("express");
const multer = require("multer");
const router = express.Router();
const Khariltsagch = require("../models/khariltsagch");
const Geree = require("../models/geree");
//const { crud } = require("../components/crud");
//const { tokenShalgakh } = require("../middlewares/tokenShalgakh");
//const UstsanBarimt = require("../models/ustsanBarimt");
const { tokenShalgakh, crud, UstsanBarimt } = require("zevbackv2");
const storage = multer.memoryStorage();
const uploadFile = multer({ storage: storage });
const {
  dansniiUldegdelAvya,
  bankniiKhuulgaTatajKhadgalya,
  tdbUldegdelShalgay,
} = require("../controller/cgw");

const { qpayGargaya, qpayTulye } = require("../controller/qpay");

const {
  khariltsagchNevtrey,
  khariltsagchNuutsUgSolikh,
  sergeekhKodAvya,
  nuutsUgSergeeye,
  khariltsagchidTokenOnooyo,
  tokenoorKhariltsagchAvya,
} = require("../controller/khariltsagch");

const {
  khariltsagchiinTooAvya,
  khyanakhSambariinUgugdul,
} = require("../controller/toololt");

const {
  khariltsagchZagvarAvya,
  khariltsagchTatya,
} = require("../controller/excel");

crud(
  router,
  "khariltsagch",
  Khariltsagch,
  UstsanBarimt,
  async (req, res, next) => {
    try {
      const { db } = require("zevbackv2");
      if (!req.body.register && !req.body.customerTin) throw new Error("Бүртгэлийн дугаар эсвэл Регистрийн дугаар бөглөнө үү!");
      else {
        if(!!req.body.register)
        {
          var khariltsagch = await Khariltsagch(db.erunkhiiKholbolt).findOne({
            register: req.body.register,
            baiguullagiinId: req.body.baiguullagiinId,
            barilgiinId: req.body.barilgiinId,
          });
          if (khariltsagch)
            throw new Error(
              "Тухайн регистрийн дугаараар харилцагч бүртгэлтэй байна!"
            );
        }
        if(!!req.body.customerTin)
        {
          var khariltsagch = await Khariltsagch(db.erunkhiiKholbolt).findOne({
            customerTin: req.body.customerTin,
            baiguullagiinId: req.body.baiguullagiinId,
            barilgiinId: req.body.barilgiinId,
          });
          if (khariltsagch)
            throw new Error(
              "Тухайн бүртгэлийн дугаараар харилцагч бүртгэлтэй байна!"
            );
        }
      }
      next();
    } catch (error) {
      next(error);
    }
  }
);

router.route("/khariltsagchNevtrey").post(khariltsagchNevtrey);
router.route("/khariltsagchNuutsUgSolikh").post(khariltsagchNuutsUgSolikh);
router.route("/sergeekhKodAvya").post(sergeekhKodAvya);
router.route("/nuutsUgSergeeye").post(nuutsUgSergeeye);
router.route("/tokenoorKhariltsagchAvya").post(tokenoorKhariltsagchAvya);
router.route("/khariltsagchidTokenOnooyo").post(khariltsagchidTokenOnooyo);
router
  .route("/khariltsagchiinTooAvya/:barilgiinId")
  .get(tokenShalgakh, khariltsagchiinTooAvya);
router
  .route("/khyanakhSambariinUgugdul")
  .post(tokenShalgakh, khyanakhSambariinUgugdul);
router.route("/dansniiUldegdelAvya").post(tokenShalgakh, dansniiUldegdelAvya);
// router.route("/qpayGargaya").post(tokenShalgakh, qpayGargaya);
router.route("/qpayTulye/:baiguullagiinId/:barilgiinId/:dugaar").get(qpayTulye);
router
  .route("/bankniiKhuulgaTatajKhadgalya")
  .post(tokenShalgakh, bankniiKhuulgaTatajKhadgalya);
router.route("/tdbUldegdelShalgay").post(tokenShalgakh, tdbUldegdelShalgay);
router
  .route("/khariltsagchZagvarAvya")
  .get(tokenShalgakh, khariltsagchZagvarAvya);
router
  .route("/khariltsagchTatya")
  .post(uploadFile.single("file"), tokenShalgakh, khariltsagchTatya);
router
  .route("/khariltsagchUstgaya")
  .post(tokenShalgakh, async (req, res, next) => {
    try {
      const { db } = require("zevbackv2");
      Khariltsagch(db.erunkhiiKholbolt)
        .findOne({
          _id: req.body.id,
        })
        .then(async (result) => {
          var geree = await Geree(req.body.tukhainBaaziinKholbolt).findOne({
            tuluv: 1,
            register: result.register,
            barilgiinId: result.barilgiinId,
            baiguullagiinId: result.baiguullagiinId,
          });
          if (geree)
            throw new Error(
              "Тухайн харилцагч дээр идэвхитэй гэрээ байгаа тул устгах боломжгүй!"
            );
          var barimt = new UstsanBarimt(req.body.tukhainBaaziinKholbolt)();
          barimt.class = "Khariltsagch";
          barimt.object = result;
          if (req.body.nevtersenAjiltniiToken) {
            barimt.ajiltniiNer = req.body.nevtersenAjiltniiToken.ner;
            barimt.ajiltniiId = req.body.nevtersenAjiltniiToken.id;
          }
          barimt.baiguullagiinId = req.body.baiguullagiinId;
          barimt.isNew = true;
          barimt.save();
          Khariltsagch(db.erunkhiiKholbolt)
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

router
  .route("/khariltsagchDavkhraarAvya")
  .post(tokenShalgakh, async (req, res, next) => {
    try {
      const { db } = require("zevbackv2");
      var davkhar = req.body.davkhar;
      var matchQuery = {
        baiguullagiinId: req.body.baiguullagiinId,
        barilgiinId: req.body.barilgiinId,
      };
      if (req.body.query) matchQuery = req.body.query;
      var query = [
        {
          $match: matchQuery,
        }
      ]
      var result = [];
      var jagsaalt = await Khariltsagch(db.erunkhiiKholbolt).aggregate(query);
      console.log("jagsaalt length ---------------- " + JSON.stringify(jagsaalt?.length));
      if(jagsaalt?.length > 0)
      {
        var matchGeree = {
          baiguullagiinId: req.body.baiguullagiinId,
          barilgiinId: req.body.barilgiinId,  
          gereeniiDugaar: { $exists: true },
          tuluv: { $nin: [-1] },
        }
        if (davkhar?.length > 0) {
          matchGeree["davkhar"] = { $in: davkhar};
        }
        query = [
          {
            $match: matchGeree,
          }
        ]
        var gereeResult = await Geree(req.body.tukhainBaaziinKholbolt).aggregate(query);
        console.log("gereeResult length ---------------- " + JSON.stringify(gereeResult?.length));
        if(gereeResult?.length > 0)
        {
          for await (const khariltsagch of jagsaalt){
            var talbainDugaar = [];
            var utas = [];
            var filteredGeree = gereeResult?.find((a) => a.register == khariltsagch.register || a.register == khariltsagch.customerTin);
            console.log("filteredGeree length ---------------- " + JSON.stringify(filteredGeree?.length));
            if(filteredGeree?.length)
            {
              for await (const geree of filteredGeree)
              {
                if (geree.talbainDugaar.includes(",")) {
                  talbainDugaar = [...talbainDugaar, ...geree.talbainDugaar.split(",")];
                } else talbainDugaar.push(geree.talbainDugaar);
                utas = [...utas, ...geree.utas];
              }
              khariltsagch.talbainDugaar = talbainDugaar;
              khariltsagch.utas = utas;
              result.push(khariltsagch);
            }
          }
        }
      }
      console.log("result length ---------------- " + JSON.stringify(result?.length));
      res.send(result);
    } catch (error) {
      console.log("error ---------------- " + error);
      next(error);
    }
  });

  router
  .route("/khariltsagchInsert")
  .post(tokenShalgakh, async (req, res, next) => {
    try {
      const { db } = require("zevbackv2");
      var jagsaalt = [];
      var matchQuery = { baiguullagiinId: req.body.baiguullagiinId };
      if(!!req.body.barilgiinId)
        matchQuery["barilgiinId"] = req.body.barilgiinId
      var resultTukhain = await Khariltsagch(db.erunkhiiKholbolt).find(matchQuery);
      if(resultTukhain?.length > 0)
      {
        for await (const data of resultTukhain)
        {
          matchQuery = { baiguullagiinId: req.body.baiguullagiinId, register: data?.register };
          if(!!req.body.barilgiinId)
            matchQuery["barilgiinId"] = req.body.barilgiinId
          var result = await Khariltsagch(req.body.tukhainBaaziinKholbolt).find(matchQuery);
          if(result?.length === 0)  
            jagsaalt.push(data);
        }
      }
      Khariltsagch(req.body.tukhainBaaziinKholbolt).insertMany(jagsaalt, function (err) {
        if (err) {
          next(err);
        }
        res.status(200).send("Amjilttai");
      });
    } catch (error) {
      next(error);
    }
  });

module.exports = router;
