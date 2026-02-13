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
const { pubClient } = require("../utils/redisClient");
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
const tokiPayController = require("../controller/tokiPayController");
const passPayController = require("../controller/passPayController");
const kioskPayController = require("../controller/kioskPayController");
const kioskEbarimtController = require("../controller/kioskEbarimtController"); 
const mashinController = require("../controller/mashinController");
const busadDataZogsoolController = require("../controller/busadDataZogsoolController");

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
router.post("/v1/tulburMedeelelAvya", passController.getTulburMedeelel);
router.get("/v1/search_car/:plate_number", searchCarToki);
router.get("/v1/search_carQR/:plate_number", searchCarQR);
router.get("/v1/search_car_unegui/:plate_number", tokenShalgakh, parkingUneguiController.searchCarUnegui);
router.post("/v1/pay", tokiPayController.tokiPay);
router.post("/pass/pay", tokenShalgakh, passPayController.passPay);
router.post("/v1/kioskPay", tokenShalgakh, kioskPayController.kioskPay);
router.post("/v1/kioskEbarimtAvya", tokenShalgakh, kioskEbarimtController.kioskEbarimtAvya);
router.post("/mashinUpdate", tokenShalgakh, mashinController.mashinUpdate);
router.post("/turluurZogsoolIdOruulakh", tokenShalgakh, busadDataZogsoolController.turluurZogsoolIdOruulakh);
router.post("/ebarimtAvsanDunOruulakh", tokenShalgakh, busadDataZogsoolController.ebarimtAvsanDunOruulakh);
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
  const cached = await pubClient.get(cacheKey);
  if (cached) return JSON.parse(cached);
  const data = await Parking(kholbolt)
    .find(query)
    .lean();
  await pubClient.setEx(cacheKey, 300, JSON.stringify(data));
  return data;
}

async function getDotorZogsoolById(kholbolt, baiguullagiinId, barilgiinId, id) {
  const cacheKey = `dotorZogsoolFindById:${baiguullagiinId}:${barilgiinId}:${id}`;
  const cached = await pubClient.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  const dotorZogsool = await Parking(kholbolt).findById(id);
  await pubClient.setEx(cacheKey, 60, JSON.stringify(dotorZogsool));
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
  const cached = await pubClient.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const xariu = await Uilchluulegch(kholbolt, true).aggregate(query);
  await pubClient.setEx(cacheKey, 60, JSON.stringify(xariu));
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
  const cached = await pubClient.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const xariu = await Uilchluulegch(kholbolt, true).findOne(query);
  await pubClient.setEx(cacheKey, 60, JSON.stringify(xariu));
  return xariu;
}

module.exports = router;
