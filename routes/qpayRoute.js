const express = require("express");
const { tokenShalgakh } = require("zevbackv2");

const router = express.Router();

const {  qpayKhariltsagchUusgey, qpayGargaya, QuickQpayObject} = require("quickqpaypackv2");

router.get("/qpaycallback/:baiguullagiinId/:zakhialgiinDugaar", async (req, res, next) => {
    try {
        console.log('req.params',req.params);
        console.log('req.query',req.query);
        const b = req.params.baiguullagiinId;
        const z = req.params.zakhialgiinDugaar;
        const baiguullaga = await QuickQpayObject.findOne({ baiguullagiinId: b});
        console.log('qpaycallback-baiguullaga ',baiguullaga);
        if(z===baiguullaga.zakhialgiinDugaar)
            req.app.get("socketio").emit("Захиалгын дугаар: " + z +" Гүйлгээ амжилттай хийгдлээ. ", b);
    } catch (err) {
        next(err);
    }
});

router.post("/qpayGargaya", tokenShalgakh, async (req, res, next) => {
    try {
        req.body.tailbar = "testiin guilgee";
        const callback_url = process.env.UNDSEN_IP + process.env.UNDSEN_PORT +'/qpaycallback'+ req.body.baiguullagiinId + "/" + req.body.zakhialgiinDugaar;
        console.log("callback_url", callback_url);
        const  khariu = await qpayGargaya(req.body, callback_url, req.body.tukhainBaaziinKholbolt);
        res.send({khariu});
    } catch (err) {
        next(err);
    }
});

router.post("/qpayKhariltsagchUusgey", tokenShalgakh, async (req, res, next) => {
    try {
        const khariu = await qpayKhariltsagchUusgey(req.body, req.body.tukhainBaaziinKholbolt);
        res.send(khariu);
    } catch (err) {
        next(err);
    }
});

router.post("/qpayKhariltsagchAvay", tokenShalgakh, async (req, res, next) => {
    try {
        const baiguullaga = await QuickQpayObject.findOne({ baiguullagiinId: req.body.baiguullagiinId});
        if(baiguullaga)
            res.send(baiguullaga);
        else
            res.send(undefined);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
