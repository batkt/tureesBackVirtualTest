const express = require("express");
const router = express.Router();
const {
  tokenShalgakh,
  crud,
  UstsanBarimt,
} = require("zevbackv2");
const {
  Parking,
  Mashin,
  BlockMashin,
  Uilchluulegch,
  ZurchilteiMashin,
} = require("parking-v2");
const KassCameraKhaalt = require("../models/kassCameraKhaalt");
const { searchCarToki, } = require("../controller/parkingToki");
const { searchCarQR } = require("../controller/parkingQR");
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
const zogsoolZurchilteiContoller = require("../controller/zogsoolZurchilteiContoller");
const notTokiParkingController = require("../controller/notTokiParkingController");
const dotorZogsoolController = require("../controller/dotorZogsoolController");

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
router.post("/davkharBarimtZasakh", tokenShalgakh, busadDataZogsoolController.davkharBarimtZasakh);
router.post("/niitZurchilteiMashinOlokh", tokenShalgakh, zogsoolZurchilteiContoller.niitZurchilteiMashinOlokh);
router.post("/zurchilteiMashinMsgilgeekh", tokenShalgakh, zogsoolZurchilteiContoller.zurchilteiMashinMsgilgeekh);
router.post("/zurchiluudTulsunBolgoy", tokenShalgakh, zogsoolZurchilteiContoller.zurchiluudTulsunBolgoy);
router.post("/zogsooliinTuluuguiMashiniiTailanAvya", tokenShalgakh, zogsoolZurchilteiContoller.zogsooliinTuluuguiMashiniiTailanAvya);
router.get("/notTokiParking", notTokiParkingController.notTokiParking);
router.post("/dotorZogsoolDavhkardsanMashin", tokenShalgakh, dotorZogsoolController.dotorZogsoolDavhkardsanMashin);
router.post("/zochinAjiltaniiIdTseverlekh", notTokiParkingController.zochinAjiltaniiIdTseverlekh);
router.post("/mashiniiDugaarZasakh", tokenShalgakh, mashinController.mashiniiDugaarZasakh);
router.post("/mashiniiDugaarZaiArilgakh", tokenShalgakh, mashinController.mashiniiDugaarZaiArilgakh);

module.exports = router;
