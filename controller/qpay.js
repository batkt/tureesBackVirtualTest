const asyncHandler = require("express-async-handler");
const aldaa = require("../components/aldaa");
const Token = require("../models/token");
const Tulbur = require("./tulbur");
const Dugaarlalt = require("../models/dugaarlalt");
const Dans = require("../models/dans");
const QpayObject = require("../models/qpayObject");
const Geree = require("../models/geree");
const got = require('got');
const { URL } = require('url');
const instance = got.extend({
    hooks: {
        beforeRequest: [
            options => {
                options.headers['Content-Type'] = "application/json"
                if (options.context && options.context.token) {
                    options.headers['Authorization'] = options.context.token;
                }
            }
        ]
    }
});

async function tokenAvya(username, password, next, baiguullagiinId) {
    try {
        var url = new URL(process.env.QPAY_SERVER + "v2/auth/token/")
        url.username = username
        url.password = password
        const response = await instance.post(url);
        var khariu = JSON.parse(response.body)
        Token.updateOne({ "turul": "qpay", "baiguullagiinId": baiguullagiinId }, { "ognoo": new Date(), "token": khariu.access_token, "refreshToken": khariu.refresh_token }, { upsert: true }).then((x) => { console.log(x) }).catch((e) => { console.log(e) });
        console.log("khariu", khariu);
        return khariu;
    } catch (error) {
        next(error);
    }
}

async function tokenSungaya(token, next) {
    try {
        var url = process.env.QPAY_SERVER + "v2/auth/refresh"
        url = new URL(url);
        const context = {
            token: "Bearer " + token
        };
        const response = await instance.post(url, { context });
        if (!response.body) {
            if (next) {
                next(new aldaa("Алдаа гарлаа!"));
                console.log("response =>", response)
            }
            else return null;
        }
        return JSON.parse(response.body);
    } catch (error) {
        console.log("error", error);
        if (next)
            next(error);
    }
}


async function qpayShivye(token, qpayObject, next) {
    try {
        var url = process.env.QPAY_SERVER + "v2/invoice"
        url = new URL(url);
        const context = {
            token: "Bearer " + token
        };
        const qpayObjectString = JSON.stringify(qpayObject);
        const response = await instance.post(url, { context, body: qpayObjectString });
        if (!response.body) {
            if (next) {
                next(new aldaa("Алдаа гарлаа!"));
                console.log("response =>", response)
            }
            else return null;
        }
        return JSON.parse(response.body);
    } catch (error) {
        console.log("error", error);
        if (next)
            next(error);
    }
}

async function qpayObjectUusgeye(body, invoiceCode, next) {
    try {
        var maxDugaar = 1;
        await Dugaarlalt.find({
            baiguullagiinId: body.baiguullagiinId,
            barilgiinId: body.barilgiinId,
            turul: "qpay"
        })
            .sort({
                dugaar: -1,
            })
            .limit(1)
            .then((result) => {
                if (result != 0) maxDugaar = result[0].dugaar + 1;
            });
        object = {
            "invoice_code": invoiceCode,
            "sender_invoice_no": maxDugaar.toString(),
            "invoice_receiver_code": body.burtgeliinDugaar,
            "invoice_description": "Түрээсийн төлбөр",
            "allow_partial": false,
            "minimum_amount": null,
            "allow_exceed": false,
            "maximum_amount": null,
            "amount": body.dun,
            "callback_url": "http://zevtabs.mn:8081/qpayTulye/" + body.baiguullagiinId.toString() + "/" + body.barilgiinId.toString() + "/" + maxDugaar.toString()
        }
        return object;
    } catch (error) {
        console.log("error", error);
        if (next)
            next(error);
    }
}

exports.qpayGargaya = asyncHandler(async (req, res, next) => {
    var dans = await Dans.findOne({ dugaar: req.body.dansniiDugaar });
    if (!dans.qpayAshiglakhEsekh || !dans.qpayUsername || !dans.qpayPassword || !dans.qpayInvoiceCode)
        throw new aldaa("Qpay тохиргоо хийгдээгүй байна!");

    var tokenObject = await Token.findOne({ "turul": "qpay", baiguullagiinId: req.body.baiguullagiinId, ognoo: { $gte: new Date(new Date().getTime() - 29 * 60000) } });
    var token;
    if (!tokenObject) {
        console.log("token bxgu");
        tokenObject = await tokenAvya(dans.qpayUsername, dans.qpayPassword, next, req.body.baiguullagiinId);
        token = tokenObject.access_token;
    }
    else {
        var tokenO = await tokenSungaya(tokenObject.refreshToken, next)
        console.log("tokenO", tokenO);
        token = tokenO.access_token
    }
    var qpayObject = await qpayObjectUusgeye(req.body, dans.qpayInvoiceCode, next);
    console.log("qpayObject", qpayObject);
    var khariu = await qpayShivye(token, qpayObject, next);
    var dugaarlalt = new Dugaarlalt();
    dugaarlalt.baiguullagiinId = req.body.baiguullagiinId;
    dugaarlalt.barilgiinId = req.body.barilgiinId;;
    dugaarlalt.ognoo = new Date();
    dugaarlalt.turul = "qpay";
    dugaarlalt.dugaar = Number(qpayObject.sender_invoice_no) + 1
    dugaarlalt.save();
    var khadgalakhQpay = new QpayObject();
    khadgalakhQpay.qpay = qpayObject;
    khadgalakhQpay.baiguullagiinId = req.body.baiguullagiinId;
    khadgalakhQpay.barilgiinId = req.body.barilgiinId;
    khadgalakhQpay.ognoo = new Date();
    khadgalakhQpay.gereeniiId = req.body.gereeniiId;
    khadgalakhQpay.tulsunEsekh = false;
    khadgalakhQpay.save();
    res.send(khariu);
});

exports.qpayTulye = asyncHandler(async (req, res, next) => {
    var qpayBarimt = await QpayObject.findOne({ "qpay.sender_invoice_no": req.params.dugaar, baiguullagiinId: req.params.baiguullagiinId, barilgiinId: req.params.barilgiinId });
    console.log("qpayBarimt", qpayBarimt);
    qpayBarimt.tulsunEsekh = true;
    qpayBarimt.isNew = false;
    var tulbur = {
        turul: "qpay",
        tulsunDun: qpayBarimt.qpay.amount,
        ognoo: qpayBarimt.ognoo,
        guilgeeKhiisenOgnoo: new Date(),
    }
    Geree.findByIdAndUpdate({ _id: qpayBarimt.gereeniiId }, {
        $push: {
            [`avlaga.guilgeenuud`]: tulbur
        }
    }).then((result) => {
        qpayBarimt.save();
        Tulbur.daraagiinTulukhOgnooZasya(qpayBarimt.gereeniiId);
        res.sendStatus(200);
    })
        .catch((err) => {
            res.sendStatus(200);
        });
});