const express = require("express");
const Baiguullaga = require("../models/baiguullaga");
const Geree = require("../models/geree");
const { tokenShalgakh, Dugaarlalt } = require("zevbackv2");
const { qpayGuilgeeUtgaAvya } = require("../controller/qpay");
const router = express.Router();
const {
  qpayKhariltsagchUusgey,
  qpayGargaya,
  QuickQpayObject,
  QpayKhariltsagch,
  qpayShalgay,
} = require("quickqpaypackv2");
const { tulburUridchiljTulukh } = require("../controller/zogsool");

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
      if (qpayObject.zogsooliinId) {
        const body = {
          turul: "qpayUridchilsan",
          uilchluulegchiinId: qpayObject.zogsoolUilchluulegch.uId,
          paid_amount: qpayObject.zogsoolUilchluulegch.pay_amount,
          plate_number: qpayObject.zogsoolUilchluulegch.plate_number,
          barilgiinId: qpayObject.salbariinId,
          ajiltniiNer: "zochin",
          ajiltniiId: "zochin",
          zogsooliinId: qpayObject.zogsooliinId,
        };
        await tulburUridchiljTulukh(body, res, next);
      }
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
        baiguullagiinId: req.body.baiguullagiinId,
        barilgiinId: req.body.barilgiinId,
        turul: "qpay",
      })
      .sort({
        dugaar: -1,
      })
      .limit(1)
      .then((result) => {
        if (result != 0) maxDugaar = result[0].dugaar + 1;
      });
    var tailbar = "Төлбөр";
    if (!!req.body.gereeniiId) {
      var geree = await Geree(req.body.tukhainBaaziinKholbolt).findById(
        req.body.gereeniiId
      );
      tailbar = "Түрээсийн төлбөр " + geree.gereeniiDugaar;
    }
    req.body.tailbar = tailbar;
    /*Төлбөр callback url*/
    var callback_url =
      "http://" +
      process.env.UNDSEN_IP +
      ":" +
      process.env.PORT +
      "/qpaycallback/" +
      req.body.baiguullagiinId +
      "/" +
      req.body?.zakhialgiinDugaar;
    /*Түрээсийн төлбөр callback url*/
    if (req.body.gereeniiId || req.body.dansniiDugaar) {
      callback_url =
        "http://" +
        process.env.UNDSEN_IP +
        ":" +
        process.env.PORT +
        "/qpayTulye/" +
        req.body.baiguullagiinId.toString() +
        "/" +
        req.body.barilgiinId.toString() +
        "/" +
        maxDugaar.toString();

      req.body.zakhialgiinDugaar = maxDugaar.toString();
    }

    console.log("callback_url", callback_url);
    const khariu = await qpayGargaya(
      req.body,
      callback_url,
      req.body.tukhainBaaziinKholbolt
    );
    var dugaarlalt = new Dugaarlalt(req.body.tukhainBaaziinKholbolt)();
    dugaarlalt.baiguullagiinId = req.body.baiguullagiinId;
    dugaarlalt.barilgiinId = req.body.barilgiinId;
    dugaarlalt.ognoo = new Date();
    dugaarlalt.turul = "qpay";
    dugaarlalt.dugaar = maxDugaar;
    dugaarlalt.save();
    res.send(khariu);
  } catch (err) {
    next(err);
  }
});

router.post("/qpayShalgay", tokenShalgakh, async (req, res, next) => {
  try {
    const khariu = await qpayShalgay(req.body, req.body.tukhainBaaziinKholbolt);
    res.send(khariu);
  } catch (err) {
    next(err);
  }
});
router.post("/qpayGuilgeeUtgaAvya", tokenShalgakh, qpayGuilgeeUtgaAvya);

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
      if (khariu === "Amjilttai") {
        res.send(khariu);
      } else throw new Error(khariu);
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
