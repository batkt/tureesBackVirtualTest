const express = require("express");
const router = express.Router();
const Sanal = require("../models/sanal");
const Gomdol = require("../models/gomdol");
const { tokenShalgakh } = require("../middlewares/tokenShalgakh");
const { crud } = require("../components/crud");

const { sanalKhadgalya, sanalKharlaa, gomdolKhadgalya, gomdolKharlaa } = require("../controller/medegdel");

crud(router, "sanal", Sanal);
crud(router, "gomdol", Gomdol);

router.route("/sanalKhadgalya").post(tokenShalgakh, sanalKhadgalya);
router.route("/sanalKharlaa").post(tokenShalgakh, sanalKharlaa);
router.route("/gomdolKhadgalya").post(tokenShalgakh, gomdolKhadgalya);
router.route("/gomdolKharlaa").post(tokenShalgakh, gomdolKharlaa);

module.exports = router;
