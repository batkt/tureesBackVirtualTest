const asyncHandler = require("express-async-handler");
const aldaa = require("../components/aldaa");
const Token = require("../models/token");
const BankniiGuilgee = require("../models/bankniiGuilgee");
const Dans = require("../models/dans");
//const Dugaarlalt = require("../models/dugaarlalt");
const { Dugaarlalt } = require("zevback");
const xml2js = require('xml2js')
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
            }
        ]
    }
});
const instanceJson = got.extend({
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
        var url = new URL('https://api.khanbank.com/v1/auth/token?grant_type=client_credentials')
        url.username = username
        url.password = password
        const response = await instance.post(url);
        var khariu = JSON.parse(response.body)
        Token.updateOne({ "turul": "khaanCorporate", "baiguullagiinId": baiguullagiinId }, { "ognoo": new Date(), "token": khariu.access_token }, { upsert: true }).then((x) => { console.log(x) }).catch((e) => { console.log(e) });
        return khariu;
    } catch (error) {
        console.log("tokenAvya -> error ", error);
        if (next)
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
        if (!response.body) {
            if (next)
                next(new aldaa("Татах хуулга байхгүй"));
            else return null;
        }
        return JSON.parse(response.body);
    } catch (error) {
        console.log("error", error);
        if (next)
            next(error);
    }
}

async function tdbDansniiKhuulgaAvya(khuselt, next, onFinish) {
    try {
        var xmlObject = {
            "GrpHdr": {
                "MsgId": khuselt.msgId,
                "CreDtTm": "2022-01-18T22:16:58",
                "TxsCd": "5004",
                "InitgPty": {
                    "Id": {
                        "OrgId": {
                            "AnyBIC": khuselt.AnyBIC
                        }
                    }
                },
                "Crdtl": {
                    "Lang": "0",
                    "LoginID": khuselt.loginId, //"tdb_test",
                    "RoleID": khuselt.RoleID,
                    "Pwds": {
                        "PwdType": "1",
                        "Pwd": khuselt.pwd
                    }
                }
            },
            "EnqInf": {
                "IBAN": khuselt.dansniiDugaar,//"400011626",
                "Ccy": khuselt.valyut,//"MNT",
                "FrDt": khuselt.ekhlekhOgnoo,//"2021-11-21",
                "ToDt": khuselt.duusakhOgnoo,//"2022-01-21",
                "JrNo": khuselt.jurnaliinDugaar//"0000010"
            }
        }
        var builder = new xml2js.Builder({ standalone: false, rootName: "Document" });
        var xmlObject = builder.buildObject(xmlObject);
        console.log("xmlObject", xmlObject);
        var xml = {
            xml: xmlObject
        }

        const objectString = JSON.stringify(xml);
        var url = new URL(process.env.ZEV_TEST_SERVER + ":5000/")
        const response = await instanceJson.post(url, { body: objectString });
        console.log("response.body", response.body);
        var parseString = xml2js.parseString;
        parseString(response.body, async function (err, result) {
            onFinish(result);
        });
    } catch (error) {
        console.log("aldaatai!!");
        console.log(error);
        if (next)
            next(error);
    }
}

async function tdbDansniiUldegdelAvya(khuselt, next, onFinish) {
    try {
        var xmlObject = {
            "GrpHdr": {
                "MsgId": khuselt.msgId,
                "CreDtTm": "2022-01-18T22:16:58",
                "TxsCd": "5003",
                "InitgPty": {
                    "Id": {
                        "OrgId": {
                            "AnyBIC": khuselt.AnyBIC
                        }
                    }
                },
                "Crdtl": {
                    "Lang": "0",
                    "LoginID": khuselt.loginId, //"tdb_test",
                    "RoleID": khuselt.RoleID,
                    "Pwds": {
                        "PwdType": "1",
                        "Pwd": khuselt.pwd
                    }
                }
            },
            "EnqInf": {
                "IBAN": khuselt.dansniiDugaar,//"400011626",
                "Ccy": khuselt.valyut,//"MNT"
            }
        }
        var builder = new xml2js.Builder({ standalone: false, rootName: "Document" });
        var xmlObject = builder.buildObject(xmlObject);
        console.log("xmlObject", xmlObject);
        var xml = {
            xml: xmlObject
        }

        const objectString = JSON.stringify(xml);
        var url = new URL(process.env.ZEV_TEST_SERVER + ":5000/")
        const response = await instanceJson.post(url, { body: objectString });
        console.log("response.body", response.body);
        var parseString = xml2js.parseString;
        parseString(response.body, async function (err, result) {
            onFinish(result);
        });
    } catch (error) {
        if (next)
            next("Дансны үлдэгдэл авахад алдаа гарлаа!");
    }
}

exports.bankniiDansniiJagsaaltAvya = asyncHandler(async (req, res, next) => {
    var tokenObject = await Token.findOne({ "turul": "khaanCorporate", baiguullagiinId: req.body.baiguullagiinId, ognoo: { $gte: new Date(new Date().getTime() - 29 * 60000) } });
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

exports.dansniiUldegdelAvya = asyncHandler(async (req, res, next) => {
    try {
        var dans = await Dans.findOne({ dugaar: req.body.dansniiDugaar });
        var uldegdel = 0;
        if (dans && dans.bank == "khanbank") {
            var tokenObject = await Token.findOne({ "turul": "khaanCorporate", baiguullagiinId: dans.baiguullagiinId, ognoo: { $gte: new Date(new Date().getTime() - 29 * 60000) } });
            var token;
            if (!tokenObject) {
                tokenObject = await tokenAvya(dans.corporateNevtrekhNer, dans.corporateNuutsUg, next, dans.baiguullagiinId);
                token = tokenObject.access_token;
            }
            else
                token = tokenObject.token
            var khariu = await dansniiJagsaaltAvya(token, next);
            console.log("khariu", khariu);
            khariu = khariu.accounts.filter(a => a.number == req.body.dansniiDugaar);
            console.log("khariu", khariu);
            if (khariu && khariu.length > 0)
                uldegdel = khariu[0].avalaibleBalance
            res.send({ uldegdel });
        }
        else if (dans && dans.bank == "tdb") {
            var query = [
                {
                    '$match': {
                        'dansniiDugaar': dans.dugaar,
                        'baiguullagiinId': dans.baiguullagiinId
                    }
                }, {
                    '$group': {
                        '_id': '$dansniiDugaar',
                        'max': {
                            '$max': {
                                $toDouble: "$NtryRef"
                            }
                        }
                    }
                }
            ]
            var max = await BankniiGuilgee.aggregate(query);
            var maxDugaar = 100;
            if (max && max.length !== 0)
                maxDugaar = max[0].max;
            var khuseltiinDugaar = await Dugaarlalt.aggregate([
                {
                    '$match': {
                        'turul': "tdbKhuselt"
                    }
                }, {
                    '$group': {
                        '_id': 'aaa',
                        'max': {
                            '$max': {
                                $toDouble: "$dugaar"
                            }
                        }
                    }
                }]);
            var maxKhuseltiinDugaar = 107;
            if (khuseltiinDugaar && khuseltiinDugaar.length !== 0)
                maxKhuseltiinDugaar = khuseltiinDugaar[0].max;
            Dugaarlalt.findOneAndUpdate({ turul: "tdbKhuselt" }, { $set: { dugaar: maxKhuseltiinDugaar + 1 } }, {
                new: true,
                upsert: true
            }).then((resa) => console.log(resa)).catch((err) => console.log(err));
            tdbDansniiUldegdelAvya({
                msgId: "ZTR" + await pad(maxKhuseltiinDugaar, 12),
                loginId: dans.corporateNevtrekhNer,
                AnyBIC: dans.AnyBIC,
                RoleID: dans.RoleID,
                pwd: dans.corporateNuutsUg,
                dansniiDugaar: dans.dugaar,
                valyut: dans.valyut
            }, next, async (khariu) => {
                console.log("khariu", new Date(), khariu);
                if (khariu && khariu.Document && khariu.Document.GrpHdr && khariu.Document.GrpHdr[0].RspCd && khariu.Document.GrpHdr[0].RspCd[0] == "10") {
                    res.send({ uldegdel: khariu.Document.EnqRsp[0].ABal[0] });
                }
                else
                    res.send({ uldegdel: 0 });
            });
        }
    }
    catch (err) {
        next(err);
    }
});

exports.bankniiDansniiKhuulgaAvya = asyncHandler(async (req, res, next) => {
    var tokenObject = await Token.findOne({ "turul": "khaanCorporate", baiguullagiinId: req.body.baiguullagiinId, ognoo: { $gte: new Date(new Date().getTime() - 29 * 60000) } });
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
    var dansnuud;
    if (req && req.body && req.body.dans) {
        dansnuud = await Dans.find({ corporateAshiglakhEsekh: true, dugaar: req.body.dans }).lean();
    }
    else
        dansnuud = await Dans.find({ corporateAshiglakhEsekh: true }).lean();
    if (dansnuud)
        for await (const dans of dansnuud) {
            if (dans.bank == "khanbank") {
                var tokenObject = await Token.findOne({ "turul": "khaanCorporate", baiguullagiinId: dans.baiguullagiinId, ognoo: { $gte: new Date(new Date().getTime() - 29 * 60000) } });
                var token;
                if (!tokenObject) {
                    tokenObject = await tokenAvya(dans.corporateNevtrekhNer, dans.corporateNuutsUg, next, dans.baiguullagiinId);
                    token = tokenObject.access_token;
                }
                else
                    token = tokenObject.token
                var query = [
                    {
                        '$match': {
                            'dansniiDugaar': dans.dugaar,
                            'baiguullagiinId': dans.baiguullagiinId
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
                var khariu = await dansniiKhuulgaAvya(token, next, {
                    baiguullagiinId: dans.baiguullagiinId,
                    barilgiinId: dans.barilgiinId,
                    dansniiDugaar: dans.dugaar,
                    ekhlekhOgnoo: "20220101",
                    duusakhOgnoo: "20221231",
                    khuudasniiKhemjee: 100,
                    khuudasniiDugaar: 0,
                    record: maxDugaar
                });
                if (khariu && khariu.transactions) {
                    var guilgeenuud = []
                    khariu.transactions.forEach(mur => guilgeenuud.push(new BankniiGuilgee(mur)));
                    guilgeenuud.forEach(x => {
                        x.dansniiDugaar = dans.dugaar;
                        x.baiguullagiinId = dans.baiguullagiinId;
                        x.barilgiinId = dans.barilgiinId;
                    });
                    BankniiGuilgee.insertMany(guilgeenuud).then((result) => { if (res) res.send("Amjilttai") }).catch((err) => { console.log(err); next(err) });
                }
            }
            else if (dans.bank == "tdb") {
                var query = [
                    {
                        '$match': {
                            'dansniiDugaar': dans.dugaar,
                            'baiguullagiinId': dans.baiguullagiinId
                        }
                    }, {
                        '$group': {
                            '_id': '$dansniiDugaar',
                            'max': {
                                '$max': {
                                    $toDouble: "$NtryRef"
                                }
                            }
                        }
                    }
                ]
                var max = await BankniiGuilgee.aggregate(query);
                var maxDugaar = 100;
                if (max && max.length !== 0)
                    maxDugaar = max[0].max;
                var khuseltiinDugaar = await Dugaarlalt.aggregate([
                    {
                        '$match': {
                            'turul': "tdbKhuselt"
                        }
                    }, {
                        '$group': {
                            '_id': 'aaa',
                            'max': {
                                '$max': {
                                    $toDouble: "$dugaar"
                                }
                            }
                        }
                    }]);
                var maxKhuseltiinDugaar = 107;
                if (khuseltiinDugaar && khuseltiinDugaar.length !== 0)
                    maxKhuseltiinDugaar = khuseltiinDugaar[0].max;
                Dugaarlalt.findOneAndUpdate({ turul: "tdbKhuselt" }, { $set: { dugaar: maxKhuseltiinDugaar + 1 } }, {
                    new: true,
                    upsert: true
                }).then((resa) => console.log(resa)).catch((err) => console.log(err));
                var firstDay;
                var lastDay;
                if (req && req.body && req.body.ognoo) {
                    var ognoo = new Date(req.body.ognoo);
                    firstDay = new Date(ognoo.getFullYear(), ognoo.getMonth(), 1);
                    lastDay = new Date(ognoo.getFullYear(), ognoo.getMonth() + 1, 0);
                }
                else {
                    firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
                    lastDay = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
                }
                khariu = await tdbDansniiKhuulgaAvya({
                    msgId: "ZTR" + await pad(maxKhuseltiinDugaar, 12),
                    loginId: dans.corporateNevtrekhNer,
                    AnyBIC: dans.AnyBIC,
                    RoleID: dans.RoleID,
                    pwd: dans.corporateNuutsUg,
                    dansniiDugaar: dans.dugaar,
                    valyut: dans.valyut,
                    ekhlekhOgnoo: firstDay.getFullYear() + "-" + (firstDay.getMonth() + 1) + "-" + firstDay.getDate(),
                    duusakhOgnoo: lastDay.getFullYear() + "-" + (lastDay.getMonth() + 1) + "-" + lastDay.getDate(),
                    jurnaliinDugaar: await pad((req && req.body && req.body.ognoo) ? 0 : maxDugaar, 7)
                }, next, async (khariu) => {
                    console.log("khariu", new Date(), khariu);
                    if (khariu && khariu.Document && khariu.Document.GrpHdr && khariu.Document.GrpHdr[0].RspCd && khariu.Document.GrpHdr[0].RspCd[0] == "10") {
                        console.log("khariu", khariu);
                        var guilgeenuud = []
                        khariu.Document.EnqRsp[0].Ntry.forEach(mur => {
                            //mur = await tdbKhuulgaKhurvuulekh(mur);
                            //console.log("mur", mur)
                            guilgeenuud.push(new BankniiGuilgee({
                                NtryRef: mur?.NtryRef[0],
                                TxDt: mur?.TxDt[0],
                                TxPostDate: mur?.TxPostDate[0],
                                TxTime: mur?.TxTime[0],
                                TxRt: mur?.TxRt[0],
                                CtAcct: mur?.CtAcct[0],
                                CtActnName: mur?.CtActnName[0],
                                TxAddInf: mur?.TxAddInf[0],
                                CtAcntOrg: mur?.CtAcntOrg[0],
                                CtBankNo: mur?.CtBankNo[0],
                                Amt: mur?.Amt[0]
                            }))
                        });
                        guilgeenuud.forEach(x => {
                            x.dansniiDugaar = dans.dugaar;
                            x.baiguullagiinId = dans.baiguullagiinId;
                            x.barilgiinId = dans.barilgiinId;
                        });
                        BankniiGuilgee.insertMany(guilgeenuud).then((result) => { if (res) res.send("Amjilttai") }).catch((err) => { console.log(err); });
                    }
                    else {
                        console.log("khariu", khariu);
                        console.log("khariu.Document", khariu["Document"]);
                        console.log("khariu.Document.GrpHdr", khariu.Document.GrpHdr);
                        console.log("khariu.Document.GrpHdr", khariu.Document.GrpHdr[0]);
                        console.log("khariu", khariu.Document.GrpHdr[0].RspCd);
                        console.log("khariu", khariu.Document.GrpHdr[0].RspCd[0]);
                    }
                });
            }
        }
    else if (res)
        res.status(200).send("Tatah guilgee baihgui!");
});

async function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

async function tdbKhuulgaKhurvuulekh(object) {
    console.log("object", object);
    object.NtryRef = object?.NtryRef[0];
    object.TxDt = object?.TxDt[0];
    object.TxPostDate = object?.TxPostDate[0];
    object.TxTime = object?.TxTime[0];
    object.TxRt = object?.TxRt[0];
    object.CtAcct = object?.CtAcct[0];
    object.CtActnName = object?.CtActnName[0];
    object.TxAddInf = object?.TxAddInf[0];
    object.CtAcntOrg = object?.CtAcntOrg[0];
    object.CtBankNo = object?.CtBankNo[0];
    object.Amt = object?.Amt[0];
    return object;
}