const express = require("express");
const router = express.Router();
const medegdel = require("../models/medegdel");
const { tokenShalgakh } = require("../middlewares/tokenShalgakh");
const { crud } = require("../components/crud");

const { medegdelKhadgalya, medegdelKharlaa } = require("../controller/medegdel");

crud(router, "medegdel", medegdel);

router.route("/medegdelKhadgalya").post(tokenShalgakh, medegdelKhadgalya);
router.route("/medegdelKharlaa").post(tokenShalgakh, medegdelKharlaa);

module.exports = router;
