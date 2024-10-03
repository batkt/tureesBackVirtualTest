const express = require("express");
const router = express.Router();
const MailiinZagvar = require("../models/mailiinZagvar");
const Baiguullaga = require("../models/baiguullaga");
const MsgTuukh = require("../models/msgTuukh");
const Geree = require("../models/geree");
const aldaa = require("../components/aldaa");
const MailIlgeeye = require("../components/mailIlgeeye");
const request = require("request");
//const { tokenShalgakh } = require("../middlewares/tokenShalgakh");
//const { crud } = require('../components/crud');
//const UstsanBarimt = require("../models/ustsanBarimt");
const { tokenShalgakh, crud, UstsanBarimt } = require("zevbackv2");
const NekhemjlekhiinTuukh = require("../models/nekhemjlekhiinTuukh");


crud(router, "mailiinZagvar", MailiinZagvar, UstsanBarimt);
crud(router, "msgTuukh", MsgTuukh, UstsanBarimt);
crud(router, "nekhemjlekhiinTuukh", NekhemjlekhiinTuukh, UstsanBarimt);

router.post("/duriinMailIlgeeye", tokenShalgakh, (req, res, next) => {
  let id = req.body.id;
  let mail = req.body.mail;
  console.log("body-->", req.body);
  MailiinZagvar(req.body.tukhainBaaziinKholbolt)
    .findById(id)
    .then(async (result) => {
      console.log("result-->", result);
      await MailIlgeeye.mailIlgeeye(
        mail,
        result ? result.mail : null,
        result ? result.zurag : null
      );
      res.send("Amjilttai");
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/mailOlnoorIlgeeye", tokenShalgakh, async (req, res, next) => {
  const { db } = require("zevbackv2");
  var baiguullaga = await Baiguullaga(db.erunkhiiKholbolt).findById({
    _id: req.body.baiguullagiinId,
  });
  console.log("baiguullaga", baiguullaga);
  if (
    !baiguullaga ||
    !baiguullaga.tokhirgoo ||
    !baiguullaga.tokhirgoo.mailNevtrekhNer ||
    !baiguullaga.tokhirgoo.mailPassword
  )
    throw new aldaa("И-Мэйлын тохиргоо хийгдээгүй байна!");
  for await (const mail of req.body.mailuud) {
    await MailIlgeeye.duriinMailIlgeeye(
      baiguullaga.tokhirgoo.mailNevtrekhNer,
      baiguullaga.tokhirgoo.mailPassword,
      baiguullaga.tokhirgoo.mailHost,
      baiguullaga.tokhirgoo.mailPort,
      mail.mail,
      req.body.subject,
      mail.content,
      null
    );
  }
  if(req.body.subject === "Түрээсийн төлбөр" && !!req.body.gereenuud)
  {
    for await (const tempData of req.body.gereenuud)
    {
      const tuukh = new NekhemjlekhiinTuukh(req.body.tukhainBaaziinKholbolt)();
      tuukh.baiguullagiinNer = tempData.baiguullagiinNer; 
      tuukh.baiguullagiinId = tempData.baiguullagiinId;
      tuukh.barilgiinId = tempData.barilgiinId;
      tuukh.ovog = tempData.ovog;
      tuukh.ner = tempData.ner;
      tuukh.register = tempData.register;
      tuukh.utas = tempData.utas;
      tuukh.khayag = tempData.khayag;
      tuukh.khugatsaa = tempData.khugatsaa;
      tuukh.duusakhOgnoo = tempData.duusakhOgnoo;
      tuukh.turul = tempData.turul;
      tuukh.gereeniiOgnoo = tempData.gereeniiOgnoo;
      tuukh.gereeniiId = tempData._id;
      tuukh.gereeniiDugaar = tempData.gereeniiDugaar;
      tuukh.talbainIdnuud = tempData.talbainIdnuud;
      tuukh.talbainDugaar = tempData.talbainDugaar;
      tuukh.talbainNegjUne = tempData.talbainNegjUne;
      tuukh.talbainNiitUne = tempData.talbainNiitUne;
      tuukh.talbainKhemjee = tempData.talbainKhemjee
      tuukh.talbainKhemjeeMetrKube = tempData.talbainKhemjeeMetrKube;
      tuukh.davkhar = tempData.davkhar;
      tuukh.baritsaaAvakhDun = tempData.baritsaaAvakhDun;
      tuukh.baritsaaniiUldegdel = tempData.baritsaaniiUldegdel;
      tuukh.baritsaaAvakhKhugatsaa = tempData.baritsaaAvakhKhugatsaa;
      tuukh.uldegdel = tempData.uldegdel;
      tuukh.daraagiinTulukhOgnoo = tempData.daraagiinTulukhOgnoo;
      tuukh.dansniiDugaar = tempData.dans;
      tuukh.gereeniiZagvariinId = tempData.gereeniiZagvariinId;
      tuukh.tulukhUdur = tempData.tulukhUdur;
      tuukh.tuluv = tempData.tuluv;
      tuukh.ognoo = tempData.ognoo;
      tuukh.mailKhayagTo = tempData.mail;
      tuukh.maililgeesenAjiltniiId = tempData.maililgeesenAjiltniiId;
      tuukh.maililgeesenAjiltniiNer = tempData.maililgeesenAjiltniiNer;
      tuukh.nekhemjlekhiinZagvarId = tempData.nekhemjlekhiinZagvarId;
      tuukh.tsonkhniiNer = tempData.tsonkhniiNer;
      tuukh.medeelel = tempData.medeelel;
      tuukh.nekhemjlekh = tempData.nekhemjlekh;
      tuukh.zagvariinNer = tempData.zagvariinNer;
      await tuukh.save()
      .then((result) => {
        console.log("result ----------> " + result);
      })
      .catch((err) => {
        console.log("err-----" + err);
        next(err);
      });
    }
  }
  res.send("Amjilttai");
});

router.post("/msgIlgeesenTooAvya", tokenShalgakh, async (req, res, next) => {
  MsgTuukh(req.body.tukhainBaaziinKholbolt)
    .aggregate([
      {
        $match: {
          barilgiinId: req.body.barilgiinId,
          baiguullagiinId: req.body.baiguullagiinId,
          createdAt: {
            $gte: new Date(req.body.ekhlekhOgnoo),
            $lte: new Date(req.body.duusakhOgnoo),
          },
        },
      },
      {
        $group: {
          _id: "aa",
          too: {
            $sum: 1,
          },
        },
      },
    ])
    .then((result) => {
      console.log(result);
      if (result.length > 0) res.send(result[0].too.toString());
      else res.send("0");
    })
    .catch((err) => next(err));
});

function msgIlgeeye(jagsaalt, key, dugaar, khariu, index, next, req, res) {
  try {
    url =
      process.env.MSG_SERVER +
      "/send" +
      "?key=" +
      key +
      "&from=" +
      dugaar +
      "&to=" +
      jagsaalt[index].to.toString() +
      "&text=" +
      jagsaalt[index].text.toString();
    url = encodeURI(url);
    request(url, { json: true }, (err1, res1, body) => {
      if (err1) {
        console.log("url", url);
        next(err1);
      } else {
        var msg = new MsgTuukh(req.body.tukhainBaaziinKholbolt)();
        msg.baiguullagiinId = req.body.baiguullagiinId;
        msg.barilgiinId = req.body.barilgiinId;
        msg.dugaar = jagsaalt[index].to;
        msg.gereeniiId = jagsaalt[index].gereeniiId;
        msg.msg = jagsaalt[index].text;
        msg.save();
        if (jagsaalt.length > index + 1) {
          console.log("url", url);
          console.log("body", body);
          khariu.push(body[0]);
          msgIlgeeye(jagsaalt, key, dugaar, khariu, index + 1, next, req, res);
        } else {
          console.log("url", url);
          khariu.push(body[0]);
          res.send(khariu);
        }
      }
    });
    return khariu;
  } catch (err) {
    next(err);
  }
}

router.post("/msgIlgeeye", tokenShalgakh, async (req, res, next) => {
  try {
    const { db } = require("zevbackv2");
    var baiguullaga = await Baiguullaga(db.erunkhiiKholbolt).findById(
      req.body.baiguullagiinId
    );
    var msgIlgeekhKey;
    var msgIlgeekhDugaar;
    try {
      msgIlgeekhKey = baiguullaga.tokhirgoo.msgIlgeekhKey;
      msgIlgeekhDugaar = baiguullaga.tokhirgoo.msgIlgeekhDugaar;
    } catch (error) {
      throw new aldaa("Тохиргоо хийгдээгүй байна!");
    }
    if (!msgIlgeekhKey || !msgIlgeekhDugaar)
      throw new aldaa("Мсж илгээх тохиргоо хийгдээгүй байна!");
    var khariu = [];
    msgIlgeeye(
      req.body.msgnuud,
      msgIlgeekhKey,
      msgIlgeekhDugaar,
      khariu,
      0,
      next,
      req,
      res
    );
  } catch (err) {
    next(err);
  }
});

router.post("/msgOlnoorIlgeeye", tokenShalgakh, async (req, res, next) => {
  try {
    const { db } = require("zevbackv2");
    var baiguullaga = await Baiguullaga(db.erunkhiiKholbolt).findById(
      req.body.baiguullagiinId
    );
    var msgIlgeekhKey;
    var msgIlgeekhDugaar;
    try {
      msgIlgeekhKey = baiguullaga.tokhirgoo.msgIlgeekhKey;
      msgIlgeekhDugaar = baiguullaga.tokhirgoo.msgIlgeekhDugaar;
    } catch (error) {
      throw new aldaa("Тохиргоо хийгдээгүй байна!");
    }
    if (!msgIlgeekhKey || !msgIlgeekhDugaar)
      throw new aldaa("Мсж илгээх тохиргоо хийгдээгүй байна!");

    const query = { baiguullagiinId: req.body.baiguullagiinId };

    if (req.body.turul == "davkharaar") {
      query["davkhar"] = req.body.davkhar;
    } else if (req.body.turul == "avlagaar") {
      query["uldegdel"] = { $gt: 0 };
    }

    const gereenuud = await Geree(req.body.tukhainBaaziinKholbolt)
      .find(query)
      .lean();
    var msgnuud = [];
    gereenuud.forEach((mur) => {
      let text = req.body.msj;
      for (const [key, value] of Object.entries(mur)) {
        text = text.replace(new RegExp(`<${key}>`, "g"), value);
      }
      msgnuud.push({ text, to: mur?.utas });
    });
    var khariu = [];
    msgIlgeeye(msgnuud, msgIlgeekhKey, msgIlgeekhDugaar, khariu, 0, next, res);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
