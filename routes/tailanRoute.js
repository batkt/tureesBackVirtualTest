const express = require("express");
const router = express.Router();
const { tokenShalgakh, crud, UstsanBarimt } = require("zevbackv2");
const {
  borluulaltiinTailanAvya,
  avlagiinTailanAvya,
  avlagiinChartSalbaraarAvya,
  orlogiinChartSalbaraarAvya,
  orlogiinChartSalbarKhugatsaagaarAvya,
  zardaliinTailanAvya,
  ashigiinTailanAvya,
  analitikTailanAvya,
  negtgelMedeelelAvya,
  negtgelTailanAvya,
} = require("../controller/tailan");
const TailangiinZagvar = require("../models/tailangiinZagvar");

crud(router, "tailangiinZagvar", TailangiinZagvar, UstsanBarimt);

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
router
  .route("/negtgelMedeelelAvya/:turul/:ekhlekhOgnoo/:duusakhOgnoo")
  .get(tokenShalgakh, negtgelMedeelelAvya);
router
  .route("/negtgelMedeelelAvya/:turul/:ekhlekhOgnoo/:duusakhOgnoo/:barilgiinId")
  .get(tokenShalgakh, negtgelMedeelelAvya);
router.get("/ognooAvya", tokenShalgakh, async (req, res, next) => {
  res.send(new Date());
});
router.route("/negtgelTailanAvya").post(tokenShalgakh, negtgelTailanAvya);
module.exports = router;
