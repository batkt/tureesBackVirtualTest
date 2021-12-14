const asyncHandler = require("express-async-handler");
const aldaa = require("../components/aldaa");
const Token = require("../models/token");
const Dugaarlalt = require("../models/dugaarlalt");
const QpayObject = require("../models/qpayObject");
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
        var url = new URL('https://merchant-sandbox.qpay.mn/v2/auth/token/')
        url.username = username
        url.password = password
        const response = await instance.post(url);
        var khariu = JSON.parse(response.body)
        Token.updateOne({ "turul": "qpay", "baiguullagiinId": baiguullagiinId }, { "ognoo": new Date(), "token": khariu.access_token, "refreshToken": khariu.refresh_token }, { upsert: true }).then((x) => { console.log(x) }).catch((e) => { console.log(e) });
        return khariu;
    } catch (error) {
        next(error);
    }
}


async function qpayShivye(token, qpayObject, next) {
    try {
        var url = "https://merchant-sandbox.qpay.mn/v2/invoice"
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

async function qpayObjectUusgeye(body, next) {
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
            "invoice_code": "TEST_INVOICE",
            "sender_invoice_no": maxDugaar.toString(),
            "invoice_receiver_code": body.burtgeliinDugaar,
            "invoice_description": "Түрээсийн төлбөр",
            "allow_partial": false,
            "minimum_amount": null,
            "allow_exceed": false,
            "maximum_amount": null,
            "amount": body.dun,
            "callback_url": "http://zevtabs.mn/qpayTulye/" + body.baiguullagiinId.toString() + "/" + body.barilgiinId.toString() + "/" + maxDugaar.toString()
        }
        return object;
    } catch (error) {
        console.log("error", error);
        if (next)
            next(error);
    }
}

exports.qpayGargaya = asyncHandler(async (req, res, next) => {
    var tokenObject = await Token.findOne({ "turul": "qpay", baiguullagiinId: req.body.baiguullagiinId, ognoo: { $gte: new Date(new Date().getTime() - 29 * 60000) } });
    var token;
    if (!tokenObject) {
        tokenObject = await tokenAvya("TEST_MERCHANT", "123456", next, req.body.baiguullagiinId);
        token = tokenObject.access_token;
    }
    else
        token = tokenObject.token
    var qpayObject = await qpayObjectUusgeye(req.body, next);
    console.log("qpayObject", qpayObject);
    var khariu = await qpayShivye(token, qpayObject, next);
    var dugaarlalt = new Dugaarlalt();
    dugaarlalt.baiguullagiinId = req.body.baiguullagiinId;
    dugaarlalt.barilgiinId = req.body.barilgiinId;;
    dugaarlalt.ognoo = new Date();
    dugaarlalt.turul = "qpay";
    dugaarlalt.dugaar = qpayObject.sender_invoice_no + 1
    dugaarlalt.save();
    res.send(khariu);
});

exports.qpayTulye = asyncHandler(async (req, res, next) => {
    console.log("qpay orj irlee body ===>", req.body);
    console.log("qpay orj irlee params ===>", req.params);
    res.send(200);
});