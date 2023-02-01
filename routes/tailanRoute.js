const express = require("express");
const router = express.Router();
const { tokenShalgakh } = require("zevbackv2");
const {
  borluulaltiinTailanAvya,
  avlagiinTailanAvya,
  avlagiinChartSalbaraarAvya,
  orlogiinChartSalbaraarAvya,
  orlogiinChartSalbarKhugatsaagaarAvya,
  zardaliinTailanAvya,
  ashigiinTailanAvya,
  analitikTailanAvya,
} = require("../controller/tailan");

router
  .route("/borluulaltiinTailanAvya")
  .post(tokenShalgakh, borluulaltiinTailanAvya);
router.route("/avlagiinTailanAvya").post(tokenShalgakh, avlagiinTailanAvya);
router
  .route("/orlogiinChartSalbaraarAvya")
  .post(tokenShalgakh, orlogiinChartSalbaraarAvya);
router
  .route("/avlagiinChartSalbaraarAvya")
  .post(tokenShalgakh, avlagiinChartSalbaraarAvya);
router
  .route("/orlogiinChartSalbarKhugatsaagaarAvya")
  .post(tokenShalgakh, orlogiinChartSalbarKhugatsaagaarAvya);
router.route("/zardaliinTailanAvya").post(tokenShalgakh, zardaliinTailanAvya);
router.route("/ashigiinTailanAvya").post(tokenShalgakh, ashigiinTailanAvya);
router.route("/analitikTailanAvya").post(tokenShalgakh, analitikTailanAvya);
module.exports = router;
