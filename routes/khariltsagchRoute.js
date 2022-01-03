const express = require("express");
const multer = require("multer");
const router = express.Router();
const Khariltsagch = require("../models/khariltsagch");
const { crud } = require("../components/crud");
const { tokenShalgakh } = require("../middlewares/tokenShalgakh");
const storage = multer.memoryStorage();
const uploadFile = multer({
  storage: storage,
});
const {
  bankniiDansniiJagsaaltAvya,
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
const { sonorduulgaIlgeeye } = require("../controller/appNotification");

crud(router, "khariltsagch", Khariltsagch);

router.route("/khariltsagchNevtrey").post(khariltsagchNevtrey);
router.route("/tokenoorKhariltsagchAvya").post(tokenoorKhariltsagchAvya)
router.route("/khariltsagchidTokenOnooyo").post(khariltsagchidTokenOnooyo);
router.route("/khariltsagchiinTooAvya/:barilgiinId").get(tokenShalgakh, khariltsagchiinTooAvya);
router.route("/bankniiDansniiJagsaaltAvya").get(tokenShalgakh, bankniiDansniiJagsaaltAvya);
router.route("/bankniiDansniiKhuulgaAvya").post(tokenShalgakh, bankniiDansniiKhuulgaAvya);
router.route("/qpayGargaya").post(tokenShalgakh, qpayGargaya);
router.route("/qpayTulye/:baiguullagiinId/:barilgiinId/:dugaar").get(qpayTulye);
router.route("/bankniiKhuulgaTatajKhadgalya").post(tokenShalgakh, bankniiKhuulgaTatajKhadgalya);
router.route("/khariltsagchZagvarAvya").get(khariltsagchZagvarAvya);
router.route("/khariltsagchTatya").post(uploadFile.single("file"), tokenShalgakh, khariltsagchTatya);
router.route("/sonorduulgaIlgeeye").post(tokenShalgakh,(req,res,next)=>{
  const {token,medeelel} = req.body
  sonorduulgaIlgeeye(token,medeelel,(r)=>res.send(r),next)
})


module.exports = router;
