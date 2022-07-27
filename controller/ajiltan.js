const asyncHandler = require("express-async-handler");
const Ajiltan = require("../models/ajiltan");
const Baiguullaga = require("../models/baiguullaga");
const aldaa = require("../components/aldaa");
const jwt = require("jsonwebtoken");
const request = require('request');
const http = require("http");

function duusakhOgnooAvya(ugugdul, onFinish, next) {
  request.get("http://127.0.0.1:8282/baiguullagiinDuusakhKhugatsaaAvya", { json: true, body: ugugdul }, (err, res1, body) => {
    if (err) next(err);
    else {
      onFinish(body);
    }
  });
}

exports.ajiltanNevtrey = asyncHandler(async (req, res, next) => {
  const ajiltan = await Ajiltan.findOne()
    .select("+nuutsUg")
    .where("nevtrekhNer")
    .equals(req.body.nevtrekhNer)
    .catch((err) => {
      next(err);
    });
  if (!ajiltan) throw new aldaa("Хэрэглэгчийн нэр эсвэл нууц үг буруу байна!");
  var ok = await ajiltan.passwordShalgaya(req.body.nuutsUg);
  if (!ok) throw new aldaa("Хэрэглэгчийн нэр эсвэл нууц үг буруу байна!");
  var baiguullaga = await Baiguullaga.findById(ajiltan.baiguullagiinId);
  let duusakhOgnoo = null;
  var butsaakhObject = {
    result: ajiltan,
    success: true
  };
  duusakhOgnooAvya({ "register": baiguullaga.register }, async (khariu) => {
    try {
      console.log("nevtrekhXariu Irlee");
      if (khariu.success) {
        if (khariu.duusakhOgnoo && (new Date(khariu.duusakhOgnoo) < new Date()))
          throw new aldaa("Лицензийн хугацаа дууссан байна!")
        const jwt = await ajiltan.tokenUusgeye(khariu.duusakhOgnoo);
        butsaakhObject.duusakhOgnoo = khariu.duusakhOgnoo;
        butsaakhObject.token = jwt;
        res.status(200).json(butsaakhObject)
      }
      else
        throw new Error(khariu.msg);
    }
    catch (err) {
      next(err);
    }
  }, next);
});

exports.tokenoorAjiltanAvya = asyncHandler(async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      throw new Error("Энэ үйлдлийг хийх эрх байхгүй байна!", 401);
    }
    const token = req.headers.authorization.split(" ")[1];
    const tokenObject = jwt.verify(token, process.env.APP_SECRET, 401);
    console.log(tokenObject);
    if (tokenObject.id == "zochin")
      throw new Error("Энэ үйлдлийг хийх эрх байхгүй байна!", 401);
    console.log("tokenObject", tokenObject);
    Ajiltan.findById(tokenObject.id)
      .then((urDun) => {
        var urdunJson = urDun.toJSON();
        urdunJson.duusakhOgnoo = tokenObject.duusakhOgnoo;
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
