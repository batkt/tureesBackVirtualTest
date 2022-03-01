const express = require("express");
const router = express.Router();
const Zardal = require("../models/zardal");
const BankniiGuilgee = require("../models/bankniiGuilgee");
const UstsanBarimt = require("../models/ustsanBarimt");
const { tokenShalgakh, crud } = require("zevback");

crud(router, "zardal", Zardal, UstsanBarimt);

router.post("/zardliinDunAvya", tokenShalgakh, async (req, res, next) => {
    var query = [
        {
            "$match": {
                "baiguullagiinId": req.body.baiguullagiinId,
                "barilgiinId": req.body.barilgiinId,
                "zardliinBulgiinId": {
                    "$in": req.body.idnuud
                },
                "$or": [
                    {
                        "TxDt": {
                            $gte: new Date(req.body.ekhlekhOgnoo),
                            $lte: new Date(req.body.duusakhOgnoo)
                        }
                    },
                    {
                        "tranDate": {
                            $gte: new Date(req.body.ekhlekhOgnoo),
                            $lte: new Date(req.body.duusakhOgnoo)
                        }
                    }
                ]
            }
        },
        {
            "$group": {
                "_id": "aa",
                "niitDun": {
                    $sum: {
                        "$add": [
                            { "$ifNull": ["$Amt", 0] },
                            { "$ifNull": ["$amount", 0] }
                        ]
                    }
                }
            }
        }
    ]
    BankniiGuilgee.aggregate(query).then((result) => {
        res.send(result);
    }).catch((err) => {
        next(err);
    })
});

router.post("/zardalKhuvaarilya", tokenShalgakh, async (req, res, next) => {
    BankniiGuilgee.updateOne({ _id: req.body.guilgeeniiId }, { $set: { zardliinBulgiinId: req.body.zardliinId } }).then((result) => {
        res.send("Amjilttai");
    }).then((err) => {
        next(err);
    })
});

module.exports = router;
