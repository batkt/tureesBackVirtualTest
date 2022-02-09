const asyncHandler = require("express-async-handler");
const Geree = require("../models/geree");

exports.guitsetgeliinTailanAvya = asyncHandler(async (req, res, next) => {
    let query = [
        {
            '$match': {
                'baiguullagiinId': req.body.baiguullagiinId,
                'barilgiinId': req.body.barilgiinId
            }
        }, {
            '$unwind': {
                'path': '$avlaga.guilgeenuud'
            }
        }, {
            '$unwind': {
                'path': '$avlaga.guilgeenuud.ognoo'
            }
        },
        {
            '$match': {
                "avlaga.guilgeenuud.ognoo": {
                    $gte: new Date(req.body.ekhlekhOgnoo),
                    $lte: new Date(req.body.duusakhOgnoo)
                },
                "avlaga.guilgeenuud.turul": {
                    $nin: ["baritsaa"]
                }
            }
        }, {
            '$group': {
                '_id': {
                    'year': {
                        $year: { date: "$avlaga.guilgeenuud.ognoo", timezone: "Asia/Ulaanbaatar" }
                    },
                    'month': {
                        $month: { date: "$avlaga.guilgeenuud.ognoo", timezone: "Asia/Ulaanbaatar" }
                    }
                }, 'tulukh': {
                    '$sum': '$avlaga.guilgeenuud.tulukhDun'
                },
                'tulsun': {
                    '$sum': '$avlaga.guilgeenuud.tulsunDun'
                }
            }
        }, {
            '$sort': {
                '_id.year': 1,
                '_id.month': 1
            }
        }
    ]
    Geree.aggregate(query).then((result) => {
        if (result && result.length > 0) {
            var labels = []
            var tuluvluguunuud = []
            var guitsetgeluud = []
            console.log("result", result);
            result.forEach((a) => {
                labels.push(a["_id"].year + "-" + a["_id"].month);
                tuluvluguunuud.push(a.tulukh.toFixed(2));
                guitsetgeluud.push(a.tulsun.toFixed(2));
            });
            var data = {
                labels,
                datasets: [
                    {
                        label: "Төлөвлөгөө",
                        data: tuluvluguunuud,
                        backgroundColor: "rgba(255, 99, 132, 0.5)",
                        borderColor: "rgba(255, 99, 132, 0.5)",
                        fill: false,
                        lineWidth: 10,
                    },
                    {
                        label: "Гүйцэтгэл",
                        data: guitsetgeluud,
                        fill: false,
                        borderColor: "rgba(53, 162, 235, 0.5)",
                        backgroundColor: "rgba(53, 162, 235, 0.5)",
                        borderDash: [10, 10]
                    },
                ],
            }
            res.send(data);
        }
        res.send(result);
    }).catch((err) => {
        next(err);
    });;
});
