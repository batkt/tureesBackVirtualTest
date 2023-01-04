const asyncHandler = require("express-async-handler");
const aldaa = require("../components/aldaa");
const SanalGomdol = require("../models/sanalGomdol");
const Khariltsagch = require("../models/khariltsagch");
const SonorduulgaObject = require("../models/sonorduulga");
const Sonorduulga = require("../components/sonorduulga");
const { sonorduulgaIlgeeye } = require("../controller/appNotification");
const jwt = require("jsonwebtoken");

exports.uruunuudOlyo = asyncHandler((ajiltan, callback) => {
  try {
    Uruu.find({ "gishuud.id": ajiltan._id }).then((result) => {
      console.log("result", result);
      callback(result);
    });
  } catch (err) {
    throw new aldaa(err);
  }
});

exports.sanalKhadgalya = asyncHandler((req, res, next) => {
  try {
    var medegdel = new SanalGomdol(req.body.tukhainBaaziinKholbolt)(req.body);
    medegdel.ognoo = new Date();
    medegdel.save(req.body).then(async (khariu) => {
      if (medegdel.turul != "shaardlaga") {
        Sonorduulga.ilgeeye((io = req.app.get("socketio")), medegdel);
        res.send("Amjilttai");
      } else {
        var firebaseToken = req.body.firebaseToken;
        var kharilltsagch = await Khariltsagch(
          req.body.tukhainBaaziinKholbolt
        ).findOne({
          _id: req.body.khariltsagchiinId,
        });
        if (kharilltsagch) firebaseToken = kharilltsagch.firebaseToken;
        sonorduulgaIlgeeye(
          firebaseToken,
          { title: req.body.title, body: req.body.message },
          (r) => {
            var sonorduulga = new SonorduulgaObject(
              req.body.tukhainBaaziinKholbolt
            )(req.body);
            if (req.body.khariltsagchiinId)
              sonorduulga.khuleenAvagchiinId = req.body.khariltsagchiinId;
            sonorduulga.kharsanEsekh = false;
            sonorduulga.save();
            var io = req.app.get("socketio");
            if (io)
              io.emit("khariltsagch" + req.body.khariltsagchiinId, sonorduulga);
            res.send(r);
          },
          next
        );
      }
    });
  } catch (err) {
    next(err);
  }
});

exports.sanalKharlaa = asyncHandler((req, res, next) => {
  try {
    SanalGomdol(req.body.tukhainBaaziinKholbolt)
      .updateMany({ _id: req.body.id }, { $set: { kharsanEsekh: true } })
      .then((res) => console.log(res));
    if (req.body.sonorduulgaId)
      Sonorduulga.sonorduulgauzsenbolgoyo(
        req.body.sonorduulgaId,
        req.body.tukhainBaaziinKholbolt
      );
    res.send("Amjilttai");
  } catch (err) {
    next(err);
  }
});

exports.sonorduulgaKharlaa = asyncHandler((req, res, next) => {
  try {
    Sonorduulga.sonorduulgauzsenbolgoyo(
      req.body.id,
      req.body.tukhainBaaziinKholbolt
    );
    res.send("Amjilttai");
  } catch (err) {
    next(err);
  }
});

exports.sanalKhuleenAvlaa = asyncHandler((req, res, next) => {
  try {
    SanalGomdol(req.body.tukhainBaaziinKholbolt)
      .updateMany({ _id: req.body.id }, { $set: { tuluv: 1 } })
      .then((res) => console.log(res));
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});
