const asyncHandler = require("express-async-handler");
const aldaa = require("../components/aldaa");
const SanalGomdol = require("../models/sanalGomdol");
const Khariltsagch = require("../models/khariltsagch");
const SonorduulgaObject = require("../models/sonorduulga");
const Sonorduulga = require("../components/sonorduulga");
const {
  sonorduulgaIlgeeye,
  khariltsagchidSonorduulgaIlgeeye,
} = require("../controller/appNotification");
const jwt = require("jsonwebtoken");

exports.uruunuudOlyo = asyncHandler((ajiltan, callback) => {
  try {
    Uruu.find({ "gishuud.id": ajiltan._id }).then((result) => {
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
        Sonorduulga.ilgeeye(
          (io = req.app.get("socketio")),
          medegdel,
          req.body.tukhainBaaziinKholbolt
        );
        res.send("Amjilttai");
      } else {
        var firebaseToken = req.body.firebaseToken;
        var kharilltsagch = await Khariltsagch(
          req.body.tukhainBaaziinKholbolt
        ).findOne({
          _id: req.body.khariltsagchiinId,
        });
        if (kharilltsagch) firebaseToken = kharilltsagch.firebaseToken;
        // if(!!firebaseToken)
        //   sonorduulgaIlgeeye(
        //     firebaseToken,
        //     { title: khariu.title, body: khariu.body },
        //     (r) => {
        var sonorduulga = new Sonorduulga(req.body.tukhainBaaziinKholbolt)();
        sonorduulga.khariltsagchiinId = req.body.khariltsagchiinId;
        sonorduulga.baiguullagiinId = req.body.baiguullagiinId;
        sonorduulga.barilgiinId = req.body.barilgiinId;
        if (req.body.khariltsagchiinId)
          sonorduulga.khuleenAvagchiinId = req.body.khariltsagchiinId;
        sonorduulga.title = khariu.title;
        sonorduulga.message = khariu.body;
        sonorduulga.kharsanEsekh = false;
        sonorduulga.save();
        var io = req.app.get("socketio");
        if (io)
          io.emit("khariltsagch" + req.body.khariltsagchiinId, sonorduulga);
        res.send(r);
        //     },
        //     next
        //   );
        // else
        //   res.send("!fire token not found");
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
      .then((res) => {});
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
      .then((res) => res);
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

exports.appWebDuudlagaKhadgalya = asyncHandler((req, res, next) => {
  try {
    var sonorduulga = new SonorduulgaObject(req.body.tukhainBaaziinKholbolt)();
    sonorduulga.khariltsagchiinId = req.body.khariltsagchiinId;
    sonorduulga.khariltsagchiinNer = req.body.khariltsagchiinNer;
    sonorduulga.khariltsagchiinUtas = req.body.khariltsagchiinUtas;
    sonorduulga.khariltsagchiinRegister = req.body.khariltsagchiinRegister;
    sonorduulga.khariltsagchiinGereeniiDugaar =
      req.body.khariltsagchiinGereeniiDugaar;
    sonorduulga.khariltsagchiinTalbainDugaar =
      req.body.khariltsagchiinTalbainDugaar;
    sonorduulga.baiguullagiinId = req.body.baiguullagiinId;
    sonorduulga.barilgiinId = req.body.barilgiinId;
    sonorduulga.title = req.body.title;
    sonorduulga.message = req.body.message;
    sonorduulga.turul = "duudlaga";
    sonorduulga.duudlagiinTurul = req.body.duudlagiinTurul;
    sonorduulga.kharsanEsekh = false;
    sonorduulga.tuluv = 0;
    sonorduulga.save();
    var io = req.app.get("socketio");
    if (io) io.emit("appWebDuudlaga" + req.body.baiguullagiinId, sonorduulga);
    res.send(sonorduulga);
  } catch (err) {
    next(err);
  }
});
