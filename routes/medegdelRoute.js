const express = require("express");
const router = express.Router();
const SanalGomdol = require("../models/sanalGomdol");
const Sonorduulga = require("../models/sonorduulga");
const Khariltsagch = require("../models/khariltsagch");
//const { tokenShalgakh } = require("../middlewares/tokenShalgakh");
//const { crud } = require("../components/crud");
//const UstsanBarimt = require("../models/ustsanBarimt");
const { tokenShalgakh, crud, UstsanBarimt } = require("zevbackv2");
const {
  khariltsagchidSonorduulgaIlgeeye,
} = require("../controller/appNotification");
const { db } = require("zevbackv2");
const {
  sanalKhadgalya,
  appWebDuudlagaKhadgalya,
  sanalKharlaa,
  sonorduulgaKharlaa,
  sanalKhuleenAvlaa,
} = require("../controller/medegdel");
const Ajiltan = require("../models/ajiltan");
const Baiguullaga = require("../models/baiguullaga");

crud(router, "sanalGomdol", SanalGomdol, UstsanBarimt);
crud(router, "sonorduulga", Sonorduulga, UstsanBarimt);

router.route("/sanalKhadgalya").post(tokenShalgakh, sanalKhadgalya);
router
  .route("/appWebDuudlagaKhadgalya")
  .post(tokenShalgakh, appWebDuudlagaKhadgalya);
router.route("/sanalKharlaa").post(tokenShalgakh, sanalKharlaa);
router.route("/sonorduulgaKharlaa").post(tokenShalgakh, sonorduulgaKharlaa);
router.route("/sanalKhuleenAvlaa").post(tokenShalgakh, sanalKhuleenAvlaa);
router
  .route("/sonorduulgaIlgeeye")
  .post(tokenShalgakh, async (req, res, next) => {
    try {
      const { medeelel, turul } = req.body;
      var firebaseToken = req.body.firebaseToken;

      var kharilltsagch = await Khariltsagch(db.erunkhiiKholbolt).findOne({
        _id: req.body.khariltsagchiinId,
      });

      if (kharilltsagch) firebaseToken = kharilltsagch.firebaseToken;

      if (!!firebaseToken) {
        khariltsagchidSonorduulgaIlgeeye(
          firebaseToken,
          medeelel,
          (r) => {
            var sonorduulga = new Sonorduulga(
              req.body.tukhainBaaziinKholbolt
            )();

            sonorduulga.khariltsagchiinId = req.body.khariltsagchiinId;
            sonorduulga.baiguullagiinId = req.body.baiguullagiinId;
            sonorduulga.barilgiinId = req.body.barilgiinId;
            sonorduulga.zurgiinId = req.body.zurgiinId;

            if (req.body.khariltsagchiinId)
              sonorduulga.khuleenAvagchiinId = req.body.khariltsagchiinId;

            if (
              turul &&
              [
                "medegdel",
                "shaardlaga",
                "sanalKhuselt",
                "sonorduulga",
                "sanal",
                "gomdol",
              ].includes(turul)
            ) {
              sonorduulga.turul = turul;
            } else {
              sonorduulga.turul = "medegdel";
            }

            sonorduulga.title = medeelel.title;
            sonorduulga.message = medeelel.body;
            sonorduulga.kharsanEsekh = false;

            sonorduulga
              .save()
              .then((savedNotif) => {
                console.log("✅ Notification saved:", {
                  id: savedNotif._id,
                  turul: savedNotif.turul,
                  khariltsagchiinId: savedNotif.khariltsagchiinId,
                });

                var io = req.app.get("socketio");
                if (io) {
                  const eventName = "khariltsagch" + req.body.khariltsagchiinId;
                  console.log("📡 Emitting socket event:", eventName);
                  io.emit(eventName, savedNotif);
                } else {
                  console.warn("socket obso");
                }

                res.send({
                  success: true,
                  message: "done",
                  notification: savedNotif,
                });
              })
              .catch((saveError) => {
                console.error("hadgaallt obso:", saveError);
                res.status(500).send({
                  success: false,
                  error: "Failed to save notification",
                });
              });
          },
          next
        );
      } else {
        console.warn("firebase bhgu:", req.body.khariltsagchiinId);
        res.status(400).send({
          success: false,
          error: "!fire token not found",
        });
      }
    } catch (error) {
      console.error(" aldaa in sonorduulgaIlgeeye:", error);
      next(error);
    }
  });

router.route("/AdminMedegellgeeye").post(async (req, res, next) => {
  try {
    const { db } = require("zevbackv2");
    const { medeelel, baiguullagiinRegister, zurag, adminMedegdelId } =
      req.body;
    var baiguullaga = await Baiguullaga(db.erunkhiiKholbolt).findOne({
      register: baiguullagiinRegister,
    });
    var zochin = new Ajiltan(db.erunkhiiKholbolt)();
    var bearerToken = zochin.zochinTokenUusgye(baiguullaga?._id.toString());
    if (!bearerToken) return res.status(401).send("Bearer token олдсонгүй.");
    var kholboltuud = db.kholboltuud;
    var kholbolt = kholboltuud.find(
      (a) => a.baiguullagiinId == baiguullaga?._id.toString()
    );
    var medegdeluud = [];
    for await (const barilga of baiguullaga.barilguud) {
      const medegdel = new Sonorduulga(kholbolt)();
      medegdel.baiguullagiinId = baiguullaga?._id.toString();
      medegdel.barilgiinId = barilga._id.toString();
      medegdel.turul = req.body.turul || "medegdelAdmin";
      medegdel.title = medeelel.title;
      medegdel.message = medeelel.body;
      medegdel.zurag = zurag;
      medegdel.adminMedegdelId = adminMedegdelId;
      medegdel.kharsanEsekh = false;
      await medegdel.save();
      medegdeluud.push(medegdel);
    }
    const io = req.app.get("socketio");
    if (io && req.body.turul == "medegdelAdmin")
      io.emit(
        "adminMedegdelilgeeyeSocket" + baiguullaga?._id.toString(),
        medegdeluud
      );
    else if (io && req.body.turul == "medegdelAdminAppWeb")
      io.emit(
        "adminMedegdelilgeeyeAppWebSocket" + baiguullaga?._id.toString(),
        medegdeluud
      );
    res.send("done");
  } catch (error) {
    next(error);
  }
});

router
  .route("/adminMedegdelZasakh")
  .post(tokenShalgakh, async (req, res, next) => {
    try {
      if (!!req.body.adminMedegdelId && !!req.body.ajiltniiId) {
        var sonorduulguud = await Sonorduulga(
          req.body.tukhainBaaziinKholbolt
        ).find({ adminMedegdelId: req.body.adminMedegdelId });
        for await (const sonorduulga of sonorduulguud) {
          await Sonorduulga(req.body.tukhainBaaziinKholbolt).findByIdAndUpdate(
            sonorduulga._id,
            {
              $push: {
                dakhijKharakhguiAjiltniiIdnuud: req.body.ajiltniiId,
              },
            }
          );
        }
      }
      res.send("Амжилттай");
    } catch (error) {
      next(error);
    }
  });

router
  .route("/adminMedegdelAllDakhijKharakhgui")
  .post(async (req, res, next) => {
    try {
      const { db } = require("zevbackv2");
      var kholboltuud = db.kholboltuud;
      if (kholboltuud) {
        for await (const kholbolt of kholboltuud) {
          var sonorduulguud = await Sonorduulga(kholbolt).find({
            turul: "medegdelAdmin",
          });
          for await (const sonorduulga of sonorduulguud) {
            await Sonorduulga(kholbolt).findByIdAndUpdate(sonorduulga._id, {
              $set: {
                dakhijKharikhEsekh: true,
              },
            });
          }
        }
      }
      res.send("Амжилттай");
    } catch (error) {
      next(error);
    }
  });

router.route("/adminMedegdelUstgakh").post(async (req, res, next) => {
  try {
    const { db } = require("zevbackv2");
    var kholboltuud = db.kholboltuud;
    if (kholboltuud) {
      for await (const kholbolt of kholboltuud) {
        var sonorduulguud = await Sonorduulga(kholbolt).find({
          turul: "medegdelAdmin",
        });
        for await (const sonorduulga of sonorduulguud) {
          await Sonorduulga(kholbolt).deleteOne({
            _id: sonorduulga._id,
          });
        }
      }
    }
    res.send("Амжилттай");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
