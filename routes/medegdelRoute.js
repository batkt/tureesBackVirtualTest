const express = require("express");
const router = express.Router();
const SanalGomdol = require("../models/sanalGomdol");
const Sonorduulga = require("../models/sonorduulga");
const { tokenShalgakh } = require("../middlewares/tokenShalgakh");
const { crud } = require("../components/crud");
const { sonorduulgaIlgeeye } = require("../controller/appNotification");

const { sanalKhadgalya, sanalKharlaa } = require("../controller/medegdel");

crud(router, "sanalGomdol", SanalGomdol);
crud(router, "sonorduulga", Sonorduulga);

router.route("/sanalKhadgalya").post(tokenShalgakh, sanalKhadgalya);
router.route("/sanalKharlaa").post(tokenShalgakh, sanalKharlaa);
router.route("/sonorduulgaIlgeeye").post(tokenShalgakh, (req, res, next) => {
    const { firebaseToken, medeelel } = req.body
    sonorduulgaIlgeeye(firebaseToken, medeelel, (r) => {
        var megegdel = new SanalGomdol();
        medegdel.khariltsagchiinId = req.body.khariltsagchiinId;
        medegdel.khariltsagchiinNer = req.body.khariltsagchiinNer;
        medegdel.title = medeelel.title;
        medegdel.message = medeelel.body;
        medegdel.kharsanEsekh = false;
        megegdel.save();
        res.send(r)
    }, next)
})

module.exports = router;
