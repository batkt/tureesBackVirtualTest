const asyncHandler = require("express-async-handler");
const aldaa = require("../components/aldaa");
const Token = require("../models/token");
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
        object = {
            "invoice_code": "TEST_INVOICE",
            "sender_invoice_no": "123455678",
            "invoice_receiver_code": "83",
            "invoice_description": "Order No1311 200.00",
            "allow_partial": false,
            "minimum_amount": null,
            "allow_exceed": false,
            "maximum_amount": null,
            "amount": 200,
            "callback_url": "https://bd5492c3ee85.ngrok.io/payments?payment_id=12345678",
            "sender_staff_code": "online",
            "invoice_receiver_data": {
                "register": "UZ96021105",
                "name": "Ganzul",
                "email": "test@gmail.com",
                "phone": "88614450"
            },
            "lines": [
                {
                    "tax_product_code": "6401",
                    "line_description": " Order No1311 200.00 .",
                    "line_quantity": "1.00",
                    "line_unit_price": "200.00",
                    "note": "-.",
                    "discounts": [
                        {
                            "discount_code": "NONE",
                            "description": " discounts",
                            "amount": 10,
                            "note": " discounts"
                        }
                    ],
                    "surcharges": [
                        {
                            "surcharge_code": "NONE",
                            "description": "Хүргэлтийн зардал",
                            "amount": 10,
                            "note": " Хүргэлт"
                        }
                    ],
                    "taxes": [
                        {
                            "tax_code": "VAT",
                            "description": "НӨАТ",
                            "amount": 20,
                            "note": " НӨАТ"
                        }
                    ]
                }
            ]
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
    var khariu = await qpayShivye(token, qpayObject, next);
    res.send(khariu);
});