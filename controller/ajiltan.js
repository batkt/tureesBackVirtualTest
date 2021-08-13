const asyncHandler = require('express-async-handler')
const Ajiltan = require("../models/ajiltan");
const License = require("../models/license");
const aldaa = require("../components/aldaa");
const jwt = require('jsonwebtoken');

exports.ajiltanNevtrey = asyncHandler(async (req, res, next) => {
    const ajiltan = await Ajiltan.findOne()
        .select("+nuutsUg")
        .where("ner")
        .equals(req.body.ner)
        .catch((err) => {
            next(err);
        });

    if (!ajiltan)
        throw new aldaa('Хэрэглэгчийн нэр эсвэл нууц үг буруу байна!');
    var ok = await ajiltan.passwordShalgaya(req.body.nuutsUg);
    if (!ok)
        throw new aldaa('Хэрэглэгчийн нэр эсвэл нууц үг буруу байна!');
    let license = await License.findOne().where("baiguullagiinId").equals(ajiltan.baiguullagiinId);
    // if (!license || license.duusakhOgnoo < new Date)
    //     throw new aldaa("Лицензийн хугацаа дууссан байна!")
    const jwt = ajiltan.tokenUusgeye(license.duusakhOgnoo);
    res.status(200).json({
        duusakhOgnoo: license.duusakhOgnoo,
        success: true,
        token: jwt,
        result: ajiltan
    })

});


exports.tokenoorAjiltanAvya = asyncHandler(async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            throw new Error('Энэ үйлдлийг хийх эрх байхгүй байна!', 401);
        }
        const token = req.headers.authorization.split(' ')[1];
        const tokenObject = jwt.verify(token, 'tokenUusgexTest0123', 401);
        console.log(tokenObject);
        if (tokenObject.id == 'zochin')
            throw new Error('Энэ үйлдлийг хийх эрх байхгүй байна!', 401);
        console.log("tokenObject", tokenObject);
        Ajiltan.findById(tokenObject.id)
            .then((urDun) => {
                var urdunJson = urDun.toJSON();
                urdunJson.duusakhOgnoo = tokenObject.duusakhOgnoo;
                res.send(urdunJson);
            })
            .catch((err) => {
                console.log('aldaa');
                next(err);
            });
    } catch (error) {
        next(error);
    }
});