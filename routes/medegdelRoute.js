const express = require("express");
const router = express.Router();
const SanalGomdol = require("../models/sanalGomdol");
const Sonorduulga = require("../models/sonorduulga");
const Khariltsagch = require("../models/khariltsagch");
//const { tokenShalgakh } = require("../middlewares/tokenShalgakh");
//const { crud } = require("../components/crud");
//const UstsanBarimt = require("../models/ustsanBarimt");
const { tokenShalgakh, crud, UstsanBarimt } = require("zevbackv2");
const { khariltsagchidSonorduulgaIlgeeye } = require("../controller/appNotification");
const { db } = require("zevbackv2");
const {
  sanalKhadgalya,
  sanalKharlaa,
  sonorduulgaKharlaa,
  sanalKhuleenAvlaa,
} = require("../controller/medegdel");
const Ajiltan = require("../models/ajiltan");
const Baiguullaga = require("../models/baiguullaga");

crud(router, "sanalGomdol", SanalGomdol, UstsanBarimt);
crud(router, "sonorduulga", Sonorduulga, UstsanBarimt);

router.route("/sanalKhadgalya").post(tokenShalgakh, sanalKhadgalya);
router.route("/sanalKharlaa").post(tokenShalgakh, sanalKharlaa);
router.route("/sonorduulgaKharlaa").post(tokenShalgakh, sonorduulgaKharlaa);
router.route("/sanalKhuleenAvlaa").post(tokenShalgakh, sanalKhuleenAvlaa);
router
  .route("/sonorduulgaIlgeeye")
  .post(tokenShalgakh, async (req, res, next) => {
    try
    {
      const { medeelel } = req.body;
      var firebaseToken = req.body.firebaseToken;
      var kharilltsagch = await Khariltsagch(db.erunkhiiKholbolt).findOne({
        _id: req.body.khariltsagchiinId,
      });
      if (kharilltsagch) firebaseToken = kharilltsagch.firebaseToken;
      if(!!firebaseToken)
      {
        khariltsagchidSonorduulgaIlgeeye(
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
            res.send("done");
          },
          next
        );
      }
      else
        res.send("!fire token not found");
    } 
    catch (error) {
      next(error);
    }  
  });

  router.route("/AdminMedegellgeeye").post(async (req, res, next) => {
    try {
      const { db } = require("zevbackv2");
      const { medeelel, baiguullagiinRegister } = req.body;
      var baiguullaga = await Baiguullaga(db.erunkhiiKholbolt).findOne({ register: baiguullagiinRegister, });
      console.log("log baiguullagiinId ------>>" + JSON.stringify(baiguullaga?._id.toString()));
      var zochin = new Ajiltan(db.erunkhiiKholbolt)();
      var bearerToken = zochin.zochinTokenUusgye(baiguullaga?._id.toString());
      if (!bearerToken) return res.status(401).send("Bearer token олдсонгүй.");
      console.log("log bearerToken ------>>" + JSON.stringify(bearerToken));
      var kholboltuud = db.kholboltuud;
      var kholbolt = kholboltuud.find((a) => a.baiguullagiinId == baiguullaga?._id.toString());
      var medegdeluud = [];
      for await (const barilga of baiguullaga.barilguud) {
        khariltsagchidSonorduulgaIlgeeye(
          bearerToken,
          medeelel,
          async (r) => {
              const medegdel = new Sonorduulga(kholbolt)();
              medegdel.baiguullagiinId = baiguullaga?._id.toString();
              medegdel.turul = req.body.turul || "medegdel";
              medegdel.title = medeelel.title;
              medegdel.message = medeelel.body;
              medegdel.kharsanEsekh = false;
              medegdel.barilgiinId = barilga._id.toString();  
              console.log("log medegdel ------>>" + JSON.stringify(medegdel));
              await medegdel.save();
              medegdeluud.push(medegdel);
            },
            next
          );
      }
      const io = req.app.get("socketio");
      if (io) io.emit("adminMedegdelilgeeyeSocket" + baiguullaga?._id.toString(), medegdeluud);
      res.send("done");
    } catch (error) {
      console.log("log------AdminMedegellgeeye" + error);
      next(error);
    }
  });

module.exports = router;
