const express = require("express");
const router = express.Router();
const Survey = require("../models/survey");
const Asuult = require("../models/asuult");
//const UstsanBarimt = require("../models/ustsanBarimt");
const { tokenShalgakh, crud, UstsanBarimt } = require("zevback");

crud(router, "survey", Survey, UstsanBarimt);
crud(router, "asuult", Asuult, UstsanBarimt);
router.route("/surveyKhadgalya").post(async (req, res, next) => {
    const data = new Survey(req.body);
    data.save().then((result) => res.send("Amjilttai")).catch((err) => next(err));
});
module.exports = router;
