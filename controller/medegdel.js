const asyncHandler = require("express-async-handler");
const aldaa = require("../components/aldaa");
const Medegdel = require("../models/medegdel");
const jwt = require("jsonwebtoken");

exports.uruunuudOlyo = asyncHandler((ajiltan, callback) => {
    try {
        Uruu.find({ "gishuud.id": ajiltan._id }).then((result) => { console.log("result", result); callback(result); });
    }
    catch (err) {
        throw new aldaa(err);
    }
});

exports.medegdelKhadgalya = asyncHandler((req, res, next) => {
    try {
        var medegdel = new Medegdel(req.body);
        medegdel.ognoo = new Date();
        medegdel.save(req.body).then((khariu) => {
            const io = req.app.get('socketio')
            if (req.body.khariltsagchiinId)
                io.emit("baiguullaga" + req.body.baiguullagiinId, { turul: req.body.turul, msg: req.body.msg });
            else
                io.emit("khariltsagch" + req.body.khariltsagchiinId, { msg: req.body.msg });
        });
    }
    catch (err) {
        next(err);
    }
});

exports.medegdelKharlaa = asyncHandler((req, res, next) => {
    try {
        Medegdel.updateOne({ _id: req.body.id }, { $set: { baiguullagaKharsanEsekh: true, khariltsagchKharsanEsekh: true } })
    }
    catch (err) {
        next(err);
    }
});