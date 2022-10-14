const express = require("express");
const router = express.Router();
const Survey = require("../models/survey");
const Asuult = require("../models/asuult");
const Khariult = require("../models/khariult");
//const UstsanBarimt = require("../models/ustsanBarimt");
const { tokenShalgakh, crud, UstsanBarimt } = require("zevback");

crud(router, "survey", Survey, UstsanBarimt);
crud(router, "asuult", Asuult, UstsanBarimt);
crud(router, "khariult", Khariult, UstsanBarimt);

router.route("/surveyKhadgalya").post(async (req, res, next) => {
    const data = new Khariult(req.body);
    data.save().then((result) => res.send("Amjilttai")).catch((err) => next(err));
});

router.route("/asuultAvya/:id").get(async (req, res, next) => {
    const data = await Asuult.findOne({_id:req.params.id})
    res.send(data)
});

module.exports = router;
