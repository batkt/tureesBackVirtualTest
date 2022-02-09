const express = require('express');
const router = express.Router();
const { tokenShalgakh } = require("zevback");
const { guitsetgeliinTailanAvya } = require("../controller/tailan");

router.route("/guitsetgeliinTailanAvya").post(tokenShalgakh, guitsetgeliinTailanAvya);
module.exports = router;