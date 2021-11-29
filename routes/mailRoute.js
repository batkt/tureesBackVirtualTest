const express = require('express');
const router = express.Router();
const {
    tokenShalgakh
} = require("../middlewares/tokenShalgakh");
const MailiinZagvar = require("../models/mailiinZagvar");
const Baiguullaga = require("../models/baiguullaga");
const Geree = require("../models/geree");

const aldaa = require("../components/aldaa");
const MailIlgeeye = require("../components/mailIlgeeye");
const request = require("request");
const {
    crudWithFile,
    crud
} = require('../components/crud');

crud(router, 'mailiinZagvar', MailiinZagvar);

router.post("/duriinMailIlgeeye", tokenShalgakh, (req, res, next) => {
    let id = req.body.id;
    let mail = req.body.mail;
    console.log("body-->", req.body);
    MailiinZagvar.findById(id)
        .then(async (result) => {
            console.log("result-->", result);
            await MailIlgeeye.mailIlgeeye(mail, (result) ? result.mail : null, (result) ? result.zurag : null);
            res.send("Amjilttai");
        })
        .catch((err) => {
            next(err);
        });
});

function msgIlgeeye(jagsaalt, key, dugaar, khariu, index, next, res) {
    try {
        url = process.env.MSG_SERVER + "/send"
            + "?key=" + key + "&from=" + dugaar + "&to="
            + jagsaalt[index].to.toString() + "&text=" + jagsaalt[index].text.toString();
        url = encodeURI(url);
        request(url,
            { json: true },
            (err1, res1, body) => {
                if (err1) {
                    console.log("url", url);
                    next(err1);
                }
                else {
                    if (jagsaalt.length > index + 1) {
                        console.log("url", url);
                        console.log("body", body)
                        khariu.push(body[0]);
                        msgIlgeeye(jagsaalt, key, dugaar, khariu, index + 1, next, res)
                    }
                    else {
                        console.log("url", url);
                        khariu.push(body[0]);
                        res.send(khariu);
                    }
                }
            }
        );
        return khariu;
    }
    catch (err) {
        next(err);
    }
}

router.post("/msgIlgeeye", tokenShalgakh, async (req, res, next) => {
    try {
        var baiguullaga = await Baiguullaga.findById(req.body.baiguullagiinId);
        var msgIlgeekhKey;
        var msgIlgeekhDugaar;
        try {
            msgIlgeekhKey = baiguullaga.tokhirgoo.msgIlgeekhKey;
            msgIlgeekhDugaar = baiguullaga.tokhirgoo.msgIlgeekhDugaar;
        }
        catch (error) {
            throw new aldaa("Тохиргоо хийгдээгүй байна!");
        }
        if (!msgIlgeekhKey || !msgIlgeekhDugaar)
            throw new aldaa("Мсж илгээх тохиргоо хийгдээгүй байна!");
        var khariu = [];
        msgIlgeeye(req.body.msgnuud, msgIlgeekhKey, msgIlgeekhDugaar, khariu, 0, next, res)
    }
    catch (err) {
        next(err);
    }
});

async function replaceAll(mur,text) {
    const returnText = text
    for (const [key, value] of Object.entries(mur)) {
        returnText = returnText.replace(new RegExp(`<${key}>`, "g"),value);
    }
    return returnText
}


router.post("/msgOlnoorIlgeeye", tokenShalgakh, async (req, res, next) => {
    try {
        var baiguullaga = await Baiguullaga.findById(req.body.baiguullagiinId);
        var msgIlgeekhKey;
        var msgIlgeekhDugaar;
        try {
            msgIlgeekhKey = baiguullaga.tokhirgoo.msgIlgeekhKey;
            msgIlgeekhDugaar = baiguullaga.tokhirgoo.msgIlgeekhDugaar;
        }
        catch (error) {
            throw new aldaa("Тохиргоо хийгдээгүй байна!");
        }
        if (!msgIlgeekhKey || !msgIlgeekhDugaar)
            throw new aldaa("Мсж илгээх тохиргоо хийгдээгүй байна!");
       

        const query = {baiguullagiinId:req.body.baiguullagiinId}

        if(req.body.turul === 'davkharaar'){
            query['davkhar'] = req.body.davkhar
        }
        else if(req.body.turul === 'avlagaar'){
            query['uldegdel'] = {$gt:0}
        }

        const gereenuud = await Geree.find(query)
        var msgnuud = []
        for await (const mur of gereenuud)
        {
            const text = await replaceAll(mur,req.body.msj)
            msgnuud.push({text,to:mur?.utas,mur})
        }
        var khariu = [];
        res.send(msgnuud)
        //msgIlgeeye(msgnuud, msgIlgeekhKey, msgIlgeekhDugaar, khariu, 0, next, res)
    }
    catch (err) {
        next(err);
    }
});

module.exports = router;