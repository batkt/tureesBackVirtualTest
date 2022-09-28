const express = require("express");
const router = express.Router();
const Talbai = require("../models/talbai");
const Geree = require("../models/geree");
const multer = require("multer");
const storage = multer.memoryStorage();
//const { tokenShalgakh } = require("../middlewares/tokenShalgakh");
//const { crud } = require("../components/crud");
//const UstsanBarimt = require("../models/ustsanBarimt");
const { tokenShalgakh, crud, UstsanBarimt, Segment } = require("zevback");
const moment = require("moment");
const uploadFile = multer({ storage: storage });

crud(router, "talbai", Talbai, UstsanBarimt);
crud(router, "segment", Segment, UstsanBarimt);

const { talbaiTatya, talbainZagvarAvya } = require("../controller/excel");

router.route("/talbaiTatya").post(uploadFile.single("file"), tokenShalgakh, talbaiTatya);
router.route("/talbainZagvarAvya").get(tokenShalgakh, talbainZagvarAvya);
router.route("/talbainSulEskhiigShalgay").get(tokenShalgakh, async (req, res, next) => {
    var geree = await Geree.findOne({ talbainDugaar: req.query.talbainDugaar, barilgiinId: req.query.barilgiinId, tuluv: 1, duusakhOgnoo: { $gte: new Date() } });
    if (geree)
        res.send(geree.gereeniiDugaar);
    else
        res.sendStatus(200)
});

router.route("/talbainTooAvya").get(tokenShalgakh, async (req, res, next) => {
    let query = [
        {
            '$match': {
                'baiguullagiinId': req.body.baiguullagiinId,
                'barilgiinId': req.query.barilgiinId
            }
        }, {
            '$group': {
                '_id': '$idevkhiteiEsekh',
                'too': {
                    '$sum': 1
                }
            }
        }
    ]
    Talbai.aggregate(query).then((result) => {
        res.send(result);
    })
        .catch((err) => {
            next(err);
        });;
});

router.route("/davkharaarToololtAvya").post(tokenShalgakh, async (req, res, next) => {
    try {
        var match = {
            'barilgiinId': req.body.barilgiinId,
        }
        if (req.body.davkhar)
            match['davkhar'] = req.body.davkhar
        let query = [
            {
                '$match': match
            }, {
                '$group': {
                    '_id': '$idevkhiteiEsekh',
                    "khemjee": {
                        $sum: "$talbainKhemjee"
                    },
                    "too": {
                        $sum: 1
                    }
                }
            }
        ]
        var khariu = await Talbai.aggregate(query);
        res.send(khariu);
    }
    catch (err) {
        next(err);
    }
});

router.route("/talbaiUstgaya").post(tokenShalgakh, async (req, res, next) => {
    try {
        Talbai.findOne({
            _id: req.body.id,
        }).then(async (result) => {
            var geree = await Geree.findOne({ tuluv: 1, talbainDugaar: result.kod, barilgiinId: result.barilgiinId, baiguullagiinId: result.baiguullagiinId });
            if (geree)
                throw new Error("Тухайн талбай дээр идэвхитэй гэрээ байгаа тул устгах боломжгүй!");
            var barimt = new UstsanBarimt();
            barimt.class = "Talbai";
            barimt.object = result;
            if (req.body.nevtersenAjiltniiToken) {
                barimt.ajiltniiNer = req.body.nevtersenAjiltniiToken.ner;
                barimt.ajiltniiId = req.body.nevtersenAjiltniiToken.id;
            }
            barimt.baiguullagiinId = req.body.baiguullagiinId;
            barimt.isNew = true;
            barimt.save();
            Talbai.deleteOne({
                _id: req.body.id,
            })
                .then((result1) => {
                    res.send("Amjilttai");
                })
                .catch((err) => {
                    next(err);
                });
        }).catch((err1) => {
            next(err1);
        });
    }
    catch (err2) {
        next(err2);
    }
});

router.route("/talbaiZasya").post(tokenShalgakh, async (req, res, next) => {
    var talbai = new Talbai(req.body);
    var khuuchinTalbai = await Talbai.findById(req.body._id);
    if (talbai.talbainNiitUne != khuuchinTalbai.talbainNiitUne || talbai.kod != khuuchinTalbai.kod) {
        var gereenuud = await Geree.find({ talbainDugaar: khuuchinTalbai.kod, barilgiinId: khuuchinTalbai.barilgiinId, baiguullagiinId: khuuchinTalbai.baiguullagiinId }).select("+avlaga +gereeniiTuukhuud");
        if (gereenuud)
            for (const geree of gereenuud) {
                talbai.idevkhiteiEsekh = true;
                var tuukh = {
                    talbainDugaar: khuuchinTalbai.kod,
                    talbainNegjUne: khuuchinTalbai.talbainNegjUne,
                    talbainNiitUne: khuuchinTalbai.talbainNiitUne,
                    talbainKhemjee: khuuchinTalbai.talbainKhemjee,
                    davkhar: khuuchinTalbai.davkhar,
                    khiisenOgnoo: new Date(),
                    turul: "TalbaiUurchlukh",
                    ajiltniiNer: req.body.nevtersenAjiltniiToken?.ner,
                    ajiltniiId: req.body.nevtersenAjiltniiToken?.id
                }
                if (geree.gereeniiTuukhuud && geree.gereeniiTuukhuud.length > 0)
                    geree.gereeniiTuukhuud.push(tuukh);
                else
                    geree.gereeniiTuukhuud = [tuukh];
                var khuvaariud = geree.avlaga.guilgeenuud;
                khuvaariud = khuvaariud.filter((x) => x.ognoo <= new Date());
                var today = new Date();
                var unuudur = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
                new Array(geree.khugatsaa || 0).fill('').map((mur, index) => {
                    geree.tulukhUdur.forEach((udur) => {
                        if (moment(unuudur).add(index, 'month').set('date', udur) <= moment(geree.duusakhOgnoo)
                            && moment(unuudur).add(index, 'month').set('date', udur) > moment(new Date()))
                            khuvaariud.push({
                                ognoo: moment(unuudur).add(index, 'month').set('date', udur),
                                khyamdral: 0,
                                undsenDun: talbai.talbainNiitUne,
                                tulukhDun: talbai.talbainNiitUne
                            })
                    })
                })
                await Geree.findOneAndUpdate({ "_id": geree._id },
                    {
                        "$set": {
                            "avlaga.guilgeenuud": khuvaariud,
                            "talbainDugaar": talbai.kod,
                            "talbainNegjUne": talbai.talbainNegjUne,
                            "talbainNiitUne": talbai.talbainNiitUne,
                            "sariinTurees": talbai.talbainNiitUne,
                            "talbainKhemjee": talbai.talbainKhemjee,
                            "davkhar": talbai.davkhar
                        }
                    }
                );
            }
        else {
            talbai.idevkhiteiEsekh = false;
        }
    }
    talbai.isNew = false;
    talbai.save();
    res.send("Amjilttai");
});

router.route("/tulultiinOgnooOlnoorUurchluy").post(tokenShalgakh, async (req, res, next) => {
    try {
        if (!req.body.barilgiinId)
            throw new aldaa("barilgiinId buglugduugui baina!");
        var gereenuud = await Geree.find({ barilgiinId: req.body.barilgiinId }).select("+avlaga");
        if (gereenuud)
            for (const geree of gereenuud) {
                var khuvaariud = geree.avlaga.guilgeenuud;
                khuvaariud = khuvaariud.filter((x) => x.ognoo <= new Date());
                var today = new Date();
                var unuudur = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
                new Array(geree.khugatsaa || 0).fill('').map((mur, index) => {
                    geree.tulukhUdur.forEach((udur) => {
                        if (moment(unuudur).add(index, 'month').set('date', udur) <= moment(geree.duusakhOgnoo)
                            && moment(unuudur).add(index, 'month').set('date', udur) > moment(new Date()))
                            khuvaariud.push({
                                ognoo: moment(unuudur).add(index, 'month').set('date', udur),
                                khyamdral: 0,
                                undsenDun: geree.talbainNiitUne,
                                tulukhDun: geree.talbainNiitUne
                            })
                    })
                })
                await Geree.findOneAndUpdate({ "_id": geree._id },
                    {
                        "$set": {
                            "avlaga.guilgeenuud": khuvaariud
                        }
                    }
                );
            }
        if (gereenuud && gereenuud.length > 0)
            res.send("Amjilttai" + gereenuud.length);
        else
            res.send("Amjilttai");
    }
    catch (err) {
        next(err);
    }
});

module.exports = router;
