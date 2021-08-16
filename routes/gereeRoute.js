const express = require("express");
const router = express.Router();
const Geree = require("../models/geree");
const { crud } = require("../components/crud");

crud(router, "geree", Geree);

module.exports = router;
