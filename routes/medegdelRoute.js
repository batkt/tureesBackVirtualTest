const express = require("express");
const router = express.Router();
const SanalGomdol = require("../models/sanalGomdol");
const Sonorduulga = require("../models/sonorduulga");
const { tokenShalgakh } = require("../middlewares/tokenShalgakh");
const { crud } = require("../components/crud");

const { sanalKhadgalya, sanalKharlaa } = require("../controller/medegdel");

crud(router, "sanalGomdol", SanalGomdol);
crud(router, "sonorduulga", Sonorduulga);

router.route("/sanalKhadgalya").post(tokenShalgakh, sanalKhadgalya);
router.route("/sanalKharlaa").post(tokenShalgakh, sanalKharlaa);

module.exports = router;
