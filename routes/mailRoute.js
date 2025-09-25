const express = require("express");
const router = express.Router();
const MailiinZagvar = require("../models/mailiinZagvar");
const Baiguullaga = require("../models/baiguullaga");
const MsgTuukh = require("../models/msgTuukh");
const Geree = require("../models/geree");
const MaililgeesenKhariu = require("../models/maililgeesenKhariu");
const aldaa = require("../components/aldaa");
const MailIlgeeye = require("../components/mailIlgeeye");
const request = require("request");
const axios = require("axios");
const FormData = require("form-data");
//const { tokenShalgakh } = require("../middlewares/tokenShalgakh");
//const { crud } = require('../components/crud');
//const UstsanBarimt = require("../models/ustsanBarimt");
const { Dugaarlalt, tokenShalgakh, crud, UstsanBarimt } = require("zevbackv2");
const NekhemjlekhiinTuukh = require("../models/nekhemjlekhiinTuukh");
const TodorkhoiloltiinTuukh = require("../models/todorkhoiloltiinTuukh");

crud(router, "mailiinZagvar", MailiinZagvar, UstsanBarimt);
crud(router, "msgTuukh", MsgTuukh, UstsanBarimt);
crud(router, "nekhemjlekhiinTuukh", NekhemjlekhiinTuukh, UstsanBarimt);
crud(router, "maililgeesenKhariu", MaililgeesenKhariu, UstsanBarimt);

router.post("/duriinMailIlgeeye", tokenShalgakh, (req, res, next) => {
  let id = req.body.id;
  let mail = req.body.mail;
  MailiinZagvar(req.body.tukhainBaaziinKholbolt)
    .findById(id)
    .then(async (result) => {
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

async function pad(num, size) {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
}

router.post("/mailOlnoorIlgeeye", tokenShalgakh, async (req, res, next) => {
  try {
    const { db } = require("zevbackv2");
    var baiguullaga = await Baiguullaga(db.erunkhiiKholbolt).findById({
      _id: req.body.baiguullagiinId,
    });
    if (
      !baiguullaga ||
      !baiguullaga.tokhirgoo ||
      !baiguullaga.tokhirgoo.mailNevtrekhNer ||
      !baiguullaga.tokhirgoo.mailPassword
    )
      throw new aldaa("И-Мэйлын тохиргоо хийгдээгүй байна!");
    if (req.body.subject === "Түрээсийн төлбөр" && !!req.body.gereenuud) {
      var ilgeekhBody = {
        mailuud: req.body.mailuud,
        baiguullaga: baiguullaga,
        subject: req.body.subject,
      };
      const resIgeeye = await axios.post(
        "http://103.143.40.43:8282/tureesMailIlgeeye",
        ilgeekhBody
      );
      const body = resIgeeye.data;
      if (body?.length > 0) {
        await MaililgeesenKhariu(req.body.tukhainBaaziinKholbolt).insertMany(
          body
        );
      }
      for await (const tempData of req.body.gereenuud) {
        const tuukh = new NekhemjlekhiinTuukh(
          req.body.tukhainBaaziinKholbolt
        )();
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
        tuukh.talbainKhemjee = tempData.talbainKhemjee;
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
        tuukh.content = req.body.mailuud?.filter(
          (a) =>
            a.mail === tempData.mail &&
            a.gereeniiDugaar === tempData.gereeniiDugaar
        )[0]?.content;
        tuukh.nekhemjlekhiinDans = tempData.nekhemjlekhiinDans;
        tuukh.nekhemjlekhiinDansniiNer = tempData.nekhemjlekhiinDansniiNer;
        tuukh.nekhemjlekhiinBank = tempData.nekhemjlekhiinBank;
        tuukh.nekhemjlekhiinIbanDugaar = tempData.nekhemjlekhiinIbanDugaar;
        tuukh.nekhemjlekhiinOgnoo = req.body.ognoo;
        tuukh.nekhemjlekhiinDugaar = tempData.nekhemjlekhiinDugaar;
        tuukh.dugaalaltDugaar = tempData.dugaalaltDugaar;
        if (!!tempData.nekhemjlekhiinDugaar)
          await Dugaarlalt(req.body.tukhainBaaziinKholbolt).insertMany({
            baiguullagiinId: tempData.baiguullagiinId,
            barilgiinId: tempData.barilgiinId,
            turul: "nekhemjlekhTurees",
            ognoo: new Date(),
            dugaar: tempData.dugaalaltDugaar,
          });
        await tuukh
          .save()
          .then((result) => {})
          .catch((err) => {
            next(err);
          });
        var update = {
          nekhemjlekhiinOgnoo: req.body.ognoo,
        };
        await Geree(req.body.tukhainBaaziinKholbolt).findByIdAndUpdate(
          tempData._id,
          update
        );
      }
      res.send(body);
    } else if (req.body.subject === "Тодорхойлолт" && !!req.body.gereenuud) {
      var ilgeekhBody = {
        mailuud: req.body.mailuud,
        baiguullaga: baiguullaga,
        subject: req.body.subject,
      };
      const resIgeeye = await axios.post(
        "http://103.143.40.43:8282/tureesMailIlgeeye",
        ilgeekhBody
      );
      const body = resIgeeye.data;
      if (body?.length > 0) {
        await MaililgeesenKhariu(req.body.tukhainBaaziinKholbolt).insertMany(
          body
        );
      }
      for await (const tempData of req.body.gereenuud) {
        const tod = new TodorkhoiloltiinTuukh(req.body.tukhainBaaziinKholbolt)();
        tod.baiguullagiinNer = tempData.baiguullagiinNer;
        tod.baiguullagiinId = tempData.baiguullagiinId;
        tod.barilgiinId = tempData.barilgiinId;
        tod.ovog = tempData.ovog;
        tod.ner = tempData.ner;
        tod.register = tempData.register;
        tod.utas = tempData.utas;
        tod.gereeniiId = tempData._id;
        tod.gereeniiDugaar = tempData.gereeniiDugaar;
        tod.talbainIdnuud = tempData.talbainIdnuud;
        tod.talbainDugaar = tempData.talbainDugaar;
        tod.mailiinZagvariinId = tempData.mailiinZagvariinId;
        tod.mailKhayagTo = tempData.mail;
        tod.maililgeesenAjiltniiId = tempData.maililgeesenAjiltniiId;
        tod.maililgeesenAjiltniiNer = tempData.maililgeesenAjiltniiNer;
        await tod.save();
      }
    }
    else {
      for await (const mail of req.body.mailuud) {
        await MailIlgeeye.duriinMailIlgeeye(
          baiguullaga.tokhirgoo.mailNevtrekhNer,
          baiguullaga.tokhirgoo.mailPassword,
          baiguullaga.tokhirgoo.mailHost,
          baiguullaga.tokhirgoo.mailPort,
          mail.mail,
          req.body.subject,
          mail.content,
          mail.gereeniiDugaar
        );
      }
      res.send("Amjilttai");
    }
  } catch (err) {
    next(err);
  }
});

router.post("/maxDugaarAvya", tokenShalgakh, async (req, res, next) => {
  try {
    var dugaar = 1;
    var nekhemjlekhiinDugaar = "";
    nekhemjlekhiinDugaar =
      nekhemjlekhiinDugaar + new Date().getFullYear().toString().slice(-2);
    nekhemjlekhiinDugaar =
      nekhemjlekhiinDugaar + ("0" + (new Date().getMonth() + 1)).slice(-2);
    var maxDugaar = await Dugaarlalt(req.body.tukhainBaaziinKholbolt).aggregate(
      [
        {
          $match: {
            baiguullagiinId: req.body.baiguullagiinId,
            barilgiinId: req.body.barilgiinId,
            turul: "nekhemjlekhTurees",
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
      ]
    );
    if (maxDugaar && maxDugaar.length > 0) dugaar = maxDugaar[0].max + 1;
    nekhemjlekhiinDugaar = nekhemjlekhiinDugaar + (await pad(dugaar, 3));
    res.send({ nekhemjlekhiinDugaar, dugaar });
  } catch (err) {
    next(err);
  }
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
        next(err1);
      } else {
        var msg = new MsgTuukh(req.body.tukhainBaaziinKholbolt)();
        msg.baiguullagiinId = req.body.baiguullagiinId;
        msg.barilgiinId = req.body.barilgiinId;
        msg.dugaar = jagsaalt[index].to;
        msg.gereeniiId = jagsaalt[index].gereeniiId;
        msg.msg = jagsaalt[index].text;
        msg.msgIlgeekhKey = key;
        msg.msgIlgeekhDugaar = dugaar;
        msg.save();
        if (jagsaalt.length > index + 1) {
          khariu.push(body[0]);
          msgIlgeeye(jagsaalt, key, dugaar, khariu, index + 1, next, req, res);
        } else {
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
function msgIlgeeyeUnitel(
  jagsaalt,
  key,
  dugaar,
  khariu,
  index,
  next,
  req,
  res
) {
  try {
    const form = new FormData();
    form.append("token_id", key);
    form.append("extension_number", "11");
    form.append("sms_number", dugaar);
    form.append("to", jagsaalt[index].to.toString());
    form.append("body", jagsaalt[index].text.toString());
    axios({
      method: "post",
      url: "http://pbxuc.unitel.mn/hodupbx_api/v1.4/sendSms",
      data: form,
      headers: { ...form.getHeaders() },
    })
      .then((err1, res1, body) => {
        if (err1) {
          next(err1);
        } else {
          if (!!req && !!req.body) {
            var msg = new MsgTuukh(req.body.tukhainBaaziinKholbolt)();
            msg.baiguullagiinId = req.body.baiguullagiinId;
            msg.barilgiinId = req.body.barilgiinId;
            msg.dugaar = jagsaalt[index].to;
            msg.gereeniiId = jagsaalt[index].gereeniiId;
            msg.msg = jagsaalt[index].text;
            msg.msgIlgeekhKey = key;
            msg.msgIlgeekhDugaar = dugaar;
            msg.save();
          }
          if (jagsaalt.length > index + 1) {
            khariu.push(body[0]);
            msgIlgeeyeUnitel(
              jagsaalt,
              key,
              dugaar,
              khariu,
              index + 1,
              next,
              req,
              res
            );
          } else {
            khariu.push(body[0]);
            res.send(khariu);
          }
        }
      })
      .catch((error) => {});
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
    if (msgIlgeekhKey == "g25dFjT1y1upZLYR")
      msgIlgeeyeUnitel(
        req.body.msgnuud,
        msgIlgeekhKey,
        msgIlgeekhDugaar,
        khariu,
        0,
        next,
        req,
        res
      );
    else
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

router.post("/msgTuukhEBarimtZogsool", async (req, res, next) => {
  try {
    const { db } = require("zevbackv2");
    var kholboltuud = db.kholboltuud;
    var baiguullaguud = await Baiguullaga(db.erunkhiiKholbolt).find({
      "barilguud.tokhirgoo.eBarimtMessageIlgeekhEsekh": true,
    });
    var result = [];
    if (kholboltuud && baiguullaguud?.length) {
      for await (const baiguullaga of baiguullaguud) {
        var kholbolt = kholboltuud.find(
          (a) => a.baiguullagiinId == baiguullaga._id.toString()
        );
        if (kholbolt) {
          var query = {
            baiguullagiinId: kholbolt.baiguullagiinId,
            mashiniiDugaar: { $exists: true },
          };
          if (req.body.ekhlekhOgnoo)
            query["createdAt"] = {
              $gte: new Date(req.body.ekhlekhOgnoo),
              $lte: new Date(req.body.duusakhOgnoo),
            };
          var msgTuukhuud = await MsgTuukh(kholbolt).find(query);
          result.push({
            register: baiguullaga.register,
            ner: baiguullaga.ner,
            dotoodNer: baiguullaga.dotoodNer,
            msgCount: msgTuukhuud?.length,
          });
        }
      }
    }
    res.send(result);
  } catch (err) {
    next(err);
  }
});
module.exports = router;
