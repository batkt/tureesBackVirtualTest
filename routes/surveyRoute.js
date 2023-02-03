const express = require("express");
const router = express.Router();
const Survey = require("../models/survey");
const Asuult = require("../models/asuult");
const Khariult = require("../models/khariult");
//const UstsanBarimt = require("../models/ustsanBarimt");
const { tokenShalgakh, crud, UstsanBarimt } = require("zevbackv2");

crud(router, "survey", Survey, UstsanBarimt);
crud(router, "asuult", Asuult, UstsanBarimt);
crud(router, "khariult", Khariult, UstsanBarimt);

router.route("/surveyKhadgalya").post(async (req, res, next) => {
  const data = new Khariult(req.body);
  data
    .save()
    .then((result) => res.send("Amjilttai"))
    .catch((err) => next(err));
});

router.route("/asuultAvya/:id").get(async (req, res, next) => {
  const { db } = require("zevbackv2");
  console.log("db.kholboltuud", db.kholboltuud);
  console.log("req.params", req.params);
  var kholboltuud = db.kholboltuud;
  var tukhainBaaziinKholbolt = kholboltuud.find(
    (a) => a.baiguullagiinId == req.params.baiguullagiinId
  );
  const data = await Asuult(tukhainBaaziinKholbolt).findOne({
    _id: req.params.id,
    baiguull,
  });
  res.send(data);
});

module.exports = router;
