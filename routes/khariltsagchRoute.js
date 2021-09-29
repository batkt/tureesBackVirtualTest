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
const { khariltsagchZagvarAvya, khariltsagchTatya } = require("../controller/excel");

crud(router, "khariltsagch", Khariltsagch);

router.route("/bankniiDansniiJagsaaltAvya").get(tokenShalgakh, bankniiDansniiJagsaaltAvya);
router.route("/bankniiDansniiKhuulgaAvya").post(tokenShalgakh, bankniiDansniiKhuulgaAvya);
router.route("/bankniiKhuulgaTatajKhadgalya").post(tokenShalgakh, bankniiKhuulgaTatajKhadgalya);
router.route("/khariltsagchZagvarAvya").get(khariltsagchZagvarAvya);
router.route("/khariltsagchTatya").post(uploadFile.single("file"), tokenShalgakh, khariltsagchTatya);

module.exports = router;
