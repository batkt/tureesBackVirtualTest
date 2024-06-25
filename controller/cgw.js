const asyncHandler = require("express-async-handler");
const aldaa = require("../components/aldaa");
const BankniiGuilgee = require("../models/bankniiGuilgee");
//const Dugaarlalt = require("../models/dugaarlalt");
const { Dugaarlalt, Token, Dans } = require("zevbackv2");
const { Uilchluulegch } = require("parking-v1");
const xml2js = require("xml2js");
const axios = require("axios");
const got = require("got");
const { URL } = require("url");
var CryptoJS = require("crypto-js");
const instance = got.extend({
  hooks: {
    beforeRequest: [
      (options) => {
        options.headers["Content-Type"] = "application/x-www-form-urlencoded";
        if (options.context && options.context.token) {
          options.headers["Authorization"] = options.context.token;
        }
      },
    ],
  },
});
const instanceJson = got.extend({
  hooks: {
    beforeRequest: [
      (options) => {
        options.headers["Content-Type"] = "application/json";
        if (options.context && options.context.token) {
          options.headers["Authorization"] = options.context.token;
        }
      },
    ],
  },
});

async function tokenAvya(
  username,
  password,
  next,
  baiguullagiinId,
  tukhainBaaziinKholbolt
) {
  try {
    var url = new URL(
      "https://api.khanbank.com/v1/auth/token?grant_type=client_credentials"
    );
    url.username = username;
    url.password = password;
    const response = await instance.post(url);
    var khariu = JSON.parse(response.body);
    Token(tukhainBaaziinKholbolt)
      .updateOne(
        { turul: "khaanCorporate", baiguullagiinId: baiguullagiinId },
        { ognoo: new Date(), token: khariu.access_token },
        { upsert: true }
      )
      .then((x) => {
        console.log(x);
      })
      .catch((e) => {
        console.log(e);
      });
    return khariu;
  } catch (error) {
    console.log("tokenAvya -> error ", error);
    if (next) next(new Error("Банктай холбогдоход алдаа гарлаа!"));
  }
}

async function golomtTokenAvya(dans, tukhainBaaziinKholbolt) {
  try {
    var tokenObject = await Token(tukhainBaaziinKholbolt).findOne({
      turul: "golomt",
      baiguullagiinId: dans.baiguullagiinId,
      ognoo: { $gte: new Date(new Date().getTime() - 29 * 60000) },
    });
    if (!tokenObject) {
      var { username, password, sessionKey, ivKey } = dans;
      var sessionKey = CryptoJS.enc.Latin1.parse(sessionKey);
      var ivKey = CryptoJS.enc.Latin1.parse(ivKey);
      var encryptedPass = await CryptoJS.AES.encrypt(password, sessionKey, {
        mode: CryptoJS.mode.CBC,
        iv: ivKey,
      });
      var url = process.env.GOLOMT_SERVER + "/v1/auth/login";
      const response = await got
        .post(url, {
          headers: {
            "Content-Type": "application/json",
          },
          json: { name: username, password: encryptedPass.toString() },
        })
        .catch((err) => {
          console.log("error " + err.message);
          throw err;
        });
      var khariu = JSON.parse(response.body);
      Token(tukhainBaaziinKholbolt)
        .updateOne(
          { turul: "golomt", baiguullagiinId: dans.baiguullagiinId },
          {
            ognoo: new Date(),
            token: khariu.token,
            refreshToken: khariu.refreshToken,
          },
          { upsert: true }
        )
        .then((x) => {
          console.log(x);
        })
        .catch((e) => {
          console.log(e);
        });
      tokenObject = khariu;
    } else if (
      tokenObject.ognoo < new Date(new Date().getTime() - 290000) //4min 50 sec-s umnu bwal sungax
    ) {
      console.log("sungaxruu orloo");
      var url = process.env.GOLOMT_SERVER + "/v1/auth/refresh";
      console.log("url", url);
      console.log("tokenObject.refreshToken", tokenObject.refreshToken);
      const response = await got
        .get(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + tokenObject.refreshToken,
          },
        })
        .catch((err) => {
          console.log("error " + err.message);
          throw err;
        });
      console.log("response.body", response.body);
      var khariu = JSON.parse(response.body);
      Token(tukhainBaaziinKholbolt)
        .updateOne(
          { turul: "golomt", baiguullagiinId: dans.baiguullagiinId },
          {
            ognoo: new Date(),
            token: khariu.token,
            refreshToken: khariu.refreshToken,
          },
          { upsert: true }
        )
        .then((x) => {
          console.log(x);
        })
        .catch((e) => {
          console.log(e);
        });
      tokenObject = khariu;
    }
    return tokenObject;
  } catch (error) {
    console.log("tokenAvya -> error ", error);
    new Error("Банктай холбогдоход алдаа гарлаа!");
  }
}

async function golomtServiceDuudya(
  dans,
  yawuulaxBody,
  url,
  serviceNer,
  next,
  tukhainBaaziinKholbolt
) {
  try {
    var { sessionKey, ivKey } = dans;
    var tokenObject = await golomtTokenAvya(dans, tukhainBaaziinKholbolt);
    console.log("tokenObject", tokenObject);
    var a = JSON.stringify(yawuulaxBody);
    var hash = CryptoJS.SHA256(a.toString());
    var hex = hash.toString(CryptoJS.enc.Hex);
    var sessionKey = CryptoJS.enc.Latin1.parse(sessionKey);
    var ivKey = CryptoJS.enc.Latin1.parse(ivKey);
    var encrypted = CryptoJS.AES.encrypt(hex, sessionKey, {
      mode: CryptoJS.mode.CBC,
      iv: ivKey,
    });
    var url = process.env.GOLOMT_SERVER + url; //"/v1/account/balance/inq";
    const response = await got
      .post(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + tokenObject.token,
          "X-Golomt-Checksum": encrypted.toString(),
          "X-Golomt-Service": serviceNer, //"ACCTBALINQ",
        },
        json: yawuulaxBody,
      })
      .catch((err) => {
        console.log("aldaaaa ", JSON.stringify(err, null, 4));
        throw err;
      });
    var stringKhariu = response?.body;
    var khariu;
    if (!!stringKhariu) {
      console.log("stringKhariu ", stringKhariu);
      var encrypt = CryptoJS.enc.Base64.parse(stringKhariu);
      var decrypted = CryptoJS.AES.decrypt(
        { ciphertext: encrypt },
        sessionKey,
        {
          mode: CryptoJS.mode.CBC,
          iv: ivKey,
        }
      );
      var plain = decrypted.toString(CryptoJS.enc.Utf8);
      var khariu = JSON.parse(plain);
    }
    return khariu;
  } catch (error) {
    console.log("golomt service aldaa -> error ", error);
    if (next) next(new Error("Банктай холбогдоход алдаа гарлаа!"));
  }
}

async function dansniiJagsaaltAvya(token, next) {
  try {
    var url = new URL("https://api.khanbank.com/v1/accounts/");
    const context = {
      token: "Bearer " + token,
    };
    const response = await instance.get(url, { context });
    return JSON.parse(response.body);
  } catch (error) {
    next(error);
  }
}

async function dansniiKhuulgaAvya(token, next, body) {
  try {
    var url =
      "https://api.khanbank.com/v1/statements/" +
      body.dansniiDugaar +
      "?from=" +
      body.ekhlekhOgnoo +
      "&to=" +
      body.duusakhOgnoo +
      "&page=" +
      body.khuudasniiDugaar +
      "&&size=" +
      body.khuudasniiKhemjee;
    if (body.record) url = url + "&&record=" + body.record;
    url = new URL(url);
    const context = {
      token: "Bearer " + token,
    };
    const response = await instance.get(url, { context });
    if (!response.body) {
      if (next) next(new aldaa("Татах хуулга байхгүй"));
      else return null;
    }
    return JSON.parse(response.body);
  } catch (error) {
    console.log("error", error);
    if (next) next(error);
  }
}

async function tdbDansniiKhuulgaAvya(khuselt, next, onFinish, baiguullagiinId) {
  try {
    var CreDtTm = new Date().toISOString().replace(/\..+/, "");
    var xmlObject = {
      GrpHdr: {
        MsgId: khuselt.msgId,
        CreDtTm,
        TxsCd: "5004",
        InitgPty: {
          Id: {
            OrgId: {
              AnyBIC: khuselt.AnyBIC,
            },
          },
        },
        Crdtl: {
          Lang: "0",
          LoginID: khuselt.loginId, //"tdb_test",
          RoleID: khuselt.RoleID,
          Pwds: {
            PwdType: "1",
            Pwd: khuselt.pwd,
          },
        },
      },
      EnqInf: {
        IBAN: khuselt.dansniiDugaar, //"400011626",
        Ccy: khuselt.valyut, //"MNT",
        FrDt: khuselt.ekhlekhOgnoo, //"2021-11-21",
        ToDt: khuselt.duusakhOgnoo, //"2022-01-21",
        JrNo: khuselt.jurnaliinDugaar, //"0000010"
      },
    };
    var builder = new xml2js.Builder({
      standalone: false,
      rootName: "Document",
    });
    var xmlObject = builder.buildObject(xmlObject);
    var xml = {
      xml: xmlObject,
    };

    const objectString = JSON.stringify(xml);
    var baiguullagiinZam = "";
    if (!!khuselt.corporateBaiguullaga) {
      baiguullagiinZam = khuselt.corporateBaiguullaga;
    } else {
      if (baiguullagiinId == "6115f350b35689cdbf1b9da3")
        baiguullagiinZam = "ikh";
      else if (baiguullagiinId == "631595e9957b7d5ec013c076")
        baiguullagiinZam = "uguumur";
      else if (baiguullagiinId == "64fe8edc54a669717ad657ac")
        baiguullagiinZam = "halmon";
      else if (baiguullagiinId == "65435cdff2f5358696c61454")
        baiguullagiinZam = "tt";
      else if (baiguullagiinId == "656f1719f28cde7f62bc5280")
        baiguullagiinZam = "polaris";
    }
    var urlString = process.env.ZEV_TEST_SERVER + ":5000/" + baiguullagiinZam;
    var url = new URL(urlString);
    const response = await instanceJson.post(url, { body: objectString });
    var parseString = xml2js.parseString;
    parseString(response.body, async function (err, result) {
      onFinish(result);
    });
  } catch (error) {
    console.log("aldaatai!!");
    console.log(error);
    if (next) next(error);
  }
}

async function tdbDansniiUldegdelAvya(
  khuselt,
  next,
  onFinish,
  baiguullagiinId
) {
  try {
    var CreDtTm = new Date().toISOString().replace(/\..+/, "");
    var xmlObject = {
      GrpHdr: {
        MsgId: khuselt.msgId,
        CreDtTm,
        TxsCd: "5003",
        InitgPty: {
          Id: {
            OrgId: {
              AnyBIC: khuselt.AnyBIC,
            },
          },
        },
        Crdtl: {
          Lang: "0",
          LoginID: khuselt.loginId, //"tdb_test",
          RoleID: khuselt.RoleID,
          Pwds: {
            PwdType: "1",
            Pwd: khuselt.pwd,
          },
        },
      },
      EnqInf: {
        IBAN: khuselt.dansniiDugaar, //"400011626",
        Ccy: khuselt.valyut, //"MNT"
      },
    };
    var builder = new xml2js.Builder({
      standalone: false,
      rootName: "Document",
    });
    var xmlObject = builder.buildObject(xmlObject);
    console.log("xmlObject", xmlObject);
    var xml = {
      xml: xmlObject,
    };

    const objectString = JSON.stringify(xml);

    var baiguullagiinZam = "";

    if (!!khuselt.corporateBaiguullaga) {
      baiguullagiinZam = khuselt.corporateBaiguullaga;
    } else {
      if (baiguullagiinId == "6115f350b35689cdbf1b9da3")
        baiguullagiinZam = "ikh";
      else if (baiguullagiinId == "631595e9957b7d5ec013c076")
        baiguullagiinZam = "uguumur";
      else if (baiguullagiinId == "64fe8edc54a669717ad657ac")
        baiguullagiinZam = "halmon";
      else if (baiguullagiinId == "65435cdff2f5358696c61454")
        baiguullagiinZam = "tt";
      else if (baiguullagiinId == "656f1719f28cde7f62bc5280")
        baiguullagiinZam = "polaris";
    }
    var urlString = process.env.ZEV_TEST_SERVER + ":5000/" + baiguullagiinZam;
    console.log("url", urlString);
    var url = new URL(urlString);
    const response = await instanceJson.post(url, { body: objectString });
    console.log("response.body", response.body);
    var parseString = xml2js.parseString;
    parseString(response.body, async function (err, result) {
      onFinish(result);
    });
  } catch (error) {
    if (next) next(new Error("Дансны үлдэгдэл авахад алдаа гарлаа!"));
  }
}

exports.dansniiUldegdelAvya = asyncHandler(async (req, res, next) => {
  try {
    var dans = await Dans(req.body.tukhainBaaziinKholbolt).findOne({
      dugaar: req.body.dansniiDugaar,
    });
    var uldegdel = 0;
    if (dans && dans.bank == "khanbank") {
      var tokenObject = await Token(req.body.tukhainBaaziinKholbolt).findOne({
        turul: "khaanCorporate",
        baiguullagiinId: dans.baiguullagiinId,
        ognoo: { $gte: new Date(new Date().getTime() - 29 * 60000) },
      });
      var token;
      if (!tokenObject) {
        tokenObject = await tokenAvya(
          dans.corporateNevtrekhNer,
          dans.corporateNuutsUg,
          next,
          dans.baiguullagiinId,
          req.body.tukhainBaaziinKholbolt
        );
        token = tokenObject?.access_token;
      } else token = tokenObject.token;
      if (!token) {
        throw new Error(
          "Corporate Gateway үйлчилгээний нэвтрэх мэдээллээ шалгана уу!"
        );
      }
      var khariu = await dansniiJagsaaltAvya(token, next);
      khariu = khariu.accounts.filter(
        (a) => a.number == req.body.dansniiDugaar
      );
      if (khariu && khariu.length > 0) uldegdel = khariu[0].avalaibleBalance;
      res.send({ uldegdel });
    } else if (dans && dans.bank == "tdb") {
      var query = [
        {
          $match: {
            dansniiDugaar: dans.dugaar,
            baiguullagiinId: dans.baiguullagiinId,
          },
        },
        {
          $group: {
            _id: "$dansniiDugaar",
            max: {
              $max: {
                $toDouble: "$NtryRef",
              },
            },
          },
        },
      ];
      var max = await BankniiGuilgee(req.body.tukhainBaaziinKholbolt).aggregate(
        query
      );
      var maxDugaar = 100;
      if (max && max.length !== 0) maxDugaar = max[0].max;
      var khuseltiinDugaar = await Dugaarlalt(
        req.body.tukhainBaaziinKholbolt
      ).aggregate([
        {
          $match: {
            turul: "tdbKhuselt",
          },
        },
        {
          $group: {
            _id: "aaa",
            max: {
              $max: {
                $toDouble: "$dugaar",
              },
            },
          },
        },
      ]);
      var maxKhuseltiinDugaar = 107;
      if (khuseltiinDugaar && khuseltiinDugaar.length !== 0)
        maxKhuseltiinDugaar = khuseltiinDugaar[0].max;
      Dugaarlalt(req.body.tukhainBaaziinKholbolt)
        .findOneAndUpdate(
          { turul: "tdbKhuselt" },
          { $set: { dugaar: maxKhuseltiinDugaar + 1 } },
          {
            new: true,
            upsert: true,
          }
        )
        .then((resa) => console.log(resa))
        .catch((err) => console.log(err));
      var textUseg = "A";
      if (dans.baiguullagiinId == "631595e9957b7d5ec013c076") textUseg = "U";
      else if (dans.baiguullagiinId == "64fe8edc54a669717ad657ac")
        textUseg = "K";
      else if (dans.baiguullagiinId == "65435cdff2f5358696c61454")
        textUseg = "T";
      else if (dans.baiguullagiinId == "656f1719f28cde7f62bc5280")
        textUseg = "P";
      tdbDansniiUldegdelAvya(
        {
          corporateBaiguullaga: dans.corporateBaiguullaga,
          msgId: "ZT" + textUseg + (await pad(maxKhuseltiinDugaar, 12)),
          loginId: dans.corporateNevtrekhNer,
          AnyBIC: dans.AnyBIC,
          RoleID: dans.RoleID,
          pwd: dans.corporateNuutsUg,
          dansniiDugaar: dans.dugaar,
          valyut: dans.valyut,
        },
        next,
        async (khariu) => {
          if (
            khariu &&
            khariu.Document &&
            khariu.Document.GrpHdr &&
            khariu.Document.GrpHdr[0].RspCd &&
            khariu.Document.GrpHdr[0].RspCd[0] == "10"
          ) {
            res.send({ uldegdel: khariu.Document.EnqRsp[0].ABal[0] });
          } else res.send({ uldegdel: 0 });
        },
        dans.baiguullagiinId
      );
    } else if (dans && dans.bank == "golomt") {
      var yawuulaxBody = { registerNo: dans.register, accountId: dans.dugaar };
      var khariu = await golomtServiceDuudya(
        dans,
        yawuulaxBody,
        "/v1/account/balance/inq",
        "ACCTBALINQ",
        next,
        req.body.tukhainBaaziinKholbolt
      );
      console.log("khariu", khariu);
      if (!!khariu && !!khariu.balanceLL && !!khariu.balanceLL.length > 0)
        khariu = khariu?.balanceLL[0].amount?.value?.toString();
      res.send(khariu);
    }
  } catch (err) {
    next(err);
  }
});

exports.bankniiKhuulgaTatajKhadgalya = asyncHandler(async (req, res, next) => {
  try {
    const { db } = require("zevbackv2");
    var kholboltuud = db.kholboltuud;
    var dansnuud;
    var firstDay;
    var lastDay;
    if (req && req.body && req.body.ognoo) {
      var ognoo = new Date(req.body.ognoo);
      firstDay = new Date(ognoo.getFullYear(), ognoo.getMonth(), 1);
      lastDay = new Date(ognoo.getFullYear(), ognoo.getMonth() + 1, 0);
    } else {
      firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      lastDay = new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        0
      );
    }
    if (kholboltuud) {
      for await (const kholbolt of kholboltuud) {
        if (!req)
          dansnuud = await Dans(kholbolt)
            .find({ corporateAshiglakhEsekh: true })
            .lean();
        else if (req.body.dansniiDugaar) {
          dansnuud = await Dans(kholbolt)
            .find({
              corporateAshiglakhEsekh: true,
              dugaar: req.body.dansniiDugaar,
            })
            .lean();
        }
        console.log("dansnuud", dansnuud);
        if (dansnuud)
          for await (const dans of dansnuud) {
            try {
              if (dans.bank == "khanbank") {
                var tokenObject = await Token(kholbolt).findOne({
                  turul: "khaanCorporate",
                  baiguullagiinId: dans.baiguullagiinId,
                  ognoo: { $gte: new Date(new Date().getTime() - 29 * 60000) },
                });
                var token;
                if (!tokenObject) {
                  tokenObject = await tokenAvya(
                    dans.corporateNevtrekhNer,
                    dans.corporateNuutsUg,
                    next,
                    dans.baiguullagiinId,
                    kholbolt
                  );
                  token = tokenObject.access_token;
                } else token = tokenObject.token;
                var query = [
                  {
                    $match: {
                      dansniiDugaar: dans.dugaar,
                      baiguullagiinId: dans.baiguullagiinId,
                    },
                  },
                  {
                    $group: {
                      _id: "$dansniiDugaar",
                      max: {
                        $max: {
                          $toInt: "$record",
                        },
                      },
                    },
                  },
                ];
                var max = await BankniiGuilgee(kholbolt).aggregate(query);
                var maxDugaar = 1;
                if (max && max.length !== 0) maxDugaar = max[0].max;
                var khariu = await dansniiKhuulgaAvya(token, next, {
                  baiguullagiinId: dans.baiguullagiinId,
                  barilgiinId: dans.barilgiinId,
                  dansniiDugaar: dans.dugaar,
                  ekhlekhOgnoo: "20220101",
                  duusakhOgnoo: "20221231",
                  khuudasniiKhemjee: 100,
                  khuudasniiDugaar: 0,
                  record: maxDugaar,
                });
                if (khariu && khariu.transactions) {
                  var guilgeenuud = [];
                  khariu.transactions.forEach((mur) =>
                    guilgeenuud.push(new BankniiGuilgee(kholbolt)(mur))
                  );
                  guilgeenuud.forEach((x) => {
                    x.dansniiDugaar = dans.dugaar;
                    x.baiguullagiinId = dans.baiguullagiinId;
                    x.barilgiinId = dans.barilgiinId;
                  });
                  BankniiGuilgee(kholbolt)
                    .insertMany(guilgeenuud)
                    .then((result) => {
                      if (res) res.send("Amjilttai");
                    })
                    .catch((err) => {
                      console.log(err);
                      next(err);
                    });
                }
              } else if (dans.bank == "tdb") {
                var query = [
                  {
                    $match: {
                      dansniiDugaar: dans.dugaar,
                      baiguullagiinId: dans.baiguullagiinId,
                    },
                  },
                  {
                    $group: {
                      _id: "$dansniiDugaar",
                      max: {
                        $max: {
                          $toDouble: "$NtryRef",
                        },
                      },
                    },
                  },
                ];
                var max = await BankniiGuilgee(kholbolt).aggregate(query);
                var maxDugaar = 100;
                if (max && max.length !== 0) maxDugaar = max[0].max;
                var khuseltiinDugaar = await Dugaarlalt(kholbolt).aggregate([
                  {
                    $match: {
                      turul: "tdbKhuselt",
                    },
                  },
                  {
                    $group: {
                      _id: "aaa",
                      max: {
                        $max: {
                          $toDouble: "$dugaar",
                        },
                      },
                    },
                  },
                ]);
                var maxKhuseltiinDugaar = 107;
                if (khuseltiinDugaar && khuseltiinDugaar.length !== 0)
                  maxKhuseltiinDugaar = khuseltiinDugaar[0].max;
                Dugaarlalt(kholbolt)
                  .findOneAndUpdate(
                    { turul: "tdbKhuselt" },
                    { $set: { dugaar: maxKhuseltiinDugaar + 1 } },
                    {
                      new: true,
                      upsert: true,
                    }
                  )
                  .then((resa) => console.log(resa))
                  .catch((err) => console.log(err));
                var textUseg = "A";
                if (dans.baiguullagiinId == "631595e9957b7d5ec013c076")
                  textUseg = "U";
                else if (dans.baiguullagiinId == "64fe8edc54a669717ad657ac")
                  textUseg = "K";
                else if (dans.baiguullagiinId == "65435cdff2f5358696c61454")
                  textUseg = "T";
                else if (dans.baiguullagiinId == "656f1719f28cde7f62bc5280")
                  textUseg = "P";
                else if (dans.baiguullagiinId == "6115f350b35689cdbf1b9da3")
                  textUseg = "I";

                khariu = await tdbDansniiKhuulgaAvya(
                  {
                    corporateBaiguullaga: dans.corporateBaiguullaga,
                    msgId:
                      "ZT" + textUseg + (await pad(maxKhuseltiinDugaar, 12)),
                    loginId: dans.corporateNevtrekhNer,
                    AnyBIC: dans.AnyBIC,
                    RoleID: dans.RoleID,
                    pwd: dans.corporateNuutsUg,
                    dansniiDugaar: dans.dugaar,
                    valyut: dans.valyut,
                    ekhlekhOgnoo:
                      firstDay.getFullYear() +
                      "-" +
                      (firstDay.getMonth() + 1) +
                      "-" +
                      firstDay.getDate(),
                    duusakhOgnoo:
                      lastDay.getFullYear() +
                      "-" +
                      (lastDay.getMonth() + 1) +
                      "-" +
                      lastDay.getDate(),
                    jurnaliinDugaar: await pad(
                      req && req.body && req.body.ognoo ? 0 : maxDugaar,
                      18
                    ),
                  },
                  next,
                  async (khariu) => {
                    if (
                      khariu &&
                      khariu.Document &&
                      khariu.Document.GrpHdr &&
                      khariu.Document.GrpHdr[0].RspCd &&
                      khariu.Document.GrpHdr[0].RspCd[0] == "10"
                    ) {
                      var guilgeenuud = [];
                      khariu.Document.EnqRsp[0].Ntry.forEach((mur) => {
                        //mur = await tdbKhuulgaKhurvuulekh(mur);
                        //console.log("mur", mur)
                        guilgeenuud.push(
                          new BankniiGuilgee(kholbolt)({
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
                            Amt: mur?.Amt[0],
                          })
                        );
                      });
                      guilgeenuud.forEach((x) => {
                        x.dansniiDugaar = dans.dugaar;
                        x.baiguullagiinId = dans.baiguullagiinId;
                        x.barilgiinId = dans.barilgiinId;
                      });
                      if (guilgeenuud) {
                        var ustgakhJagsaalt = [];
                        for await (const item of guilgeenuud) {
                          var guilgee = await BankniiGuilgee(kholbolt).findOne({
                            NtryRef: item.NtryRef,
                            barilgiinId: dans.barilgiinId,
                          });
                          if (guilgee) ustgakhJagsaalt.push(item);
                        }
                        if (!!ustgakhJagsaalt) {
                          guilgeenuud = guilgeenuud.filter(
                            (el) => !ustgakhJagsaalt.includes(el)
                          );
                        }
                      }
                      BankniiGuilgee(kholbolt)
                        .insertMany(guilgeenuud)
                        .then((result) => {
                          if (res) res.send("Amjilttai");
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                    } else {
                      console.log(
                        "khariu.Document.GrpHdr",
                        khariu.Document.GrpHdr
                      );
                    }
                  },
                  dans.baiguullagiinId
                );
              } else if (dans.bank == "golomt") {
                var max = await BankniiGuilgee(kholbolt)
                  .findOne({
                    barilgiinId: dans.barilgiinId,
                    dansniiDugaar: dans.dugaar,
                  })
                  .sort({ createdAt: -1 })
                  .limit(1);
                if (!!max) {
                  console.log("max baina", max);
                  console.log("max.tranDate", max.tranDate);
                  firstDay = new Date(max.tranDate);
                }
                var yawuulaxBody = {
                  registerNo: dans.register,
                  accountId: dans.dugaar,
                  startDate:
                    firstDay.getFullYear() +
                    "-" +
                    (firstDay.getMonth() < 9 ? "0" : "") +
                    (firstDay.getMonth() + 1) +
                    "-" +
                    (firstDay.getDate() < 10 ? "0" : "") +
                    firstDay.getDate(),
                  endDate:
                    lastDay.getFullYear() +
                    "-" +
                    (lastDay.getMonth() < 9 ? "0" : "") +
                    (lastDay.getMonth() + 1) +
                    "-" +
                    (lastDay.getDate() < 10 ? "0" : "") +
                    lastDay.getDate(),
                };
                console.log("yawuulaxBody", yawuulaxBody);
                var khariu = await golomtServiceDuudya(
                  dans,
                  yawuulaxBody,
                  "/v1/account/operative/statement",
                  "OPERACCTSTA",
                  next,
                  req.body.tukhainBaaziinKholbolt
                );
                console.log("khariu", khariu);
                if (
                  !!khariu &&
                  !!khariu.statements &&
                  khariu.statements.length > 0
                ) {
                  var guilgeenuud = [];
                  khariu.statements.forEach((mur) => {
                    guilgeenuud.push(
                      new BankniiGuilgee(kholbolt)({
                        requestId: mur?.requestId,
                        recNum: mur?.recNum,
                        tranId: mur?.tranId,
                        tranDate: mur?.tranDate,
                        drOrCr: mur?.drOrCr,
                        tranAmount: mur?.tranAmount,
                        tranDesc: mur?.tranDesc,
                        tranPostedDate: mur?.tranPostedDate,
                        tranCrnCode: mur?.tranCrnCode,
                        exchRate: mur?.exchRate,
                        balance: mur?.balance,
                        accName: mur?.accName,
                        accNum: mur?.accNum,
                      })
                    );
                  });
                  guilgeenuud.forEach((x) => {
                    x.dansniiDugaar = dans.dugaar;
                    x.baiguullagiinId = dans.baiguullagiinId;
                    x.barilgiinId = dans.barilgiinId;
                  });
                  if (guilgeenuud) {
                    var ustgakhJagsaalt = [];
                    for await (const item of guilgeenuud) {
                      var guilgee = await BankniiGuilgee(kholbolt).findOne({
                        tranId: item.tranId,
                        barilgiinId: dans.barilgiinId,
                      });
                      if (guilgee) ustgakhJagsaalt.push(item);
                    }
                    if (!!ustgakhJagsaalt) {
                      guilgeenuud = guilgeenuud.filter(
                        (el) => !ustgakhJagsaalt.includes(el)
                      );
                    }
                  }
                  BankniiGuilgee(kholbolt)
                    .insertMany(guilgeenuud)
                    .then((result) => {
                      if (res) res.send("Amjilttai");
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }
              }
            } catch (aldaaa) {
              console.log("tatax ued aldaa garlaa ==> ", aldaaa);
              continue;
            }
          }
        else if (res) res.status(200).send("Tatah guilgee baihgui!");
      }
    }
  } catch (err) {
    if (next) next(err);
  }
});

exports.tdbUldegdelShalgay = asyncHandler(async (req, res, next) => {
  var dans = req.body;
  var query = [
    {
      $match: {
        dansniiDugaar: dans.dugaar,
        baiguullagiinId: dans.baiguullagiinId,
      },
    },
    {
      $group: {
        _id: "$dansniiDugaar",
        max: {
          $max: {
            $toDouble: "$NtryRef",
          },
        },
      },
    },
  ];
  var max = await BankniiGuilgee(req.body.tukhainBaaziinKholbolt).aggregate(
    query
  );
  var maxDugaar = 100;
  if (max && max.length !== 0) maxDugaar = max[0].max;
  var khuseltiinDugaar = await Dugaarlalt(
    req.body.tukhainBaaziinKholbolt
  ).aggregate([
    {
      $match: {
        turul: "tdbKhuselt",
      },
    },
    {
      $group: {
        _id: "aaa",
        max: {
          $max: {
            $toDouble: "$dugaar",
          },
        },
      },
    },
  ]);
  var maxKhuseltiinDugaar = 107;
  if (khuseltiinDugaar && khuseltiinDugaar.length !== 0)
    maxKhuseltiinDugaar = khuseltiinDugaar[0].max;
  Dugaarlalt(req.body.tukhainBaaziinKholbolt)
    .findOneAndUpdate(
      { turul: "tdbKhuselt" },
      { $set: { dugaar: maxKhuseltiinDugaar + 1 } },
      {
        new: true,
        upsert: true,
      }
    )
    .then((resa) => console.log(resa))
    .catch((err) => console.log(err));
  var textUseg = "A";
  if (dans.baiguullagiinId == "631595e9957b7d5ec013c076") textUseg = "U";
  else if (dans.baiguullagiinId == "64fe8edc54a669717ad657ac") textUseg = "K";
  else if (dans.baiguullagiinId == "65435cdff2f5358696c61454") textUseg = "T";
  else if (dans.baiguullagiinId == "656f1719f28cde7f62bc5280") textUseg = "P";
  else if (dans.baiguullagiinId == "6115f350b35689cdbf1b9da3") textUseg = "I";
  tdbDansniiUldegdelAvya(
    {
      corporateBaiguullaga: dans.corporateBaiguullaga,
      msgId: "ZT" + textUseg + (await pad(maxKhuseltiinDugaar, 12)),
      loginId: dans.corporateNevtrekhNer,
      AnyBIC: dans.AnyBIC,
      RoleID: dans.RoleID,
      pwd: dans.corporateNuutsUg,
      dansniiDugaar: dans.dugaar,
      valyut: dans.valyut,
    },
    next,
    async (khariu) => {
      if (
        khariu &&
        khariu.Document &&
        khariu.Document.GrpHdr &&
        khariu.Document.GrpHdr[0].RspDesc
      )
        res.send({ msg: khariu.Document.GrpHdr[0].RspDesc[0] });
      else res.send({ msg: "Банктай холбогдох үед алдаа гарлаа!" });
    },
    dans.baiguullagiinId
  );
});

exports.bankniiKhuulgaTatyaOirkhon = asyncHandler(async () => {
  try {
    const { db } = require("zevbackv2");
    var kholboltuud = db.kholboltuud;
    var dansnuud;
    if (kholboltuud) {
      for await (const kholbolt of kholboltuud) {
        var firstDay;
        var lastDay;
        firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        lastDay = new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          0
        );
        dansnuud = await Dans(kholbolt)
          .find({
            corporateAshiglakhEsekh: true,
            oirkhonTatakhEsekh: true,
          })
          .lean();
        if (dansnuud)
          for await (const dans of dansnuud) {
            try {
              console.log("dans baina --------------------------");
              if (dans.bank == "khanbank") {
                var tokenObject = await Token(kholbolt).findOne({
                  turul: "khaanCorporate",
                  baiguullagiinId: dans.baiguullagiinId,
                  ognoo: { $gte: new Date(new Date().getTime() - 29 * 60000) },
                });
                var token;
                if (!tokenObject) {
                  tokenObject = await tokenAvya(
                    dans.corporateNevtrekhNer,
                    dans.corporateNuutsUg,
                    null,
                    dans.baiguullagiinId,
                    kholbolt
                  );
                  token = tokenObject.access_token;
                } else token = tokenObject.token;
                var query = [
                  {
                    $match: {
                      dansniiDugaar: dans.dugaar,
                      baiguullagiinId: dans.baiguullagiinId,
                    },
                  },
                  {
                    $group: {
                      _id: "$dansniiDugaar",
                      max: {
                        $max: {
                          $toInt: "$record",
                        },
                      },
                    },
                  },
                ];
                var max = await BankniiGuilgee(kholbolt).aggregate(query);
                var maxDugaar = 1;
                if (max && max.length !== 0) maxDugaar = max[0].max;
                var khariu = await dansniiKhuulgaAvya(token, next, {
                  baiguullagiinId: dans.baiguullagiinId,
                  barilgiinId: dans.barilgiinId,
                  dansniiDugaar: dans.dugaar,
                  ekhlekhOgnoo: "20230101",
                  duusakhOgnoo: "20231231",
                  khuudasniiKhemjee: 100,
                  khuudasniiDugaar: 0,
                  record: maxDugaar,
                });
                if (khariu && khariu.transactions) {
                  var guilgeenuud = [];
                  khariu.transactions.forEach((mur) =>
                    guilgeenuud.push(new BankniiGuilgee(kholbolt)(mur))
                  );
                  guilgeenuud.forEach((x) => {
                    x.dansniiDugaar = dans.dugaar;
                    x.baiguullagiinId = dans.baiguullagiinId;
                    x.barilgiinId = dans.barilgiinId;
                  });
                  BankniiGuilgee(kholbolt)
                    .insertMany(guilgeenuud)
                    .then((result) => {
                      if (res) res.send("Amjilttai");
                    })
                    .catch((err) => {
                      console.log(err);
                      next(err);
                    });
                }
              } else if (dans.bank == "tdb") {
                var query = [
                  {
                    $match: {
                      dansniiDugaar: dans.dugaar,
                      baiguullagiinId: dans.baiguullagiinId,
                    },
                  },
                  {
                    $group: {
                      _id: "$dansniiDugaar",
                      max: {
                        $max: {
                          $toDouble: "$NtryRef",
                        },
                      },
                    },
                  },
                ];
                var max = await BankniiGuilgee(kholbolt).aggregate(query);
                var maxDugaar = 100;
                if (max && max.length !== 0) maxDugaar = max[0].max;
                var khuseltiinDugaar = await Dugaarlalt(kholbolt).aggregate([
                  {
                    $match: {
                      turul: "tdbKhuselt",
                    },
                  },
                  {
                    $group: {
                      _id: "aaa",
                      max: {
                        $max: {
                          $toDouble: "$dugaar",
                        },
                      },
                    },
                  },
                ]);
                var maxKhuseltiinDugaar = 107;
                if (khuseltiinDugaar && khuseltiinDugaar.length !== 0)
                  maxKhuseltiinDugaar = khuseltiinDugaar[0].max;
                Dugaarlalt(kholbolt)
                  .findOneAndUpdate(
                    { turul: "tdbKhuselt" },
                    { $set: { dugaar: maxKhuseltiinDugaar + 1 } },
                    {
                      new: true,
                      upsert: true,
                    }
                  )
                  .then((resa) => console.log(resa))
                  .catch((err) => console.log(err));
                var textUseg = "A";
                if (dans.baiguullagiinId == "631595e9957b7d5ec013c076")
                  textUseg = "U";
                else if (dans.baiguullagiinId == "64fe8edc54a669717ad657ac")
                  textUseg = "K";
                else if (dans.baiguullagiinId == "65435cdff2f5358696c61454")
                  textUseg = "T";
                else if (dans.baiguullagiinId == "656f1719f28cde7f62bc5280")
                  textUseg = "P";
                else if (dans.baiguullagiinId == "6115f350b35689cdbf1b9da3")
                  textUseg = "I";
                khariu = await tdbDansniiKhuulgaAvya(
                  {
                    corporateBaiguullaga: dans.corporateBaiguullaga,
                    msgId:
                      "ZT" + textUseg + (await pad(maxKhuseltiinDugaar, 12)),
                    loginId: dans.corporateNevtrekhNer,
                    AnyBIC: dans.AnyBIC,
                    RoleID: dans.RoleID,
                    pwd: dans.corporateNuutsUg,
                    dansniiDugaar: dans.dugaar,
                    valyut: dans.valyut,
                    ekhlekhOgnoo:
                      firstDay.getFullYear() +
                      "-" +
                      (firstDay.getMonth() + 1) +
                      "-" +
                      firstDay.getDate(),
                    duusakhOgnoo:
                      lastDay.getFullYear() +
                      "-" +
                      (lastDay.getMonth() + 1) +
                      "-" +
                      lastDay.getDate(),
                    jurnaliinDugaar: await pad(maxDugaar, 18),
                  },
                  null,
                  async (khariu) => {
                    if (
                      khariu &&
                      khariu.Document &&
                      khariu.Document.GrpHdr &&
                      khariu.Document.GrpHdr[0].RspCd &&
                      khariu.Document.GrpHdr[0].RspCd[0] == "10"
                    ) {
                      var guilgeenuud = [];
                      khariu.Document.EnqRsp[0].Ntry.forEach((mur) => {
                        guilgeenuud.push(
                          new BankniiGuilgee(kholbolt)({
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
                            Amt: mur?.Amt[0],
                          })
                        );
                      });
                      guilgeenuud.forEach((x) => {
                        x.dansniiDugaar = dans.dugaar;
                        x.baiguullagiinId = dans.baiguullagiinId;
                        x.barilgiinId = dans.barilgiinId;
                      });
                      if (guilgeenuud) {
                        var ustgakhJagsaalt = [];
                        for await (const item of guilgeenuud) {
                          if (!!dans.zogsooliinId) {
                            var url =
                              "http://" +
                              process.env.UNDSEN_IP +
                              ":" +
                              process.env.PORT +
                              "/zogsooliinTulburOrjIrlee";
                            axios
                              .post(url, {
                                baiguullagiinId: dans.baiguullagiinId,
                                tulsunDun: item.Amt,
                                zogsooliinId: dans.zogsooliinId,
                              })
                              .catch(function (error) {});
                          }
                          var guilgee = await BankniiGuilgee(kholbolt).findOne({
                            NtryRef: item.NtryRef,
                            barilgiinId: dans.barilgiinId,
                          });
                          if (guilgee) ustgakhJagsaalt.push(item);
                        }
                        if (!!ustgakhJagsaalt) {
                          guilgeenuud = guilgeenuud.filter(
                            (el) => !ustgakhJagsaalt.includes(el)
                          );
                        }
                      }
                      await BankniiGuilgee(kholbolt)
                        .insertMany(guilgeenuud)
                        .then((result) => {
                          console.log("amjilttai");
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                    }
                  },
                  dans.baiguullagiinId
                );
              } else if (dans.bank == "golomt") {
                var max = await BankniiGuilgee(kholbolt)
                  .findOne({
                    barilgiinId: dans.barilgiinId,
                    dansniiDugaar: dans.dugaar,
                  })
                  .sort({ createdAt: -1 })
                  .limit(1);
                if (!!max) {
                  firstDay = new Date(max.tranDate);
                }
                var yawuulaxBody = {
                  registerNo: dans.register,
                  accountId: dans.dugaar,
                  startDate:
                    firstDay.getFullYear() +
                    "-" +
                    (firstDay.getMonth() < 9 ? "0" : "") +
                    (firstDay.getMonth() + 1) +
                    "-" +
                    (firstDay.getDate() < 10 ? "0" : "") +
                    firstDay.getDate(),
                  endDate:
                    lastDay.getFullYear() +
                    "-" +
                    (lastDay.getMonth() < 9 ? "0" : "") +
                    (lastDay.getMonth() + 1) +
                    "-" +
                    (lastDay.getDate() < 10 ? "0" : "") +
                    lastDay.getDate(),
                };
                var khariu = await golomtServiceDuudya(
                  dans,
                  yawuulaxBody,
                  "/v1/account/operative/statement",
                  "OPERACCTSTA",
                  null,
                  kholbolt
                );
                console.log("khariu", khariu);
                if (
                  !!khariu &&
                  !!khariu.statements &&
                  khariu.statements.length > 0
                ) {
                  var guilgeenuud = [];
                  khariu.statements.forEach((mur) => {
                    guilgeenuud.push(
                      new BankniiGuilgee(kholbolt)({
                        requestId: mur?.requestId,
                        recNum: mur?.recNum,
                        tranId: mur?.tranId,
                        tranDate: mur?.tranDate,
                        drOrCr: mur?.drOrCr,
                        tranAmount: mur?.tranAmount,
                        tranDesc: mur?.tranDesc,
                        tranPostedDate: mur?.tranPostedDate,
                        tranCrnCode: mur?.tranCrnCode,
                        exchRate: mur?.exchRate,
                        balance: mur?.balance,
                        accName: mur?.accName,
                        accNum: mur?.accNum,
                      })
                    );
                  });
                  guilgeenuud.forEach((x) => {
                    x.dansniiDugaar = dans.dugaar;
                    x.baiguullagiinId = dans.baiguullagiinId;
                    x.barilgiinId = dans.barilgiinId;
                  });
                  if (guilgeenuud) {
                    var ustgakhJagsaalt = [];
                    for await (const item of guilgeenuud) {
                      var guilgee = await BankniiGuilgee(kholbolt).findOne({
                        tranId: item.tranId,
                        barilgiinId: dans.barilgiinId,
                      });
                      if (guilgee) ustgakhJagsaalt.push(item);
                    }
                    if (!!ustgakhJagsaalt) {
                      guilgeenuud = guilgeenuud.filter(
                        (el) => !ustgakhJagsaalt.includes(el)
                      );
                    }
                  }
                  for await (const item of guilgeenuud) {
                    if (!!dans.zogsooliinId) {
                      var url =
                        "http://" +
                        process.env.UNDSEN_IP +
                        ":" +
                        process.env.PORT +
                        "/zogsooliinTulburOrjIrlee";
                      axios
                        .post(url, {
                          baiguullagiinId: dans.baiguullagiinId,
                          tulsunDun: item.tranAmount,
                          zogsooliinId: dans.zogsooliinId,
                        })
                        .catch(function (error) {});
                    }
                  }
                  BankniiGuilgee(kholbolt)
                    .insertMany(guilgeenuud)
                    .then((result) => {
                      console.log("golomt xuulga tatsan");
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }
              }
            } catch (aldaaa) {
              console.log("tatax ued aldaa garlaa ==> ", aldaaa);
              continue;
            }
          }
        else if (res) res.status(200).send("Tatah guilgee baihgui!");
      }
    }
  } catch (err) {
    console.log("oirxon xuulga tatya ==>", err);
  }
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
