const express = require("express");
const router = express.Router();
const { crud, UstsanBarimt, tokenShalgakh } = require("zevbackv2");
const { Pool } = require("pg");
const TogloomiinTariff = require("../models/togloomiinTariff");
const TogloomiinTuv = require("../models/togloomiinTuv");
const TogloomiinTulbur = require("../models/togloomiinTulbur");

crud(router, "togloomiinTariff", TogloomiinTariff, UstsanBarimt);
crud(router, "togloomiinTuv", TogloomiinTuv, UstsanBarimt);

router
  .route("/togloomiinToololtAvya")
  .post(tokenShalgakh, async (req, res, next) => {
    try {
      var ekhlekhOgnoo = new Date(req.body.ekhlekhOgnoo);
      var duusakhOgnoo = new Date(req.body.duusakhOgnoo);
      var khariu = await TogloomiinTuv(
        req.body.tukhainBaaziinKholbolt
      ).aggregate([
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
            _id: "aaa",
            ekhlesen: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      {
                        $gte: ["$ekhlekhTsag", new Date()],
                      },
                      {
                        $lt: ["$duusakhTsag", new Date()],
                      },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            tulsun: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      {
                        $gte: ["$duusakhTsag", new Date()],
                      },
                      {
                        $eq: ["$tulburTulsunEsekh", true],
                      },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            tuluugui: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      {
                        $gte: ["$duusakhTsag", new Date()],
                      },
                      {
                        $or: [
                          {
                            $eq: ["$tulburTulsunEsekh", false],
                          },
                          {
                            $not: ["$tulburTulsunEsekh"],
                          },
                        ],
                      },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            tsutsalsan: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$tuluv", -1],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
      ]);
      res.send(khariu);
    } catch (err) {
      next(err);
    }
  });
router
  .route("/togloomiinDunAvya")
  .post(tokenShalgakh, async (req, res, next) => {
    try {
      var ekhlekhOgnoo = new Date(req.body.ekhlekhOgnoo);
      var duusakhOgnoo = new Date(req.body.duusakhOgnoo);
      var khariu = await TogloomiinTuv(
        req.body.tukhainBaaziinKholbolt
      ).aggregate([
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
            _id: "id",
            dun: {
              $sum: "$niitDun",
            },
          },
        },
      ]);
      res.send(khariu);
    } catch (err) {
      next(err);
    }
  });
router
  .route("/togloomiinDunBoduulya")
  .post(tokenShalgakh, async (req, res, next) => {
    try {
      var minut = Number(req.body.minut);
      var dun = 0;
      var unuudur = new Date().getDay();
      var maxTsag = 0;
      var khariu = await TogloomiinTariff(
        req.body.tukhainBaaziinKholbolt
      ).findOne({
        udruud: unuudur,
        baiguullagiinId: req.body.baiguullagiinId,
      });
      if (khariu && khariu.tariffuud) {
        khariu.tariffuud.sort(function (a, b) {
          return a.minut - b.minut;
        });
        maxTsag = khariu.tariffuud[khariu.tariffuud.length - 1].minut;
        for await (const x of khariu.tariffuud) {
          dun = x.tariff;
          if (minut <= x.minut) {
            iluuGarsan = false;
            continue;
          }
        }
        if (maxTsag > minut) {
          var tsag = Math.ceil(maxTsag - minut / 60);
          dun = tsag * khariu.undsenTariff + dun;
        }
      }

      res.send({
        dun,
      });
    } catch (err) {
      next(err);
    }
  });
router
  .route("/togloomiinTulburTulye")
  .post(tokenShalgakh, async (req, res, next) => {
    try {
      var guilgeeniiTuukh = [];
      var guilgeenuud = req.body.tulbur;
      if (Array.isArray(guilgeenuud)) {
        guilgeenuud.forEach((mur) =>
          guilgeeniiTuukh.push(new TogloomiinTulbur(mur))
        );
      }
      guilgeeniiTuukh.forEach((mur) => (mur.ognoo = new Date()));
      await TogloomiinTuv(req.body.tukhainBaaziinKholbolt).findByIdAndUpdate(
        req.body.id,
        { tulburTulsunEsekh: true, tuluv: 1, tulbur: guilgeenuud }
      );
      await TogloomiinTulbur(req.body.tukhainBaaziinKholbolt).insertMany(
        guilgeenuud
      );
      res.send("Amjilttai");
    } catch (err) {
      next(err);
    }
  });

router.route("/khuukhedGargaya").post(tokenShalgakh, async (req, res, next) => {
  try {
    await TogloomiinTuv(req.body.tukhainBaaziinKholbolt).findByIdAndUpdate(
      req.body.id,
      { tuluv: 3, garsanTsag: new Date() }
    );
    res.send("Amjilttai");
  } catch (err) {
    next(err);
  }
});

router
  .route("/togloomTsutslaya")
  .post(tokenShalgakh, async (req, res, next) => {
    try {
      await TogloomiinTuv(req.body.tukhainBaaziinKholbolt).findByIdAndUpdate(
        req.body.id,
        { tuluv: -1, tsutsalsanShaltgaan: req.body.shaltgaan }
      );
      res.send("Amjilttai");
    } catch (err) {
      next(err);
    }
  });
module.exports = router;
