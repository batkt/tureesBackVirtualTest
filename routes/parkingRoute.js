const express = require("express");
const router = express.Router();
const { tokenShalgakh, khuudaslalt, crud, UstsanBarimt } = require("zevbackv2");
const {
    Parking,
    Uilchluulegch,
    ZogsooliinTulbur,
    zogsoolUusgey,
    sdkData,
} = require("parking-v1");
const lodash = require("lodash");

/*crud(router, "parking", Parking, UstsanBarimt, async (req, res, next) => {
    console.log('parking --- ', req.body);
});*/
crud(router, "parking", Parking, UstsanBarimt);
crud(router, "zogsoolUilchluulegch", Uilchluulegch, UstsanBarimt);
/*
crud(router, "zogsoolUilchluulegch", async (req, res, next) => {
    console.log('zogsoolUilchluulegch --- ', req);
});
*/

/*router.post("/khaalganiiErkh", tokenShalgakh, async (req, res, next) => {
    console.log('req.query---req', req.body.query);
    try {
        const body = req.body.query;
        let bulk = [];
        if(body.khaalga?.length > 0){
            for await (const id of body.khaalga) {
                bulk.push({
                        updateOne: {
                            filter: { "khaalga._id": id },
                            update: {
                                "khaalga.ajiltnuud.id": body.ajiltan,
                            },
                        },
                    })
            }
        }
        if (bulk!==[])
            Parking(req.body.tukhainBaaziinKholbolt)
                .bulkWrite(bulk)
                .then((bulkWriteOpResult) => {
                    console.log("BULK update OK", bulkWriteOpResult);
                })
                .catch((err) => {
                    console.log("BULK update error", err);
                });

    } catch (error) {
        next(error);
    }
});*/

router.get("/zogsoolJagsaalt", tokenShalgakh, async (req, res, next) => {
    // console.log('req.query---', req.query);
    try {
        const body = req.query;
        if (!!body?.query) body.query = JSON.parse(body.query);
        if (!!body?.order) body.order = JSON.parse(body.order);
        if (!!body?.khuudasniiDugaar)
            body.khuudasniiDugaar = Number(body.khuudasniiDugaar);
        if (!!body?.khuudasniiKhemjee)
            body.khuudasniiKhemjee = Number(body.khuudasniiKhemjee);
        if (!!body?.search) body.search = String(body.search);

        khuudaslalt(Parking(req.body.tukhainBaaziinKholbolt), body)
            .then((result) => {
                res.send(result);
            })
            .catch((err) => {
                next(err);
            });
    } catch (error) {
        next(error);
    }
});

router.post("/zogsoolUstgay", tokenShalgakh, async (req, res, next) => {
    // console.log('req.query1---', req.query);
    try {
        Parking(req.body.tukhainBaaziinKholbolt)
            .findOne({
                _id: req.body.id,
            })
            .then(async (result) => {
                var barimt = new UstsanBarimt(req.body.tukhainBaaziinKholbolt)();
                barimt.class = "Zogsool";
                barimt.object = result;
                if (req.body.nevtersenAjiltniiToken) {
                    barimt.ajiltniiNer = req.body.nevtersenAjiltniiToken.ner;
                    barimt.ajiltniiId = req.body.nevtersenAjiltniiToken.id;
                }
                barimt.baiguullagiinId = req.body.baiguullagiinId;
                barimt.isNew = true;
                barimt.save();
                Parking(req.body.tukhainBaaziinKholbolt)
                    .deleteOne({
                        _id: req.body.id,
                    })
                    .then((result1) => {
                        res.send("Amjilttai");
                    })
                    .catch((err) => {
                        next(err);
                    });
            })
            .catch((err1) => {
                next(err1);
            });
    } catch (error) {
        next(error);
    }
});

router.post(
    "/zogsoolUilchiluulegchidiinDunAvay",
    tokenShalgakh,
    async (req, res, next) => {
        try {
            const match = {
                baiguullagiinId: req.body.baiguullagiinId,
                createdAt: {
                    $gte: new Date(req.body.ekhlekhOgnoo),
                    $lte: new Date(req.body.duusakhOgnoo),
                },
                "tuukh.zogsooliinId": req.body.zogsooliinId,
                // "tuukh.tuluv": 1,
            };
            if (!!req.body.barilgiinId) match.barilgiinId = req.body.barilgiinId;
            const query = [
                {
                    $match: match,
                },
                {
                    $project: {
                        tuluv: {
                            $first: "$tuukh.tuluv",
                        },
                        niitDun : {
                            $sum: {$ifNull: ["$tuukh.tulukhDun", 0]},
                        },
                    }
                },
                {
                    $group: {
                        _id : "id",
                        dun: {
                            $sum: {
                                $cond: [
                                    {
                                        $eq: ["$tuluv", 1],
                                    },
                                    "$niitDun",
                                    0,
                                ],
                            },
                        },
                        garsanKhaalga: !!req.body.garakhKhaalgaIp ? {
                            $sum: {
                                $cond: [
                                    {
                                        $eq: ["$garsanKhaalga", req.body.garakhKhaalgaIp],
                                    },
                                    "$niitDun",
                                    0,
                                ],
                            },
                        } : {$sum: 0},
                        niitDun : {
                            $sum: {$ifNull: ["$niitDun", 0]}
                        }
                    }
                }
            ];
            const khariu = await Uilchluulegch(req.body.tukhainBaaziinKholbolt).aggregate(query);
            res.send(khariu);
        } catch (err) {
            next(err);
        }
    }
);

router.post("/zogsoolSdkService", tokenShalgakh, async (req, res, next) => {
    console.log("zogsoolSdkService--- ", req?.body);
    try {
        if (req.body.mashiniiDugaar)
            req.body.mashiniiDugaar = req.body.mashiniiDugaar.replace(/\0/g, "");
        const khariu = await sdkData(req);
        res.send(khariu);
    } catch (err) {
        next(err);
    }
});

router
    .route("/zogsooliinTulburTulye")
    .post(tokenShalgakh, async (req, res, next) => {
        try {
            var guilgeeniiTuukh = [];
            var guilgeenuud = req.body.tulbur;
            if (Array.isArray(guilgeenuud)) {
                guilgeenuud.forEach((mur) =>
                    guilgeeniiTuukh.push(
                        new ZogsooliinTulbur(req.body.tukhainBaaziinKholbolt)(mur)
                    )
                );
            }
            var niitDun = lodash.sumBy(guilgeeniiTuukh, function (object) {
                return object.dun;
            });
            var update = {
                tulburTulsunEsekh: true,
                tuluv: 1,
                tulbur: guilgeeniiTuukh,
                dutuuDun: 0,
                ebarimtAvakhDun: 0,
            };
            guilgeeniiTuukh.forEach((mur) => {
                mur.ognoo = new Date();
                if (mur.turul === "khunglukh") {
                    update.khungulsunEsekh = true;
                    update.khungulsunDun = mur.dun;
                    update.niitDun = niitDun - mur.dun;
                } else if (mur.turul !== "khariult") {
                    update.ebarimtAvakhDun = update.ebarimtAvakhDun + mur.dun;
                } else if (mur.turul === "khariult") {
                    update.ebarimtAvakhDun = update.ebarimtAvakhDun - mur.dun;
                }
            });
            await ZogsooliinTulbur(req.body.tukhainBaaziinKholbolt).findByIdAndUpdate(
                req.body.id,
                update
            );
            await ZogsooliinTulbur(req.body.tukhainBaaziinKholbolt).insertMany(
                guilgeeniiTuukh
            );
            res.send("Amjilttai");
        } catch (err) {
            next(err);
        }
    });

module.exports = router;
