const express = require("express");
const Baiguullaga = require("../models/baiguullaga");
const { tokenShalgakh } = require("zevbackv2");

const router = express.Router();

const {
  qpayKhariltsagchUusgey,
  qpayGargaya,
  QuickQpayObject,
  QpayKhariltsagch,
} = require("quickqpaypackv2");

router.get(
  "/qpaycallback/:baiguullagiinId/:zakhialgiinDugaar",
  async (req, res, next) => {
    try {
      console.log("req.params", req.params);
      console.log("req.query", req.query);
      const { db } = require("zevbackv2");
      const b = req.params.baiguullagiinId;
      const qpayObject = await QuickQpayObject(db.erunkhiiKholbolt).findOne({
        zakhialgiinDugaar: req.params.zakhialgiinDugaar,
      });
      qpayObject.tulsunEsekh = true;
      qpayObject.isNew = false;
      console.log("qpayObject ", qpayObject);
      await qpayObject.save();
      req.app.get("socketio").emit(`qpay/${b}/${qpayObject.zakhialgiinDugaar}`);
      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  }
);

router.post("/qpayMerchantGargaya", tokenShalgakh, async (req, res, next) => {
  try {
    req.body.tailbar = "testiin guilgee";
    const callback_url =
      "http://" +
      process.env.UNDSEN_IP +
      ":" +
      process.env.PORT +
      "/qpaycallback/" +
      req.body.baiguullagiinId +
      "/" +
      req.body.zakhialgiinDugaar;
    console.log("callback_url", callback_url);
    const khariu = await qpayGargaya(
      req.body,
      callback_url,
      req.body.tukhainBaaziinKholbolt
    );
    res.send({ khariu });
  } catch (err) {
    next(err);
  }
});

router.post(
  "/qpayKhariltsagchUusgey",
  tokenShalgakh,
  async (req, res, next) => {
    try {
      const { db } = require("zevbackv2");
      var baiguullaga = await Baiguullaga(db.erunkhiiKholbolt).findOne({
        register: req.body.register_number,
      });
      var kholbolt = db.kholboltuud.find(
        (a) => a.baiguullagiinId == baiguullaga._id
      );
      req.body.baiguullagiinId = baiguullaga._id;
      delete req.body.tukhainBaaziinKholbolt;
      delete req.body.erunkhiiKholbolt;
      var khariu = await qpayKhariltsagchUusgey(req.body, kholbolt);
      res.send(khariu);
    } catch (err) {
      next(err);
    }
  }
);

router.post("/qpayKhariltsagchAvay", tokenShalgakh, async (req, res, next) => {
  try {
    const { db } = require("zevbackv2");
    var baiguullaga1 = await Baiguullaga(db.erunkhiiKholbolt).findOne({
      register: req.body.register,
    });
    var kholbolt = db.kholboltuud.find(
      (a) => a.baiguullagiinId == baiguullaga1._id
    );
    var qpayKhariltsagch = new QpayKhariltsagch(kholbolt);

    req.body.baiguullagiinId = baiguullaga1._id;
    const baiguullaga = await qpayKhariltsagch.findOne({
      baiguullagiinId: req.body.baiguullagiinId,
    });
    console.log("baiguullaga", baiguullaga);
    if (baiguullaga) res.send(baiguullaga);
    else res.send(undefined);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
