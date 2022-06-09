const express = require("express");
const router = express.Router();
const BankniiGuilgee = require("../models/bankniiGuilgee");
const { tdbcer } = require("../kholbolt/tdbcer");
const { bankniiGuilgeeToololtAvya } = require("../controller/toololt");
//const UstsanBarimt = require("../models/ustsanBarimt");
const { tokenShalgakh, crud, UstsanBarimt } = require("zevback");
//const { crud } = require('../components/crud');
//const { tokenShalgakh } = require("../middlewares/tokenShalgakh");

crud(router, 'bankniiGuilgee', BankniiGuilgee, UstsanBarimt)
router.post("/bankniiGuilgeeToololtAvya", tokenShalgakh, bankniiGuilgeeToololtAvya);
router.post("/tdbcer", tdbcer);

router.route("/dansniiKhuulgaDunAvya").post(tokenShalgakh, async (req, res, next) => {
    var turul = req.body.turul;
    let query = [
        {
            '$match': {
                'baiguullagiinId': req.body.baiguullagiinId,
                'barilgiinId': req.body.barilgiinId,
                "dansniiDugaar": req.body.dansniiDugaar,
                "$or": [
                    {
                        "$and": [
                            {
                                "TxDt": {
                                    $gte: new Date(req.body.ekhlekhOgnoo),
                                    $lte: new Date(req.body.duusakhOgnoo)
                                }
                            },
                            {
                                "Amt": (turul == "orlogo") ? {
                                    $gt: 0
                                } : {
                                    $lt: 0
                                }
                            }
                        ]
                    },
                    {
                        "$and": [
                            {
                                "tranDate": {
                                    $gte: new Date(req.body.ekhlekhOgnoo),
                                    $lte: new Date(req.body.duusakhOgnoo)
                                }
                            },
                            {
                                "amount": (turul == "orlogo") ? {
                                    $gt: 0
                                } : {
                                    $lt: 0
                                }
                            }
                        ]
                    }
                ]
            }
        },
        {
            '$project': {
                "dun": { "$ifNull": ["$Amt", "$amount"] }
            }
        },
        {
            '$group': {
                '_id': "dun",
                'dun': {
                    $sum: "$dun"
                }
            }
        }
    ]
    console.log("turluur", JSON.stringify(query, null, 4));
    BankniiGuilgee.aggregate(query).then((result) => {
        res.send(result);
    })
        .catch((err) => {
            next(err);
        });;
});


module.exports = router;