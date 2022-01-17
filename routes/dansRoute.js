const express = require("express");
const router = express.Router();
const dans = require("../models/dans");
const { crud } = require("../components/crud");
crud(router, "dans", dans);
module.exports = router;
