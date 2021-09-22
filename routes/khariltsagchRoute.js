const express = require("express");
const multer = require("multer");
const router = express.Router();
const Khariltsagch = require("../models/khariltsagch");
const { crudWithFile, crud } = require("../components/crud");
const { tokenShalgakh } = require("../middlewares/tokenShalgakh");
const { bankniiDansniiJagsaaltAvya, bankniiDansniiKhuulgaAvya } = require("../controller/cgw");
crud(router, "khariltsagch", Khariltsagch);

router.route("/bankniiDansniiJagsaaltAvya").get(tokenShalgakh, bankniiDansniiJagsaaltAvya);
router.route("/bankniiDansniiKhuulgaAvya").post(tokenShalgakh, bankniiDansniiKhuulgaAvya);

module.exports = router;
