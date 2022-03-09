const asyncHandler = require("express-async-handler");
const Geree = require("../models/geree");
const BankniiGuilgee = require("../models/bankniiGuilgee");

exports.zardaliinTailanAvya = asyncHandler(async (req, res, next) => {
    var group = {
        '_id': {
        }, 'dun': {
            $sum: "$dun"
        }
    }
    var sort = {}
    if (req.body.nariivchlal == "year") {
        group['_id']['year'] = {
            $year: { date: "$ognoo", timezone: "Asia/Ulaanbaatar" }
        }
        sort['_id.year'] = 1
    }
    else if (req.body.nariivchlal == "month") {
        group['_id']['year'] = {
            $year: { date: "$ognoo", timezone: "Asia/Ulaanbaatar" }
        }
        group['_id']['month'] = {
            $month: { date: "$ognoo", timezone: "Asia/Ulaanbaatar" }
        }
        sort['_id.year'] = 1
        sort['_id.month'] = 1
    }
    else if (req.body.nariivchlal == "day") {
        group['_id']['year'] = {
            $year: { date: "$ognoo", timezone: "Asia/Ulaanbaatar" }
        }
        group['_id']['month'] = {
            $month: { date: "$ognoo", timezone: "Asia/Ulaanbaatar" }
        }
        group['_id']['day'] = {
            $dayOfMonth: { date: "$ognoo", timezone: "Asia/Ulaanbaatar" }
        }
        sort['_id.year'] = 1
        sort['_id.month'] = 1
        sort['_id.day'] = 1
    }
    let query = [
        {
            '$match': {
                'baiguullagiinId': req.body.baiguullagiinId,
                'barilgiinId': req.body.barilgiinId,
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
                                "Amt": {
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
                                "amount": {
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
                "dun": { "$ifNull": ["$Amt", "$amount"] },
                "ognoo": { "$ifNull": ["$TxDt", "$tranDate"] }
            }
        },
        {
            '$group': group
        }, {
            '$sort': sort
        }
    ]
    BankniiGuilgee.aggregate(query).then((result) => {
        if (result && result.length > 0) {
            var labels = []
            var zardluud = []
            result.forEach((a) => {
                if (req.body.nariivchlal == "year")
                    labels.push(a["_id"].year);
                else if (req.body.nariivchlal == "month")
                    labels.push(a["_id"].year + "/" + a["_id"].month);
                else if (req.body.nariivchlal == "day")
                    labels.push(a["_id"].year + "/" + a["_id"].month + "/" + a["_id"].day);
                zardluud.push((a.dun * -1).toFixed(2));
            });
            var data = {
                labels,
                datasets: [
                    {
                        label: "Зардал",
                        data: zardluud,
                        backgroundColor: "rgba(255, 99, 132, 0.5)",
                        borderColor: "rgba(255, 99, 132, 0.5)",
                        fill: false,
                        lineWidth: 10
                    }
                ],
            }
            res.send(data);
        }
        res.send(result);
    }).catch((err) => {
        next(err);
    });;
});

exports.borluulaltiinTailanAvya = asyncHandler(async (req, res, next) => {
    var group = {
        '_id': {
        }, 'tulukh': {
            '$sum': '$avlaga.guilgeenuud.tulukhDun'
        },
        'tulsun': {
            '$sum': '$avlaga.guilgeenuud.tulsunDun'
        },
        'khyamdral': {
            '$sum': '$avlaga.guilgeenuud.khyamdral'
        }
    }
    var sort = {}
    if (req.body.nariivchlal == "year") {
        group['_id']['year'] = {
            $year: { date: "$avlaga.guilgeenuud.ognoo", timezone: "Asia/Ulaanbaatar" }
        }
        sort['_id.year'] = 1
    }
    else if (req.body.nariivchlal == "month") {
        group['_id']['year'] = {
            $year: { date: "$avlaga.guilgeenuud.ognoo", timezone: "Asia/Ulaanbaatar" }
        }
        group['_id']['month'] = {
            $month: { date: "$avlaga.guilgeenuud.ognoo", timezone: "Asia/Ulaanbaatar" }
        }
        sort['_id.year'] = 1
        sort['_id.month'] = 1
    }
    else if (req.body.nariivchlal == "day") {
        group['_id']['year'] = {
            $year: { date: "$avlaga.guilgeenuud.ognoo", timezone: "Asia/Ulaanbaatar" }
        }
        group['_id']['month'] = {
            $month: { date: "$avlaga.guilgeenuud.ognoo", timezone: "Asia/Ulaanbaatar" }
        }
        group['_id']['day'] = {
            $dayOfMonth: { date: "$avlaga.guilgeenuud.ognoo", timezone: "Asia/Ulaanbaatar" }
        }
        sort['_id.year'] = 1
        sort['_id.month'] = 1
        sort['_id.day'] = 1
    }
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
        },
        {
            '$match': {
                "geree.tuluv": {
                    $ne: -1
                },
                "avlaga.guilgeenuud.ognoo": {
                    $gte: new Date(req.body.ekhlekhOgnoo),
                    $lte: new Date(req.body.duusakhOgnoo)
                },
                "avlaga.guilgeenuud.turul": {
                    $nin: ["baritsaa"]
                }
            }
        }, {
            '$group': group
        }, {
            '$sort': sort
        }
    ]
    var turluur = await Geree.aggregate([
        {
            '$match': {
                'baiguullagiinId': req.body.baiguullagiinId,
                'barilgiinId': req.body.barilgiinId
            }
        }, {
            '$unwind': {
                'path': '$avlaga.guilgeenuud'
            }
        },
        {
            '$match': {
                "geree.tuluv": {
                    $ne: -1
                },
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
                _id: "$avlaga.guilgeenuud.turul",
                "tulsun": {
                    $sum: {
                        $ifNull: ["$avlaga.guilgeenuud.tulsunDun", 0]
                    }
                }
            }
        }, {
            '$sort':
            {
                "tulsun": -1

            }
        }
    ]);
    Geree.aggregate(query).then((result) => {
        if (result && result.length > 0) {
            var labels = []
            var tuluvluguunuud = []
            var tuluvluguu = 0;
            var guitsetgeluud = []
            console.log("result", result);
            result.forEach((a) => {
                if (req.body.nariivchlal == "year")
                    labels.push(a["_id"].year);
                else if (req.body.nariivchlal == "month")
                    labels.push(a["_id"].year + "/" + a["_id"].month);
                else if (req.body.nariivchlal == "day")
                    labels.push(a["_id"].year + "/" + a["_id"].month + "/" + a["_id"].day);
                tuluvluguu = tuluvluguu + a.tulukh - a.tulsun - a.khyamdral;
                tuluvluguunuud.push(tuluvluguu.toFixed(2));
                guitsetgeluud.push(a.tulsun.toFixed(2));
            });
            var jagsaalt = [];
            if (turluur && turluur.length > 0) {
                turluur.forEach(x => {
                    if (x._id == "bank") {
                        jagsaalt.push({
                            ner: "Харилцах",
                            dun: x.tulsun,
                            ungu: "rgba(255, 99, 132, 0.5)"
                        });
                    }
                    else if (x._id == "barter") {
                        jagsaalt.push({
                            ner: "Бартер",
                            dun: x.tulsun,
                            ungu: "rgba(53, 162, 235, 0.5)"
                        });
                    }
                    else if (x._id == "qpay") {
                        jagsaalt.push({
                            ner: "Qpay",
                            dun: x.tulsun,
                            ungu: "rgba(0, 255, 0, 0.5)"
                        });
                    }
                    else if (x._id == "voucher") {
                        jagsaalt.push({
                            ner: "Ваучер",
                            dun: x.tulsun,
                            ungu: "rgba(255, 0, 255, 0.5)"
                        });
                    }
                });
            }
            var data = {
                labels,
                jagsaalt,
                datasets: [
                    {
                        label: "Төлөвлөгөө",
                        data: tuluvluguunuud,
                        backgroundColor: "rgba(255, 99, 132, 0.5)",
                        borderColor: "rgba(255, 99, 132, 0.5)",
                        fill: false,
                        lineWidth: 10
                    },
                    {
                        label: "Гүйцэтгэл",
                        data: guitsetgeluud,
                        fill: false,
                        borderColor: "rgba(53, 162, 235, 0.5)",
                        backgroundColor: "rgba(53, 162, 235, 0.5)",
                        lineWidth: 10
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

exports.avlagiinTailanAvya = asyncHandler(async (req, res, next) => {
    var group = {
        '_id': {
        }, 'tulukh': {
            '$sum': '$avlaga.guilgeenuud.tulukhDun'
        },
        'tulsun': {
            '$sum': '$avlaga.guilgeenuud.tulsunDun'
        },
        'khyamdral': {
            '$sum': '$avlaga.guilgeenuud.khyamdral'
        }
    }
    var sort = {}
    if (req.body.nariivchlal == "year") {
        group['_id']['year'] = {
            $year: { date: "$avlaga.guilgeenuud.ognoo", timezone: "Asia/Ulaanbaatar" }
        }
        sort['_id.year'] = 1
    }
    else if (req.body.nariivchlal == "month") {
        group['_id']['year'] = {
            $year: { date: "$avlaga.guilgeenuud.ognoo", timezone: "Asia/Ulaanbaatar" }
        }
        group['_id']['month'] = {
            $month: { date: "$avlaga.guilgeenuud.ognoo", timezone: "Asia/Ulaanbaatar" }
        }
        sort['_id.year'] = 1
        sort['_id.month'] = 1
    }
    else if (req.body.nariivchlal == "day") {
        group['_id']['year'] = {
            $year: { date: "$avlaga.guilgeenuud.ognoo", timezone: "Asia/Ulaanbaatar" }
        }
        group['_id']['month'] = {
            $month: { date: "$avlaga.guilgeenuud.ognoo", timezone: "Asia/Ulaanbaatar" }
        }
        group['_id']['day'] = {
            $dayOfMonth: { date: "$avlaga.guilgeenuud.ognoo", timezone: "Asia/Ulaanbaatar" }
        }
        sort['_id.year'] = 1
        sort['_id.month'] = 1
        sort['_id.day'] = 1
    }
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
                "geree.tuluv": {
                    $ne: -1
                },
                "avlaga.guilgeenuud.ognoo": {
                    $lte: new Date(req.body.duusakhOgnoo)
                },
                "avlaga.guilgeenuud.turul": {
                    $nin: ["baritsaa"]
                }
            }
        }, {
            '$group': group
        }, {
            '$sort': sort
        }
    ]
    Geree.aggregate(query).then((result) => {
        if (result && result.length > 0) {
            var labels = []
            var tuluvluguunuud = []
            var guitsetgeluud = []
            console.log("result", result);
            var ekhlekhSar = new Date(req.body.ekhlekhOgnoo).getMonth() + 1; // returns 0 - 11
            var ekhlekhOn = new Date(req.body.ekhlekhOgnoo).getFullYear();
            var ekhlekhUdur = new Date(req.body.ekhlekhOgnoo).getDate();
            var niitAvlaga = 0;
            result.forEach((a) => {
                niitAvlaga = niitAvlaga + a.tulukh;
                niitAvlaga = niitAvlaga - a.tulsun;
                niitAvlaga = niitAvlaga - a.khyamdral;
                if (a["_id"].year > ekhlekhOn || (a["_id"].year == ekhlekhOn && a["_id"].month >= ekhlekhSar)
                    || (a["_id"].year == ekhlekhOn && a["_id"].month == ekhlekhSar && a["_id"].day >= ekhlekhUdur)) {
                    if (req.body.nariivchlal == "year")
                        labels.push(a["_id"].year);
                    else if (req.body.nariivchlal == "month")
                        labels.push(a["_id"].year + "/" + a["_id"].month);
                    else if (req.body.nariivchlal == "day")
                        labels.push(a["_id"].year + "/" + a["_id"].month + "/" + a["_id"].day);
                    tuluvluguunuud.push(niitAvlaga.toFixed(2));
                    guitsetgeluud.push(a.tulsun.toFixed(2));
                }
            });
            var data = {
                labels,
                datasets: [
                    {
                        label: "Нийт авлага",
                        data: tuluvluguunuud,
                        backgroundColor: "rgba(255, 99, 132, 0.5)",
                        borderColor: "rgba(255, 99, 132, 0.5)",
                        fill: false,
                        lineWidth: 10,
                    },
                    {
                        label: "Нийт төлсөн",
                        data: guitsetgeluud,
                        fill: false,
                        borderColor: "rgba(53, 162, 235, 0.5)",
                        backgroundColor: "rgba(53, 162, 235, 0.5)",
                        lineWidth: 10,
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
