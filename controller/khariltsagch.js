const asyncHandler = require("express-async-handler");
const aldaa = require("../components/aldaa");
const Khariltsagch = require("../models/khariltsagch");
const jwt = require("jsonwebtoken");

exports.khariltsagchNevtrey = asyncHandler(async (req, res, next) => {
  try {
    console.log("asdasd");
    const khariltsagch = await Khariltsagch.findOne({ utas: req.body.utas })
      .select("+nuutsUg")
      .catch((err) => {
        next(err);
      });
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

exports.khariltsagchidTokenOnooyo = asyncHandler(async (req, res, next) => {
  try {
    let filter = {
      _id: req.body.id,
    };
    let update = {
      firebaseToken: req.body.token,
    };
    Khariltsagch.findOneAndUpdate(filter, update)
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
    if (!req.headers.authorization) {
      throw new Error("Энэ үйлдлийг хийх эрх байхгүй байна!", 401);
    }
    const token = req.headers.authorization.split(" ")[1];
    const tokenObject = jwt.verify(token, "tokenUusgexTest0123", 401);
    Khariltsagch.findById(tokenObject.id)
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
