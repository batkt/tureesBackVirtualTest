const asyncHandler = require("express-async-handler");
const aldaa = require("../components/aldaa");
const Sanal = require("../models/sanal");;
const Gomdol = require("../models/gomdol");
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
        var medegdel = new Sanal(req.body);
        medegdel.ognoo = new Date();
        medegdel.save(req.body).then((khariu) => {
            const io = req.app.get('socketio');
            io.emit("baiguullaga" + req.body.baiguullagiinId, { msg: req.body.message });
            res.send("Amjilttai");
        });
    }
    catch (err) {
        next(err);
    }
});

exports.sanalKharlaa = asyncHandler((turul, req, res, next) => {
    try {
        var medegdel = new Sanal(req.body);
        medegdel.updateOne({ _id: req.body.id }, { $set: { kharsanEsekh: true } })
    }
    catch (err) {
        next(err);
    }
});

exports.gomdolKhadgalya = asyncHandler((req, res, next) => {
    try {
        var medegdel = new Gomdol(req.body);
        medegdel.ognoo = new Date();
        medegdel.save(req.body).then((khariu) => {
            const io = req.app.get('socketio')
            io.emit("baiguullaga" + req.body.baiguullagiinId, { msg: req.body.message });
            res.send("Amjilttai");
        });
    }
    catch (err) {
        next(err);
    }
});

exports.gomdolKharlaa = asyncHandler((turul, req, res, next) => {
    try {
        var medegdel = new Gomdol(req.body);
        medegdel.updateOne({ _id: req.body.id }, { $set: { kharsanEsekh: true } })
    }
    catch (err) {
        next(err);
    }
});