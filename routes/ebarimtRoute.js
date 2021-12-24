const express = require("express");
const http = require("http");
const Ebarimt = require("../models/ebarimt");
const BankniiGuilgee = require("../models/bankniiGuilgee");
const Geree = require("../models/geree");
const router = express.Router();
const aldaa = require("../components/aldaa");
const khuudaslalt = require("../components/khuudaslalt");
const { tokenShalgakh } = require("../middlewares/tokenShalgakh");
const request = require("request");

function nuatBodyo(bodokhDun) {
    var nuatguiDun = bodokhDun / 1.1;
    return (bodokhDun - nuatguiDun).toFixed(2).toString();
}

async function guilgeeneesEbarimtUusgye(guilgee, geree, register, turul) {
    var ebarimt = new Ebarimt();
    if (register) {
        if (turul) ebarimt.billType = turul;
        ebarimt.customerNo = register;
    }
    ebarimt.guilgeeniiId = guilgee._id;
    ebarimt.baiguullagiinId = guilgee.baiguullagiinId;
    ebarimt.barilgiinId = guilgee.barilgiinId;
    ebarimt.gereeniiDugaar = geree.gereeniiDugaar;
    ebarimt.talbainDugaar = geree.talbainDugaar;
    ebarimt.utas = geree.utas;
    ebarimt.amount = guilgee.amount.toFixed(2).toString();
    ebarimt.vat = nuatBodyo(guilgee.amount);
    ebarimt.cashAmount = guilgee.amount.toFixed(2).toString();
    ebarimt.nonCashAmount = "0.00";
    ebarimt.cityTax = "0.00";
    ebarimt.districtCode = "12";
    ebarimt.posNo = "0001";
    var stocks = [];
    var stock = {
        code: "721",
        name: "Үл хөдлөх хөрөнгийг түрээслэх, худалдаалах үйлчилгээ",
        measureUnit: "шир",
        qty: "1.00",
        unitPrice: guilgee.amount.toFixed(2).toString(),
        totalAmount: guilgee.amount.toFixed(2).toString(),
        cityTax: "0.00",
        vat: nuatBodyo(guilgee.amount),
        barCode: "721",
    };
    stocks.push(stock);
    ebarimt.stocks = stocks;
    return ebarimt;
}

async function ebarimtDuudya(ugugdul, onFinish, next) {
    const data = new TextEncoder().encode(JSON.stringify(ugugdul));
    var url = process.env.EBARIMT_IP + "/put";
    if (ugugdul.barilgiinId) url = url + "?lib=" + ugugdul.barilgiinId.toString();
    request.post(url,
        { json: true, body: { data: ugugdul } },
        (err, res1, body) => {
            if (err) next(err);
            else {
                onFinish(body);
            }
        }
    );
}

async function ebarimtMedeelelAvya(ugugdul, onFinish, next) {
    var url = process.env.EBARIMT_IP + "/getInformation";
    if (ugugdul) url = url + "?lib=" + ugugdul.toString();
    console.log("url", url);
    request(url,
        { json: true },
        (err, res1, body) => {
            if (err) next(err);
            else {
                onFinish(body);
            }
        }
    );
}
router.post("/ebarimtMedeelelAvya", tokenShalgakh, async (req, res, next) => {
    try {
        ebarimtMedeelelAvya(
            req.body.barilgiinId,
            (d) => {
                console.log("duuslaa", d);
                res.send(d);
            },
            next
        );
    } catch (error) {
        next(error);
    }
});

async function ebarimtButsaaya(ugugdul, onFinish, next) {
    const data = new TextEncoder().encode(JSON.stringify(ugugdul));
    var url = process.env.EBARIMT_IP + "/returnBill";
    if (ugugdul.barilgiinId) url = url + "?lib=" + ugugdul.barilgiinId.toString();
    request.post(url,
        { json: true, body: { data: ugugdul } },
        (err, res1, body) => {
            if (err) next(err);
            else {
                onFinish(body);
            }
        }
    );
}

router.post("/ebarimtShivye", tokenShalgakh, async (req, res, next) => {
    try {
        var guilgee = await BankniiGuilgee.findById(req.body.id);
        console.log("guilgee", guilgee);
        if (guilgee.ebarimtAvsanEsekh)
            throw new aldaa("Ибаримт хэвлэж авсан байна!");
        var geree = await Geree.findById(guilgee.kholbosonGereeniiId[0]);
        if (!geree)
            throw new aldaa("Холбогдсон гэрээ байхгүй тул ибаримт хэвлэх боломжгүй");
        var ebarimt = await guilgeeneesEbarimtUusgye(
            guilgee,
            geree,
            req.body.register,
            req.body.turul
        );
        console.log("ebarimt", ebarimt);
        ebarimtDuudya(
            ebarimt,
            (d) => {
                var ebarimt = new Ebarimt(d)
                ebarimt.save().catch((err) => {
                    next(err);
                });
                BankniiGuilgee.findByIdAndUpdate({ "_id": req.body.id }, { ebarimtAvsanEsekh: true }).then((xariu) => { console.log(xariu) }).catch((err) => { console.log(err) });
                console.log("duuslaa", d);
                res.send(d);
            },
            next
        );
    } catch (error) {
        next(error);
    }
});

router.post("/ebarimtZasya", tokenShalgakh, async (req, res, next) => {
    try {
        var umnukhBarimt = new Ebarimt(req.body);
        var shineBarimt = new Ebarimt(req.body);
        shineBarimt._id = null;
        shineBarimt.returnBillId = shineBarimt.billId.toString();
        shineBarimt.vat = nuatBodyo(shineBarimt.amount);
        shineBarimt.stocks.forEach((mur) => {
            mur.vat = nuatBodyo(mur.totalAmount);
        });
        console.log("ebarimt", shineBarimt);
        ebarimtDuudya(shineBarimt, (d) => {
            umnukhBarimt.ustgasanOgnoo = new Date();
            umnukhBarimt.isNew = false;
            d = new Ebarimt(d);
            d.isNew = true;
            umnukhBarimt.save().catch((err) => { next(err) });
            d.save().catch((err) => { next(err) });
            console.log("duuslaa", d);
            res.send(d);
        }, next);
    } catch (error) {
        next(error);
    }
});

router.post("/ebarimtButsaaya", tokenShalgakh, async (req, res, next) => {
    try {
        var butsaakhBarimt = new Ebarimt(req.body);
        butsaakhBarimt.returnBillId = butsaakhBarimt.billId;
        ebarimtButsaaya(butsaakhBarimt, async (d) => {
            butsaakhBarimt.ustgasanOgnoo = new Date();
            butsaakhBarimt.isNew = false;
            await butsaakhBarimt.save().catch((err) => { next(err); console.log("aldaa", err) });
            if (butsaakhBarimt.guilgeeniiId)
                await BankniiGuilgee.findByIdAndUpdate({ _id: butsaakhBarimt.guilgeeniiId }, { ebarimtAvsanEsekh: false }).catch((err) => { next(err); console.log("aldaa", err) });
            console.log("duuslaa", d);
            res.json(d);
        }, next);
    } catch (error) {
        next(error);
    }
});

router.post("/ebarimtIlgeeye", tokenShalgakh, async (req, res, next) => {
    try {
        var url = process.env.EBARIMT_IP + "/sendData";
        if (req.body.barilgiinId) url = url + "?lib=" + req.body.barilgiinId.toString();
        console.log('url', url);
        request.get(url,
            { json: true },
            (err, res1, body) => {
                if (err) {
                    console.log(err);
                    next(err);
                }
                else {
                    res.send(body);
                }
            }
        );
    } catch (error) {
        next(error);
    }
});

router.get("/ebarimtJagsaaltAvya", tokenShalgakh, async (req, res, next) => {
    try {
        const body = req.query;
        if (!!body?.query) body.query = JSON.parse(body.query);
        if (!!body?.order) body.order = JSON.parse(body.order);
        if (!!body?.khuudasniiDugaar) body.khuudasniiDugaar = Number(body.khuudasniiDugaar);
        if (!!body?.khuudasniiKhemjee) body.khuudasniiKhemjee = Number(body.khuudasniiKhemjee);
        if (!!body?.search) body.search = String(body.search);
        body.query && (body.query["baiguullagiinId"] = req.body.baiguullagiinId)

        khuudaslalt(Ebarimt, body)
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
router.post("/ebarimtToololtAvya", tokenShalgakh, async (req, res, next) => {
    try {
        var query = [{
            $match: {
                baiguullagiinId: req.body.baiguullagiinId,
                barilgiinId: req.body.barilgiinId,
                dateOgnoo: {
                    $gte: new Date(req.body.ekhlekhOgnoo),
                    $lte: new Date(req.body.duusakhOgnoo)
                }
            }
        }, {
            $facet: {
                butsaasan: [{
                    $match: {
                        ustgasanOgnoo: {
                            $exists: true
                        }
                    }
                },
                {
                    $group: {
                        _id: 'butsaasan',
                        too: {
                            $sum: 1
                        },
                        dun: {
                            $sum: {
                                "$toDecimal": '$amount'
                            }
                        }
                    }
                }
                ],
                ilgeesen: [{
                    $match: {
                        ustgasanOgnoo: {
                            $exists: false
                        }
                    }
                },
                {
                    $group: {
                        _id: 'ilgeesen',
                        too: {
                            $sum: 1
                        },
                        dun: {
                            $sum: {
                                $toDecimal: '$amount'
                            }
                        }
                    }
                }
                ]
            }
        }];
        var result = await Ebarimt.aggregate(query).catch(err => { next(err); })

        query = [{
            $match: {
                baiguullagiinId: req.body.baiguullagiinId,
                barilgiinId: req.body.barilgiinId,
                amount: {
                    $gt: 0
                },
                tranDate: {
                    $gte: new Date(req.body.ekhlekhOgnoo),
                    $lte: new Date(req.body.duusakhOgnoo)
                },
                ebarimtAvsanEsekh: {
                    $ne: true
                },
                kholbosonGereeniiId: {
                    $exists: true
                }
            }
        }, {
            $group: {
                _id: 'ebarimt',
                dun: {
                    $sum: '$amount'
                },
                too: {
                    $sum: 1
                }
            }
        }]
        var result1 = await BankniiGuilgee.aggregate(query).catch(err => { next(err); })

        khariu = {
            ilgeesenDun: 0,
            ilgeesenToo: 0,
            butsaasanDun: 0,
            butsaasanToo: 0,
            avakhDun: 0,
            avakhToo: 0
        }
        if (result[0]) {
            if (result[0].butsaasan[0]) {
                khariu.butsaasanDun = parseFloat(result[0].butsaasan[0].dun);
                khariu.butsaasanToo = result[0].butsaasan[0].too;
            }
            if (result[0].ilgeesen[0]) {
                khariu.ilgeesenDun = parseFloat(result[0].ilgeesen[0].dun);
                khariu.ilgeesenToo = result[0].ilgeesen[0].too;
            }
        }

        if (result1[0]) {
            khariu.avakhDun = result1[0].dun;
            khariu.avakhToo = result1[0].too;
        }
        res.send(khariu);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
