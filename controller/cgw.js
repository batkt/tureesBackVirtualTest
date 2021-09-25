const asyncHandler = require("express-async-handler");
const aldaa = require("../components/aldaa");
const Token = require("../models/token");
const BankniiGuilgee = require("../models/bankniiGuilgee");
const got = require('got');
const { URL } = require('url');
const instance = got.extend({
    hooks: {
        beforeRequest: [
            options => {
                options.headers['Content-Type'] = "application/x-www-form-urlencoded"
                if (options.context && options.context.token) {
                    options.headers['Authorization'] = options.context.token;
                }
                console.log(options)
            }
        ]
    }
});

async function tokenAvya(username, password, next, baiguullagiinId) {
    try {
        var url = new URL('https://api.khanbank.com/v1/auth/token?grant_type=client_credentials')
        url.username = username
        url.password = password
        const response = await instance.post(url);
        var khariu = JSON.parse(response.body)
        Token.updateOne({ "baiguullagiinId": baiguullagiinId }, { "ognoo": new Date(), "token": khariu.access_token }, { upsert: true }).then((x) => { console.log(x) }).catch((e) => { console.log(e) });
        return khariu;
    } catch (error) {
        next(error);
    }
}

async function dansniiJagsaaltAvya(token, next) {
    try {
        var url = new URL('https://api.khanbank.com/v1/accounts/')
        const context = {
            token: "Bearer " + token
        };
        const response = await instance.get(url, { context });
        return JSON.parse(response.body);
    } catch (error) {
        next(error);
    }
}
async function dansniiKhuulgaAvya(token, next, body) {
    try {
        var url = "https://api.khanbank.com/v1/statements/" + body.dansniiDugaar
            + "?from=" + body.ekhlekhOgnoo + "&to=" + body.duusakhOgnoo + "&page="
            + body.khuudasniiDugaar + "&&size=" + body.khuudasniiKhemjee;
        if (body.record)
            url = url + "&&record=" + body.record;
        url = new URL(url);
        const context = {
            token: "Bearer " + token
        };
        const response = await instance.get(url, { context });
        return JSON.parse(response.body);
    } catch (error) {
        next(error);
    }
}

exports.bankniiDansniiJagsaaltAvya = asyncHandler(async (req, res, next) => {
    var tokenObject = await Token.findOne({ baiguullagiinId: req.body.baiguullagiinId, ognoo: { $gte: new Date(new Date().getTime() - 29 * 60000) } });
    var token;
    if (!tokenObject) {
        tokenObject = await tokenAvya("0CAhOZ85wlmRzrPAkBycQFeTBnewDX7O", "Rv1eLukuzQirNgD3", next, req.body.baiguullagiinId);
        token = tokenObject.access_token;
    }
    else
        token = tokenObject.token
    var khariu = await dansniiJagsaaltAvya(token, next);
    res.send(khariu);
});

exports.bankniiDansniiKhuulgaAvya = asyncHandler(async (req, res, next) => {
    var tokenObject = await Token.findOne({ baiguullagiinId: req.body.baiguullagiinId, ognoo: { $gte: new Date(new Date().getTime() - 29 * 60000) } });
    var token;
    if (!tokenObject) {
        tokenObject = await tokenAvya("0CAhOZ85wlmRzrPAkBycQFeTBnewDX7O", "Rv1eLukuzQirNgD3", next, req.body.baiguullagiinId);
        token = tokenObject.access_token;
    }
    else
        token = tokenObject.token
    var khariu = await dansniiKhuulgaAvya(token, next, req.body);
    res.send(khariu);
});


exports.bankniiKhuulgaTatajKhadgalya = asyncHandler(async (req, res, next) => {
    var tokenObject = await Token.findOne({ baiguullagiinId: req.body.baiguullagiinId, ognoo: { $gte: new Date(new Date().getTime() - 29 * 60000) } });
    var token;
    if (!tokenObject) {
        tokenObject = await tokenAvya("0CAhOZ85wlmRzrPAkBycQFeTBnewDX7O", "Rv1eLukuzQirNgD3", next, req.body.baiguullagiinId);
        token = tokenObject.access_token;
    }
    else
        token = tokenObject.token
    var query = [
        {
            '$match': {
                'dansniiDugaar': req.body.dansniiDugaar
            }
        }, {
            '$group': {
                '_id': '$dansniiDugaar',
                'max': {
                    '$max': {
                        $toInt: "$record"
                    }
                }
            }
        }
    ]
    var max = await BankniiGuilgee.aggregate(query);
    var maxDugaar = 1;
    if (max && max.length !== 0)
        maxDugaar = max[0].max;
    if (maxDugaar != 1)
        req.body.record = maxDugaar
    var khariu = await dansniiKhuulgaAvya(token, next, req.body);
    if (khariu && khariu.transactions) {
        var guilgeenuud = []
        khariu.transactions.forEach(mur => guilgeenuud.push(new BankniiGuilgee(mur)));
        guilgeenuud.forEach(x => {
            x.dansniiDugaar = req.body.dansniiDugaar;
            x.baiguullagiinId = req.body.baiguullagiinId;
        });
        BankniiGuilgee.insertMany(guilgeenuud).then((result) => { res.send(khariu) }).catch((err) => { next(err) });
    }
    else
        res.send("Татах гүйлгээ байхгүй байна!");
});