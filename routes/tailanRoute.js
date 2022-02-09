const express = require('express');
const router = express.Router();
const { tokenShalgakh } = require("zevback");
const { guitsetgeliinTailanAvya, avlagiinTailanAvya } = require("../controller/tailan");

router.route("/guitsetgeliinTailanAvya").post(tokenShalgakh, guitsetgeliinTailanAvya);
router.route("/avlagiinTailanAvya").post(tokenShalgakh, avlagiinTailanAvya);
module.exports = router;