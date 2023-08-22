const express = require("express");
const router = express.Router();
const { tokenShalgakh, khuudaslalt, crud, UstsanBarimt } = require("zevbackv2");
const {
  Parking,
  Mashin,
  Uilchluulegch,
  ZogsooliinTulbur,
  uilchluulegchdiinToo,
  sdkData,
} = require("parking-v1");
const ZogsooliinIp = require("../models/zogsooliinIp");
const Khariltsagch = require("../models/khariltsagch");
const Sonorduulga = require("../models/sonorduulga");
const { sonorduulgaIlgeeye } = require("../controller/appNotification");
const lodash = require("lodash");
const moment = require("moment");

/*crud(router, "parking", Parking, UstsanBarimt, async (req, res, next) => {
    console.log('parking --- ', req.body);
});*/
crud(router, "parking", Parking, UstsanBarimt);
crud(router, "mashin", Mashin, UstsanBarimt);
crud(router, "zogsoolUilchluulegch", Uilchluulegch, UstsanBarimt);
/*
crud(router, "zogsoolUilchluulegch", async (req, res, next) => {
    console.log('zogsoolUilchluulegch --- ', req);
});
*/

/*router.post("/khaalganiiErkh", tokenShalgakh, async (req, res, next) => {
    console.log('req.query---req', req.body.query);
    try {
        const body = req.body.query;
        let bulk = [];
        if(body.khaalga?.length > 0){
            for await (const id of body.khaalga) {
                bulk.push({
                        updateOne: {
                            filter: { "khaalga._id": id },
                            update: {
                                "khaalga.ajiltnuud.id": body.ajiltan,
                            },
                        },
                    })
            }
        }
        if (bulk!==[])
            Parking(req.body.tukhainBaaziinKholbolt)
                .bulkWrite(bulk)
                .then((bulkWriteOpResult) => {
                    console.log("BULK update OK", bulkWriteOpResult);
                })
                .catch((err) => {
                    console.log("BULK update error", err);
                });

    } catch (error) {
        next(error);
    }
});*/

router.get("/zogsoolJagsaalt", tokenShalgakh, async (req, res, next) => {
  // console.log('req.query---', req.query);
  try {
    const body = req.query;
    if (!!body?.query) body.query = JSON.parse(body.query);
    if (!!body?.order) body.order = JSON.parse(body.order);
    if (!!body?.khuudasniiDugaar)
      body.khuudasniiDugaar = Number(body.khuudasniiDugaar);
    if (!!body?.khuudasniiKhemjee)
      body.khuudasniiKhemjee = Number(body.khuudasniiKhemjee);
    if (!!body?.search) body.search = String(body.search);

    khuudaslalt(Parking(req.body.tukhainBaaziinKholbolt), body)
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        next(err);
      });
  } catch (error) {
    next(error);
  }
});

router.post("/zogsoolUstgay", tokenShalgakh, async (req, res, next) => {
  // console.log('req.query1---', req.query);
  try {
    Parking(req.body.tukhainBaaziinKholbolt)
      .findOne({
        _id: req.body.id,
      })
      .then(async (result) => {
        var barimt = new UstsanBarimt(req.body.tukhainBaaziinKholbolt)();
        barimt.class = "Zogsool";
        barimt.object = result;
        if (req.body.nevtersenAjiltniiToken) {
          barimt.ajiltniiNer = req.body.nevtersenAjiltniiToken.ner;
          barimt.ajiltniiId = req.body.nevtersenAjiltniiToken.id;
        }
        barimt.baiguullagiinId = req.body.baiguullagiinId;
        barimt.isNew = true;
        barimt.save();
        Parking(req.body.tukhainBaaziinKholbolt)
          .deleteOne({
            _id: req.body.id,
          })
          .then((result1) => {
            res.send("Amjilttai");
          })
          .catch((err) => {
            next(err);
          });
      })
      .catch((err1) => {
        next(err1);
      });
  } catch (error) {
    next(error);
  }
});

router.post("/zogsoolSdkService", tokenShalgakh, async (req, res, next) => {
  try {
    if (req.body.mashiniiDugaar)
      req.body.mashiniiDugaar = req.body.mashiniiDugaar.replace(/\0/g, "");
    const medegdel = async (uilchluulegch, khariltsagchiinId) => {
      /**
       * Web.с машин бүртгэсэн тохиолдолд khariltsagchiinId байхгүй байгаа тул
       * зарим машин дээр khariltsagchiinId undefined ирж болно.
       * */
      var firebaseToken = req.body.firebaseToken;
      var kharilltsagch = await Khariltsagch(
        req.body.tukhainBaaziinKholbolt
      ).findOne({ _id: khariltsagchiinId });
      if (!!kharilltsagch) {
        const medeelel = {
          title: "Зогсоол",
          body: `<span>
          <div style="display:flex; flex-direction:row; justify-content:space-between">
            <p style="width:maxContent; text-align:left">Машин:</p>
            <p style="width:maxContent; text-align:right; color: #999999">${
              uilchluulegch.mashiniiDugaar
            }</p>
          </div>
          <div style="display:flex; flex-direction:row; justify-content:space-between">
            <p style="width:maxContent; text-align:left">Орсон:</p>
            <p style="width:maxContent; text-align:right; color: #999999">${moment(
              uilchluulegch.tuukh[0].tsagiinTuukh[0].orsonTsag
            ).format("YYYY/MM/DD HH:mm:ss")}</p>
          </div>
          <div style="display:flex; flex-direction:row; justify-content:space-between">
            <p style="width:maxContent; text-align:left">Гарсан:</p>
            <p style="width:maxContent; text-align:right; color: #999999">${moment(
              uilchluulegch.tuukh[0].tsagiinTuukh[0].garsanTsag
            ).format("YYYY/MM/DD HH:mm:ss")}</p>
          </div>
          <div style="display:flex; flex-direction:row; justify-content:space-between">
            <p style="width:maxContent; text-align:left">Хугацаа:</p>
            <p style="width:maxContent; text-align:right; color: #999999">${
              uilchluulegch.tuukh[0].niitKhugatsaa
            } мин</p>
          </div>
          <div style="display:flex; flex-direction:row; justify-content:space-between">
            <p style="width:maxContent; text-align:left">Дүн:</p>
            <p style="width:maxContent; text-align:right; color: #999999; font-weight: bold">${
              uilchluulegch.tuukh[0].tulukhDun
            } ₮</p>
          </div>
          </span>`,
        };
        firebaseToken = kharilltsagch.firebaseToken;
        sonorduulgaIlgeeye(firebaseToken, medeelel, (r) => {
          var sonorduulga = new Sonorduulga(req.body.tukhainBaaziinKholbolt)();
          sonorduulga.khariltsagchiinId = khariltsagchiinId;
          sonorduulga.baiguullagiinId = req.body.baiguullagiinId;
          sonorduulga.barilgiinId = req.body.barilgiinId;
          sonorduulga.zurgiinId = req.body.zurgiinId;
          if (khariltsagchiinId)
            sonorduulga.khuleenAvagchiinId = khariltsagchiinId;
          if (!req.body.turul) sonorduulga.turul = "medegdel";
          sonorduulga.title = medeelel.title;
          sonorduulga.message = medeelel.body;
          sonorduulga.kharsanEsekh = false;
          sonorduulga.save();
          var io = req.app.get("socketio");
          if (io) io.emit("khariltsagch" + khariltsagchiinId, sonorduulga);
        });
      }
    };
    const khariu = await sdkData(req, medegdel);
    console.log("zogsoolSdkService--- khariu ", khariu);
    res.send(khariu);
  } catch (err) {
    next(err);
  }
});

router
  .route("/zogsooliinTulburTulye")
  .post(tokenShalgakh, async (req, res, next) => {
    try {
      var guilgeenuud = req.body.tulbur;
      console.log("zogsooliinTulburTulye: ", guilgeenuud);
      if (Array.isArray(guilgeenuud)) {
        let tulbur = [];
        guilgeenuud.map((guilgee) => {
          tulbur.push({
            ognoo: guilgee.ognoo,
            turul: guilgee.turul,
            dun: guilgee.dun,
          });
        });
        await Uilchluulegch(req.body.tukhainBaaziinKholbolt).findByIdAndUpdate(
          req.body.id,
          {
            $set: {
              "tuukh.$[t].burtgesenAjiltaniiId":
                guilgeenuud[0].burtgesenAjiltaniiId,
              "tuukh.$[t].burtgesenAjiltaniiNer":
                guilgeenuud[0].burtgesenAjiltaniiNer,
              "tuukh.$[t].tulbur": tulbur,
              "tuukh.$[t].tuluv": 1,
            },
          },
          {
            arrayFilters: [
              {
                "t.zogsooliinId": guilgeenuud[0].zogsooliinId,
              },
            ],
          }
        );
      }
      /*var niitDun = lodash.sumBy(guilgeeniiTuukh, function (object) {
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
        if (mur.turul === "khunglukh") {
          update.khungulsunEsekh = true;
          update.khungulsunDun = mur.dun;
          update.niitDun = niitDun - mur.dun;
        } else if (mur.turul !== "khariult") {
          update.ebarimtAvakhDun = update.ebarimtAvakhDun + mur.dun;
        } else if (mur.turul === "khariult") {
          update.ebarimtAvakhDun = update.ebarimtAvakhDun - mur.dun;
        }
      });
      await Uilchluulegch(req.body.tukhainBaaziinKholbolt).findByIdAndUpdate(
        req.body.id,
        update
      );
      await ZogsooliinTulbur(req.body.tukhainBaaziinKholbolt).insertMany(
        guilgeeniiTuukh
      );*/
      res.send("Amjilttai");
    } catch (err) {
      next(err);
    }
  });

router.post(
  "/zogsooliinUdriinTailanAvya",
  tokenShalgakh,
  async (req, res, next) => {
    try {
      const udriinTailan = await Uilchluulegch(
        req.body.tukhainBaaziinKholbolt
      ).aggregate([
        {
          $match: {
            baiguullagiinId: req.body.baiguullagiinId,
            barilgiinId: req.body.barilgiinId,
            "tuukh.tsagiinTuukh.garsanTsag": {
              $gte: req.body.ekhlekhOgnoo,
              $lte: req.body.duusakhOgnoo,
            },
            "tuukh.tuluv": 1,
          },
        },
        {
          $unwind: "$tuukh",
        },
        {
          $unwind: "$tuukh.tulbur",
        },
        {
          $group: {
            _id: "$tuukh.tulbur.turul",
            niitDun: {
              $sum: "$tuukh.tulbur.dun",
            },
          },
        },
      ]);
      res.status(200).send(udriinTailan);
    } catch (error) {
      next(error);
    }
  }
);

router.get("/zogsooliinIpAvaya/:barilgiinId", async (req, res, next) => {
  try {
    const { db } = require("zevbackv2");
    if (req.params.barilgiinId) {
      ZogsooliinIp(db.erunkhiiKholbolt)
        .findOne({
          barilgiinId: req.params.barilgiinId,
        })
        .then((result) => {
          res.send(result);
        })
        .catch((err1) => {
          next(err1);
        });
    } else res.send("BarilgiinId baihgui bn");
  } catch (err) {
    next(err);
  }
});

router.post(
  "/zogsoolUilchluulegchdiinToo",
  tokenShalgakh,
  async (req, res, next) => {
    try {
      const result = await uilchluulegchdiinToo(req.body);
      console.log("/zogsoolUilchluulegchdiinToo", result);
      res.send(result);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/zogsoolUilchluulegchdiinDunAvay",
  tokenShalgakh,
  async (req, res, next) => {
    try {
      const match = {
        baiguullagiinId: req.body.baiguullagiinId,
        createdAt: {
          $gte: new Date(req.body.ekhlekhOgnoo),
          $lte: new Date(req.body.duusakhOgnoo),
        },
        "tuukh.zogsooliinId": { $exists: true },
        //"tuukh.zogsooliinId": req.body.zogsooliinId,
        // "tuukh.tuluv": 1,
      };
      if (!!req.body.barilgiinId) match.barilgiinId = req.body.barilgiinId;
      const query = [
        {
          $match: match,
        },
        {
          $project: {
            tuluv: {
              $first: "$tuukh.tuluv",
            },
            niitDun: {
              $sum: { $ifNull: ["$tuukh.tulukhDun", 0] },
            },
          },
        },
        {
          $group: {
            _id: "id",
            dun: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$tuluv", 1],
                  },
                  "$niitDun",
                  0,
                ],
              },
            },
            garsanKhaalga: !!req.body.garakhKhaalgaIp
              ? {
                  $sum: {
                    $cond: [
                      {
                        $eq: ["$garsanKhaalga", req.body.garakhKhaalgaIp],
                      },
                      "$niitDun",
                      0,
                    ],
                  },
                }
              : { $sum: 0 },
            niitDun: {
              $sum: { $ifNull: ["$niitDun", 0] },
            },
          },
        },
      ];
      const khariu = await Uilchluulegch(
        req.body.tukhainBaaziinKholbolt
      ).aggregate(query);
      res.send(khariu);
    } catch (err) {
      next(err);
    }
  }
);

router.post("/mashiniiTooAvya", tokenShalgakh, async (req, res, next) => {
  var query = [
    {
      $match: {
        baiguullagiinId: req.body.baiguullagiinId,
        barilgiinId: req.body.barilgiinId,
      },
    },
    {
      $group: {
        _id: "$turul",
        too: {
          $sum: 1,
        },
      },
    },
  ];
  Mashin(req.body.tukhainBaaziinKholbolt)
    .aggregate(query)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      next(err);
    });
});
module.exports = router;
