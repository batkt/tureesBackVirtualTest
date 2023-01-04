const express = require("express");
const router = express.Router();
const SanalGomdol = require("../models/sanalGomdol");
const Sonorduulga = require("../models/sonorduulga");
const Khariltsagch = require("../models/khariltsagch");
//const { tokenShalgakh } = require("../middlewares/tokenShalgakh");
//const { crud } = require("../components/crud");
//const UstsanBarimt = require("../models/ustsanBarimt");
const { tokenShalgakh, crud, UstsanBarimt } = require("zevback");
const { sonorduulgaIlgeeye } = require("../controller/appNotification");
const {
  sanalKhadgalya,
  sanalKharlaa,
  sonorduulgaKharlaa,
  sanalKhuleenAvlaa,
} = require("../controller/medegdel");

crud(router, "sanalGomdol", SanalGomdol, UstsanBarimt);
crud(router, "sonorduulga", Sonorduulga, UstsanBarimt);

router.route("/sanalKhadgalya").post(tokenShalgakh, sanalKhadgalya);
router.route("/sanalKharlaa").post(tokenShalgakh, sanalKharlaa);
router.route("/sonorduulgaKharlaa").post(tokenShalgakh, sonorduulgaKharlaa);
router.route("/sanalKhuleenAvlaa").post(tokenShalgakh, sanalKhuleenAvlaa);
router
  .route("/sonorduulgaIlgeeye")
  .post(tokenShalgakh, async (req, res, next) => {
    const { medeelel } = req.body;
    var firebaseToken = req.body.firebaseToken;
    var kharilltsagch = await Khariltsagch(
      req.body.tukhainBaaziinKholbolt
    ).findOne({ _id: req.body.khariltsagchiinId });
    if (kharilltsagch) firebaseToken = kharilltsagch.firebaseToken;
    sonorduulgaIlgeeye(
      firebaseToken,
      medeelel,
      (r) => {
        var sonorduulga = new Sonorduulga(req.body.tukhainBaaziinKholbolt)();
        sonorduulga.khariltsagchiinId = req.body.khariltsagchiinId;
        sonorduulga.baiguullagiinId = req.body.baiguullagiinId;
        sonorduulga.barilgiinId = req.body.barilgiinId;
        sonorduulga.zurgiinId = req.body.zurgiinId;
        if (req.body.khariltsagchiinId)
          sonorduulga.khuleenAvagchiinId = req.body.khariltsagchiinId;
        if (!req.body.turul) sonorduulga.turul = "medegdel";
        sonorduulga.title = medeelel.title;
        sonorduulga.message = medeelel.body;
        sonorduulga.kharsanEsekh = false;
        sonorduulga.save();
        var io = req.app.get("socketio");
        if (io)
          io.emit("khariltsagch" + req.body.khariltsagchiinId, sonorduulga);
        res.send(r);
      },
      next
    );
  });

module.exports = router;
