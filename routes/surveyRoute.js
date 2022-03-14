const express = require("express");
const router = express.Router();
const Survey = require("../models/survey");
const UstsanBarimt = require("../models/ustsanBarimt");
const { tokenShalgakh, crud } = require("zevback");

crud(router, "survey", Survey, UstsanBarimt);
router.route("/surveyKhadgalya").get(async (req, res, next) => {
    const data = new Survey(req.body);
    data.save().then((result) => res.send("Amjilttai"))
});
module.exports = router;
