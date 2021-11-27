const express = require("express");
const http = require("http");
const Ebarimt = require("../models/ebarimt");
const BankniiGuilgee = require("../models/bankniiGuilgee");
const router = express.Router();
const aldaa = require("../components/aldaa");
const Geree = require("../models/geree");
const khuudaslalt = require("../components/khuudaslalt");
const { tokenShalgakh } = require("../middlewares/tokenShalgakh");
const request = require("request");

function nuatBodyo(bodokhDun) {
    var nuatguiDun = bodokhDun / 1.1;
    return (bodokhDun - nuatguiDun).toFixed(2).toString();
}

async function guilgeeneesEbarimtUusgye(guilgee, register, turul) {
    var ebarimt = new Ebarimt();
    if (register) {
        if (turul) ebarimt.billType = turul;
        ebarimt.customerNo = register;
    }
    ebarimt.baiguullagiinId = guilgee.baiguullagiinId;
    ebarimt.gereeniiDugaar = guilgee.kholbosonGereeniiId;
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
    if (ugugdul.baiguullagiinId) url = url + "?lib=" + ugugdul.baiguullagiinId.toString();
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
router.get("/ebarimtMedeelelAvya", tokenShalgakh, async (req, res, next) => {
    try {
        ebarimtMedeelelAvya(
            req.body.baiguullagiinId,
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
    if (ugugdul.baiguullagiinId) url = url + "?lib=" + ugugdul.baiguullagiinId.toString();
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
        var ebarimt = await guilgeeneesEbarimtUusgye(
            guilgee,
            req.body.register,
            req.body.turul
        );
        console.log("ebarimt", ebarimt);
        ebarimtDuudya(
            ebarimt,
            (d) => {
                Ebarimt.insertMany(d).catch((err) => {
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
        ebarimtButsaaya(butsaakhBarimt, (d) => {
            butsaakhBarimt.ustgasanOgnoo = new Date();
            butsaakhBarimt.isNew = false;
            butsaakhBarimt.save().catch((err) => { next(err) });
            console.log("duuslaa", d);
            res.send(d);
        }, next);
    } catch (error) {
        next(error);
    }
});

router.post("/ebarimtIlgeeye", tokenShalgakh, async (req, res, next) => {
    try {
        var url = process.env.EBARIMT_IP + "/sendData";
        if (req.body.baiguullagiinId) url = url + "?lib=" + req.body.baiguullagiinId.toString();
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
            .then(async(result) => {
                const gereeniiDugaaruud = result?.jagsaalt?.map(a=>a.gereeniiDugaar)
                if(!!gereeniiDugaaruud)
                {
                   Geree.find({_id:gereeniiDugaaruud}).then(rows=>{
                        result.jagsaalt.forEach(a=>{
                            const geree = rows.find(b=>b._id === a.gereeniiDugaar)
                            if(geree){
                                a.utas = geree.utas
                                a.talbainDugaar = geree.talbainDugaar
                            }
                        })
                    res.send(result);
                   })
                }
            })
            .catch((err) => {
                next(err);
            });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
