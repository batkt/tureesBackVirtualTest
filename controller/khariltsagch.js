const asyncHandler = require("express-async-handler");
const aldaa = require("../components/aldaa");
const Khariltsagch = require("../models/khariltsagch");

exports.khariltsagchNevtrey = asyncHandler(async (req, res, next) => {
    try {
        console.log("asdasd");
        const khariltsagch = await Khariltsagch.findOne({utas:req.body.utas})
            .select("+nuutsUg")
            .catch((err) => {
                next(err);
            });
        if (!khariltsagch) throw new aldaa("Хэрэглэгчийн нэр эсвэл нууц үг буруу байна!");
        var ok = await khariltsagch.passwordShalgaya(req.body.nuutsUg);
        if (!ok) throw new aldaa("Хэрэглэгчийн нэр эсвэл нууц үг буруу байна!");
        var butsaakhObject = {
            result: khariltsagch,
            success: true
        }
        const jwt = await khariltsagch.tokenUusgeye();
        butsaakhObject.token = jwt;
        res.status(200).json(butsaakhObject);
    }
    catch (err) {
        next(err);
    }
});

exports.khariltsagchidTokenOnooyo = asyncHandler(async (req, res, next) => {
    try {
        let filter = {
            "_id": req.body.id
        }
        let update = {
            "firebaseToken": req.body.token
        }
        Khariltsagch.findOneAndUpdate(filter, update)
            .then((result) => {
                res.send("Amjilttai")
            })
            .catch((err) => {
                next(err);
            });
    } catch (error) {
        next(error);
    }
});