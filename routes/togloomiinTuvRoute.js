const express = require("express");
const router = express.Router();
const { crud, UstsanBarimt } = require("zevbackv2");
const { Pool } = require("pg");
const TogloomiinTariff = require("../models/togloomiinTariff");
const TogloomiinTuv = require("../models/togloomiinTuv");

crud(router, "togloomiinTariff", TogloomiinTariff, UstsanBarimt);
crud(router, "togloomiinTuv", TogloomiinTuv, UstsanBarimt);

module.exports = router;
