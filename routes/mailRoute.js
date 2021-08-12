const express = require('express');
const router = express.Router();
const {
    tokenShalgakh
} = require("../middlewares/tokenShalgakh");
const MailiinZagvar = require("../models/mailiinZagvar");
const MailIlgeeye = require("../components/mailIlgeeye");
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

module.exports = router;