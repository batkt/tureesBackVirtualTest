const express = require("express");
const router = express.Router();
const { crud, UstsanBarimt } = require("zevbackv2");
const { Pool } = require("pg");
const TogloomiinTariff = require("../models/togloomiinTariff");
const TogloomiinTuv = require("../models/togloomiinTuv");

crud(router, "togloomiinTariff", TogloomiinTariff, UstsanBarimt);
crud(router, "togloomiinTuv", TogloomiinTuv, UstsanBarimt);

router
  .route("/togloomiinToololtAvya")
  .post(tokenShalgakh, async (req, res, next) => {
    try {
      var ekhlekhOgnoo = new Date(req.body.ekhlekhOgnoo);
      var duusakhOgnoo = new Date(req.body.duusakhOgnoo);
      var khariu = await TogloomiinTuv.aggregate([
        {
          $match: {
            baiguullagiinId: req.body.baiguullagiinId,
            ognoo: {
              $gte: ekhlekhOgnoo,
              $lte: duusakhOgnoo,
            },
          },
        },
        {
          $group: {
            _id: "tuluv",
            too: {
              $sum: 1,
            },
          },
        },
      ]);
      res.send(khariu);
    } catch (err) {
      next(err);
    }
  });
module.exports = router;
