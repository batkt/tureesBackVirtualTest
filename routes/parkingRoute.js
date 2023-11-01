const express = require("express");
const router = express.Router();
const { tokenShalgakh, khuudaslalt, crud, UstsanBarimt } = require("zevbackv2");
const {
  Parking,
  Mashin,
  Uilchluulegch,
  ZogsooliinTulbur,
  uilchluulegchdiinToo,
  zogsoolTusBurUilchluulegchdiinToo,
  sdkData,
  uilchluulegchTseverliy,
  zogsooliinDunAvya,
  TokiMashin,
} = require("parking-v1");
const {
  zogsooloosEbarimtUusgye,
  ebarimtDuudya,
} = require("../routes/ebarimtRoute");
const ZogsooliinIp = require("../models/zogsooliinIp");
const Khariltsagch = require("../models/khariltsagch");
const Sonorduulga = require("../models/sonorduulga");
const Ebarimt = require("../models/ebarimt");

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

router.route("/zogsooliinTulburOrjIrlee").post(async (req, res, next) => {
  try {
    var baiguullagiinId = req.body.baiguullagiinId;
    var zogsooliinId = req.body.zogsooliinId;
    var tulsunDun = Number(req.body.tulsunDun);
    const { db } = require("zevbackv2");
    var kholbolt = db.kholboltuud.find(
      (a) => a.baiguullagiinId == baiguullagiinId
    );
    var shuukhKhugatsaa = new Date(
      Date.now() - 900000 //15 * 60 * 1000
    );
    var oldsonData = await Uilchluulegch(kholbolt).findOne({
      niitDun: tulsunDun,
      "tuukh.0.tsagiinTuukh.0.garsanTsag": {
        $gt: shuukhKhugatsaa,
      },
      "tuukh.0.tuluv": 0,
    });
    if (oldsonData) {
      await Uilchluulegch(kholbolt).findByIdAndUpdate(
        oldsonData._id,
        {
          $set: {
            "tuukh.$[t].burtgesenAjiltaniiId": "system",
            "tuukh.$[t].burtgesenAjiltaniiNer": "system",
            "tuukh.$[t].tulbur": [
              {
                ognoo: new Date(),
                turul: "khariltsakh",
                dun: tulsunDun,
              },
            ],
            "tuukh.$[t].tuluv": 1,
          },
        },
        {
          arrayFilters: [
            {
              "t.zogsooliinId": zogsooliinId,
            },
          ],
        }
      );
      const io = req.app.get("socketio");
      if (io) {
        io.emit(`zogsool${baiguullagiinId}`, {
          khaalgaTurul: "oroh",
          cameraIP: oldsonData.tuukh[0].garsanKhaalga,
        });
      }
    }
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.post(
  "/uilchluulegchTseverliy",
  tokenShalgakh,
  async (req, res, next) => {
    try {
      const result = await uilchluulegchTseverliy(req.body);
      res.send(result);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/zogsooliinUdriinTailanAvya",
  tokenShalgakh,
  async (req, res, next) => {
    try {
      var match = {
        "tuukh.tsagiinTuukh.garsanTsag": {
          $gte: new Date(req.body.ekhlekhOgnoo),
          $lte: new Date(req.body.duusakhOgnoo),
        },
        "tuukh.tuluv": 1,
      };

      if (req.body.garsanKhaalga !== null)
        match["tuukh.garsanKhaalga"] = req.body.garsanKhaalga;
      if (req.body.ajiltniiId !== null)
        match["tuukh.burtgesenAjiltaniiId"] = req.body.ajiltniiId;
      console.log("match", JSON.stringify(match, null, 4));
      const udriinTailan = await Uilchluulegch(
        req.body.tukhainBaaziinKholbolt
      ).aggregate([
        {
          $match: {
            baiguullagiinId: req.body.baiguullagiinId,
            barilgiinId: req.body.barilgiinId,
          },
        },
        {
          $unwind: "$tuukh",
        },
        {
          $unwind: "$tuukh.tulbur",
        },
        {
          $match: match,
        },
        {
          $group: {
            _id: "$tuukh.tulbur.turul",
            niitDun: {
              $sum: "$tuukh.tulbur.dun",
            },
            niitToo: { $sum: 1 },
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
  "/zogsoolTusBurUilchluulegchdiinToo",
  tokenShalgakh,
  async (req, res, next) => {
    try {
      const result = await zogsoolTusBurUilchluulegchdiinToo(req.body);
      console.log("/zogsoolTusBurUilchluulegchdiinToo", result);
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
        "tuukh.tsagiinTuukh.garsanTsag": {
          $gte: new Date(req.body.ekhlekhOgnoo),
          $lte: new Date(req.body.duusakhOgnoo),
        },
        // "tuukh.zogsooliinId": { $exists: true },
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
                    $eq: ["$tuukh.0.tuluv", 1],
                  },
                  { $ifNull: ["$niitDun", 0] },
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
                      { $ifNull: ["$niitDun", 0] },
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

router.get("/v1/parking", async (req, res, next) => {
  var jagsaalt = [];
  const { db } = require("zevbackv2");
  var kholboltuud = db.kholboltuud;
  var ekhlekhOgnoo = new Date(Date.now() - 86400000);
  var duusakhOgnoo = new Date(Date.now() - 86400000);
  ekhlekhOgnoo.setHours(0, 0, 0, 0);
  duusakhOgnoo.setHours(23, 59, 59, 999);
  if (kholboltuud) {
    for await (const kholbolt of kholboltuud) {
      var zogsooluud = await Parking(kholbolt).find({
        tokiNer: { $exists: true },
      });
      console.log(zogsooluud.length);
      for await (const zogsool of zogsooluud) {
        console.log(zogsool);
        if (!!zogsool) {
          var xariu = await Uilchluulegch(kholbolt).aggregate([
            {
              $match: {
                createdAt: {
                  $gte: ekhlekhOgnoo,
                  $lte: duusakhOgnoo,
                },
                baiguullagiinId: zogsool.baiguullagiinId,
              },
            },
            {
              $unwind: { path: "$tuukh" },
            },
            {
              $match: {
                "tuukh.garsanKhaalga": {
                  $exists: false,
                },
              },
            },
            {
              $group: {
                _id: {
                  id: "aa",
                  zogsool: "$tuukh.zogsooliinId",
                },
                too: {
                  $sum: 1,
                },
              },
            },
          ]);
          var parked = 0;
          if (xariu && xariu.length > 0) parked = xariu[0].too;
          jagsaalt.push({
            id: zogsool._id.toString(),
            name: zogsool.ner,
            slot: {
              outside: {
                total: zogsool.too,
                parked,
              },
            },
          });
        }
      }
    }
  }
  var butsaakhKhariu = {
    success: true,
    message: "Amjilttai",
  };
  /*data: [
    {
      id: "62bd5b52a9708728807b20a4",
      name: "Shangri-la",
      slot: {
        inside: {
          total: 200,
          parked: 100,
        },
        outside: {
          total: 200,
          parked: 100,
        },
      },
    },
  ],*/
  if (jagsaalt && jagsaalt.length > 0) butsaakhKhariu.data = jagsaalt;
  res.send(butsaakhKhariu);
});

router.get("/v1/search_car/:plate_number", async (req, res, next) => {
  const { db } = require("zevbackv2");
  var kholboltuud = db.kholboltuud;
  var bodsonDun = 0;
  var data;
  var message = "Amjilttai";
  var success = true;
  var oldsonMashin;
  if (kholboltuud) {
    for await (const kholbolt of kholboltuud) {
      var zogsooluud = await Parking(kholbolt).find({
        tokiNer: { $exists: true },
      });
      for await (const zogsool of zogsooluud) {
        console.log(zogsool);
        if (!!zogsool) {
          oldsonMashin = await Uilchluulegch(kholbolt).findOne({
            "tuukh.0.zogsooliinId": zogsool._id,
            mashiniiDugaar: req.params.plate_number,
            $or: [
              {
                "tuukh.0.tsagiinTuukh.0.garsanTsag": {
                  $gt: new Date(Date.now() - 100000), //1.30sec in dotor
                },
              },
              {
                "tuukh.0.tsagiinTuukh.0.garsanTsag": {
                  $exists: false,
                },
              },
            ],
            "tuukh.0.tuluv": {
              $nin: [-2, -3],
            },
            tuukh: {
              $size: 1,
            },
          });
          if (!!oldsonMashin && !!oldsonMashin.mashiniiDugaar)
            bodsonDun = await zogsooliinDunAvya(
              zogsool,
              oldsonMashin,
              kholbolt
            );
        }
        if (bodsonDun > 0) {
          var tulburuud = oldsonMashin.tuukh[0].tulbur;
          var niitTulsunDun = 0;
          if (tulburuud) {
            niitTulsunDun = lodash.sumBy(tulburuud, function (object) {
              return object.dun;
            });
          }
          data = {
            plate_number: req.params.plate_number,
            enter_date: moment(
              oldsonMashin.tuukh[0].tsagiinTuukh[0].orsonTsag
            ).format("YYYY/MM/DD HH:mm:ss"),
            pay_amount: bodsonDun - niitTulsunDun,
            parking_id: zogsool._id,
            session_id: oldsonMashin._id,
          };
          break;
        } else if (oldsonMashin && !!oldsonMashin.mashiniiDugaar) {
          data = {
            plate_number: req.params.plate_number,
            enter_date: moment(
              oldsonMashin.tuukh[0].tsagiinTuukh[0].orsonTsag
            ).format("YYYY/MM/DD HH:mm:ss"),
            pay_amount: 0,
            parking_id: zogsool._id,
            session_id: oldsonMashin._id,
          };
          break;
        }
      }
      if (data && data.plate_number) break;
    }
  }

  if (!oldsonMashin) {
    message = "Машины мэдээлэл олдсонгүй!";
    success = false;
  }
  var butsaakhKhariu = {
    success,
    message,
    data,
  };
  res.send(butsaakhKhariu);
});

router.get("/v1/car/:session_id", async (req, res, next) => {
  const { db } = require("zevbackv2");
  var kholboltuud = db.kholboltuud;
  var data;
  var message = "Amjilttai";
  var oldsonMashin;
  var success = true;
  if (kholboltuud) {
    for await (const kholbolt of kholboltuud) {
      var zogsooluud = await Parking(kholbolt).find({
        tokiNer: { $exists: true },
      });
      for await (const zogsool of zogsooluud) {
        console.log(zogsool);
        if (!!zogsool) {
          oldsonMashin = await Uilchluulegch(kholbolt).findById(
            req.params.session_id
          );
          if (!oldsonMashin) {
            message = "Мэдээлэл олдсонгүй!";
            success = false;
          }
          if (!!oldsonMashin && !!oldsonMashin.mashiniiDugaar) {
            data = {
              plate_number: req.params.plate_number,
              enter_date: moment(
                oldsonMashin.tuukh[0].tsagiinTuukh[0].orsonTsag
              ).format("YYYY/MM/DD HH:mm:ss"),
              out_date: moment(
                oldsonMashin.tuukh[0].tsagiinTuukh[0].garsanTsag
              ).format("YYYY/MM/DD HH:mm:ss"),
              pay_amount: oldsonMashin.niitDun,
              paid_amount:
                (oldsonMashin.tuukh[0].tulbur &&
                  oldsonMashin.tuukh[0].tulbur.length) > 0
                  ? oldsonMashin.niitDun
                  : 0,
              parking_id: zogsool._id,
              session_id: oldsonMashin._id,
            };
            break;
          }
        }
      }
      if (!!oldsonMashin && !!oldsonMashin.mashiniiDugaar) break;
    }
  }
  var butsaakhKhariu = {
    success,
    message,
    data,
  };
  res.send(butsaakhKhariu);
});

router.post("/v1/car_add", async (req, res, next) => {
  const { db } = require("zevbackv2");
  var erunkhiiKholbolt = db.erunkhiiKholbolt;
  var message = "Amjilttai";
  await TokiMashin(erunkhiiKholbolt).insertMany([
    {
      mashiniiDugaar: req.body.plate_number,
    },
  ]);
  var success = true;
  var butsaakhKhariu = {
    success,
    message,
  };
  res.send(butsaakhKhariu);
});

router.route("/v1/pay").post(async (req, res, next) => {
  try {
    /*{
      "session_id":"",
      "paid_amount": 1622.0,
      "plate_number": "7120СЭА",
      "individual": true, //true = xuwi xun, false = baiguullaga
      "customer_no": "",
      "door_id": "",
      "manually_open": true
     }*/
    let tulbur = [
      {
        ognoo: new Date(),
        turul: "toki",
        dun: req.body.paid_amount,
      },
    ];
    const { db } = require("zevbackv2");
    var kholboltuud = db.kholboltuud;
    var message = "Amjilttai";
    var oldsonMashin;
    var tukhainKholbolt;
    var tukhainObject;
    var tukhainZogsool;
    var success = true;
    if (kholboltuud) {
      for await (const kholbolt of kholboltuud) {
        console.log("1");
        var zogsooluud = await Parking(kholbolt).find({
          tokiNer: { $exists: true },
        });
        for await (const zogsool of zogsooluud) {
          if (!!zogsool) {
            console.log("2");
            console.log("kholbolt  ", kholbolt.baaziinNer);
            if (!!req.body.manually_open) {
              oldsonMashin = await Uilchluulegch(kholbolt).find({
                "tuukh.0.zogsooliinId": zogsool._id,
                mashiniiDugaar: req.body.plate_number,
                "tuukh.0.tsagiinTuukh.0.garsanTsag": {
                  $exists: true,
                },
                "tuukh.0.tuluv": {
                  $nin: [-2, -3],
                },
                updatedAt: {
                  $gt: new Date(Date.now() - 900000), //15min dotor
                },
              });
              if (oldsonMashin && oldsonMashin.length > 0)
                oldsonMashin = oldsonMashin[0];
            } else {
              oldsonMashin = await Uilchluulegch(kholbolt).findOne({
                "tuukh.0.zogsooliinId": zogsool._id,
                mashiniiDugaar: req.body.plate_number,
                "tuukh.0.tsagiinTuukh.0.garsanTsag": {
                  $exists: false,
                },
                "tuukh.0.tuluv": {
                  $nin: [-2, -3],
                },
              });
            }
            if (!!oldsonMashin && !!oldsonMashin.mashiniiDugaar) {
              tukhainKholbolt = kholbolt;
              tukhainZogsool = zogsool;
              tukhainObject = oldsonMashin;
              break;
            }
          }
          if (!!oldsonMashin && !!oldsonMashin.mashiniiDugaar) break;
        }
        if (!!oldsonMashin && !!oldsonMashin.mashiniiDugaar) break;
      }
    }
    var butsaakhKhariu = {
      success,
      message,
    };
    console.log("oldsonMashin pay", tukhainObject);
    if (!tukhainObject) {
      res.send({ success: false, message: "Машины мэдээлэл олдсонгүй!" });
    }
    if (
      tukhainObject &&
      tukhainObject.tuukh &&
      tukhainObject.tuukh.length > 0
    ) {
      if (tukhainObject.tuukh && tukhainObject.tuukh.length > 0)
        if (
          tukhainObject.tuukh[0].tulbur &&
          tukhainObject.tuukh[0].tulbur.length > 0
        )
          tukhainObject.tuukh[0].tulbur.push(...tulbur);
        else tukhainObject.tuukh[0].tulbur = tulbur;

      await Uilchluulegch(tukhainKholbolt).findByIdAndUpdate(
        tukhainObject._id,
        {
          $set: {
            "tuukh.$[t].tulbur": tukhainObject.tuukh[0].tulbur,
            "tuukh.$[t].tuluv": 1,
            tokiId: "toki",
            garakhTsag: new Date(new Date().getTime() + 30 * 60000),
          },
        },
        {
          arrayFilters: [
            {
              "t.zogsooliinId": tukhainZogsool._id,
            },
          ],
        }
      );
      tukhainObject.niitDun = req.body.paid_amount;
      var ebarimt = await zogsooloosEbarimtUusgye(
        tukhainObject,
        req.body.customer_no,
        req.body.individual ? null : "3",
        tukhainKholbolt
      );
      butsaakhMethod = function (d) {
        try {
          if (!d.success) throw new Error(d.message);
          var ebarimt = new Ebarimt(tukhainKholbolt)(d);
          ebarimt.save().catch((err) => {
            next(err);
          });
          var update = { ebarimtAvsanEsekh: true };
          if (ebarimt.customerNo)
            update = {
              ...update,
              ebarimtRegister: ebarimt.customerNo,
            };
          Uilchluulegch(tukhainKholbolt)
            .findByIdAndUpdate(tukhainObject._id, update)
            .then((xariu) => {
              console.log("xariu", xariu);
            })
            .catch((err) => {
              console.log(err);
            });
          delete d.baiguullagiinId;
          delete d.zogsooliinId;
          delete d.barilgiinId;
          delete d._id;
          console.log("ebarimt duuslaa");
          butsaakhKhariu.data = d;
          res.send(butsaakhKhariu);
        } catch (err) {
          next(err);
        }
      };

      ebarimtDuudya(ebarimt, butsaakhMethod, next);
    }
    if (!!req.body.manually_open && tukhainObject && tukhainObject.tuukh) {
      const io = req.app.get("socketio");
      io.emit(`zogsool${tukhainObject.baiguullagiinId}`, {
        khaalgaTurul: "oroh",
        turul: "toki",
        mashiniiDugaar: req.body.plate_number,
        cameraIP: tukhainObject.tuukh[0].garsanKhaalga,
      });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
