const asyncHandler = require("express-async-handler");
const aldaa = require("../components/aldaa");
const BankniiGuilgee = require("../models/bankniiGuilgee");
const Baiguullaga = require("../models/baiguullaga");
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
  barilgiinId,
  tukhainBaaziinKholbolt
) {
  try {
    var url = new URL(
      "https://api.khanbank.com/v1/auth/token?grant_type=client_credentials"
    );
    url.username = username;
    url.password = password;
    const response = await instance.post(url).catch((err) => {
      console.log("khanbank tokenAvya err " + err.message);
      throw err;
    });
    var qeury = { turul: "khaanCorporate", baiguullagiinId: baiguullagiinId };
    if(!!barilgiinId)
      qeury["barilgiinId"] = barilgiinId;
    var khariu = JSON.parse(response.body);
    Token(tukhainBaaziinKholbolt)
      .updateOne(
        qeury,
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
      ognoo: { $gte: new Date(new Date().getTime() - 290000) }, //29 * 60000) }, 30min aldaa zaagad baina golomt deer
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

async function bogdTokentAvya(dans, tukhainBaaziinKholbolt){
  
  var tokenObject = await Token(tukhainBaaziinKholbolt).findOne({
    turul: "bogd",
    baiguullagiinId: dans.baiguullagiinId,
    ognoo: { $gte: new Date(new Date().getTime() - 590000) }, //59 * 60000) }, 
  });
  if(!tokenObject)
  {
    const paramsVal = new URLSearchParams("username=" + dans.corporateNevtrekhNer + "&password=" + dans.corporateNuutsUg);
    const response = await got.post(process.env.BOGD_SERVER + "authentication/login", { 
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8", "lang_code": "MN", }, 
      body: paramsVal.toString(), 
    })
    .catch((err) => {
      console.log("error " + err.message);
      throw err;
    });
    var khariu = JSON.parse(response.body);
      Token(tukhainBaaziinKholbolt)
        .updateOne(
          { turul: "bogd", baiguullagiinId: dans.baiguullagiinId },
          {
            ognoo: new Date(),
            token: khariu.data.access_token,
          },
          { upsert: true }
        )
        .then((x) => {
          console.log(x);
        })
        .catch((e) => {
          console.log(e);
        });
      return khariu.data.access_token;
    }
    else
      return tokenObject?.token;
}

async function transTokenAvya(dans, tukhainBaaziinKholbolt) {
  try {
    var tokenObject = await Token(tukhainBaaziinKholbolt).findOne({
      turul: "trans",
      ognoo: { $gte: new Date(new Date().getTime() - 590000) }, //59 * 60000) },
    });
    if (!tokenObject) {
      var url =
        process.env.TRANS_SERVER +
        "/getToken?apikey=" +
        (dans.apikey ? dans.apikey : "p_uZ6A"); //=p_uZ6A
      const response = await got
        .post(url, {
          headers: {
            "Content-Type": "application/json",
          },
          json: {
            username: dans.corporateNevtrekhNer,
            password: dans.corporateNuutsUg, //"9900022424"
          },
        })
        .catch((err) => {
          console.log("error " + err.message);
          throw err;
        });
      var khariu = JSON.parse(response.body);
      tokenObject = khariu;
      Token(tukhainBaaziinKholbolt)
        .updateOne(
          { turul: "trans" },
          {
            ognoo: new Date(),
            token: khariu.result,
          },
          { upsert: true }
        )
        .then((x) => {
          console.log(x);
        })
        .catch((e) => {
          console.log(e);
        });
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
    var a = JSON.stringify(yawuulaxBody);
    var hash = CryptoJS.SHA256(a.toString());
    var hex = hash.toString(CryptoJS.enc.Hex);
    console.log("sessionKey ------------>>>" + sessionKey);
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
    var url = "https://api.khanbank.com/v1/statements/" + body.dansniiDugaar;
    if(body.record)
      url = url + "/record?record=" + body.record;
    const context = {
      token: "Bearer " + token,
    };
    console.log("url -------------------->>" + JSON.stringify(url));
    const response = await instance.get(url, { context });
    if (!response.body) {
      if (next) next(new aldaa("Татах хуулга байхгүй"));
      else return null;
    }
    return JSON.parse(response?.body);
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
      var query = {
        turul: "khaanCorporate",
        baiguullagiinId: dans.baiguullagiinId,
        ognoo: { $gte: new Date(new Date().getTime() - 29 * 60000) },
      }
      if(dans.corporateBarilgaTusBur && !!dans.barilgiinId)
        query["barilgiinId"] = dans.barilgiinId
      var tokenObject = await Token(req.body.tukhainBaaziinKholbolt).findOne(query);
      var token;
      if (!tokenObject) {
        tokenObject = await tokenAvya(
          dans.corporateNevtrekhNer,
          dans.corporateNuutsUg,
          next,
          dans.baiguullagiinId,
          dans.corporateBarilgaTusBur ? dans.barilgiinId : null,
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
      khariu = khariu?.accounts?.filter(
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
      if (!!khariu && !!khariu.balanceLL && !!khariu.balanceLL.length > 0)
        khariu = { uldegdel: khariu?.balanceLL[0].amount?.value };
      res.send(khariu);
    } else if (dans && dans.bank == "trans") {
      var tokenObject = await transTokenAvya(
        dans,
        req.body.tukhainBaaziinKholbolt
      );
      var url =
        process.env.TRANS_SERVER +
        "/getAccountBalance?apikey=" +
        (dans.apikey ? dans.apikey : "p_uZ6A");
      const response = await got
        .post(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + tokenObject.token,
          },
          json: {
            acnt_code: dans.dugaar, //"MN660019009090003918"
          },
        })
        .catch((err) => {
          console.log("error " + err.message);
          throw err;
        });
      var khariu = JSON.parse(response.body);
      tokenObject = khariu;
      return res.send(tokenObject);
    } else if (dans && dans.bank == "bogd") {
      var tokenObject = await bogdTokentAvya(dans, req.body.tukhainBaaziinKholbolt);
      const response = await got
        .post(process.env.BOGD_SERVER + "api/accounts", {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            "lang_code": "MN",
            Authorization: "Bearer " + tokenObject,
          },
        })
        .catch((err) => {
          console.log("error " + err.message);
          throw err;
        });
      var khariu = JSON.parse(response.body);
      var khariltsakh = khariu?.data?.types[0].accounts?.filter((e) => e.accountNo === dans.dugaar)[0];
      res.send({ uldegdel: khariltsakh?.balance });
    }
  } catch (err) {
    next(err);
  }
});

exports.bankniiKhuulgaTatajKhadgalya = asyncHandler(async (req, res, next) => {
  try {
    var kholboltuud;

    const { db } = require("zevbackv2");
    if (!!req?.body?.tukhainBaaziinKholbolt) {
      kholboltuud = [req.body.tukhainBaaziinKholbolt];
    } else {
      kholboltuud = db.kholboltuud;
    }
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
            .find({ corporateAshiglakhEsekh: true, oirkhonTatakhEsekh: { $exists: false }, })
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
                var query = {
                  turul: "khaanCorporate",
                  baiguullagiinId: dans.baiguullagiinId,
                  ognoo: { $gte: new Date(new Date().getTime() - 29 * 60000) },
                }
                if(dans.corporateBarilgaTusBur && !!dans.barilgiinId)
                  query["barilgiinId"] = dans.barilgiinId
                var tokenObject = await Token(kholbolt).findOne(query);
                var token;
                if (!tokenObject) {
                  tokenObject = await tokenAvya(
                    dans.corporateNevtrekhNer,
                    dans.corporateNuutsUg,
                    next,
                    dans.baiguullagiinId,
                    dans.corporateBarilgaTusBur ? dans.barilgiinId : null,
                    kholbolt
                  );
                  token = tokenObject?.access_token;
                } else token = tokenObject.token;
                var query = [
                  {
                    $match: {
                      dansniiDugaar: dans.dugaar,
                      baiguullagiinId: dans.baiguullagiinId,
                      barilgiinId: dans.barilgiinId,
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
                console.log("max --------------->" + JSON.stringify(max));
                var bodyKhuulga = {
                  baiguullagiinId: dans.baiguullagiinId,
                  barilgiinId: dans.barilgiinId,
                  dansniiDugaar: dans.dugaar,
                }
                if (max && max.length !== 0) bodyKhuulga["record"] = max[0].max;
                var khariu = await dansniiKhuulgaAvya(token, next, bodyKhuulga);

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
                  if (guilgeenuud) {
                    var ustgakhJagsaalt = [];
                    for await (const item of guilgeenuud) {
                      var guilgee = await BankniiGuilgee(kholbolt).findOne({
                        record: item.record,
                        code: item.code,
                        branch: item.branch,
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
                        "khariu.Document.GrpHdr ",
                        JSON.stringify(khariu.Document.GrpHdr, null, 4)
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
                console.log("------   yawuulaxBody  --->>" + JSON.stringify(yawuulaxBody));
                var khariu = await golomtServiceDuudya(
                  dans,
                  yawuulaxBody,
                  "/v1/account/operative/statement",
                  "OPERACCTSTA",
                  next,
                  kholbolt
                );
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
              } else if (dans.bank == "trans") {
                var tokenObject = await transTokenAvya(
                  dans,
                  req.body.tukhainBaaziinKholbolt
                );
                var url =
                  process.env.TRANS_SERVER +
                  "/getStatement?apikey=" +
                  (dans.apikey ? dans.apikey : "p_uZ6A");
                var max = await BankniiGuilgee(kholbolt)
                  .findOne({
                    barilgiinId: dans.barilgiinId,
                    dansniiDugaar: dans.dugaar,
                  })
                  .sort({ createdAt: -1 })
                  .limit(1);
                if (!!max) {
                  firstDay = new Date(max.txnDate);
                }
                const response = await got
                  .post(url, {
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: "Bearer " + tokenObject.token,
                    },
                    json: {
                      acnt_code: dans.dugaar, //"MN660019009090003918"
                      start_date:
                        firstDay.getFullYear() +
                        "-" +
                        (firstDay.getMonth() < 9 ? "0" : "") +
                        (firstDay.getMonth() + 1) +
                        "-" +
                        (firstDay.getDate() < 10 ? "0" : "") +
                        firstDay.getDate(),
                      end_date:
                        lastDay.getFullYear() +
                        "-" +
                        (lastDay.getMonth() < 9 ? "0" : "") +
                        (lastDay.getMonth() + 1) +
                        "-" +
                        (lastDay.getDate() < 10 ? "0" : "") +
                        lastDay.getDate(),
                      start_paging_position: 0,
                      page_row_count: 100,
                    },
                  })
                  .catch((err) => {
                    console.log("error " + err.message);
                    throw err;
                  });
                var khariu = JSON.parse(response.body);

                if (
                  !!khariu &&
                  !!khariu.result &&
                  !!khariu.result.txns &&
                  khariu.result.txns.length > 0
                ) {
                  var guilgeenuud = [];
                  khariu.result.txns.forEach((mur) => {
                    guilgeenuud.push(
                      new BankniiGuilgee(kholbolt)({
                        jrno: mur?.jrno,
                        jritemNo: mur?.jritemNo,
                        contCurRate: mur?.contCurRate,
                        username: mur?.username,
                        userId: mur?.userId,
                        userBrchCode: mur?.userBrchCode,
                        txnCode: mur?.txnCode,
                        txnNo: mur?.txnNo,
                        balTypeCode: mur?.balTypeCode,
                        income: mur?.income,
                        outcome: mur?.outcome,
                        curCode: mur?.curCode,
                        curRate: mur?.curRate,
                        contAcntName: mur?.contAcntName,
                        contAcntCode: mur?.contAcntCode,
                        contBankAcntCode: mur?.contBankAcntCode,
                        contBankAcntName: mur?.contBankAcntName,
                        txnDesc: mur?.txnDesc,
                        txnDate: mur?.txnDate,
                        postDate: mur?.postDate,
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
                        jrno: item.jrno,
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
              } else if (dans.bank == "bogd") {
                var tokenObject = await bogdTokentAvya(dans, kholbolt);
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
                const paramsVal = new URLSearchParams("account_no=" + dans.dugaar + 
                  "&start_date=" + firstDay.getFullYear() + "-" + (firstDay.getMonth() < 9 ? "0" : "") + (firstDay.getMonth() + 1) + "-" + (firstDay.getDate() < 10 ? "0" : "") + firstDay.getDate() +
                  "&end_date=" + lastDay.getFullYear() + "-" + (lastDay.getMonth() < 9 ? "0" : "") + (lastDay.getMonth() + 1) + "-" + (lastDay.getDate() < 10 ? "0" : "") + lastDay.getDate());
                const response = await got
                  .post(process.env.BOGD_SERVER + "api/statement", {
                    headers: {
                      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                      "lang_code": "MN",
                      Authorization: "Bearer " + tokenObject,
                    },
                    body: paramsVal.toString(),
                  })
                  .catch((err) => {
                    console.log("error " + err.message);
                    throw err;
                  });
                var khariu = JSON.parse(response.body);
                var guilgeenuud = [];
                if(khariu?.data?.transactions?.length > 0)
                {
                  khariu?.data?.transactions.forEach((mur) => {
                    var postedDate = new Date(mur?.date);
                    postedDate.setHours(mur?.time?.split(":")[0]);
                    postedDate.setMinutes(mur?.time?.split(":")[1]);
                    postedDate.setSeconds(mur?.time?.split(":")[2]);
                    guilgeenuud.push(
                      new BankniiGuilgee(kholbolt)({
                      requestId: mur?.txn_id,
                      recNum: mur?.txn_no,
                      tranId: mur?.txn_id,
                      tranDate: new Date(mur?.date),
                      drOrCr: "Credit",
                      amount: mur?.debit,
                      description: mur?.description,
                      tranPostedDate: postedDate,
                      tranCrnCode: mur?.currency,
                      exchRate: 1,
                      balance: mur?.balance_after,
                      beforeBalance: mur?.balance_before,
                      accName: mur?.to_acc_name,
                      accNum: mur?.to_acc_no,
                      relatedAccount: mur?.to_acc_no,
                      time: mur?.time,
                      })
                    );
                  });  
                }
                guilgeenuud.forEach((x) => {
                  x.dansniiDugaar = dans.dugaar;
                  x.baiguullagiinId = dans.baiguullagiinId;
                  x.barilgiinId = dans.barilgiinId;
                });
                if (guilgeenuud) {
                  var ustgakhJagsaalt = [];
                  for await (const item of guilgeenuud) {
                    var guilgee = await BankniiGuilgee(kholbolt).findOne({
                      requestId: item.requestId,
                      recNum: item.recNum,
                      dansniiDugaar: item.dansniiDugaar,
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
              if (dans.bank == "khanbank") {
                var query = {
                  turul: "khaanCorporate",
                  baiguullagiinId: dans.baiguullagiinId,
                  ognoo: { $gte: new Date(new Date().getTime() - 29 * 60000) },
                }
                if(dans.corporateBarilgaTusBur && !!dans.barilgiinId)
                  query["barilgiinId"] = dans.barilgiinId
                var tokenObject = await Token(kholbolt).findOne(query);
                var token;
                if (!tokenObject) {
                  tokenObject = await tokenAvya(
                    dans.corporateNevtrekhNer,
                    dans.corporateNuutsUg,
                    null,
                    dans.baiguullagiinId,
                    dans.corporateBarilgaTusBur ? dans.barilgiinId : null,
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
                var khariu = await dansniiKhuulgaAvya(token, null, {
                  baiguullagiinId: dans.baiguullagiinId,
                  barilgiinId: dans.barilgiinId,
                  dansniiDugaar: dans.dugaar,
                  record: maxDugaar === 1 ? null : maxDugaar,  
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
                  if (guilgeenuud) {
                    var ustgakhJagsaalt = [];
                    for await (const item of guilgeenuud) {
                      var guilgee = await BankniiGuilgee(kholbolt).findOne({
                        record: item.record,
                        code: item.code,
                        branch: item.branch,
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
                          barilgiinId: dans.barilgiinId,
                          tulsunDun: item.amount,
                          zogsooliinId: dans.zogsooliinId,
                          nemeltUtga :item.description
                        })
                        .catch(function (error) {});
                    }
                    if(!!dans.zogsooliinId && dans.baiguullagiinId === "65435cdff2f5358696c61454") // GTHub dotor garakh
                    {
                      var url =
                        "http://" +
                        process.env.UNDSEN_IP +
                        ":" +
                        process.env.PORT +
                        "/zogsooliinTulburOrjIrlee";
                      axios
                        .post(url, {
                          baiguullagiinId: dans.baiguullagiinId,
                          barilgiinId: dans.barilgiinId,
                          tulsunDun: item.amount,
                          zogsooliinId: "655599400445b0f0de65267c",
                          nemeltUtga :item.description
                        })
                        .catch(function (error) {});
                    }
                  }
                  BankniiGuilgee(kholbolt)
                    .insertMany(guilgeenuud)
                    .then((result) => {
                      console.log("khaan xuulga tatsan");
                      // if (res) res.send("Amjilttai");
                    })
                    .catch((err) => {
                      console.log(err);
                      // next(err);
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
                                barilgiinId: dans.barilgiinId,
                                tulsunDun: item.Amt,
                                zogsooliinId: dans.zogsooliinId,
                                nemeltUtga :item.TxAddInf
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
                        tranPostedDate: new Date(mur?.tranPostedDate),
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
                          barilgiinId: dans.barilgiinId,
                          tulsunDun: item.tranAmount,
                          zogsooliinId: dans.zogsooliinId,
                          nemeltUtga : item.tranDesc
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
              } else if (dans.bank == "trans") {
                var tokenObject = await transTokenAvya(dans, kholbolt);
                var url =
                  process.env.TRANS_SERVER +
                  "/getStatement?apikey=" +
                  (dans.apikey ? dans.apikey : "p_uZ6A");
                var max = await BankniiGuilgee(kholbolt)
                  .findOne({
                    barilgiinId: dans.barilgiinId,
                    dansniiDugaar: dans.dugaar,
                  })
                  .sort({ createdAt: -1 })
                  .limit(1);
                if (!!max) {
                  firstDay = new Date(max.txnDate);
                }
                const response = await got
                  .post(url, {
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: "Bearer " + tokenObject.token,
                    },
                    json: {
                      acnt_code: dans.dugaar, //"MN660019009090003918"
                      start_date:
                        firstDay.getFullYear() +
                        "-" +
                        (firstDay.getMonth() < 9 ? "0" : "") +
                        (firstDay.getMonth() + 1) +
                        "-" +
                        (firstDay.getDate() < 10 ? "0" : "") +
                        firstDay.getDate(),
                      end_date:
                        lastDay.getFullYear() +
                        "-" +
                        (lastDay.getMonth() < 9 ? "0" : "") +
                        (lastDay.getMonth() + 1) +
                        "-" +
                        (lastDay.getDate() < 10 ? "0" : "") +
                        lastDay.getDate(),
                      start_paging_position: 0,
                      page_row_count: 100,
                    },
                  })
                  .catch((err) => {
                    console.log("error " + err.message);
                    throw err;
                  });
                var khariu = JSON.parse(response.body);

                if (
                  !!khariu &&
                  !!khariu.result &&
                  !!khariu.result.txns &&
                  khariu.result.txns.length > 0
                ) {
                  var guilgeenuud = [];
                  khariu.result.txns.forEach((mur) => {
                    guilgeenuud.push(
                      new BankniiGuilgee(kholbolt)({
                        jrno: mur?.jrno,
                        jritemNo: mur?.jritemNo,
                        contCurRate: mur?.contCurRate,
                        username: mur?.username,
                        userId: mur?.userId,
                        userBrchCode: mur?.userBrchCode,
                        txnCode: mur?.txnCode,
                        txnNo: mur?.txnNo,
                        balTypeCode: mur?.balTypeCode,
                        income: mur?.income,
                        outcome: mur?.outcome,
                        curCode: mur?.curCode,
                        curRate: mur?.curRate,
                        contAcntName: mur?.contAcntName,
                        contAcntCode: mur?.contAcntCode,
                        contBankAcntCode: mur?.contBankAcntCode,
                        contBankAcntName: mur?.contBankAcntName,
                        txnDesc: mur?.txnDesc,
                        txnDate: mur?.txnDate,
                        postDate: mur?.postDate,
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
                        jrno: item.jrno,
                        barilgiinId: dans.barilgiinId,
                      });
                      if (guilgee) ustgakhJagsaalt.push(item);
                    }
                    if (!!ustgakhJagsaalt) {
                      guilgeenuud = guilgeenuud.filter(
                        (el) => !ustgakhJagsaalt.includes(el)
                      );
                    }
                    for await (const item of guilgeenuud) {
                      if (!!dans.zogsooliinId && item.income > 0) {
                        var url =
                          "http://" +
                          process.env.UNDSEN_IP +
                          ":" +
                          process.env.PORT +
                          "/zogsooliinTulburOrjIrlee";
                        axios
                          .post(url, {
                            baiguullagiinId: dans.baiguullagiinId,
                            barilgiinId: dans.barilgiinId,
                            tulsunDun: item.income,
                            zogsooliinId: dans.zogsooliinId,
                            nemeltUtga : item.txnDesc
                          })
                          .catch(function (error) {});
                      }
                    }
                  }
                  BankniiGuilgee(kholbolt)
                    .insertMany(guilgeenuud)
                    .then((result) => {
                      console.log("trans xuulga tatsan");
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }
              } else if (dans.bank == "bogd") {
                var tokenObject = await bogdTokentAvya(dans, kholbolt);
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
                const paramsVal = new URLSearchParams("account_no=" + dans.dugaar + 
                  "&start_date=" + firstDay.getFullYear() + "-" + (firstDay.getMonth() < 9 ? "0" : "") + (firstDay.getMonth() + 1) + "-" + (firstDay.getDate() < 10 ? "0" : "") + firstDay.getDate() +
                  "&end_date=" + lastDay.getFullYear() + "-" + (lastDay.getMonth() < 9 ? "0" : "") + (lastDay.getMonth() + 1) + "-" + (lastDay.getDate() < 10 ? "0" : "") + lastDay.getDate());
                const response = await got
                  .post(process.env.BOGD_SERVER + "api/statement", {
                    headers: {
                      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                      "lang_code": "MN",
                      Authorization: "Bearer " + tokenObject,
                    },
                    body: paramsVal.toString(),
                  })
                  .catch((err) => {
                    console.log("error " + err.message);
                    throw err;
                  });
                var khariu = JSON.parse(response.body);
                var guilgeenuud = [];
                if(khariu?.data?.transactions?.length > 0)
                {
                  khariu?.data?.transactions.forEach((mur) => {
                    var postedDate = new Date(mur?.date);
                    postedDate.setHours(mur?.time?.split(":")[0]);
                    postedDate.setMinutes(mur?.time?.split(":")[1]);
                    postedDate.setSeconds(mur?.time?.split(":")[2]);
                    guilgeenuud.push(
                      new BankniiGuilgee(kholbolt)({
                      requestId: mur?.txn_id,
                      recNum: mur?.txn_no,
                      tranId: mur?.txn_id,
                      tranDate: new Date(mur?.date),
                      drOrCr: "Credit",
                      amount: mur?.debit,
                      description: mur?.description,
                      tranPostedDate: postedDate,
                      tranCrnCode: mur?.currency,
                      exchRate: 1,
                      balance: mur?.balance_after,
                      beforeBalance: mur?.balance_before,
                      accName: mur?.to_acc_name,
                      accNum: mur?.to_acc_no,
                      relatedAccount: mur?.to_acc_no,
                      time: mur?.time,
                      })
                    );
                  });  
                }
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
                    });
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

exports.davkhardsanMashinTseverlye = asyncHandler(async (req, res, next) => {
  try 
  {
    const { db } = require("zevbackv2");
    var kholboltuud = db.kholboltuud;
    if (!!req?.body?.tukhainBaaziinKholbolt) {
      kholboltuud = [req.body.tukhainBaaziinKholbolt];
    } else {
      kholboltuud = db.kholboltuud;
    }
    var baiguullaguud = await Baiguullaga(db.erunkhiiKholbolt).find({"tokhirgoo.davkharsanMDTSDavtamjSecond": { $exists: true, } });
    if(baiguullaguud?.length > 0 && kholboltuud)
    {
      var query = {
        "tuukh.garsanKhaalga": {
          $exists: false,
        },
        "tuukh.tsagiinTuukh.garsanTsag": { 
          $exists: false, 
        },
        "tuukh.tuluv": {
          $ne: -2,
        },
      }
      for await (const baiguullaga of baiguullaguud) {
        if(req?.body?.umnukhUgugdulTseverlekh)
        {
          query["tuukh.tsagiinTuukh.orsonTsag"] = {
            $lt: new Date(Date.now() - (baiguullaga?.tokhirgoo?.davkharsanMDTSDavtamjSecond * 1000)),
          }
        }
        else
          query["tuukh.tsagiinTuukh.orsonTsag"] = {
            $gte: new Date(Date.now() - (baiguullaga?.tokhirgoo?.davkharsanMDTSDavtamjSecond * 1000)),
            $lt: new Date(),
          }

        var kholbolt = kholboltuud.find((a) => a.baiguullagiinId == baiguullaga._id.toString());
        var groupCounts = await Uilchluulegch(kholbolt).aggregate([
          {
            $match: {
              baiguullagiinId: baiguullaga._id.toString(),
            },
          },
          {
            $unwind: "$tuukh",
          },
          {
            $match: query,
          },
          {
            $group: {
              _id: "$mashiniiDugaar",
              too: {
                $sum: 1,
              },
            },
          },
        ]);
        if(groupCounts?.length > 0)
        {
          var filterGroupCounts = groupCounts?.filter((a) => a.too > 1);
          if(filterGroupCounts?.length > 0)
          {
            for await (const groupCount of filterGroupCounts)
            {
              query["mashiniiDugaar"] = groupCount._id;
              const uilchluulegchuud = await Uilchluulegch(kholbolt).find(query).sort({ createdAt: -1 });
              uilchluulegchuud?.shift();
              await Uilchluulegch(kholbolt).deleteMany({ _id: { $in: uilchluulegchuud?.map((e) => e._id) }, });
            }
          }
        }
      }	
    }
    if(res) res.send("Amjilttai");
  }
  catch (err) {
	  console.log("davkhardsan Mashin Tseverlye log err ==>", err);
    if (next) next(err);
  }
});
