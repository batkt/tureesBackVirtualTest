const express = require("express");
const router = express.Router();
const SanalGomdol = require("../models/sanalGomdol");
const Sonorduulga = require("../models/sonorduulga");
//const { tokenShalgakh } = require("../middlewares/tokenShalgakh");
//const { crud } = require("../components/crud");
//const UstsanBarimt = require("../models/ustsanBarimt");
const { tokenShalgakh, crud, UstsanBarimt } = require("zevback");
const { sonorduulgaIlgeeye } = require("../controller/appNotification");
const { sanalKhadgalya, sanalKharlaa } = require("../controller/medegdel");

crud(router, "sanalGomdol", SanalGomdol, UstsanBarimt);
crud(router, "sonorduulga", Sonorduulga, UstsanBarimt);

router.route("/sanalKhadgalya").post(tokenShalgakh, sanalKhadgalya);
router.route("/sanalKharlaa").post(tokenShalgakh, sanalKharlaa);
router.route("/sonorduulgaIlgeeye").post(tokenShalgakh, async (req, res, next) => {
    const { firebaseToken, medeelel } = req.body
    sonorduulgaIlgeeye(firebaseToken, medeelel, (r) => {
        var sonorduulga = new Sonorduulga();
        sonorduulga.khariltsagchiinId = req.body.khariltsagchiinId;
        sonorduulga.baiguullagiinId = req.body.baiguullagiinId;
        sonorduulga.barilgiinId = req.body.barilgiinId;
        sonorduulga.title = medeelel.title;
        sonorduulga.message = medeelel.body;
        sonorduulga.kharsanEsekh = false;
        sonorduulga.save();
        res.send(r)
    }, next)
})

module.exports = router;
