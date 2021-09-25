const express = require("express");
const multer = require("multer");
const router = express.Router();
const Khariltsagch = require("../models/khariltsagch");
const { crudWithFile, crud } = require("../components/crud");
const { tokenShalgakh } = require("../middlewares/tokenShalgakh");
const storage = multer.memoryStorage();
const uploadFile = multer({
    storage: storage,
});
const { bankniiDansniiJagsaaltAvya, bankniiDansniiKhuulgaAvya, bankniiKhuulgaTatajKhadgalya } = require("../controller/cgw");
const {
    irgenZagvarAvya, irgenTatya
} = require("../controller/excel");

crud(router, "khariltsagch", Khariltsagch);

router.route("/bankniiDansniiJagsaaltAvya").get(tokenShalgakh, bankniiDansniiJagsaaltAvya);
router.route("/bankniiDansniiKhuulgaAvya").post(tokenShalgakh, bankniiDansniiKhuulgaAvya);;
router.route("/bankniiKhuulgaTatajKhadgalya").post(tokenShalgakh, bankniiKhuulgaTatajKhadgalya);
router.route("/irgenZagvarAvya").get(irgenZagvarAvya);;
router.route("/irgenTatya").post(uploadFile.single("file"), irgenTatya);

module.exports = router;
