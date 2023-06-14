const asyncHandler = require("express-async-handler");
const aldaa = require("../components/aldaa");
const Khariltsagch = require("../models/khariltsagch");
const Baiguullaga = require("../models/baiguullaga");
const jwt = require("jsonwebtoken");
const MsgTuukh = require("../models/msgTuukh");
const request = require("request");
const { formatNumber } = require("zevbackv2");

exports.khariltsagchNevtrey = asyncHandler(async (req, res, next) => {
  try {
    const { db } = require("zevbackv2");
    const khariltsagch = await Khariltsagch(db.erunkhiiKholbolt)
      .findOne({ utas: req.body.utas })
      .select("+nuutsUg")
      .catch((err) => {
        next(err);
      });
    console.log("khariltsagch", khariltsagch);
    if (!khariltsagch)
      throw new aldaa("Хэрэглэгчийн нэр эсвэл нууц үг буруу байна!");
    var ok = await khariltsagch.passwordShalgaya(req.body.nuutsUg);
    if (!ok) throw new aldaa("Хэрэглэгчийн нэр эсвэл нууц үг буруу байна!");
    var butsaakhObject = {
      result: khariltsagch,
      success: true,
    };
    const token = await khariltsagch.tokenUusgeye();
    butsaakhObject.token = token;
    res.status(200).json(butsaakhObject);
  } catch (err) {
    next(err);
  }
});

async function kodUusgey() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

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
        }
      }
    });
  } catch (err) {
    next(err);
  }
}

async function tulultiinMsgIlgeeye(gereeniiDugaar, utas, dun) {
  try {
    const { db } = require("zevbackv2");
    var baiguullaga = await Baiguullaga(db.erunkhiiKholbolt).findById(
      req.params.baiguullagiinId
    );
    console.log("gereeniiDugaar ", gereeniiDugaar);
    console.log("utas ", utas);
    console.log("dun ", dun);
    var msgIlgeekhKey;
    var msgIlgeekhDugaar;
    try {
      msgIlgeekhKey = baiguullaga.tokhirgoo.msgIlgeekhKey;
      msgIlgeekhDugaar = baiguullaga.tokhirgoo.msgIlgeekhDugaar;
    } catch (error) {
      console.log("msg tokhirgoo bxgui");
    }
    if (!!msgIlgeekhKey && !!msgIlgeekhDugaar) {
    }
    var text =
      gereeniiDugaar +
      " дугаартай гэрээний түрээсийн төлбөр " +
      (await formatNumber(dun)) +
      " төлөгдлөө";
    dun;
    msgIlgeeye(
      [
        {
          to: utas,
          text,
        },
      ],
      msgIlgeekhKey,
      msgIlgeekhDugaar,
      [],
      0,
      next,
      req,
      res
    );
  } catch (err) {
    console.log("tulburiin msg ilgeexed aldaa garsan " + err);
  }
}

exports.tulultiinMsgIlgeeye = tulultiinMsgIlgeeye;

exports.sergeekhKodAvya = asyncHandler(async (req, res, next) => {
  try {
    const { db } = require("zevbackv2");
    const khariltsagch = await Khariltsagch(db.erunkhiiKholbolt).findOne({
      utas: req.body.utas,
    });
    req.body.tukhainBaaziinKholbolt = db.erunkhiiKholbolt;
    if (!khariltsagch) throw new Error("Бүртгэлтэй харилцагч олдсонгүй!");
    khariltsagch.sergeekhKod = await kodUusgey();
    var baiguullaga = await Baiguullaga(db.erunkhiiKholbolt).findById(
      khariltsagch.baiguullagiinId
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
    await Khariltsagch(db.erunkhiiKholbolt).updateOne(
      { _id: khariltsagch._id },
      { $set: { sergeekhKod: khariltsagch.sergeekhKod } }
    );
    await msgIlgeeye(
      [
        {
          text: "Нууц үг сэргээх код: " + khariltsagch.sergeekhKod,
          to: khariltsagch?.utas,
        },
      ],
      msgIlgeekhKey,
      msgIlgeekhDugaar,
      [],
      0,
      next,
      req,
      res
    );
    res.send(khariltsagch._id);
  } catch (err) {
    next(err);
  }
});

exports.nuutsUgSergeeye = asyncHandler(async (req, res, next) => {
  try {
    const { db } = require("zevbackv2");
    var khariltsagch = await Khariltsagch(db.erunkhiiKholbolt).findById(
      req.body.id
    );
    if (!khariltsagch) throw new Error("Харилцагч олдсонгүй!");
    if (khariltsagch.sergeekhKod != req.body.sergeekhKod)
      throw new Error("Сэргээх код буруу байна!");
    var token = await khariltsagch.tokenUusgeye();
    res.send({ token });
  } catch (err) {
    throw new Error(err);
  }
});

exports.khariltsagchidTokenOnooyo = asyncHandler(async (req, res, next) => {
  try {
    const { db } = require("zevbackv2");
    let filter = {
      _id: req.body.id,
    };
    let update = {
      firebaseToken: req.body.token,
    };
    Khariltsagch(db.erunkhiiKholbolt)
      .findOneAndUpdate(filter, update)
      .then((result) => {
        res.send("Amjilttai");
      })
      .catch((err) => {
        next(err);
      });
  } catch (error) {
    next(error);
  }
});

exports.tokenoorKhariltsagchAvya = asyncHandler(async (req, res, next) => {
  try {
    const { db } = require("zevbackv2");
    if (!req.headers.authorization) {
      throw new Error("Энэ үйлдлийг хийх эрх байхгүй байна!", 401);
    }
    const token = req.headers.authorization.split(" ")[1];
    const tokenObject = jwt.verify(token, process.env.APP_SECRET, 401);
    Khariltsagch(db.erunkhiiKholbolt)
      .findById(tokenObject.id)
      .then((urDun) => {
        var urdunJson = urDun.toJSON();
        res.send(urdunJson);
      })
      .catch((err) => {
        console.log("aldaa");
        next(err);
      });
  } catch (error) {
    next(error);
  }
});
