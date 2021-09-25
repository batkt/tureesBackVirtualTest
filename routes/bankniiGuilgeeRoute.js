const express = require("express");
const router = express.Router();
const BankniiGuilgee = require("../models/bankniiGuilgee");

const {
  crud
} = require('../components/crud');
const {
  tokenShalgakh
} = require("../middlewares/tokenShalgakh");

crud(router, 'bankniiGuilgee', BankniiGuilgee)

module.exports = router;