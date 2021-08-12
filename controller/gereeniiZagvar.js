const asyncHandler = require('express-async-handler')
const GereeniiZagvar = require('../models/gereeniiZagvar')
const xlsx = require('xlsx');
const mongoose = require('mongoose');

function usegTooruuKhurvuulekh(useg) {
    if (!!useg)
        return useg.charCodeAt() - 65;
    else
        return 0
}

exports.gereeniiZagvarTatya = asyncHandler(async (req, res, next) => {
    try {
        console.log("req.body", req.body);
        const workbook = xlsx.read(req.file.buffer);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jagsaalt = [];
        var tolgoinObject = {};
        for (let cell in worksheet) {
            var cellAsString = cell.toString();
            if (cellAsString[1] === "1" && !!worksheet[cellAsString].v) {
                if (worksheet[cellAsString].v.includes("Харагдах дугаар"))
                    tolgoinObject.kharagdakhDugaar = cellAsString[0];
                else if (worksheet[cellAsString].v.includes("Заалт"))
                    tolgoinObject.zaalt = cellAsString[0];
                else if (worksheet[cellAsString].v.includes("Хамаарах хэсэг"))
                    tolgoinObject.khamaarakh = cellAsString[0];
            }
        }
        var data = xlsx.utils.sheet_to_json(worksheet, {
            header: 1,
            range: 1
        });
        const rowNum = 1;
        data.forEach(mur => {
            let object = new GereeniiZagvar();
            object.kharagdakhDugaar = mur[usegTooruuKhurvuulekh(tolgoinObject.kharagdakhDugaar)];
            object.desDugaar = rowNum;
            object.zaalt = mur[usegTooruuKhurvuulekh(tolgoinObject.zaalt)];
            object.khamaarakh = mur[usegTooruuKhurvuulekh(tolgoinObject.khamaarakh)];
            //object.baiguullagiinId = req.body.baiguullagiinId;
            jagsaalt.push(object);
            rowNum = rowNum + 1;
        });
        var aldaaniiMsg = '';
        if (aldaaniiMsg)
            throw new aldaa(aldaaniiMsg);
        GereeniiZagvar.insertMany(jagsaalt, function (err) {
            if (err) {
                next(err);
            };
            res.status(200).send("Amjilttai");
        });
    } catch (error) {
        next(error);
    }
});