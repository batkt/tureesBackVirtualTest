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
} = require("../controller/cgw");

const { qpayGargaya, qpayTulye } = require("../controller/qpay");

const {
  khariltsagchNevtrey,
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
      if (!req.body.register) throw new Error("Регистрийн дугаар бөглөнө үү!");
      else {
        var khariltsagch = await Khariltsagch(
          req.body.tukhainBaaziinKholbolt
        ).findOne({
          register: req.body.register,
          baiguullagiinId: req.body.baiguullagiinId,
          barilgiinId: req.body.barilgiinId,
        });
        if (khariltsagch)
          throw new Error(
            "Тухайн регистрийн дугаараар харилцагч бүртгэлтэй байна!"
          );
        else if (Array.isArray(req.body.utas)) {
          khariltsagch = await Khariltsagch(
            req.body.tukhainBaaziinKholbolt
          ).findOne({
            utas: { $in: req.body.utas },
            baiguullagiinId: req.body.baiguullagiinId,
            barilgiinId: req.body.barilgiinId,
          });
          if (khariltsagch)
            throw new Error(
              "Тухайн утасны дугаараар харилцагч бүртгэлтэй байна!"
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
router.route("/qpayGargaya").post(tokenShalgakh, qpayGargaya);
router.route("/qpayTulye/:baiguullagiinId/:barilgiinId/:dugaar").get(qpayTulye);
router
  .route("/bankniiKhuulgaTatajKhadgalya")
  .post(tokenShalgakh, bankniiKhuulgaTatajKhadgalya);
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
      Khariltsagch(req.body.tukhainBaaziinKholbolt)
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
          Khariltsagch(req.body.tukhainBaaziinKholbolt)
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
      var davkhar = req.body.davkhar;
      var matchQuery = {};
      var query = [
        {
          $match: {
            baiguullagiinId: req.body.baiguullagiinId,
            barilgiinId: req.body.barilgiinId,
          },
        },
        {
          $lookup: {
            from: "geree",
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
                      { $eq: ["$baiguullagiinId", "$$baiguullagiinId"] },
                      { $eq: ["$barilgiinId", "$$barilgiinId"] },
                    ],
                  },
                },
              },
            ],
            as: "geree",
          },
        },
      ];
      if (req.body.query) matchQuery = req.body.query;
      if (davkhar) {
        matchQuery["geree.davkhar"] = davkhar;
        matchQuery["geree.tuluv"] = { $nin: [-1] };
      }
      if (matchQuery)
        query.push({
          $match: matchQuery,
        });
      query.push({
        $project: {
          geree: 0,
        },
      });
      var result = await Khariltsagch(
        req.body.tukhainBaaziinKholbolt
      ).aggregate(query);
      res.send(result);
    } catch (error) {
      next(error);
    }
  });

module.exports = router;
