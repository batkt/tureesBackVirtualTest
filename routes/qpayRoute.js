const express = require("express");
const Baiguullaga = require("../models/baiguullaga");
const { tokenShalgakh, Dugaarlalt } = require("zevbackv2");

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
      var kholbolt = db.kholboltuud.find((a) => a.baiguullagiinId == b);
      const qpayObject = await QuickQpayObject(kholbolt).findOne({
        zakhialgiinDugaar: req.params.zakhialgiinDugaar,
      });
      console.log("qpayObject ", qpayObject);
      qpayObject.tulsunEsekh = true;
      qpayObject.isNew = false;
      await qpayObject.save();
      req.app.get("socketio").emit(`qpay/${b}/${qpayObject.zakhialgiinDugaar}`);
      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  }
);

router.post("/qpayGargaya", tokenShalgakh, async (req, res, next) => {
  try {
    var maxDugaar = 1;
    await Dugaarlalt(req.body.tukhainBaaziinKholbolt)
      .find({
        baiguullagiinId: body.baiguullagiinId,
        barilgiinId: body.barilgiinId,
        turul: "qpay",
      })
      .sort({
        dugaar: -1,
      })
      .limit(1)
      .then((result) => {
        if (result != 0) maxDugaar = result[0].dugaar + 1;
      });
    req.body.tailbar = "Түрээсийн г";
    const callback_url =
      "http://" +
      process.env.UNDSEN_IP +
      ":" +
      process.env.PORT +
      "/qpaycallback/" +
      req.body.baiguullagiinId +
      "/" +
      req.body?.zakhialgiinDugaar
        ? req.body.zakhialgiinDugaar
        : maxDugaar.toString();
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
