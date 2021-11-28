const express = require("express");
const router = express.Router();
const medegdel = require("../models/medegdel");
const { crud } = require("../components/crud");

crud(router, "medegdel", medegdel);

module.exports = router;
