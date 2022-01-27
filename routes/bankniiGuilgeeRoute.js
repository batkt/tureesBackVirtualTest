const express = require("express");
const router = express.Router();
const BankniiGuilgee = require("../models/bankniiGuilgee");
const { tdbcer } = require("../kholbolt/tdbcer");
const {
  bankniiGuilgeeToololtAvya
} = require("../controller/toololt");

const {
  crud
} = require('../components/crud');
const {
  tokenShalgakh
} = require("../middlewares/tokenShalgakh");

crud(router, 'bankniiGuilgee', BankniiGuilgee)
router.post("/bankniiGuilgeeToololtAvya", tokenShalgakh, bankniiGuilgeeToololtAvya);
router.post("/tdbcer", tdbcer);

module.exports = router;