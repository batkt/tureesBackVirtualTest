const asyncHandler = require("express-async-handler");
const aldaa = require("../components/aldaa");
const SanalGomdol = require("../models/sanalGomdol");
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

exports.sanalKharlaa = asyncHandler((turul, req, res, next) => {
    try {
        var medegdel = new SanalGomdol(req.body);
        medegdel.updateOne({ _id: req.body.id }, { $set: { kharsanEsekh: true } });
        Sonorduulga.sonorduulgauzsenbolgoyo(io = req.app.get('socketio'), medegdel);
        res.send(200);
    }
    catch (err) {
        next(err);
    }
});