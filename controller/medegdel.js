const asyncHandler = require("express-async-handler");
const aldaa = require("../components/aldaa");
const SanalGomdol = require("../models/sanalGomdol");
const SonorduulgaObject = require("../models/sonorduulga");
const Sonorduulga = require("../components/sonorduulga");
const jwt = require("jsonwebtoken");

exports.uruunuudOlyo = asyncHandler((ajiltan, callback) => {
    try {
        Uruu.find({ "gishuud.id": ajiltan._id }).then((result) => { console.log("result", result); callback(result); });
    }
    catch (err) {
        throw new aldaa(err);
    }
});

exports.sanalKhadgalya = asyncHandler((req, res, next) => {
    try {
        var medegdel = new SanalGomdol(req.body);
        medegdel.ognoo = new Date();
        medegdel.save(req.body).then((khariu) => {
            Sonorduulga.ilgeeye(io = req.app.get('socketio'), medegdel);
            res.send("Amjilttai");
        });
    }
    catch (err) {
        next(err);
    }
});

exports.sanalKharlaa = asyncHandler((req, res, next) => {
    try {
        SanalGomdol.updateMany({ _id: req.body.id }, { $set: { kharsanEsekh: true } }).then((res) => console.log(res));
        if (req.body.sonorduulgaId)
            Sonorduulga.sonorduulgauzsenbolgoyo(req.body.sonorduulgaId);
        res.sendStatus(200);
    }
    catch (err) {
        next(err);
    }
});

exports.sonorduulgaKharlaa = asyncHandler((req, res, next) => {
    try {
        Sonorduulga.sonorduulgauzsenbolgoyo(req.body.id);
        res.send("Amjilttai");
    }
    catch (err) {
        next(err);
    }
});

exports.sanalKhuleenAvlaa = asyncHandler((req, res, next) => {
    try {
        SonorduulgaObject.updateMany({ _id: req.body.id }, { $set: { tuluv: 1 } }).then((res) => console.log(res));
        res.sendStatus(200);
    }
    catch (err) {
        next(err);
    }
});