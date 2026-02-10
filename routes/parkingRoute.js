const express = require("express");
const router = express.Router();
const {
  tokenShalgakh,
  khuudaslalt,
  crud,
  UstsanBarimt,
  db,
} = require("zevbackv2");
const {
  Parking,
  Mashin,
  BlockMashin,
  Uilchluulegch,
  ZurchilteiMashin,
  ZogsooliinTulbur,
  uilchluulegchdiinToo,
  zogsoolTusBurUilchluulegchdiinToo,
  sdkData,
  uilchluulegchTseverliy,
  zogsooliinDunAvya,
  TokiMashin,
  uilchluulegchGaraasBurtgey,
} = require("parking-v2");
const {
  zogsooloosEbarimtUusgye,
  zogsooloosEbarimtShineUusgye,
  ebarimtDuudya,
} = require("../routes/ebarimtRoute");
const ZogsooliinIp = require("../models/zogsooliinIp");
const Khariltsagch = require("../models/khariltsagch");
const Sonorduulga = require("../models/sonorduulga");
const Ebarimt = require("../models/ebarimt");
const EbarimtShine = require("../models/ebarimtShine");
const KassCameraKhaalt = require("../models/kassCameraKhaalt");
const uneguiMashin = require("../models/uneguiMashin");

const {
  khariltsagchidSonorduulgaIlgeeye,
} = require("../controller/appNotification");
const lodash = require("lodash");
const moment = require("moment");
const Baiguullaga = require("../models/baiguullaga");
const { zogsoolNiitDungeerEbarimtShivye } = require("../routes/ebarimtRoute");
const { msgIlgeeye } = require("../controller/khariltsagch");
const { searchCarToki, } = require("../controller/parkingToki");
const { searchCarQR } = require("../controller/parkingQR");
const MsgTuukh = require("../models/msgTuukh");
const client = require("../routes/redisClient");
const crypto = require("crypto");
const { QuickQpayObject } = require("quickqpaypackv2");
const axios = require("axios");
const { encode, decode } = require("@msgpack/msgpack");
const uilchluulegchController = require("../controller/uilchluulegchController");
const zogsoolSDK = require("../controller/zogsoolSDK");
const zogsooliinTulburController = require("../controller/zogsooliinTulburController");
const zogsoolTailanController = require("../controller/zogsoolTailanController");
const parkingController = require("../controller/parkingController");
const parkingUneguiController = require("../controller/parkingUneguiController");
const tsenegleltController = require("../controller/tsenegleltController");
const passController = require("../controller/passController");

crud(router, "parking", Parking, UstsanBarimt);
crud(router, "zurchilteiMashin", ZurchilteiMashin, UstsanBarimt);
crud(router, "mashin", Mashin, UstsanBarimt);
crud(router, "blockMashin", BlockMashin, UstsanBarimt);
crud(router, "zogsoolUilchluulegch", Uilchluulegch, UstsanBarimt);
crud(router, "uilchluulegch", Uilchluulegch, UstsanBarimt);
crud(router, "kassCameraKhaalt", KassCameraKhaalt, UstsanBarimt);

router.get("/zogsoolUilchluulegchJagsaalt", tokenShalgakh, uilchluulegchController.getJagsaalt);
router.get("/zogsoolJagsaalt", tokenShalgakh, uilchluulegchController.zogsoolJagsaalt);
router.post("/zogsoolUstgay", tokenShalgakh, uilchluulegchController.zogsoolUstgah);
router.post("/zogsoolOrlogoGaraas", tokenShalgakh, uilchluulegchController.orlogoGaraas);
router.post("/zogsooliinTulburTulye", tokenShalgakh, uilchluulegchController.tulburTulye);
router.post("/uilchluulegchTseverliy", tokenShalgakh, uilchluulegchController.tseverliy);
router.post("/uilchluulegchUstgay", tokenShalgakh, uilchluulegchController.ustgah);
router.post("/zogsoolUilchluulegchdiinToo", tokenShalgakh, uilchluulegchController.tooAvya);
router.post("/zogsoolTusBurUilchluulegchdiinToo", tokenShalgakh, uilchluulegchController.tusBuriinTooAvya);
router.post("/zogsoolSdkService", tokenShalgakh, zogsoolSDK.zogsoolSdkService);
router.post("/zogsooliinTulburOrjIrlee", zogsooliinTulburController.tulburOrjIrlee);
router.post("/zogsooliinAjiltniiUdriinTailanAvya", tokenShalgakh, zogsoolTailanController.ajiltniiUdriinTailan);
router.post("/zogsooliinUdriinTailanAvya", tokenShalgakh, zogsoolTailanController.udriinTailan);
router.post("/zogsoolUilchluulegchdiinDunAvay", tokenShalgakh, zogsoolTailanController.zogsoolUilchluulegchdiinDunAvay);
router.get("/zogsooliinIpAvaya/:barilgiinId", tokenShalgakh, parkingController.getZogsooliinIpAvaya);
router.post("/mashiniiTooAvya", tokenShalgakh, parkingController.mashiniiTooAvya);
router.get("/v1/parking", parkingController.getParkingV1);
router.post("/tsenegleltKhiiy", tokenShalgakh, tsenegleltController.tsenegleltKhiiy);
router.get("/pass/zogsool", tokenShalgakh, passController.getPassZogsool);
router.get("/pass/mashinKhaikh/:dugaar", tokenShalgakh, passController.mashinKhaikh);
router.get("/v1/car/:session_id", passController.getCarBySession);
router.post("/v1/car_add", passController.carAddSession);
router.get("/v1/search_car/:plate_number", searchCarToki);
router.get("/v1/search_carQR/:plate_number", searchCarQR);
router.get("/v1/search_car_unegui/:plate_number", tokenShalgakh, parkingUneguiController.searchCarUnegui);
router.post("/v1/tulburMedeelelAvya", async (req, res, next) => {
  try {
    const { db } = require("zevbackv2");
    var { session_id, parking_id } = req.body;
    var kholboltuud = db.kholboltuud;
    var data;
    var message = "Amjilttai";
    var oldsonMashin;
    var success = true;
    if (kholboltuud) {
      for (const kholbolt of kholboltuud) {
        var zogsool = await Parking(kholbolt).findById(parking_id);
        if (!!zogsool) {
          oldsonMashin = await Uilchluulegch(kholbolt, true).findById(
            session_id,
          );
          if (!oldsonMashin) {
            message = "Мэдээлэл олдсонгүй!";
            success = false;
          }
          if (!!oldsonMashin && !!oldsonMashin.mashiniiDugaar) {
            data = {
              plate_number: req.params.plate_number,
              enter_date: moment(
                oldsonMashin.tuukh[0].tsagiinTuukh[0].orsonTsag,
              ).format("YYYY/MM/DD HH:mm:ss"),
              out_date: moment(
                oldsonMashin.tuukh[0].tsagiinTuukh[0].garsanTsag,
              ).format("YYYY/MM/DD HH:mm:ss"),
              tulburuud: oldsonMashin.tuukh[0].tulbur,
              parking_id,
              session_id,
            };
            break;
          }
        }
        if (!!oldsonMashin && !!oldsonMashin.mashiniiDugaar) break;
      }
    }
    var butsaakhKhariu = {
      success,
      message,
      data,
    };
    res.send(butsaakhKhariu);
  } catch (err) {
    next(err);
  }
});

router.route("/v1/pay").post(async (req, res, next) => {
  try {
    /*{nevtreltiinTuukhAvya
      "session_id":"",
      "paid_amount": 1622.0,
      "plate_number": "7120СЭА",
      "individual": true, //true = xuwi xun, false = baiguullaga
      "customer_no": "",
      "door_id": "",
      "manually_open": true
     }*/
    let tulbur = [
      {
        ognoo: new Date(),
        turul: "toki",
        dun: req.body.paid_amount,
      },
    ];
    const { db } = require("zevbackv2");
    var kholboltuud = db.kholboltuud;
    var message = "Amjilttai";
    var oldsonMashin;
    var tukhainKholbolt;
    var tukhainObject;
    var tukhainZogsool;
    var success = true;
    var bodsonDun = 0;
    var localEsekh = !!req.body.baiguullagiinId;
    if (localEsekh) {
      kholboltuud = kholboltuud.filter(
        (a) => a.baiguullagiinId == req.body.baiguullagiinId,
      );
    }
    if (kholboltuud) {
      var query = { tokiNer: { $exists: true } };
      if (!!req.body.baiguullagiinId)
        query["baiguullagiinId"] = req.body.baiguullagiinId;
      for (const kholbolt of kholboltuud) {
        var zogsooluud = await getParkingFind(
          kholbolt,
          kholbolt.baiguullagiinId,
          query,
        );
        for (const zogsool of zogsooluud) {
          if (!!zogsool) {
            const plateNumber = req.body.plate_number;
            const zogsoolId = zogsool._id;
            const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
            oldsonMashin = await Uilchluulegch(kholbolt, true)
              .findOne({
                mashiniiDugaar: plateNumber,
                "tuukh.0.zogsooliinId": zogsoolId,
                "tuukh.0.tuluv": { $nin: [-2, -3, -4] },
                updatedAt: { $gt: fiveMinutesAgo },
              })
              .sort({ updatedAt: -1 });
            if (!!oldsonMashin && !!oldsonMashin.mashiniiDugaar) {
              tukhainKholbolt = kholbolt;
              tukhainZogsool = zogsool;
              tukhainObject = oldsonMashin;
              break;
            }
          }
          if (!!oldsonMashin && !!oldsonMashin.mashiniiDugaar) break;
        }
        if (!!oldsonMashin && !!oldsonMashin.mashiniiDugaar) break;
      }
    }
    var butsaakhKhariu = {
      success,
      message,
    };
    if (!tukhainObject) {
      res.send({ success: false, message: "Машины мэдээлэл олдсонгүй!" });
    } else {
      // var mashinTurul = "toki"; // default value

      // if (!!tukhainObject.turul) {
      //   mashinTurul = tukhainObject.turul;
      // } else if (!!tukhainObject.mashiniiDugaar) {
      //   try {
      //     const mashin = await Mashin(tukhainKholbolt).findOne({
      //       dugaar: tukhainObject.mashiniiDugaar,
      //       baiguullagiinId: tukhainObject.baiguullagiinId,
      //       barilgiinId: tukhainObject.barilgiinId,
      //     });
      //     if (!!mashin && !!mashin.turul) {
      //       mashinTurul = mashin.turul;
      //     }
      //   } catch (err) {}
      // }

      // tulbur[0].turul = mashinTurul;
      if(!tukhainObject?.freezeOgnoo)
      {
        tukhainObject.freezeOgnoo = tukhainObject.tuukh[0].tsagiinTuukh[0].garsanTsag ? tukhainObject.tuukh[0].tsagiinTuukh[0].garsanTsag : new Date();
        await Uilchluulegch(tukhainKholbolt).updateOne(
          { _id: tukhainObject._id },
          {
            freezeOgnoo: tukhainObject.freezeOgnoo,
          },
        );
      }
      bodsonDun = await zogsooliinDunAvya(
        tukhainZogsool,
        tukhainObject,
        tukhainKholbolt,
      );
      if (
        tukhainObject &&
        tukhainObject.tuukh &&
        tukhainObject.tuukh.length > 0
      ) {
        if (tukhainObject.tuukh && tukhainObject.tuukh.length > 0)
          if (
            tukhainObject.tuukh[0].tulbur &&
            tukhainObject.tuukh[0].tulbur.length > 0
          ) {
            var tulburDun = tukhainObject.tuukh[0].tulbur?.reduce(
              (a, b) => a + (b.dun || 0),
              0,
            );
            if (tulburDun > 0 && bodsonDun > 0) {
              if (bodsonDun == req.body.paid_amount + tulburDun)
                tukhainObject.tuukh[0].tulbur.push(...tulbur);
              else if (bodsonDun < req.body.paid_amount + tulburDun)
                res.send({ success: false, message: "Төлөлт хийгдсэн байна!" });
            }
          } else tukhainObject.tuukh[0].tulbur = tulbur;
        var set = {
          "tuukh.$[t].tulbur": tukhainObject.tuukh[0].tulbur,
          tokiId: "toki",
        };
        if (bodsonDun > 0) {
          var tulburDun = tukhainObject.tuukh[0].tulbur?.reduce(
            (a, b) => a + (b.dun || 0),
            0,
          );
          if (bodsonDun == tulburDun) {
            if (!req.body.manually_open)
              set["garakhTsag"] = new Date(
                new Date().getTime() +
                  (tukhainZogsool?.garakhTsag || 30) * 60000,
              );
            if (!!tukhainObject.tuukh[0].garsanKhaalga)
              set["tuukh.$[t].tuluv"] = 1;
          }
        }
        if (
          !!tukhainObject.tuukh[0].tsagiinTuukh?.[0].garsanTsag &&
          tukhainObject.tuukh[0].tsagiinTuukh[0].garsanTsag >
            new Date(Date.now() - 600000)
        )
          req.body.manually_open = true;
        await Uilchluulegch(tukhainKholbolt).findByIdAndUpdate(
          tukhainObject._id,
          {
            $set: set,
          },
          {
            arrayFilters: [
              {
                "t.zogsooliinId": tukhainZogsool._id,
              },
            ],
          },
        );
        if (!!req.body.manually_open) {
          if (
            !!tukhainZogsool.kamerDavkharAshiglakh &&
            !tukhainObject?.tuukh[0]?.garsanKhaalga
          ) {
            var nemeltZogsool = await Parking(tukhainKholbolt).findOne({
              _id: { $ne: tukhainZogsool._id },
            });
            var garsanObject = await Uilchluulegch(
              tukhainKholbolt,
              true,
            ).findOne({
              mashiniiDugaar: req.body.plate_number,
              "tuukh.zogsooliinId": nemeltZogsool._id.toString(),
              "tuukh.0.tsagiinTuukh.0.garsanKhaalga": {
                $exists: true,
              },
              updatedAt: {
                $gt: new Date(Date.now() - 300000), //5min dotor
              },
              "tuukh.0.tuluv": {
                $ne: -2,
              },
            });
            const io = req.app.get("socketio");
            io.emit(
              "zogsoolGarahTulsun",
              {
                baiguullagiinId: tukhainObject.baiguullagiinId,
                khaalgaTurul: "garsan",
                turul: "toki",
                mashiniiDugaar: tukhainObject.mashiniiDugaar,
                cameraIP: garsanObject.tuukh[0].garsanKhaalga,
              },
            );
          } else {
            const io = req.app.get("socketio");
            io.emit(
              "zogsoolGarahTulsun",
              {
                baiguullagiinId: tukhainObject.baiguullagiinId,
                khaalgaTurul: "garsan",
                turul: "toki",
                mashiniiDugaar: tukhainObject.mashiniiDugaar,
                cameraIP: tukhainObject.tuukh[0].garsanKhaalga,
              },
            );
          }
        }
        tukhainObject.niitDun = req.body.paid_amount;
        var baiguullaga = await Baiguullaga(db.erunkhiiKholbolt).findById(
          tukhainObject.baiguullagiinId,
        );
        // var ebarimtAshiglakhEsekh = false;
        // if (!!baiguullaga)
        //   ebarimtAshiglakhEsekh = baiguullaga?.tokhirgoo?.ebarimtAshiglakhEsekh;
        // if (!!ebarimtAshiglakhEsekh) {
        var tuxainSalbar = baiguullaga?.barilguud?.find(
          (e) => e._id.toString() == tukhainObject.barilgiinId,
        )?.tokhirgoo;
        var nuatTulukhEsekh = baiguullaga.barilguud.find(
          (x) => x._id.toString() == tukhainObject.barilgiinId,
        )?.tokhirgoo?.nuatTulukhEsekh;
        if (nuatTulukhEsekh != false) nuatTulukhEsekh = true;
        if (tuxainSalbar?.eBarimtShine === true) {
          var ebarimt = await zogsooloosEbarimtShineUusgye(
            tukhainObject,
            req.body.customerNo,
            req.body.customerTin,
            tuxainSalbar.merchantTin, //"37900846788",
            tuxainSalbar.districtCode, //,"0023"
            tukhainKholbolt,
            nuatTulukhEsekh,
          );
          butsaakhMethod = function (d, khariuObject) {
            try {
              if (d?.status != "SUCCESS" && !d.success) {
                delete d.baiguullagiinId;
                delete d.zogsooliinId;
                delete d.barilgiinId;
                delete d._id;
                butsaakhKhariu.data = d;
                if (!res.headersSent) {
                  res.send(butsaakhKhariu);
                }
              } else {
                var ebarimt;
                if (!!tuxainSalbar.eBarimtShine)
                  ebarimt = new EbarimtShine(tukhainKholbolt)(d);
                else ebarimt = new Ebarimt(tukhainKholbolt)(d);
                ebarimt.zogsooliinId = tukhainObject._id;
                ebarimt.baiguullagiinId = khariuObject.baiguullagiinId;
                ebarimt.barilgiinId = khariuObject.barilgiinId;
                ebarimt.mashiniiDugaar = khariuObject.mashiniiDugaar;
                ebarimt.save().catch((err) => {
                  if (!res.headersSent && next) next(err);
                });
                var update = {
                  ebarimtAvsanEsekh: true,
                  ebarimtAvsanDun: ebarimt.cashAmount || ebarimt.totalAmount,
                };
                if (ebarimt.customerNo)
                  update = {
                    ...update,
                    ebarimtRegister: ebarimt.customerNo,
                  };
                Uilchluulegch(tukhainKholbolt)
                  .findByIdAndUpdate(tukhainObject._id, update)
                  .then((xariu) => {})
                  .catch((err) => {
                    if (!res.headersSent && next) next(err);
                  });
                delete d.baiguullagiinId;
                delete d.zogsooliinId;
                delete d.barilgiinId;
                delete d._id;
                butsaakhKhariu.data = d;
                if (!res.headersSent) {
                  res.send(butsaakhKhariu);
                }
              }
            } catch (err) {
              if (!res.headersSent && next) next(err);
            }
          };
          ebarimtDuudya(
            ebarimt,
            butsaakhMethod,
            next,
            tuxainSalbar.eBarimtShine,
          );
        } else {
          butsaakhKhariu.success = true;
          butsaakhKhariu.message = "ИБаримт dll холболт хийгдээгүй байна!";
          res.send(butsaakhKhariu);
        }
      }
    }
  } catch (err) {
    next(err);
  }
});

router.route("/pass/pay").post(tokenShalgakh, async (req, res, next) => {
  try {
    let tulbur = [
      {
        ognoo: new Date(),
        turul: "pass",
        dun: req.body.tulukhDun,
      },
    ];
    const { db } = require("zevbackv2");
    var kholboltuud = db.kholboltuud;
    var message = "Amjilttai";
    var oldsonMashin;
    var tukhainKholbolt;
    var tukhainObject;
    var tukhainZogsool;
    var success = true;
    var bodsonDun = 0;
    if (kholboltuud) {
      for (const kholbolt of kholboltuud) {
        var zogsooluud = await Parking(kholbolt).find({
          passNer: { $exists: true },
        });
        for (const zogsool of zogsooluud) {
          if (!!zogsool) {
            oldsonMashin = await Uilchluulegch(kholbolt, true).findOne({
              "tuukh.0.zogsooliinId": zogsool._id,
              mashiniiDugaar: req.body.dugaar,
              $or: [
                {
                  "tuukh.0.tsagiinTuukh.0.garsanTsag": {
                    $gt: new Date(Date.now() - 100000), //1.30sec in dotor
                  },
                },
                {
                  "tuukh.0.tsagiinTuukh.0.garsanTsag": {
                    $exists: false,
                  },
                },
              ],
              "tuukh.0.tuluv": {
                $nin: [-2, -3, -4],
              },
            });
            if (!!oldsonMashin && !!oldsonMashin.mashiniiDugaar) {
              tukhainKholbolt = kholbolt;
              tukhainZogsool = zogsool;
              tukhainObject = oldsonMashin;
              break;
            }
          }
          if (!!oldsonMashin && !!oldsonMashin.mashiniiDugaar) break;
        }
        if (!!oldsonMashin && !!oldsonMashin.mashiniiDugaar) break;
      }
    }
    var butsaakhKhariu = {
      success,
      message,
    };
    if (!tukhainObject) {
      res.send({ success: false, message: "Машины мэдээлэл олдсонгүй!" });
    } else {
      bodsonDun = await zogsooliinDunAvya(
        tukhainZogsool,
        tukhainObject,
        tukhainKholbolt,
      );
      if (
        tukhainObject &&
        tukhainObject.tuukh &&
        tukhainObject.tuukh.length > 0
      ) {
        if (tukhainObject.tuukh && tukhainObject.tuukh.length > 0)
          if (
            tukhainObject.tuukh[0].tulbur &&
            tukhainObject.tuukh[0].tulbur.length > 0
          )
            tukhainObject.tuukh[0].tulbur.push(...tulbur);
          else tukhainObject.tuukh[0].tulbur = tulbur;
        var set = {
          "tuukh.$[t].tulbur": tukhainObject.tuukh[0].tulbur,
          tokiId: "pass",
        };
        if (bodsonDun > 0) {
          if (bodsonDun == req.body.tulukhDun) {
            set["tuukh.$[t].tuluv"] = 1;
            if (!req.body.manually_open)
              set["garakhTsag"] = new Date(
                new Date().getTime() +
                  (tukhainZogsool?.garakhTsag || 30) * 60000,
              );
          }
        }
        await Uilchluulegch(tukhainKholbolt).findByIdAndUpdate(
          tukhainObject._id,
          {
            $set: set,
          },
          {
            arrayFilters: [
              {
                "t.zogsooliinId": tukhainZogsool._id,
              },
            ],
          },
        );
        if (!!req.body.manually_open) {
          if (
            !!tukhainZogsool.kamerDavkharAshiglakh &&
            !tukhainObject?.tuukh[0]?.garsanKhaalga
          ) {
            var nemeltZogsool = await Parking(tukhainKholbolt).findOne({
              _id: { $ne: tukhainZogsool._id },
            });
            var garsanObject = await Uilchluulegch(
              tukhainKholbolt,
              true,
            ).findOne({
              mashiniiDugaar: req.body.plate_number,
              "tuukh.zogsooliinId": nemeltZogsool._id.toString(),
              "tuukh.0.tsagiinTuukh.0.garsanKhaalga": {
                $exists: true,
              },
              updatedAt: {
                $gt: new Date(Date.now() - 300000), //5min dotor
              },
              "tuukh.0.tuluv": {
                $ne: -2,
              },
            });
            const io = req.app.get("socketio");
            io.emit(
              "zogsoolGarahTulsun",
              {
                baiguullagiinId: tukhainObject.baiguullagiinId,
                khaalgaTurul: "garsan",
                turul: "toki",
                mashiniiDugaar: tukhainObject.mashiniiDugaar,
                cameraIP: garsanObject.tuukh[0].garsanKhaalga,
              },
            );
          } else {
            const io = req.app.get("socketio");
            io.emit(
              "zogsoolGarahTulsun",
              {
                baiguullagiinId: tukhainObject.baiguullagiinId,
                khaalgaTurul: "garsan",
                turul: "toki",
                mashiniiDugaar: tukhainObject.mashiniiDugaar,
                cameraIP: tukhainObject.tuukh[0].garsanKhaalga,
              },
            );
          }
        }
        tukhainObject.niitDun = req.body.tulukhDun;
        var baiguullaga = await Baiguullaga(db.erunkhiiKholbolt).findById(
          tukhainObject.baiguullagiinId,
        );
        var tuxainSalbar = baiguullaga?.barilguud?.find(
          (e) => e._id.toString() == tukhainObject.barilgiinId,
        )?.tokhirgoo;

        var nuatTulukhEsekh = false;
        nuatTulukhEsekh = tuxainSalbar.nuatTulukhEsekh;
        if (nuatTulukhEsekh != false) nuatTulukhEsekh = true;
        if (!!tuxainSalbar?.eBarimtShine) {
          var ebarimt = await zogsooloosEbarimtShineUusgye(
            tukhainObject,
            req.body.customerNo,
            req.body.customerTin,
            tuxainSalbar.merchantTin, //"37900846788",
            tuxainSalbar.districtCode, //,"0023"
            tukhainKholbolt,
            nuatTulukhEsekh,
          );
          butsaakhMethod = function (d, khariuObject) {
            try {
              if (d?.status != "SUCCESS" && !d.success)
                throw new Error(d.message);
              var ebarimt;
              if (!!tuxainSalbar.eBarimtShine)
                ebarimt = new EbarimtShine(tukhainKholbolt)(d);
              else ebarimt = new Ebarimt(tukhainKholbolt)(d);
              ebarimt.zogsooliinId = tukhainObject._id;
              ebarimt.baiguullagiinId = khariuObject.baiguullagiinId;
              ebarimt.barilgiinId = khariuObject.barilgiinId;
              ebarimt.mashiniiDugaar = khariuObject.mashiniiDugaar;
              ebarimt.save().catch((err) => {
                if (!res.headersSent && next) next(err);
              });
              var update = {
                ebarimtAvsanEsekh: true,
                ebarimtAvsanDun: ebarimt.cashAmount || ebarimt.totalAmount,
              };
              if (ebarimt.customerNo)
                update = {
                  ...update,
                  ebarimtRegister: ebarimt.customerNo,
                };
              Uilchluulegch(tukhainKholbolt)
                .findByIdAndUpdate(tukhainObject._id, update)
                .then((xariu) => {})
                .catch((err) => {
                  if (!res.headersSent && next) next(err);
                });
              delete d.baiguullagiinId;
              delete d.zogsooliinId;
              delete d.barilgiinId;
              delete d._id;
              butsaakhKhariu.data = d;
              if (!res.headersSent) {
                res.send(butsaakhKhariu);
              }
            } catch (err) {
              if (!res.headersSent && next) next(err);
            }
          };
          ebarimtDuudya(
            ebarimt,
            butsaakhMethod,
            next,
            tuxainSalbar.eBarimtShine,
          );
        } else
          res.send({
            success: true,
            message: "ИБаримт dll холболт хийгдээгүй байна!",
          });
      }
    }
  } catch (err) {
    next(err);
  }
});

router.route("/v1/kioskPay").post(tokenShalgakh, async (req, res, next) => {
  try {
    let tulbur = [];
    if (
      req.body.ajiltniiId == "66384a9061eeda747d01a320" ||
      req.body.ajiltniiId == "6966f429535c9cddf36c9761"
    ) {
      if (req.body.paid_amount == 0) {
        tulbur = [
          {
            ognoo: new Date(),
            turul: "Fitness",
            dun: 4000,
          },
        ];
      } else {
        tulbur = [
          {
            ognoo: new Date(),
            turul: "Fitness",
            dun: 4000,
          },
          {
            ognoo: new Date(),
            turul: req.body.turul,
            dun: req.body.paid_amount,
          },
        ];
      }
    } else if (req.body.ajiltniiId == "6746b7b1e3a4bd05bbac6880") {
      if (req.body.paid_amount == 0) {
        tulbur = [
          {
            ognoo: new Date(),
            turul: "Соёолж Ц/Д",
            dun: 4000,
          },
        ];
      } else {
        tulbur = [
          {
            ognoo: new Date(),
            turul: "Соёолж Ц/Д",
            dun: 4000,
          },
          {
            ognoo: new Date(),
            turul: req.body.turul,
            dun: req.body.paid_amount,
          },
        ];
      }
    } else if (req.body.ajiltniiId == "67d92062513ec21e26bdb604") {
      if (req.body.paid_amount == 0) {
        tulbur = [
          {
            ognoo: new Date(),
            turul: "Бассэйн",
            dun: 7000,
          },
        ];
      } else {
        tulbur = [
          {
            ognoo: new Date(),
            turul: "Бассэйн",
            dun: 7000,
          },
          {
            ognoo: new Date(),
            turul: req.body.turul,
            dun: req.body.paid_amount,
          },
        ];
      }
    } else if (
      req.body.ajiltniiId == "68357e846653c13643908698" &&
      !!req.body.khungulukhTsag &&
      !!req.body.zogsoolUndsenUne
    ) {
      if (req.body.paid_amount == 0) {
        tulbur = [
          {
            ognoo: new Date(),
            turul: "Божон/ " + req.body.khungulukhTsag + " цаг",
            dun: req.body.zogsoolUndsenUne * req.body.khungulukhTsag,
          },
        ];
      } else {
        tulbur = [
          {
            ognoo: new Date(),
            turul: "Божон/ " + req.body.khungulukhTsag + " цаг",
            dun: req.body.zogsoolUndsenUne * req.body.khungulukhTsag,
          },
          {
            ognoo: new Date(),
            turul: req.body.turul,
            dun: req.body.paid_amount,
          },
        ];
      }
    } else if (
      (req.body.ajiltniiId == "694e6d2d5b0e44bb0cca2945" ||
        req.body.ajiltniiId == "694e260f3f0da03b83ace92b") &&
      !!req.body.khungulukhTsag &&
      !!req.body.zogsoolUndsenUne
    ) {
      if (req.body.paid_amount == 0) {
        tulbur = [
          {
            ognoo: new Date(),
            turul: "ugaalga/ " + req.body.khungulukhTsag + " цаг",
            dun: req.body.zogsoolUndsenUne * req.body.khungulukhTsag,
          },
        ];
      } else {
        tulbur = [
          {
            ognoo: new Date(),
            turul: "ugaalga/ " + req.body.khungulukhTsag + " цаг",
            dun: req.body.zogsoolUndsenUne * req.body.khungulukhTsag,
          },
          {
            ognoo: new Date(),
            turul: req.body.turul,
            dun: req.body.paid_amount,
          },
        ];
      }
    } else if (req.body.barilgiinId === "673d88133987e97992f77c03") {
      if (req.body.paid_amount == 0) {
        tulbur = [
          {
            ognoo: new Date(),
            turul: "Хөнгөлөлт",
            dun: 3000,
          },
        ];
      } else {
        tulbur = [
          {
            ognoo: new Date(),
            turul: "Хөнгөлөлт",
            dun: 3000,
          },
          {
            ognoo: new Date(),
            turul: req.body.turul,
            dun: req.body.paid_amount,
          },
        ];
      }
    } else if (req.body.ajiltniiId === "68425acd7611dd8da7e7a7d2") {
      if (req.body.paid_amount == 0) {
        tulbur = [
          {
            ognoo: new Date(),
            turul: "Хөнгөлөлт",
            dun: req.body.khungulult,
          },
        ];
      } else {
        tulbur = [
          {
            ognoo: new Date(),
            turul: "Хөнгөлөлт",
            dun: req.body.khungulult,
          },
          {
            ognoo: new Date(),
            turul: req.body.turul,
            dun: req.body.paid_amount,
          },
        ];
      }
    } else
      tulbur = [
        {
          ognoo: new Date(),
          turul: req.body.turul,
          dun: req.body.paid_amount,
        },
      ];
    var oldsonMashin;
    var tukhainKholbolt;
    var tukhainObject;
    var tukhainZogsool;
    var bodsonDun = 0;
    const zogsool = req.body.zogsooliinId
      ? await Parking(req.body.tukhainBaaziinKholbolt).findOne({
          _id: req.body.zogsooliinId,
        })
      : await Parking(req.body.tukhainBaaziinKholbolt).findOne({
          baiguullagiinId: req.body.baiguullagiinId,
          barilgiinId: req.body.barilgiinId,
          "khaalga.ajiltnuud.id": req.body.ajiltniiId,
        });
    if (!!zogsool) {
      oldsonMashin = await Uilchluulegch(
        req.body.tukhainBaaziinKholbolt,
        true,
      ).findOne({
        _id: req.body.uilchluulegchiinId,
      });
      if (!!oldsonMashin && !!oldsonMashin.mashiniiDugaar) {
        tukhainKholbolt = req.body.tukhainBaaziinKholbolt;
        tukhainZogsool = zogsool;
        tukhainObject = oldsonMashin;
      }
    }
    if (
      !!tukhainObject?.tuukh?.[0].tsagiinTuukh?.[0].garsanTsag &&
      tukhainObject.niitDun > 0
    ) {
      bodsonDun = tukhainObject.niitDun;
    } else
    {
      if(!tukhainObject?.freezeOgnoo)
      {
        tukhainObject.freezeOgnoo = tukhainObject?.tuukh?.[0].tsagiinTuukh?.[0].garsanTsag ? tukhainObject?.tuukh?.[0].tsagiinTuukh?.[0].garsanTsag : new Date();
        await Uilchluulegch(tukhainKholbolt).updateOne(
          { _id: tukhainObject._id },
          {
            freezeOgnoo: tukhainObject.freezeOgnoo,
          },
        );
      }
      bodsonDun = await zogsooliinDunAvya(
        tukhainZogsool,
        tukhainObject,
        tukhainKholbolt,
      );
    }
    if (!tukhainObject) {
      res.send({ success: false, message: "Машины мэдээлэл олдсонгүй!" });
    }
    bodsonDun -= tukhainObject.tuukh[0].tulbur.reduce(
      (a, b) => a + (b.dun || 0),
      0,
    );
    if (
      tukhainObject &&
      tukhainObject.tuukh &&
      tukhainObject.tuukh.length > 0
    ) {
      if (tukhainObject.tuukh && tukhainObject.tuukh.length > 0)
        if (
          tukhainObject.tuukh[0].tulbur &&
          tukhainObject.tuukh[0].tulbur.length > 0
        ) {
          if (
            req.body.ajiltniiId == "66384a9061eeda747d01a320" ||
            req.body.ajiltniiId == "6966f429535c9cddf36c9761"
          ) {
            if (tukhainObject.tuukh[0].tulbur.find((x) => x.turul == "Fitness"))
              throw new Error("Хөнгөлөлт оруулсан байна!");
          } else if (req.body.ajiltniiId == "6746b7b1e3a4bd05bbac6880") {
            if (
              tukhainObject.tuukh[0].tulbur.find((x) => x.turul == "Соёолж Ц/Д")
            )
              throw new Error("Хөнгөлөлт оруулсан байна!");
          } else if (req.body.ajiltniiId == "67d92062513ec21e26bdb604") {
            if (tukhainObject.tuukh[0].tulbur.find((x) => x.turul == "Бассэйн"))
              throw new Error("Хөнгөлөлт оруулсан байна!");
          } else if (req.body.ajiltniiId == "68357e846653c13643908698") {
            if (
              tukhainObject.tuukh[0].tulbur.find((x) =>
                x.turul?.includes("Божон"),
              )
            )
              throw new Error("Хөнгөлөлт оруулсан байна!");
          } else if (
            req.body.ajiltniiId == "694e260f3f0da03b83ace92b" ||
            req.body.ajiltniiId == "694e6d2d5b0e44bb0cca2945"
          ) {
            const existingUgaalga = tukhainObject.tuukh[0].tulbur.find((x) =>
              x.turul?.includes("ugaalga"),
            );
            if (existingUgaalga) {
              throw new Error("Угаалга хөнгөлөлт оруулсан байна!");
            }
          } else if (req.body.barilgiinId === "673d88133987e97992f77c03") {
            if (
              tukhainObject.tuukh[0].tulbur.find((x) => x.turul == "Хөнгөлөлт")
            )
              throw new Error("Хөнгөлөлт оруулсан байна!");
          } else if (req.body.ajiltniiId === "68425acd7611dd8da7e7a7d2") {
            if (
              tukhainObject.tuukh[0].tulbur.find((x) =>
                x.turul?.includes("Хөнгөлөлт"),
              )
            )
              throw new Error("Хөнгөлөлт оруулсан байна!");
          } else if (req.body.barilgiinId === "67e0ca757d7ac716ef9c3cc5") {
            if (
              tukhainObject.tuukh[0].tulbur.find(
                (x) => x.turul === req.body.turul,
              )
            )
              throw new Error("Хөнгөлөлт оруулсан байна!");
          }
          tukhainObject.tuukh[0].tulbur.push(...tulbur);
        } else tukhainObject.tuukh[0].tulbur = tulbur;
      var set = {
        "tuukh.$[t].tulbur": tukhainObject.tuukh[0].tulbur,
      };
      if (bodsonDun > 0) {
        if (bodsonDun == req.body.paid_amount) {
          if (!!tukhainObject.tuukh[0]?.tsagiinTuukh[0]?.garsanTsag) {
            set["tuukh.$[t].tuluv"] = 1;
            if (!!tukhainObject.tuukh[0]?.garsanKhaalga) {
              const io = req.app.get("socketio");
              io.emit(
                "zogsoolGarahTulsun",
                {
                  baiguullagiinId: tukhainObject.baiguullagiinId,
                  khaalgaTurul: "garsan",
                  mashiniiDugaar: tukhainObject.mashiniiDugaar,
                  cameraIP: tukhainObject.tuukh[0]?.garsanKhaalga,
                },
              );
            }
          }
          set["garakhTsag"] = new Date(
            new Date().getTime() + (tukhainZogsool?.garakhTsag || 30) * 60000,
          );
          set["tuukh.$[t].burtgesenAjiltaniiId"] = req.body.ajiltniiId;
          set["tuukh.$[t].burtgesenAjiltaniiNer"] = req.body.ajiltniiNer;
        }
      }
      if (req.body.turul == "Пос үнэгүй") {
        set = {
          "tuukh.$[t].uneguiGarsan": req.body.uneguiGarsan,
          turul: req.body.turul,
        };
        if (!!tukhainObject.tuukh[0]?.tsagiinTuukh[0]?.garsanTsag) {
          set["tuukh.$[t].tuluv"] = -1;
        }
      }
      await Uilchluulegch(tukhainKholbolt).findByIdAndUpdate(
        tukhainObject._id,
        {
          $set: set,
        },
        {
          arrayFilters: [
            {
              "t.zogsooliinId": tukhainZogsool.gadnaZogsooliinId
                ? tukhainZogsool.gadnaZogsooliinId
                : tukhainZogsool._id,
            },
          ],
        },
      );
      if (req.body.turul == "Пос үнэгүй") {
        const io = req.app.get("socketio");
        io.emit(
          "zogsoolGarahTulsun",
          {
            baiguullagiinId: tukhainObject.baiguullagiinId,
            khaalgaTurul: "garsan",
            mashiniiDugaar: tukhainObject.mashiniiDugaar,
            cameraIP: tukhainObject.tuukh[0]?.garsanKhaalga,
          },
        );
      }
      res.send("Amjilttai");
    }
  } catch (err) {
    if (next) next(err);
  }
});

router
  .route("/v1/kioskEbarimtAvya")
  .post(tokenShalgakh, async (req, res, next) => {
    try {
      var tukhainKholbolt = req.body.tukhainBaaziinKholbolt;
      var tukhainObject = await Uilchluulegch(tukhainKholbolt, true).findById(
        req.body.uilchluulegchiinId,
      );
      if (!!tukhainObject) {
        tukhainObject.niitDun = req.body.paid_amount;
        const { db } = require("zevbackv2");
        var baiguullaga = await Baiguullaga(db.erunkhiiKholbolt).findById(
          tukhainObject.baiguullagiinId,
        );
        tuxainSalbar = baiguullaga?.barilguud?.find(
          (e) => e._id.toString() == tukhainObject.barilgiinId,
        )?.tokhirgoo;
        var nuatTulukhEsekh = baiguullaga.barilguud.find(
          (x) => x._id.toString() == tukhainObject.barilgiinId,
        )?.tokhirgoo?.nuatTulukhEsekh;
        if (nuatTulukhEsekh != false) nuatTulukhEsekh = true;
        if (!!tuxainSalbar?.eBarimtShine)
          ebarimt = await zogsooloosEbarimtShineUusgye(
            tukhainObject,
            req.body.customerNo,
            req.body.customerTin,
            tuxainSalbar.merchantTin, //"37900846788",
            tuxainSalbar.districtCode, //,"0023"
            tukhainKholbolt,
            nuatTulukhEsekh,
          );
        else
          var ebarimt = await zogsooloosEbarimtUusgye(
            tukhainObject,
            req.body.customer_no,
            req.body.individual ? null : "3",
            tukhainKholbolt,
            nuatTulukhEsekh,
          );
        butsaakhMethod = function (d, khariuObject) {
          try {
            if (d?.status != "SUCCESS" && !d.success)
              throw new Error(d.message);
            var ebarimt;
            if (!!tuxainSalbar.eBarimtShine)
              ebarimt = new EbarimtShine(tukhainKholbolt)(d);
            else ebarimt = new Ebarimt(tukhainKholbolt)(d);
            ebarimt.zogsooliinId = tukhainObject._id;
            ebarimt.baiguullagiinId = khariuObject.baiguullagiinId;
            ebarimt.barilgiinId = khariuObject.barilgiinId;
            ebarimt.mashiniiDugaar = khariuObject.mashiniiDugaar;
            ebarimt.save().catch((err) => {
              if (!res.headersSent && next) next(err);
            });
            var update = {
              ebarimtAvsanEsekh: true,
              ebarimtAvsanDun: ebarimt.cashAmount || ebarimt.totalAmount,
            };
            if (ebarimt.customerNo)
              update = {
                ...update,
                ebarimtRegister: ebarimt.customerNo,
              };
            Uilchluulegch(tukhainKholbolt)
              .findByIdAndUpdate(tukhainObject._id, update)
              .then((xariu) => {})
              .catch((err) => {
                if (!res.headersSent && next) next(err);
              });
            delete d.baiguullagiinId;
            delete d.zogsooliinId;
            delete d.barilgiinId;
            delete d._id;
            var butsaakhKhariu = {
              success: true,
              message: "Amjilttai",
            };
            butsaakhKhariu.data = d;
            if (!res.headersSent) {
              res.send(butsaakhKhariu);
            }
          } catch (err) {
            if (!res.headersSent && next) next(err);
          }
        };
        ebarimtDuudya(ebarimt, butsaakhMethod, next, tuxainSalbar.eBarimtShine);
      } else res.send(null);
    } catch (err) {
      next(err);
    }
  });

router.route("/mashinUpdate").post(tokenShalgakh, async (req, res, next) => {
  try {
    const { db } = require("zevbackv2");
    var baiguullaga = await Baiguullaga(db.erunkhiiKholbolt).findOne({
      register: req.body.register,
    });
    var tukhainKholbolt;
    tukhainKholbolt = db.kholboltuud.find(
      (a) => a.baiguullagiinId == baiguullaga._id,
    );
    var orsonTsag = new Date(new Date.getTime() - 15 * 60000);
    Uilchluulegch(tukhainKholbolt).updateOne(
      {
        mashiniiDugaar: req.body.mashiniiDugaar,
        "tuukh.0.tuluv": { $ne: -2 },
        "tuukh.0.tsagiinTuukh.garsanTsag": { $exists: false },
      },
      {
        "tuukh.0.tsagiinTuukh.0.orsonTsag": orsonTsag,
      },
    );
    res.send("Amjilttai");
  } catch (error) {
    next(error);
  }
});

router.route("/mashinUpdate1").post(async (req, res, next) => {
  try {
    res.send("Amjilttai");
  } catch (error) {
    next(error);
  }
});

router.post(
  "/turluurZogsoolIdOruulakh",
  tokenShalgakh,
  async (req, res, next) => {
    try {
      var match = {
        baiguullagiinId: req.body.baiguullagiinId,
        barilgiinId: req.body.barilgiinId,
        ebarimtAvsanEsekh: true,
        mashiniiDugaar: { $exists: true },
        "tuukh.tulbur.turul": req.body.turul,
      };
      if (!!req.body.mashiniiDugaar)
        match["mashiniiDugaar"] = req.body.mashiniiDugaar;
      var uilchluulegchuud = await Uilchluulegch(
        req.body.tukhainBaaziinKholbolt,
        true,
      ).find(match);
      var ebarimtuud = [];
      if (uilchluulegchuud?.length > 0) {
        for (const data of uilchluulegchuud) {
          ebarimtuud = await EbarimtShine(req.body.tukhainBaaziinKholbolt).find(
            {
              baiguullagiinId: req.body.baiguullagiinId,
              barilgiinId: req.body.barilgiinId,
              ustgasanOgnoo: { $exists: false },
              zogsooliinId: data?._id,
            },
          );
          if (ebarimtuud?.length === 0) {
            ebarimtuud = await EbarimtShine(
              req.body.tukhainBaaziinKholbolt,
            ).find({
              baiguullagiinId: req.body.baiguullagiinId,
              barilgiinId: req.body.barilgiinId,
              ustgasanOgnoo: { $exists: false },
              mashiniiDugaar: data?.mashiniiDugaar,
              createdAt: {
                $gte: moment(data.tuukh[0]?.tulbur[0]?.ognoo).format(
                  "YYYY-MM-DD 00:00:00",
                ),
                $lte: moment(data.tuukh[0]?.tulbur[0]?.ognoo).format(
                  "YYYY-MM-DD 23:59:59",
                ),
              },
            });
            if (ebarimtuud?.length > 0) {
              for (const saveEBarimt of ebarimtuud) {
                saveEBarimt.zogsooliinId = data?._id;
                await saveEBarimt.save().catch((err) => {
                  next(err);
                });
              }
            }
          }
        }
      }
      res.send(ebarimtuud);
    } catch (err) {
      next(err);
    }
  },
);

router.post(
  "/ebarimtAvsanDunOruulakh",
  tokenShalgakh,
  async (req, res, next) => {
    try {
      var match = {
        baiguullagiinId: req.body.baiguullagiinId,
        barilgiinId: req.body.barilgiinId,
        mashiniiDugaar: { $exists: true },
        zogsooliinId: { $exists: true },
      };
      var ebarimtuud = await EbarimtShine(req.body.tukhainBaaziinKholbolt).find(
        match,
      );
      if (ebarimtuud?.length > 0) {
        for (const ebarimt of ebarimtuud) {
          var update = {
            ebarimtAvsanDun: ebarimt.cashAmount || ebarimt.totalAmount,
          };
          Uilchluulegch(req.body.tukhainBaaziinKholbolt)
            .findByIdAndUpdate(ebarimt.zogsooliinId, update)
            .then((xariu) => {})
            .catch((err) => {
              next(err);
            });
        }
      }
      res.send("Амжилттай");
    } catch (err) {
      next(err);
    }
  },
);

router.post("/davkharBarimtZasakh", tokenShalgakh, async (req, res, next) => {
  try {
    var match = {
      baiguullagiinId: req.body.baiguullagiinId,
      barilgiinId: req.body.barilgiinId,
      mashiniiDugaar: { $exists: true },
      "tuukh.tulbur": { $size: req.body.count },
      "tuukh.tulbur.turul": req.body.turul,
    };
    if (!!req.body.mashiniiDugaar)
      match["mashiniiDugaar"] = req.body.mashiniiDugaar;
    var uilchluulegchuud = await Uilchluulegch(
      req.body.tukhainBaaziinKholbolt,
      true,
    ).find(match);
    if (uilchluulegchuud?.length > 0) {
      for (const data of uilchluulegchuud) {
        var filteredData = data.tuukh[0]?.tulbur?.filter(
          (a) => a.turul === req.body.turul,
        );
        if (filteredData?.length === req.body.count) {
          await Uilchluulegch(req.body.tukhainBaaziinKholbolt).updateOne(
            { _id: data._id },
            {
              "tuukh.0.tulbur": [filteredData[0]],
            },
          );
        }
      }
    }
    res.send("Амжилттай");
  } catch (err) {
    next(err);
  }
});

router.post(
  "/niitZurchilteiMashinOlokh",
  tokenShalgakh,
  async (req, res, next) => {
    try {
      var query = {
        baiguullagiinId: req.body.baiguullagiinId,
        barilgiinId: req.body.barilgiinId,
        gadnaZogsooliinId: { $exists: false },
        zurchulMsgeerSanuulakh: true,
      };
      var zogsool = await Parking(req.body.tukhainBaaziinKholbolt).findOne(
        query,
      );
      if (zogsool?.zurchulMsgeerSanuulakh) {
        const zurchilteiUilchluulegch = await Uilchluulegch(
          req.body.tukhainBaaziinKholbolt,
          true,
        ).find({
          baiguullagiinId: zogsool?.baiguullagiinId,
          barilgiinId: zogsool.barilgiinId,
          "tuukh.zogsooliinId": zogsool?._id.toString(),
          "tuukh.tulbur": [],
          "tuukh.tsagiinTuukh.garsanTsag": { $exists: true },
          "tuukh.garsanKhaalga": { $exists: true },
          niitDun: { $gt: zogsool?.tulburiinLimitDun || 0 },
        });
        if (zurchilteiUilchluulegch?.length > 0) {
          for (const zurchil of zurchilteiUilchluulegch) {
            const zurchilteiData = await ZurchilteiMashin(
              req.body.tukhainBaaziinKholbolt,
            ).findOne({
              baiguullagiinId: zurchil?.baiguullagiinId,
              barilgiinId: zurchil?.barilgiinId,
              uilchluulegchiinId: zurchil?._id.toString(),
              zogsooliinId: zurchil?.tuukh[0]?.zogsooliinId,
              mashiniiDugaar: zurchil?.mashiniiDugaar,
            });
            if (!zurchilteiData) {
              const zurchilModel = new ZurchilteiMashin(
                req.body.tukhainBaaziinKholbolt,
              )();
              zurchilModel.baiguullagiinId = zurchil?.baiguullagiinId;
              zurchilModel.barilgiinId = zurchil?.barilgiinId;
              zurchilModel.uilchluulegchiinId = zurchil?._id.toString();
              zurchilModel.mashiniiDugaar = zurchil?.mashiniiDugaar;
              zurchilModel.zogsooliinId = zurchil?.tuukh[0]?.zogsooliinId;
              zurchilModel.niitKhugatsaa = zurchil?.niitKhugatsaa;
              zurchilModel.orsonKhaalga = zurchil?.tuukh[0].orsonKhaalga;
              zurchilModel.garsanKhaalga = zurchil?.tuukh[0].garsanKhaalga;
              zurchilModel.orsonTsag =
                zurchil?.tuukh[0].tsagiinTuukh[0].orsonTsag;
              zurchilModel.garsanTsag =
                zurchil?.tuukh[0].tsagiinTuukh[0].garsanTsag;
              zurchilModel.niitDun = zurchil?.niitDun;
              zurchilModel.turul = zurchil?.turul;
              zurchilModel.tuluv = 0;
              zurchilModel.save();
            }
          }
        }
      }
      return res.send("Amjilttai");
    } catch (err) {
      next(err);
    }
  },
);

router.post(
  "/zurchilteiMashinMsgilgeekh",
  tokenShalgakh,
  async (req, res, next) => {
    try {
      var query = {
        baiguullagiinId: req.body.baiguullagiinId,
        barilgiinId: req.body.barilgiinId,
        gadnaZogsooliinId: { $exists: false },
        zurchulMsgeerSanuulakh: true,
      };
      var zogsool = await Parking(req.body.tukhainBaaziinKholbolt).findOne(
        query,
      );
      var msgnuud = [];
      if (!!zogsool && zogsool?.zurchilMsgilgeekhDugaar?.length > 0) {
        var match = {
          baiguullagiinId: req.body.baiguullagiinId,
          barilgiinId: req.body.barilgiinId,
          zogsooliinId: zogsool?._id?.toString(),
          mashiniiDugaar: req.body.mashiniiDugaar,
          tuluv: { $ne: 1 },
        };
        var query = [
          {
            $match: match,
          },
          {
            $group: {
              _id: "$mashiniiDugaar",
              dun: {
                $sum: "$niitDun",
              },
            },
          },
        ];
        var zurchiluud = await ZurchilteiMashin(
          req.body.tukhainBaaziinKholbolt,
        ).aggregate(query);
        if (zurchiluud?.length > 0) {
          for (const dugaar of zogsool?.zurchilMsgilgeekhDugaar) {
            var msg = new MsgTuukh(req.body.tukhainBaaziinKholbolt)();
            msg.baiguullagiinId = req.body.baiguullagiinId;
            msg.barilgiinId = req.body.barilgiinId;
            msg.mashiniiDugaar = zurchiluud[0]._id;
            msg.dugaar = dugaar;
            msg.turul = "zurchil";
            msg.msg =
              formatNumber(zurchiluud[0].dun, 0) +
              " zurchiltei " +
              (zurchiluud[0]._id || "") +
              " dugaartai mashin newterlee";
            msg.save();
            msgnuud.push({ to: dugaar, text: msg.msg });
          }
        }
        if (msgnuud?.length > 0) {
          var msgIlgeekhKey = "aa8e588459fdd9b7ac0b809fc29cfae3";
          var msgIlgeekhDugaar = "72002032";
          msgIlgeeye(
            msgnuud,
            msgIlgeekhKey,
            msgIlgeekhDugaar,
            [],
            0,
            req.body.tukhainBaaziinKholbolt,
            req.body.baiguullagiinId,
          );
        }
      }
      return res.send(msgnuud);
    } catch (err) {
      next(err);
    }
  },
);

router.post(
  "/zurchiluudTulsunBolgoy",
  tokenShalgakh,
  async (req, res, next) => {
    try {
      await ZurchilteiMashin(req.body.tukhainBaaziinKholbolt).updateMany(
        { _id: { $in: req.body.utguud } },
        {
          $set: {
            tuluv: 1,
            tailbar: req.body.shaltgaan,
          },
        },
      );
      res.send("Amjilttai");
    } catch (err) {
      next(err);
    }
  },
);

function formatNumber(num, fixed = 2) {
  if (num === undefined || num === null || num === "")
    return formatNumber("0.00", fixed);
  var fixedNum = parseFloat(num).toFixed(fixed).toString();
  var numSplit = fixedNum.split(".");
  if (numSplit === null || numSplit.length === 0) {
    return formatNumber("0.00", fixed);
  }
  var firstFormatNum = numSplit[0]
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  if (lodash.isNaN(firstFormatNum)) firstFormatNum = "0";
  if (fixed === 0) return firstFormatNum;
  return firstFormatNum + "." + numSplit[1];
}

router.post(
  "/zogsooliinTuluuguiMashiniiTailanAvya",
  tokenShalgakh,
  async (req, res, next) => {
    try {
      var match = {
        baiguullagiinId: req.body.baiguullagiinId,
        barilgiinId: !!req.body.barilgiinId
          ? req.body.barilgiinId
          : { $exists: true },
        mashiniiDugaar: !!req.body.searchUtga
          ? { $regex: req.body.searchUtga, $options: "i" }
          : { $exists: true },
        tuluv: 0,
        createdAt: {
          $lte: new Date(moment(req.body.ognoo).format("YYYY-MM-DD 23:59:59")),
        },
      };
      var query = [
        {
          $match: match,
        },
        {
          $group: {
            _id: "$mashiniiDugaar",
            dun: {
              $sum: "$niitDun",
            },
            too: {
              $sum: 1,
            },
          },
        },
      ];
      var tailan = await ZurchilteiMashin(
        req.body.tukhainBaaziinKholbolt,
      ).aggregate(query);
      res.send(tailan);
    } catch (err) {
      next(err);
    }
  },
);

router.get("/notTokiParking", async (req, res, next) => {
  try {
    const { db } = require("zevbackv2");
    var kholboltuud = db.kholboltuud;
    var localEsekh = !!req.body.baiguullagiinId;
    if (localEsekh) {
      kholboltuud = kholboltuud.filter(
        (a) => a.baiguullagiinId == req.body.baiguullagiinId,
      );
    }
    var result = [];
    if (kholboltuud) {
      var query = { tokiNer: { $exists: false } };
      if (!!req.body.baiguullagiinId)
        query["baiguullagiinId"] = req.body.baiguullagiinId;
      for (const kholbolt of kholboltuud) {
        var baiguullaga = await Baiguullaga(db.erunkhiiKholbolt).findById(
          kholbolt.baiguullagiinId,
        );
        var zogsooluud = await getParkingFind(
          kholbolt,
          kholbolt.baiguullagiinId,
          query,
        );
        if (zogsooluud?.length > 0)
          result.push({ ner: baiguullaga.ner, register: baiguullaga.register });
      }
    }
    res.send(result);
  } catch (err) {
    next(err);
  }
});

router.post(
  "/dotorZogsoolDavhkardsanMashin",
  tokenShalgakh,
  async (req, res, next) => {
    try {
      var match = {
        baiguullagiinId: req.body.baiguullagiinId,
        barilgiinId: req.body.barilgiinId,
        tuukh: { $size: req.body.size },
        "tuukh.zogsooliinId": req.body.zogsooliinId,
        "tuukh.orsonKhaalga": req.body.cameraIP,
        "tuukh.tsagiinTuukh.garsanTsag": { $exists: true },
      };
      if (req.body.mashiniiDugaar)
        match["mashiniiDugaar"] = req.body.mashiniiDugaar;
      var mashinuud = await Uilchluulegch(
        req.body.tukhainBaaziinKholbolt,
        true,
      ).find(match);
      var result = [];
      for (const data of mashinuud) {
        var tuukh = data.tuukh?.filter(
          (e) => e.orsonKhaalga === req.body.cameraIPGadna,
        );
        var filtered = data.tuukh?.filter(
          (e) => e.orsonKhaalga === req.body.cameraIP,
        );
        tuukh.push(filtered[0]);
        data.tuukh = tuukh;
        await Uilchluulegch(req.body.tukhainBaaziinKholbolt).findByIdAndUpdate(
          data._id,
          {
            $set: {
              tuukh: tuukh,
            },
          },
        );
        result.push(data);
      }
      res.send(result);
    } catch (err) {
      next(err);
    }
  },
);
router.post("/zochinAjiltaniiIdTseverlekh", async (req, res, next) => {
  try {
    const { db } = require("zevbackv2");
    var kholboltuud = db.kholboltuud;
    var localEsekh = !!req.body.baiguullagiinId;
    if (localEsekh) {
      kholboltuud = kholboltuud.filter(
        (a) => a.baiguullagiinId == req.body.baiguullagiinId,
      );
    }
    var result = [];
    if (kholboltuud) {
      var query = { "tuukh.burtgesenAjiltaniiId": "zochin" };
      if (!!req.body.baiguullagiinId)
        query["baiguullagiinId"] = req.body.baiguullagiinId;
      for (const kholbolt of kholboltuud) {
        var mashinuud = await Uilchluulegch(kholbolt, true).find(query);
        if (mashinuud?.length > 0) {
          for (const data of mashinuud) {
            await Uilchluulegch(kholbolt).findByIdAndUpdate(data._id, {
              $unset: {
                "tuukh.0.burtgesenAjiltaniiId": 1,
              },
            });
            result.push(data);
          }
        }
      }
    }
    res.send(result);
  } catch (err) {
    next(err);
  }
});

router.post("/mashiniiDugaarZasakh", tokenShalgakh, async (req, res, next) => {
  try {
    var uilchluulegch = await Uilchluulegch(
      req.body.tukhainBaaziinKholbolt,
      true,
    )
      .findOne({
        baiguullagiinId: req.body.baiguullagiinId,
        barilgiinId: req.body.barilgiinId,
        mashiniiDugaar: req.body.mashiniiDugaar,
        "tuukh.garsanKhaalga": { $exists: false },
        "tuukh.0.tsagiinTuukh.0.garsanTsag": { $exists: false },
        "tuukh.0.tuluv": { $ne: -2 },
      })
      .sort({ createdAt: -1 })
      .limit(1);
    if (!!uilchluulegch && !!uilchluulegch?._id && !!req.body.mashin) {
      await Uilchluulegch(req.body.tukhainBaaziinKholbolt).findByIdAndUpdate(
        uilchluulegch?._id.toString(),
        {
          $set: {
            turul: req.body.mashin?.turul,
            mashin: req.body.mashin,
          },
        },
      );
      res.send("Amjilttai");
    } else res.send("Amjiltgui");
  } catch (error) {
    if (next) next(error);
  }
});

router.post(
  "/mashiniiDugaarZaiArilgakh",
  tokenShalgakh,
  async (req, res, next) => {
    try {
      var mashinuud = await Mashin(req.body.tukhainBaaziinKholbolt).find({
        baiguullagiinId: req.body.baiguullagiinId,
      });
      if (mashinuud?.length > 0) {
        for (const mashin of mashinuud) {
          await Mashin(req.body.tukhainBaaziinKholbolt).findByIdAndUpdate(
            mashin?._id.toString(),
            {
              $set: {
                dugaar: mashin.dugaar?.trim().replace(/\s/g, ""),
              },
            },
          );
        }
      }
      // var uilchluulegchuud = await Uilchluulegch(
      //   req.body.tukhainBaaziinKholbolt
      // ).find({
      //   baiguullagiinId: req.body.baiguullagiinId,
      // });
      // if (uilchluulegchuud?.length > 0) {
      //   for (const data of uilchluulegchuud) {
      //     await Uilchluulegch(
      //       req.body.tukhainBaaziinKholbolt
      //     ).findByIdAndUpdate(data?._id.toString(), {
      //       $set: {
      //         dugaar: data.mashiniiDugaar?.trim().replace(/\s/g, ""),
      //       },
      //     });
      //   }
      // }
      res.send("Амжилттай");
    } catch (error) {
      if (next) next(error);
    }
  },
);

router.post(
  "/zogsoolUilchluulegchFast",
  tokenShalgakh,
  async (req, res, next) => {
    try {
      const {
        baiguullagiinId,
        barilgiinId,
        matchWithGate,
        matchWithoutGate,
        khuudasniiDugaar = 1,
        khuudasniiKhemjee = 10,
        order = { "tuukh.0.tsagiinTuukh.garsanTsag": -1 },
      } = req.body;

      // $or filter-г нэгтгэх
      const orFilter = [];
      if (matchWithGate) orFilter.push(matchWithGate);
      if (matchWithoutGate) orFilter.push(matchWithoutGate);

      // MongoDB query
      const result = await Uilchluulegch(req.body.tukhainBaaziinKholbolt)
        .find({
          baiguullagiinId,
          barilgiinId,
          $or: orFilter.length > 0 ? orFilter : [{}],
        })
        .sort(order)
        .skip((khuudasniiDugaar - 1) * khuudasniiKhemjee)
        .limit(khuudasniiKhemjee);

      // Хүссэн тоогоор count авах
      const total = await Uilchluulegch(
        req.body.tukhainBaaziinKholbolt,
      ).countDocuments({
        baiguullagiinId,
        barilgiinId,
        $or: orFilter.length > 0 ? orFilter : [{}],
      });
      res.json({ data: result, total });
    } catch (err) {
      if (next) next(err);
      res.status(500).json({ error: "Алдаа гарлаа" });
    }
  },
);

function stableStringify(obj) {
  if (obj === null || typeof obj !== "object") return JSON.stringify(obj);
  if (Array.isArray(obj)) return `[${obj.map(stableStringify).join(",")}]`;
  const keys = Object.keys(obj).sort();
  return `{${keys
    .map((k) => JSON.stringify(k) + ":" + stableStringify(obj[k]))
    .join(",")}}`;
}

async function getParkingFind(kholbolt, baiguullagiinId, query) {
  const queryKey = crypto
    .createHash("md5")
    .update(stableStringify(query))
    .digest("hex");
  const cacheKey = `parkingFind:${baiguullagiinId}:${queryKey}`;
  const cached = await client.get(cacheKey);
  if (cached) return JSON.parse(cached);
  const data = await Parking(kholbolt)
    .find(query)
    .lean();
  await client.setEx(cacheKey, 300, JSON.stringify(data));
  return data;
}

async function getDotorZogsoolById(kholbolt, baiguullagiinId, barilgiinId, id) {
  const cacheKey = `dotorZogsoolFindById:${baiguullagiinId}:${barilgiinId}:${id}`;
  const cached = await client.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  const dotorZogsool = await Parking(kholbolt).findById(id);
  await client.setEx(cacheKey, 60, JSON.stringify(dotorZogsool));
  return dotorZogsool;
}

async function getAggregateUilchluulegch(
  kholbolt,
  baiguullagiinId,
  barilgiinId,
  query,
) {
  const queryKey = crypto
    .createHash("md5")
    .update(stableStringify(query))
    .digest("hex");
  const cacheKey = `parkingUilchluulegch:${baiguullagiinId}:${barilgiinId}:${queryKey}`;
  const cached = await client.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const xariu = await Uilchluulegch(kholbolt, true).aggregate(query);
  await client.setEx(cacheKey, 60, JSON.stringify(xariu));
  return xariu;
}

async function getUilchluulegchfindOne(
  kholbolt,
  baiguullagiinId,
  barilgiinId,
  query,
) {
  const queryKey = crypto
    .createHash("md5")
    .update(stableStringify(query))
    .digest("hex");
  const cacheKey = `UilchluulegchFindOne:${baiguullagiinId}:${barilgiinId}:${queryKey}`;
  const cached = await client.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const xariu = await Uilchluulegch(kholbolt, true).findOne(query);
  await client.setEx(cacheKey, 60, JSON.stringify(xariu));
  return xariu;
}

module.exports = router;
