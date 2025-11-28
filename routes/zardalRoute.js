const express = require("express");
const router = express.Router();
const Zardal = require("../models/zardal");
const BankniiGuilgee = require("../models/bankniiGuilgee");
const Geree = require("../models/geree");
const AshiglaltiinZardluud = require("../models/ashiglaltiinZardluud");
const { backAvya } = require("../controller/backup");
//const UstsanBarimt = require("../models/ustsanBarimt");
const { tokenShalgakh, crud, UstsanBarimt } = require("zevbackv2");
var ObjectId = require("mongodb").ObjectId;
crud(router, "zardal", Zardal, UstsanBarimt);

router.post("/zardliinDunAvya", tokenShalgakh, async (req, res, next) => {
  var query = [
    {
      $match: {
        baiguullagiinId: req.body.baiguullagiinId,
        barilgiinId: req.body.barilgiinId,
        zardliinBulgiinId: {
          $in: req.body.idnuud,
        },
        $or: [
          {
            TxDt: {
              $gte: new Date(req.body.ekhlekhOgnoo),
              $lte: new Date(req.body.duusakhOgnoo),
            },
          },
          {
            tranDate: {
              $gte: new Date(req.body.ekhlekhOgnoo),
              $lte: new Date(req.body.duusakhOgnoo),
            },
          },
        ],
      },
    },
    {
      $group: {
        _id: "aa",
        niitDun: {
          $sum: {
            $add: [{ $ifNull: ["$Amt", 0] }, { $ifNull: ["$amount", 0] }],
          },
        },
      },
    },
  ];
  BankniiGuilgee(req.body.tukhainBaaziinKholbolt, true)
    .aggregate(query)
    .then((result) => {
      var dun = 0;
      if (result && result.length > 0) {
        dun = result[0].niitDun;
      }
      res.send(dun.toString());
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/zardalKhuvaarilya", tokenShalgakh, async (req, res, next) => {
  BankniiGuilgee(req.body.tukhainBaaziinKholbolt)
    .updateOne(
      { _id: req.body.guilgeeniiId },
      { $set: { zardliinBulgiinId: req.body.zardliinId } }
    )
    .then((result) => {
      res.send("Amjilttai");
    })
    .then((err) => {
      next(err);
    });
});

router.post("/zardalTsutslaya", tokenShalgakh, async (req, res, next) => {
  BankniiGuilgee(req.body.tukhainBaaziinKholbolt)
    .updateOne(
      { _id: req.body.guilgeeniiId },
      { $set: { zardliinBulgiinId: null } }
    )
    .then((result) => {
      res.send("Amjilttai");
    })
    .then((err) => {
      next(err);
    });
});
router.post("/backTest", tokenShalgakh, async (req, res, next) => {
  backAvya();
  res.send("Amjilttai");
});

module.exports = router;
