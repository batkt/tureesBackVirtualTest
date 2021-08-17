const express = require("express");
const multer = require("multer");
const router = express.Router();
const Khariltsagch = require("../models/khariltsagch");
const { crudWithFile, crud } = require("../components/crud");
const { tokenShalgakh } = require("../middlewares/tokenShalgakh");

crud(router, "khariltsagch", Khariltsagch);

module.exports = router;
