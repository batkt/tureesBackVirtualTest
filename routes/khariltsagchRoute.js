const express = require("express");
const multer = require("multer");
const router = express.Router();
const Khariltsagch = require("../models/khariltsagch");
const Geree = require("../models/geree");
//const { crud } = require("../components/crud");
//const { tokenShalgakh } = require("../middlewares/tokenShalgakh");
const UstsanBarimt = require("../models/ustsanBarimt");
const { tokenShalgakh, crud } = require("zevback");
const storage = multer.memoryStorage();
const uploadFile = multer({ storage: storage });
const {
  bankniiDansniiJagsaaltAvya,
  dansniiUldegdelAvya,
  bankniiDansniiKhuulgaAvya,
  bankniiKhuulgaTatajKhadgalya,
} = require("../controller/cgw");

const {
  qpayGargaya,
  qpayTulye
} = require("../controller/qpay");

const {
  khariltsagchNevtrey,
  khariltsagchidTokenOnooyo,
  tokenoorKhariltsagchAvya
} = require('../controller/khariltsagch')

const {
  khariltsagchiinTooAvya
} = require("../controller/toololt");

const { khariltsagchZagvarAvya, khariltsagchTatya } = require("../controller/excel");

crud(router, "khariltsagch", Khariltsagch, UstsanBarimt);

router.route("/khariltsagchNevtrey").post(khariltsagchNevtrey);
router.route("/tokenoorKhariltsagchAvya").post(tokenoorKhariltsagchAvya)
router.route("/khariltsagchidTokenOnooyo").post(khariltsagchidTokenOnooyo);
router.route("/khariltsagchiinTooAvya/:barilgiinId").get(tokenShalgakh, khariltsagchiinTooAvya);
router.route("/bankniiDansniiJagsaaltAvya").get(tokenShalgakh, bankniiDansniiJagsaaltAvya);
router.route("/dansniiUldegdelAvya").post(tokenShalgakh, dansniiUldegdelAvya);
router.route("/bankniiDansniiKhuulgaAvya").post(tokenShalgakh, bankniiDansniiKhuulgaAvya);
router.route("/qpayGargaya").post(tokenShalgakh, qpayGargaya);
router.route("/qpayTulye/:baiguullagiinId/:barilgiinId/:dugaar").get(qpayTulye);
router.route("/bankniiKhuulgaTatajKhadgalya").post(tokenShalgakh, bankniiKhuulgaTatajKhadgalya);
router.route("/khariltsagchZagvarAvya").get(khariltsagchZagvarAvya);
router.route("/khariltsagchTatya").post(uploadFile.single("file"), tokenShalgakh, khariltsagchTatya);

router.route("/khariltsagchUstgaya").post(tokenShalgakh, async (req, res, next) => {
  try {
    Khariltsagch.findOne({
      _id: req.body.id,
    }).then(async (result) => {
      var geree = await Geree.findOne({ tuluv: 1, register: result.register, barilgiinId: result.barilgiinId, baiguullagiinId: result.baiguullagiinId });
      if (geree)
        throw new Error("Тухайн харилцагч дээр идэвхитэй гэрээ байгаа тул устгах боломжгүй!");
      var barimt = new UstsanBarimt();
      barimt.class = modelName;
      barimt.object = result;
      if (req.body.nevtersenAjiltniiToken) {
        barimt.ajiltniiNer = req.body.nevtersenAjiltniiToken.ner;
        barimt.ajiltniiId = req.body.nevtersenAjiltniiToken.id;
      }
      barimt.baiguullagiinId = req.body.baiguullagiinId;
      barimt.isNew = true;
      barimt.save();
      Model.deleteOne({
        _id: req.body.id,
      })
        .then((result) => {
          res.send("Amjilttai");
        })
        .catch((err) => {
          next(err);
        });
    }).catch((err) => {
      next(err);
    });
  }
  catch (err) {
    next(err);
  }
});


module.exports = router;
