const express = require("express");
const router = express.Router();
const nekhemjlekhiinZagvar = require("../models/nekhemjlekhiinZagvar");
const { crud } = require("../components/crud");

crud(router, "nekhemjlekhiinZagvar", nekhemjlekhiinZagvar);

module.exports = router;
