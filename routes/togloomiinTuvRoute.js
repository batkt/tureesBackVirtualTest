const express = require("express");
const router = express.Router();
const { crud, UstsanBarimt, tokenShalgakh } = require("zevbackv2");
const TogloomiinTariff = require("../models/togloomiinTariff");
const TogloomiinTuv = require("../models/togloomiinTuv");
const TogloomiinTulbur = require("../models/togloomiinTulbur");
const lodash = require("lodash");

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
                        $ne: ["$tuluv", -1],
                      },
                      {
                        $lte: ["$ekhlekhTsag", new Date()],
                      },
                      {
                        $gt: ["$duusakhTsag", new Date()],
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
                        $lte: ["$duusakhTsag", new Date()],
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
                        $ne: ["$tuluv", -1],
                      },
                      {
                        $lte: ["$duusakhTsag", new Date()],
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
            khungulsun: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      {
                        $ne: ["$tuluv", -1],
                      },
                      {
                        $eq: ["$khungulsunEsekh", true],
                      },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            garsan: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      {
                        $eq: ["$tuluv", 3],
                      },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            sungasan: {
              $sum: {
                $cond: ["$sungalt.0", 1, 0],
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
            tuluv: {
              $ne: -1,
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
      var asragchiinToo = Number(req.body.asragchiinToo);
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
        console.log("maxTsag", maxTsag);
        for await (const x of khariu.tariffuud) {
          dun = x.tariff;
          if (minut <= x.minut) break;
        }
        if (minut > maxTsag) {
          var tsag = Math.ceil((minut - maxTsag) / 60);
          console.log("tsag", tsag);
          console.log("khariu.undsenTariff", khariu.undsenTariff);
          dun = tsag * khariu.undsenTariff + dun;
        }
        if (asragchiinToo > 1) {
          var asragchTariff = Number(khariu.asragchTariff);
          if (asragchTariff > 0) {
            asragchiinDun = (asragchiinToo - 1) * asragchTariff;
            dun = dun + asragchiinDun;
          }
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
          guilgeeniiTuukh.push(
            new TogloomiinTulbur(req.body.tukhainBaaziinKholbolt)(mur)
          )
        );
      }
      var niitDun = lodash.sumBy(guilgeeniiTuukh, function (object) {
        return object.dun;
      });
      var update = {
        tulburTulsunEsekh: true,
        tuluv: 1,
        tulbur: guilgeeniiTuukh,
        dutuuDun: 0,
        ebarimtAvakhDun: 0,
      };
      guilgeeniiTuukh.forEach((mur) => {
        mur.ognoo = new Date();
        if (mur.turul == "khunglukh") {
          update.khungulsunEsekh = true;
          update.khungulsunDun = mur.dun;
          update.niitDun = niitDun - mur.dun;
        } else if (mur.turul != "khariult") {
          update.ebarimtAvakhDun = update.ebarimtAvakhDun + mur.dun;
        } else if (mur.turul == "khariult") {
          update.ebarimtAvakhDun = update.ebarimtAvakhDun - mur.dun;
        }
      });
      await TogloomiinTuv(req.body.tukhainBaaziinKholbolt).findByIdAndUpdate(
        req.body.id,
        update
      );
      await TogloomiinTulbur(req.body.tukhainBaaziinKholbolt).insertMany(
        guilgeeniiTuukh
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
        { tuluv: -1, tsutsalsanShaltgaan: req.body.shaltgaan, niitDun: 0 }
      );
      res.send("Amjilttai");
    } catch (err) {
      next(err);
    }
  });

router.route("/togloomSungaya").post(tokenShalgakh, async (req, res, next) => {
  try {
    var umnukh = await TogloomiinTuv(req.body.tukhainBaaziinKholbolt).findOne({
      _id: req.body.id,
    });
    if (!umnukh || !umnukh.tulburTulsunEsekh || !umnukh.ebarimtAvsanEsekh)
      throw new Error(
        "Зөвхөн төлбөр төлж ИБаримт авсаны дараагаар сунгах боломжтой!"
      );
    if (umnukh.sungalt && umnukh.sungalt.length > 0) {
      umnukh.sungalt.push({
        khugatsaa: req.body.khugatsaa,
        niitDun: umnukh.niitDun + req.body.niitDun,
        ekhlekhTsag: req.body.ekhlekhTsag,
        duusakhTsag: req.body.duusakhTsag,
      });
    } else {
      umnukh.sungalt = [
        {
          khugatsaa: req.body.khugatsaa,
          niitDun: umnukh.niitDun + req.body.niitDun,
          ekhlekhTsag: req.body.ekhlekhTsag,
          duusakhTsag: req.body.duusakhTsag,
        },
      ];
    }
    umnukh.duusakhTsag = req.body.duusakhTsag;
    umnukh.tulburTulsunEsekh = false;
    umnukh.ebarimtAvsanEsekh = false;
    umnukh.dutuuDun = req.body.niitDun;
    umnukh.niitDun = umnukh.niitDun + req.body.niitDun;
    umnukh.sungasanMinut =
      (umnukh.sungasanMinut ? umnukh.sungasanMinut : 0) + req.body.khugatsaa;
    await TogloomiinTuv(req.body.tukhainBaaziinKholbolt).findByIdAndUpdate(
      umnukh._id,
      umnukh
    );
    res.send("Amjilttai");
  } catch (err) {
    next(err);
  }
});

async function dunBoduulya(tukhainBaaziinKholbolt, minut, asragchiinToo) {
  var dun = 0;
  var unuudur = new Date().getDay();
  var maxTsag = 0;
  var khariu = await TogloomiinTariff(tukhainBaaziinKholbolt).findOne({
    udruud: unuudur,
    baiguullagiinId: baiguullagiinId,
  });
  if (khariu && khariu.tariffuud) {
    khariu.tariffuud.sort(function (a, b) {
      return a.minut - b.minut;
    });
    maxTsag = khariu.tariffuud[khariu.tariffuud.length - 1].minut;
    console.log("maxTsag", maxTsag);
    for await (const x of khariu.tariffuud) {
      dun = x.tariff;
      if (minut <= x.minut) break;
    }
    if (minut > maxTsag) {
      var tsag = Math.ceil((minut - maxTsag) / 60);
      console.log("tsag", tsag);
      console.log("khariu.undsenTariff", khariu.undsenTariff);
      dun = tsag * khariu.undsenTariff + dun;
    }
    if (asragchiinToo > 1) {
      var asragchTariff = Number(khariu.asragchTariff);
      if (asragchTariff > 0) {
        asragchiinDun = (asragchiinToo - 1) * asragchTariff;
        dun = dun + asragchiinDun;
      }
    }
    return dun;
  }
}
router
  .route("/togloomiinTuvKhadgalya")
  .post(tokenShalgakh, async (req, res, next) => {
    try {
      var togloomiinTuv = new TogloomiinTuv(req.body.tukhainBaaziinKholbolt)(
        req.body
      );
      var minut = Number(togloomiinTuv.khugatsaa);
      var asragchiinToo = Number(
        togloomiinTuv.asragchiinTurul ? togloomiinTuv.asragchiinTurul.length : 0
      );
      togloomiinTuv.niitDun = await dunBoduulya(
        req.body.tukhainBaaziinKholbolt,
        minut,
        asragchiinToo
      );
      togloomiinTuv
        .save()
        .then((result) => {
          res.send("Amjilttai");
        })
        .catch((er) => {
          next(er);
        });
    } catch (err) {
      next(err);
    }
  });
module.exports = router;
