const express = require("express");
const router = express.Router();
const Talbai = require("../models/talbai");
const Geree = require("../models/geree");
const multer = require("multer");
const storage = multer.memoryStorage();
//const { tokenShalgakh } = require("../middlewares/tokenShalgakh");
//const { crud } = require("../components/crud");
const UstsanBarimt = require("../models/ustsanBarimt");
const { tokenShalgakh, crud } = require("zevback");
const uploadFile = multer({ storage: storage });

crud(router, "talbai", Talbai, UstsanBarimt);

const { talbaiTatya, talbainZagvarAvya } = require("../controller/excel");

router.route("/talbaiTatya").post(uploadFile.single("file"), tokenShalgakh, talbaiTatya);
router.route("/talbainZagvarAvya").get(talbainZagvarAvya);
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
module.exports = router;
