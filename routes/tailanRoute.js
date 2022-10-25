const express = require('express');
const router = express.Router();
const { tokenShalgakh } = require("zevback");
const { borluulaltiinTailanAvya, avlagiinTailanAvya, zardaliinTailanAvya, ashigiinTailanAvya, analitikTailanAvya } = require("../controller/tailan");

router.route("/borluulaltiinTailanAvya").post(tokenShalgakh, borluulaltiinTailanAvya);
router.route("/avlagiinTailanAvya").post(tokenShalgakh, avlagiinTailanAvya);
router.route("/zardaliinTailanAvya").post(tokenShalgakh, zardaliinTailanAvya);
router.route("/ashigiinTailanAvya").post(tokenShalgakh, ashigiinTailanAvya);
router.route("/analitikTailanAvya").post(tokenShalgakh, analitikTailanAvya);
module.exports = router;