const express = require("express");
const router = express.Router();
const Zardal = require("../models/zardal");
const UstsanBarimt = require("../models/ustsanBarimt");
const { tokenShalgakh, crud } = require("zevback");

crud(router, "zardal", Zardal, UstsanBarimt);
module.exports = router;
