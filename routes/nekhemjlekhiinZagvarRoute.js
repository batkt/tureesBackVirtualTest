const express = require("express");
const router = express.Router();
const nekhemjlekhiinZagvar = require("../models/nekhemjlekhiinZagvar");
//const { crud } = require("../components/crud");
const UstsanBarimt = require("../models/ustsanBarimt");
const { crud } = require("zevback");

crud(router, "nekhemjlekhiinZagvar", nekhemjlekhiinZagvar, UstsanBarimt);

module.exports = router;
