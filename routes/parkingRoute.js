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
  uilchluulegchGaraasBurtgey,
} = require("parking-v1");
const {
  zogsooloosEbarimtUusgye,
  zogsooloosEbarimtShineUusgye,
  ebarimtDuudya,
} = require("../routes/ebarimtRoute");
const ZogsooliinIp = require("../models/zogsooliinIp");
const Khariltsagch = require("../models/khariltsagch");
const Sonorduulga = require("../models/sonorduulga");
const Ebarimt = require("../models/ebarimt");
const EbarimtShine = require("../models/ebarimtShine");

const { sonorduulgaIlgeeye } = require("../controller/appNotification");
const lodash = require("lodash");
const moment = require("moment");
const Baiguullaga = require("../models/baiguullaga");

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
    if (!!req?.body?.color) {
      console.log("Color", req.body.color);
    }
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
        sonorduulgaIlgeeye(
          firebaseToken,
          medeelel,
          (r) => {
            var sonorduulga = new Sonorduulga(
              req.body.tukhainBaaziinKholbolt
            )();
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
          },
          next
        );
      }
    };

    var zogsooluud = await (Parking)(req.body.tukhainBaaziinKholbolt).find({
      'khaalga.camera.cameraIP': req.body.CAMERA_IP,
      'khaalga.camera.turul': 'Орох',
    });
    var zogsool = {};
    if (zogsooluud.length > 0) {
      zogsool = zogsooluud[0];
    }
    req.body.ekhlekhOgnoo = moment().startOf("day").format("YYYY-MM-DD 00:00:00");
    req.body.duusakhOgnoo = moment().endOf("day").format("YYYY-MM-DD 23:59:59")
    const zogsoolResult = await zogsoolTusBurUilchluulegchdiinToo(req.body);
    const filterData = zogsoolResult?.filter((mur) => JSON.stringify(mur?._id?.zogsool) === JSON.stringify(zogsool?._id));
    var sulToo = (zogsool.too || 0) - (filterData?.length > 0 ? filterData[0].too : 0);
    console.log("CAMERA_IP ----------------->>>" + req.body.CAMERA_IP);
    console.log("sulToo ----------------->>>" + sulToo);
    if(zogsool?.zogsoolTooKhyazgaarlakhEsekh && (sulToo === 0 || sulToo <= -1))
    {
      const io = req.app.get("socketio");
      if (io) {
        io.emit(`zogsool${zogsool?.baiguullagiinId}`, {
          khaalgaTurul: "oroh",
          cameraIP: req.body.CAMERA_IP,
          mashiniiDugaar: "Зогсоол дүүрсэн",
        });
      }
      console.log("----------------->>>Зогсоол дүүрсэн");
      res.send({aldaa: "Зогсоол дүүрсэн"});
    }
    else
    {
      const khariu = await sdkData(req, medegdel);
      res.send(khariu);
    }
  } catch (err) {
    next(err);
  }
});

router.post("/zogsoolMobileSdk", tokenShalgakh, async (req, res, next) => {
  try {
    console.log("mashiniiDugaar ----------------->>" + req.body.mashiniiDugaar);
    console.log("cameraIP ----------------->>" + req.body.cameraIP);
    if(req.body.baiguullagiinId === "6715ef2ca5cefb3e54505428")
    {
      const io = req.app.get("socketio");
      if(io)
      {
        io.emit(`qpayMobileSdk${req.body.baiguullagiinId}`, {
          khaalgaTurul: "Гарах",
          turul: "qpayMobile",
          mashiniiDugaar: req.body.mashiniiDugaar,
          cameraIP: req.body.cameraIP,
        });
      }
    }
    res.send(req.body.mashiniiDugaar);
  } catch (err) {
    next(err);
  }
});

router
  .route("/zogsoolOrlogoGaraas")
  .post(tokenShalgakh, async (req, res, next) => {
    try {
      const utguud = req.body;
      if (!utguud.mashiniiDugaar) {
        throw new Error("Машиний дугаар оруулна уу");
      }
      if (!utguud.tulukhDun) {
        throw new Error("Төлөх дүн оруулна уу");
      }
      if (!utguud.orsonCamera) {
        throw new Error("Орох камер бүртгэгдээгүй байна");
      }
      if (!utguud.garsanCamera) {
        throw new Error("Гарах камер бүртгэгдээгүй байна");
      }
      const response = await uilchluulegchGaraasBurtgey({ body: utguud });
      if (response) {
        res.status(200).send(response);
      }
    } catch (error) {
      next(error);
    }
  });

router
  .route("/zogsooliinTulburTulye")
  .post(tokenShalgakh, async (req, res, next) => {
    try {
      var uurchlukhTuluv = 1;
      var guilgeenuud = req.body.tulbur;
      if (Array.isArray(guilgeenuud)) {
        let tulbur = [];
        guilgeenuud.map((guilgee) => {
          tulbur.push({
            ognoo: guilgee.ognoo,
            turul: guilgee.turul,
            dun: guilgee.dun,
          });
        });
        if (!!req.body.urdchilsan) {
          uurchlukhTuluv = 0;
        }
        await Uilchluulegch(req.body.tukhainBaaziinKholbolt).updateOne(
          {
            _id: req.body.id,
            tuukh: {
              $elemMatch: { zogsooliinId: guilgeenuud[0].zogsooliinId },
            },
          },
          {
            $set: {
              "tuukh.$.burtgesenAjiltaniiId":
                guilgeenuud[0].burtgesenAjiltaniiId,
              "tuukh.$.burtgesenAjiltaniiNer":
                guilgeenuud[0].burtgesenAjiltaniiNer,
              "tuukh.$.tulbur": tulbur,
              "tuukh.$.tuluv": uurchlukhTuluv,
            },
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
    var nemeltUtga = req.body.nemeltUtga;
    var tulsunDun = Number(req.body.tulsunDun);
    var shineDun = 0;
    if (
      baiguullagiinId == "65435cdff2f5358696c61454" ||
      baiguullagiinId == "663da696aa6bedd9ae0567f0"
    ) {
      tulsunDun = tulsunDun + 50; //sms 50tug
    }
    shineDun =
      (await Math.round((tulsunDun + tulsunDun / 99 + Number.EPSILON) * 100)) /
      100;
    const { db } = require("zevbackv2");
    var kholbolt = db.kholboltuud.find(
      (a) => a.baiguullagiinId == baiguullagiinId
    );
    var shuukhKhugatsaa = new Date(
      Date.now() - 300000 //5 * 60 * 1000
    );
    var query = {
      $or: [
        {
          niitDun: tulsunDun,
        },
        {
          niitDun: shineDun > 0 ? shineDun : tulsunDun,
        },
      ],
      tokiId: { $exists: false },
      "tuukh.0.tsagiinTuukh.0.garsanTsag": {
        $gt: shuukhKhugatsaa,
      },
      "tuukh.0.tuluv": 0,
    }
    if(baiguullagiinId == "6115f350b35689cdbf1b9da3")
    {
      if(!!nemeltUtga && (nemeltUtga.includes("Хаалт 1")||nemeltUtga.includes("ХААЛТ 1")))
        {
          query["tuukh.0.garsanKhaalga"] = "192.168.1.202"
        }
      else if(!!nemeltUtga && (nemeltUtga.includes("Хаалт 2")||nemeltUtga.includes("ХААЛТ 2")))
        {
          query["tuukh.0.garsanKhaalga"] = "192.168.1.204"
        }
      else if(!!nemeltUtga && (nemeltUtga.includes("Хаалт 3")||nemeltUtga.includes("ХААЛТ 3")))
        {
          query["tuukh.0.garsanKhaalga"] = "192.168.1.207"
        }
      else if(!!nemeltUtga && (nemeltUtga.includes("Хаалт 4")||nemeltUtga.includes("ХААЛТ 4")))
        {
          query["tuukh.0.garsanKhaalga"] = "192.168.1.205"
        }
    }
    var oldsonData = await Uilchluulegch(kholbolt).findOne(query);
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
      Uilchluulegch(kholbolt).deleteOne({
        mashiniiDugaar: oldsonData.mashiniiDugaar,
        "tuukh.0.tsagiinTuukh.0.garsanTsag": {
          $exists: false,
        },
        "tuukh.0.tuluv": {
          $ne: -2,
        },
        "tuukh.zogsooliinId": { $ne: zogsooliinId },
      });
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
      const match = !!req.body.garsanKhaalga
        ? {
            "tuukh.garsanKhaalga": !!req.body.garsanKhaalga
              ? req.body.garsanKhaalga
              : { $exists: true },
            "tuukh.tsagiinTuukh.garsanTsag": {
              $gte: new Date(req.body.ekhlekhOgnoo),
              $lte: new Date(req.body.duusakhOgnoo),
            },
          }
        : {
            "tuukh.tulbur.ognoo": {
              $gte: new Date(req.body.ekhlekhOgnoo),
              $lte: new Date(req.body.duusakhOgnoo),
            },
          };
      if (!!req.body.burtgesenAjiltaniiId)
        match["tuukh.burtgesenAjiltaniiId"] = req.body.burtgesenAjiltaniiId;
      var udriinTailan = await Uilchluulegch(
        req.body.tukhainBaaziinKholbolt
      ).aggregate([
        {
          $match: {
            baiguullagiinId: req.body.baiguullagiinId,
            barilgiinId: !!req.body.barilgiinId
              ? req.body.barilgiinId
              : { $exists: true },
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
      var zurchiltei = await Uilchluulegch(
        req.body.tukhainBaaziinKholbolt
      ).aggregate([
        {
          $match: {
            baiguullagiinId: req.body.baiguullagiinId,
            barilgiinId: !!req.body.barilgiinId
              ? req.body.barilgiinId
              : { $exists: true },
          },
        },
        {
          $unwind: "$tuukh",
        },
        {
          $match: {
            "tuukh.tsagiinTuukh.garsanTsag": {
              $gte: new Date(req.body.ekhlekhOgnoo),
              $lte: new Date(req.body.duusakhOgnoo),
            },
            "tuukh.tuluv": -2,
          },
        },
        {
          $group: {
            _id: "Зөрчилтэй",
            niitDun: {
              $sum: "$niitDun",
            },
            niitToo: { $sum: 1 },
          },
        },
      ]);

      var unegui = await Uilchluulegch(
        req.body.tukhainBaaziinKholbolt
      ).aggregate([
        {
          $match: {
            baiguullagiinId: req.body.baiguullagiinId,
            barilgiinId: !!req.body.barilgiinId
              ? req.body.barilgiinId
              : { $exists: true },
          },
        },
        {
          $unwind: "$tuukh",
        },
        {
          $match: {
            "tuukh.tsagiinTuukh.garsanTsag": {
              $gte: new Date(req.body.ekhlekhOgnoo),
              $lte: new Date(req.body.duusakhOgnoo),
            },
            "tuukh.uneguiGarsan": { $exists: true },
          },
        },
        {
          $group: {
            _id: "Үнэгүй",
            niitDun: {
              $sum: "$niitDun",
            },
            niitToo: { $sum: 1 },
          },
        },
      ]);
      if (
        !!udriinTailan &&
        udriinTailan.length > 0 &&
        req.body.baiguullagiinId != "657915f5b7453f90155dce6b"
      ) {
        if (!!zurchiltei && zurchiltei.length > 0)
          udriinTailan.push(zurchiltei[0]);
        if (!!unegui && unegui.length > 0) udriinTailan.push(unegui[0]);
      }
      res.status(200).send(udriinTailan);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/zogsooliinIpAvaya/:barilgiinId",
  tokenShalgakh,
  async (req, res, next) => {
    try {
      //const { db } = require("zevbackv2");
      if (req.params.barilgiinId) {
        Parking(req.body.tukhainBaaziinKholbolt)
          .find({
            barilgiinId: req.params.barilgiinId,
          })
          .then((result) => {
            let yavuulakhIp = [];
            let yavuulakhData = {};
            if (result.length > 0) {
              for (const zogsool of result) {
                for (const khaalga of zogsool.khaalga) {
                  for (const cameraIp of khaalga.camera) {
                    yavuulakhIp.push(cameraIp.cameraIP);
                  }
                }
              }
            }
            yavuulakhData.ip = yavuulakhIp;
            yavuulakhData.baiguullagiinId = req.body.baiguullagiinId;
            yavuulakhData.barilgiinId = req.params.barilgiinId;
            res.send(yavuulakhData);
          })
          .catch((err1) => {
            next(err1);
          });
      } else res.send("BarilgiinId baihgui bn");
    } catch (err) {
      next(err);
    }
  }
);

router.post("/tsenegleltKhiiy", tokenShalgakh, async (req, res, next) => {
  try {
    const baiguullagiinId = req.body.baiguullagiinId;
    const barilgiinId = req.body.barilgiinId;
    const mashiniiId = req.body.mashiniiId;
    const tseneglekhDun = req.body.dun;
    if (!mashiniiId) {
      throw new Error("Дахин оролдоно уу");
    }
    if (!tseneglekhDun || tseneglekhDun == 0) {
      throw new Error("Цэнэглэлтийн дүн хоосон болон 0 байж болохгүй");
    }
    const tukhainMashin = await Mashin(req.body.tukhainBaaziinKholbolt).findOne(
      {
        _id: mashiniiId,
        baiguullagiinId: baiguullagiinId,
        barilgiinId: barilgiinId,
      }
    );
    if (!tukhainMashin) {
      throw new Error("Машин олдсонгүй. Та дахин оролдоно уу");
    }
    const umnukhUldegdel = tukhainMashin.tsenegleltUldegdel
      ? tukhainMashin.tsenegleltUldegdel
      : 0;
    tukhainMashin.tsenegleltUldegdel = umnukhUldegdel + tseneglekhDun;
    if (
      tukhainMashin.tsenegleltTuukh &&
      tukhainMashin.tsenegleltTuukh.length > 0
    ) {
      tukhainMashin.tsenegleltTuukh.push({
        ognoo: new Date(),
        turul: "orlogo",
        dun: tseneglekhDun,
        uldegdel: tukhainMashin.tsenegleltUldegdel,
      });
    } else {
      tukhainMashin.tsenegleltTuukh = [
        {
          ognoo: new Date(),
          turul: "orlogo",
          dun: tseneglekhDun,
          uldegdel: tukhainMashin.tsenegleltUldegdel,
        },
      ];
    }
    await tukhainMashin.save();
    res.status(200).send("Amjilttai");
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
        mashiniiDugaar: { $regex: "[a-z\u0400-\u04FF]" },
        // "tuukh.tsagiinTuukh.garsanTsag": {
        //   $gte: new Date(req.body.ekhlekhOgnoo),
        //   $lte: new Date(req.body.duusakhOgnoo),
        // },
        // "tuukh.zogsooliinId": { $exists: true },
        //"tuukh.zogsooliinId": req.body.zogsooliinId,
      };
      if (!!req.body.barilgiinId) match.barilgiinId = req.body.barilgiinId;
      const query = [
        {
          $match: match,
        },
        { $unwind: "$tuukh" },
        {
          $unwind: { path: "$tuukh.tulbur", preserveNullAndEmptyArrays: true },
        },
        {
          $match: {
            "tuukh.tulbur.ognoo": {
              $gte: new Date(req.body.ekhlekhOgnoo),
              $lte: new Date(req.body.duusakhOgnoo),
            },
          },
        },
        {
          $group: {
            _id: {
              id: "$tuukh._id",
              tuluv: "$tuukh.tuluv",
              tulukhDun: "$tuukh.tulukhDun",
            },
            tulsunDun: {
              $sum: {
                $cond: [
                  { $ne: ["$tuukh.tulbur.turul", "khungulult"] },
                  { $ifNull: ["$tuukh.tulbur.dun", 0] },
                  0,
                ],
              },
            },
            khungulult: {
              $sum: {
                $cond: [
                  { $eq: ["$tuukh.tulbur.turul", "khungulult"] },
                  { $ifNull: ["$tuukh.tulbur.dun", 0] },
                  0,
                ],
              },
            },
          },
        },
        {
          $group: {
            _id: "id",
            dun: { $sum: "$tulsunDun" },
            garsanKhaalga: !!req.body.garakhKhaalgaIp
              ? {
                  $sum: {
                    $cond: [
                      {
                        $eq: ["$garsanKhaalga", req.body.garakhKhaalgaIp],
                      },
                      { $ifNull: ["$_id.tulukhDun", 0] },
                      0,
                    ],
                  },
                }
              : { $sum: 0 },
            niitDun: {
              $sum: { $ifNull: ["$_id.tulukhDun", 0] },
            },
            khungulsun: {
              $sum: { $ifNull: ["$khungulult", 0] },
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
      for await (const zogsool of zogsooluud) {
        if (!!zogsool) {
          var dotorZogsool;
          if (!!zogsool.dotorZogsooliinId) {
            dotorZogsool = await Parking(kholbolt).findById(
              zogsool.dotorZogsooliinId
            );
          }
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
                _id: "$tuukh.zogsooliinId",
                too: {
                  $sum: 1,
                },
              },
            },
          ]);
          var parked = 0;
          var inside = {};
          if (xariu && xariu.length > 0) {
            if (!!dotorZogsool && !!zogsool.dotorZogsooliinId) {
              inside.total = dotorZogsool.too;
              inside.parked = xariu.find(
                (x) => x._id == dotorZogsool._id.toString()
              )?.too;
              if (!inside.parked) inside.parked = 0;
              parked = xariu.find((x) => x._id == zogsool._id.toString())?.too;
            } else {
              parked = xariu[0].too;
            }
          }
          var slot = {
            outside: {
              total: zogsool.too,
              parked,
            },
          };
          if (!!dotorZogsool && !!zogsool.dotorZogsooliinId)
            slot.inside = inside;
          jagsaalt.push({
            id: zogsool._id.toString(),
            name: zogsool.ner,
            slot,
          });
        }
      }
    }
  }
  var butsaakhKhariu = {
    success: true,
    message: "Amjilttai",
  };
  if (jagsaalt && jagsaalt.length > 0) butsaakhKhariu.data = jagsaalt;
  res.send(butsaakhKhariu);
});

router.get("/pass/zogsool", tokenShalgakh, async (req, res, next) => {
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
        passNer: { $exists: true },
      });
      for await (const zogsool of zogsooluud) {
        if (!!zogsool) {
          var dotorZogsool;
          if (!!zogsool.dotorZogsooliinId) {
            dotorZogsool = await Parking(kholbolt).findById(
              zogsool.dotorZogsooliinId
            );
          }
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
                _id: "$tuukh.zogsooliinId",
                too: {
                  $sum: 1,
                },
              },
            },
          ]);
          var parked = 0;
          var dotor = {};
          if (xariu && xariu.length > 0) {
            if (!!dotorZogsool && !!zogsool.dotorZogsooliinId) {
              dotor.niit = dotorZogsool.too;
              dotor.zogsson = xariu.find(
                (x) => x._id == dotorZogsool._id.toString()
              )?.too;
              if (!dotor.zogsson) dotor.zogsson = 0;
              parked = xariu.find((x) => x._id == zogsool._id.toString())?.too;
            } else {
              parked = xariu[0].too;
            }
          }
          var slot = {
            gadna: {
              garakhTsag: zogsool.garakhTsag || 30, 
              tulburuud: zogsool.tulburuud,
              niit: zogsool.too,
              zogsson: parked,
            },
          };
          if (!!dotorZogsool && !!zogsool.dotorZogsooliinId) slot.dotor = dotor;
          jagsaalt.push({
            id: zogsool._id.toString(),
            ner: zogsool.passNer,
            bagtaamj: slot,
          });
        }
      }
    }
  }
  var butsaakhKhariu = {
    success: true,
    message: "Amjilttai",
  };
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
  var freeze = req.query.freeze;
  var tukhainKholbolt;
  var localEsekh = !!req.query.baiguullagiinId;
  if (localEsekh) {
    kholboltuud = kholboltuud.filter(
      (a) => a.baiguullagiinId == req.query.baiguullagiinId
    );
  }
  if (kholboltuud) {
    for await (const kholbolt of kholboltuud) {
      var query = localEsekh
        ? { baiguullagiinId: req.query.baiguullagiinId }
        : {
            tokiNer: { $exists: true },
          };
      var zogsooluud = await Parking(kholbolt).find(query);
      for await (const zogsool of zogsooluud) {
        if (!!zogsool) {
          oldsonMashin = await Uilchluulegch(kholbolt).findOne({
            "tuukh.0.zogsooliinId": zogsool._id,
            mashiniiDugaar: req.params.plate_number,
            // "tuukh.0.tulbur": { $eq: [] },
            $or: [
              {
                "tuukh.0.tsagiinTuukh.0.garsanTsag": {
                  $gt: new Date(Date.now() - 5 * 100000), //1.30sec in dotor
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
          });
          if (!!oldsonMashin && !!oldsonMashin.mashiniiDugaar)
          {
            bodsonDun = await zogsooliinDunAvya(
              zogsool,
              oldsonMashin,
              kholbolt
            );
          }
            
        }
        if (bodsonDun > 0) {
          data = {
            plate_number: req.params.plate_number,
            enter_date: moment(
              oldsonMashin.tuukh[0].tsagiinTuukh[0].orsonTsag
            ).format("YYYY/MM/DD HH:mm:ss"),
            pay_amount: bodsonDun,
            parking_id: zogsool._id,
            session_id: oldsonMashin._id,
            garsanCameraIP: oldsonMashin.tuukh[0].garsanKhaalga,
          };
          tukhainKholbolt = kholbolt;
          break;
        } else if (oldsonMashin && !!oldsonMashin.mashiniiDugaar) {
          tukhainKholbolt = kholbolt;
          data = {
            plate_number: req.params.plate_number,
            enter_date: moment(
              oldsonMashin.tuukh[0].tsagiinTuukh[0].orsonTsag
            ).format("YYYY/MM/DD HH:mm:ss"),
            pay_amount: 0,
            parking_id: zogsool._id,
            session_id: oldsonMashin._id,
            garsanCameraIP: oldsonMashin.tuukh[0].garsanKhaalga,
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
  if ((!!freeze || !!localEsekh) && !!oldsonMashin) {
    await Uilchluulegch(tukhainKholbolt).updateOne(
      { _id: oldsonMashin._id },
      {
        freezeOgnoo: new Date(),
      }
    );
  }
  var butsaakhKhariu = {
    success,
    message,
    data,
  };
  res.send(butsaakhKhariu);
});


router.get("/v1/search_car_unegui/:plate_number", async (req, res, next) => {
  const { db } = require("zevbackv2");
  var ObjectId = require("mongodb").ObjectId;
  var kholboltuud = db.kholboltuud;
  var data;
  var message = "Amjilttai";
  var success = true;
  var oldsonMashin;
  var tukhainKholbolt;
  var localEsekh = !!req.query.baiguullagiinId;
  var tulburData = [];
  if (localEsekh) {
    kholboltuud = kholboltuud.filter(
      (a) => a.baiguullagiinId == req.query.baiguullagiinId
    );
  }
  if (kholboltuud) {
    for await (const kholbolt of kholboltuud) {
      var query = localEsekh
        ? { baiguullagiinId: req.query.baiguullagiinId }
        : {
            tokiNer: { $exists: true },
          };
      var zogsooluud = await Parking(kholbolt).find(query);
      for await (const zogsool of zogsooluud) {
        if (!!zogsool) {
          tukhainKholbolt = kholbolt;
          oldsonMashin = await Uilchluulegch(kholbolt).findOne({
            "tuukh.0.zogsooliinId": new ObjectId(zogsool._id),
            mashiniiDugaar: req.params.plate_number,
            // "tuukh.0.tulbur": { $eq: [] },
            $or: [
              {
                "tuukh.0.tsagiinTuukh.0.garsanTsag": {
                  $gt: new Date(Date.now() - 5 * 100000), //1.30sec in dotor
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
          });
        }
        if (!!localEsekh && !!oldsonMashin) {
          if(req.query.baiguullagiinId === "670f3437b41a478195dd3d4b")
          {
            data = { 
              plate_number: req.params.plate_number, 
              text: "Үнэгүй зочид",
            };
            tulburData = [ { ognoo: new Date(), turul: "Үнэгүй", dun: 0, }, ];
          }
          else if(req.query.baiguullagiinId === "670f3437b41a478195dd3d4b")
          {
            tulbur = [
              {
                ognoo: new Date(),
                turul: "Соёолж Ц/Д",
                dun: 4000,
              },
            ];
          }
        }
        if (data && data.plate_number) break;
      }
      if (data && data.plate_number) break;
    }
  }

  if (!oldsonMashin) {
    message = "Машины мэдээлэл олдсонгүй!";
    success = false;
  }
  if (!!localEsekh && !!oldsonMashin) {
    await Uilchluulegch(tukhainKholbolt).updateOne(
      { _id: oldsonMashin._id },
      {
        "tuukh.0.uneguiGarsan": data.text,
        "tuukh.0.tulbur": tulburData,
      }
    );
  }
  var butsaakhKhariu = {
    success,
    message,
    data,
  };
  res.send(butsaakhKhariu);
});

router.get(
  "/pass/mashinKhaikh/:dugaar",
  tokenShalgakh,
  async (req, res, next) => {
    const { db } = require("zevbackv2");
    var kholboltuud = db.kholboltuud;
    var bodsonDun = 0;
    var data;
    var message = "Amjilttai";
    var success = true;
    var oldsonMashin;
    var freeze = req.query.freeze ;
    var tukhainKholbolt;
    if (kholboltuud) {
      for await (const kholbolt of kholboltuud) {
        var query = {
          passNer: { $exists: true },
        };
        var zogsooluud = await Parking(kholbolt).find(query);
        for await (const zogsool of zogsooluud) {
          if (!!zogsool) {
            oldsonMashin = await Uilchluulegch(kholbolt).findOne({
              "tuukh.0.zogsooliinId": zogsool._id,
              mashiniiDugaar: req.params.dugaar,
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
            });
            if (!!oldsonMashin && !!oldsonMashin.mashiniiDugaar)
              bodsonDun = await zogsooliinDunAvya(
                zogsool,
                oldsonMashin,
                kholbolt
              );
          }
          if (bodsonDun > 0) {
            data = {
              dugaar: req.params.dugaar,
              orsonTsag: moment(
                oldsonMashin.tuukh[0].tsagiinTuukh[0].orsonTsag
              ).format("YYYY/MM/DD HH:mm:ss"),
              tulukhDun: bodsonDun,
              zogsoolId: zogsool._id,
              garakhKhugatsaa: zogsool?.garakhTsag || 30,
              id: oldsonMashin._id,
            };
            tukhainKholbolt = kholbolt;
            break;
          } else if (oldsonMashin && !!oldsonMashin.mashiniiDugaar) {
            tukhainKholbolt = kholbolt;
            data = {
              dugaar: req.params.dugaar,
              orsonTsag: moment(
                oldsonMashin.tuukh[0].tsagiinTuukh[0].orsonTsag
              ).format("YYYY/MM/DD HH:mm:ss"),
              tulukhDun: 0,
              zogsoolId: zogsool._id,
              id: oldsonMashin._id,
            };
            break;
          }
        }
        if (data && data.dugaar) break;
      }
    }

    if (!oldsonMashin) {
      message = "Машины мэдээлэл олдсонгүй!";
      success = false;
    }
    if (!!freeze && !!oldsonMashin) {
      await Uilchluulegch(tukhainKholbolt).updateOne(
        { _id: oldsonMashin._id },
        {
          freezeOgnoo: new Date(),
        }
      );
    }
    var butsaakhKhariu = {
      success,
      message,
      data,
    };
    res.send(butsaakhKhariu);
  }
);

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

// router.post("/v1/car_add", async (req, res, next) => {
//   const { db } = require("zevbackv2");
//   var erunkhiiKholbolt = db.erunkhiiKholbolt;
//   var message = "Amjilttai";
//   var mashiniiToo = await TokiMashin(erunkhiiKholbolt).countDocuments({
//     mashiniiDugaar: req.body.plate_number,
//   });
//   if (mashiniiToo == 0) {
//     await TokiMashin(erunkhiiKholbolt).insertMany([
//       {
//         mashiniiDugaar: req.body.plate_number,
//       },
//     ]);
//   } else if (mashiniiToo > 1) {
//     await TokiMashin(erunkhiiKholbolt).deleteMany([
//       {
//         mashiniiDugaar: req.body.plate_number,
//       },
//     ]);
//     await TokiMashin(erunkhiiKholbolt).insertMany([
//       {
//         mashiniiDugaar: req.body.plate_number,
//       },
//     ]);
//   }

//   var success = true;
//   var butsaakhKhariu = {
//     success,
//     message,
//   };
//   res.send(butsaakhKhariu);
// });

router.post("/v1/car_add", async (req, res, next) => {
  try {
    var message = "Amjilttai";
    var mashinuud = await TokiMashin.find(req.body.plate_number);
    console.log("mashinuud", mashinuud);
    if (!mashinuud || mashinuud.length == 0) {
      await TokiMashin.insertOne({
        mashiniiDugaar: req.body.plate_number,
      });
    } else if (mashinuud.length > 1) {
      await TokiMashin.deleteMany({
        mashiniiDugaar: req.body.plate_number,
      });
      await TokiMashin.insertOne({
        mashiniiDugaar: req.body.plate_number,
      });
    }
    var success = true;
    var butsaakhKhariu = {
      success,
      message,
    };
    res.send(butsaakhKhariu);
  } catch (err) {
    next(err);
  }
});

router.post("/v1/tulburMedeelelAvya", async (req, res, next) => {
  try {
    const { db } = require("zevbackv2");
    var { session_id, parking_id } = req.body;
    var kholboltuud = db.kholboltuud;
    var data;
    var message = "Amjilttai";
    var oldsonMashin;
    var success = true;
    if (kholboltuud) {
      for await (const kholbolt of kholboltuud) {
        var zogsool = await Parking(kholbolt).findById(parking_id);
        if (!!zogsool) {
          oldsonMashin = await Uilchluulegch(kholbolt).findById(session_id);
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
              tulburuud: oldsonMashin.tuukh[0].tulbur,
              parking_id,
              session_id,
            };
            break;
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
  } catch (err) {
    next(err);
  }
});

router.route("/v1/pay").post(async (req, res, next) => {
  try {
    /*{nevtreltiinTuukhAvya
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
    console.log("toki pay body", req.body);
    const { db } = require("zevbackv2");
    var kholboltuud = db.kholboltuud;
    var message = "Amjilttai";
    var oldsonMashin;
    var tukhainKholbolt;
    var tukhainObject;
    var tukhainZogsool;
    var success = true;
    var bodsonDun = 0;
    if (kholboltuud) {
      for await (const kholbolt of kholboltuud) {
        var zogsooluud = await Parking(kholbolt).find({
          tokiNer: { $exists: true },
        });
        for await (const zogsool of zogsooluud) {
          if (!!zogsool) {
              oldsonMashin = await Uilchluulegch(kholbolt).findOne({
                "tuukh.0.zogsooliinId": zogsool._id,
                mashiniiDugaar: req.body.plate_number,
                "tuukh.0.tuluv": {
                  $nin: [-2, -3],
                },
                updatedAt: {
                  $gt: new Date(Date.now() - 300000), //5min dotor
                },
              });
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
    if (!tukhainObject) {
      res.send({ success: false, message: "Машины мэдээлэл олдсонгүй!" });
    }
    bodsonDun = await zogsooliinDunAvya(
      tukhainZogsool,
      tukhainObject,
      tukhainKholbolt
    );
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
      var set = {
        "tuukh.$[t].tulbur": tukhainObject.tuukh[0].tulbur,
        tokiId: "toki",
      };
      if (bodsonDun > 0) {
        if (bodsonDun == req.body.paid_amount) {
          if (!req.body.manually_open)
            set["garakhTsag"] = new Date(
              new Date().getTime() + (tukhainZogsool?.garakhTsag || 30) * 60000
            );
          else set["tuukh.$[t].tuluv"] = 1;
        }
      }
      await Uilchluulegch(tukhainKholbolt).findByIdAndUpdate(
        tukhainObject._id,
        {
          $set: set,
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
      var baiguullaga = await Baiguullaga(db.erunkhiiKholbolt).findById(
        tukhainObject.baiguullagiinId
      );
      // var ebarimtAshiglakhEsekh = false;
      // if (!!baiguullaga)
      //   ebarimtAshiglakhEsekh = baiguullaga?.tokhirgoo?.ebarimtAshiglakhEsekh;
      // if (!!ebarimtAshiglakhEsekh) {
      var tuxainSalbar = baiguullaga?.barilguud?.find(
        (e) => e._id.toString() == tukhainObject.barilgiinId
      )?.tokhirgoo;
      var nuatTulukhEsekh = baiguullaga.barilguud.find(
        (x) => x._id.toString() == tukhainObject.barilgiinId
      )?.tokhirgoo?.nuatTulukhEsekh;
      if (nuatTulukhEsekh != false) nuatTulukhEsekh = true;
      if (!!tuxainSalbar?.eBarimtShine)
        ebarimt = await zogsooloosEbarimtShineUusgye(
          tukhainObject,
          req.body.customerNo,
          req.body.customerTin,
          tuxainSalbar.merchantTin, //"37900846788",
          tuxainSalbar.districtCode, //,"0023"
          tukhainKholbolt,
          nuatTulukhEsekh
        );
      else
        var ebarimt = await zogsooloosEbarimtUusgye(
          tukhainObject,
          req.body.customer_no,
          req.body.individual ? null : "3",
          tukhainKholbolt,
          nuatTulukhEsekh
        );
      butsaakhMethod = function (d, khariuObject) {
        try {
          if (d?.status != "SUCCESS" && !d.success) {
            delete d.baiguullagiinId;
            delete d.zogsooliinId;
            delete d.barilgiinId;
            delete d._id;
            console.log("ebarimt aldaatai duuslaa");
            butsaakhKhariu.data = d;
            res.send(butsaakhKhariu);
          }
          var ebarimt;
          if (!!tuxainSalbar.eBarimtShine)
            ebarimt = new EbarimtShine(tukhainKholbolt)(d);
          else ebarimt = new Ebarimt(tukhainKholbolt)(d);
          ebarimt.zogsooliinId = khariuObject._id;
          ebarimt.baiguullagiinId = khariuObject.baiguullagiinId;
          ebarimt.barilgiinId = khariuObject.barilgiinId;
          ebarimt.mashiniiDugaar = khariuObject.mashiniiDugaar;
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
      if (!!req.body.manually_open) {
        if (
          !!tukhainZogsool.kamerDavkharAshiglakh &&
          !tukhainObject?.tuukh[0]?.garsanKhaalga
        ) {
          var nemeltZogsool = await Parking(tukhainKholbolt).findOne({
            _id: { $ne: tukhainZogsool._id },
          });
          var garsanObject = await Uilchluulegch(tukhainKholbolt).findOne({
            mashiniiDugaar: req.body.plate_number,
            "tuukh.zogsooliinId": nemeltZogsool._id.toString(),
            "tuukh.0.tsagiinTuukh.0.garsanKhaalga": {
              $exists: true,
            },
            updatedAt: {
              $gt: new Date(Date.now() - 300000), //5min dotor
            },
            "tuukh.0.tuluv": {
              $ne: -2,
            },
          });
          const io = req.app.get("socketio");
          io.emit(`zogsool${tukhainObject.baiguullagiinId}`, {
            khaalgaTurul: "oroh",
            turul: "toki",
            mashiniiDugaar: req.body.plate_number,
            cameraIP: garsanObject.tuukh[0].garsanKhaalga,
          });
        } else {
          const io = req.app.get("socketio");
          io.emit(`zogsool${tukhainObject.baiguullagiinId}`, {
            khaalgaTurul: "oroh",
            turul: "toki",
            mashiniiDugaar: req.body.plate_number,
            cameraIP: tukhainObject.tuukh[0].garsanKhaalga,
          });
        }
      }
      ebarimtDuudya(ebarimt, butsaakhMethod, next, tuxainSalbar.eBarimtShine);
      /*} else {
        if (!!req.body.manually_open) {
          if (
            !!tukhainZogsool.kamerDavkharAshiglakh &&
            !tukhainObject?.tuukh[0]?.garsanKhaalga
          ) {
            var nemeltZogsool = await Parking(tukhainKholbolt).findOne({
              _id: { $ne: tukhainZogsool._id },
            });
            var garsanObject = await Uilchluulegch(tukhainKholbolt).findOne({
              mashiniiDugaar: req.body.plate_number,
              "tuukh.zogsooliinId": nemeltZogsool._id.toString(),
              "tuukh.0.tsagiinTuukh.0.garsanKhaalga": {
                $exists: true,
              },
              updatedAt: {
                $gt: new Date(Date.now() - 300000), //5min dotor
              },
              "tuukh.0.tuluv": {
                $ne: -2,
              },
            });
            const io = req.app.get("socketio");
            io.emit(`zogsool${tukhainObject.baiguullagiinId}`, {
              khaalgaTurul: "oroh",
              turul: "toki",
              mashiniiDugaar: req.body.plate_number,
              cameraIP: garsanObject.tuukh[0].garsanKhaalga,
            });
          } else {
            const io = req.app.get("socketio");
            io.emit(`zogsool${tukhainObject.baiguullagiinId}`, {
              khaalgaTurul: "oroh",
              turul: "toki",
              mashiniiDugaar: req.body.plate_number,
              cameraIP: tukhainObject.tuukh[0].garsanKhaalga,
            });
          }
        }
      }*/
    }
  } catch (err) {
    next(err);
  }
});

router.route("/pass/pay").post(tokenShalgakh, async (req, res, next) => {
  try {
    let tulbur = [
      {
        ognoo: new Date(),
        turul: "pass",
        dun: req.body.tulukhDun,
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
    var bodsonDun = 0;
    if (kholboltuud) {
      for await (const kholbolt of kholboltuud) {
        var zogsooluud = await Parking(kholbolt).find({
          passNer: { $exists: true },
        });
        for await (const zogsool of zogsooluud) {
          if (!!zogsool) {
            oldsonMashin = await Uilchluulegch(kholbolt).findOne({
              "tuukh.0.zogsooliinId": zogsool._id,
              mashiniiDugaar: req.body.dugaar,
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
            });
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
    if (!tukhainObject) {
      res.send({ success: false, message: "Машины мэдээлэл олдсонгүй!" });
    }
    bodsonDun = await zogsooliinDunAvya(
      tukhainZogsool,
      tukhainObject,
      tukhainKholbolt
    );
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
      var set = {
        "tuukh.$[t].tulbur": tukhainObject.tuukh[0].tulbur,
        tokiId: "pass",
      };
      if (bodsonDun > 0) {
        if (bodsonDun == req.body.tulukhDun) {
          set["tuukh.$[t].tuluv"] = 1;
          if (!req.body.manually_open)
            set["garakhTsag"] = new Date(
              new Date().getTime() + (tukhainZogsool?.garakhTsag || 30) * 60000
            );
        }
      }
      console.log("pass pay", set);
      await Uilchluulegch(tukhainKholbolt).findByIdAndUpdate(
        tukhainObject._id,
        {
          $set: set,
        },
        {
          arrayFilters: [
            {
              "t.zogsooliinId": tukhainZogsool._id,
            },
          ],
        }
      );
      tukhainObject.niitDun = req.body.tulukhDun;
      var baiguullaga = await Baiguullaga(db.erunkhiiKholbolt).findById(
        tukhainObject.baiguullagiinId
      );
      var tuxainSalbar = baiguullaga?.barilguud?.find(
        (e) => e._id.toString() == tukhainObject.barilgiinId
      )?.tokhirgoo;

      var nuatTulukhEsekh = false;
      nuatTulukhEsekh = tuxainSalbar.nuatTulukhEsekh;
      if (nuatTulukhEsekh != false) nuatTulukhEsekh = true;
      if (!!tuxainSalbar?.eBarimtShine) {
        ebarimt = await zogsooloosEbarimtShineUusgye(
          tukhainObject,
          req.body.customerNo,
          req.body.customerTin,
          tuxainSalbar.merchantTin, //"37900846788",
          tuxainSalbar.districtCode, //,"0023"
          tukhainKholbolt,
          nuatTulukhEsekh
        );
      } else {
        var ebarimt = await zogsooloosEbarimtUusgye(
          tukhainObject,
          req.body.register,
          req.body.register ? "3" : null,
          tukhainKholbolt,
          nuatTulukhEsekh
        );
      }
      butsaakhMethod = function (d, khariuObject) {
        try {
          if (d?.status != "SUCCESS" && !d.success) throw new Error(d.message);
          var ebarimt;
          if (!!tuxainSalbar.eBarimtShine)
            ebarimt = new EbarimtShine(tukhainKholbolt)(d);
          else ebarimt = new Ebarimt(tukhainKholbolt)(d);
          ebarimt.zogsooliinId = khariuObject._id;
          ebarimt.baiguullagiinId = khariuObject.baiguullagiinId;
          ebarimt.barilgiinId = khariuObject.barilgiinId;
          ebarimt.mashiniiDugaar = khariuObject.mashiniiDugaar;
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
      if (!!req.body.manually_open) {
        if (
          !!tukhainZogsool.kamerDavkharAshiglakh &&
          !tukhainObject?.tuukh[0]?.garsanKhaalga
        ) {
          var nemeltZogsool = await Parking(tukhainKholbolt).findOne({
            _id: { $ne: tukhainZogsool._id },
          });
          var garsanObject = await Uilchluulegch(tukhainKholbolt).findOne({
            mashiniiDugaar: req.body.plate_number,
            "tuukh.zogsooliinId": nemeltZogsool._id.toString(),
            "tuukh.0.tsagiinTuukh.0.garsanKhaalga": {
              $exists: true,
            },
            updatedAt: {
              $gt: new Date(Date.now() - 300000), //5min dotor
            },
            "tuukh.0.tuluv": {
              $ne: -2,
            },
          });
          const io = req.app.get("socketio");
          io.emit(`zogsool${tukhainObject.baiguullagiinId}`, {
            khaalgaTurul: "oroh",
            turul: "toki",
            mashiniiDugaar: req.body.plate_number,
            cameraIP: garsanObject.tuukh[0].garsanKhaalga,
          });
        } else {
          const io = req.app.get("socketio");
          io.emit(`zogsool${tukhainObject.baiguullagiinId}`, {
            khaalgaTurul: "oroh",
            turul: "toki",
            mashiniiDugaar: req.body.plate_number,
            cameraIP: tukhainObject.tuukh[0].garsanKhaalga,
          });
        }
      }
      ebarimtDuudya(ebarimt, butsaakhMethod, next, tuxainSalbar.eBarimtShine);
    }
  } catch (err) {
    next(err);
  }
});

router.route("/v1/kioskPay").post(tokenShalgakh, async (req, res, next) => {
  try {
    let tulbur = [];
    if (req.body.ajiltniiId == "66384a9061eeda747d01a320") {
      if (req.body.paid_amount == 0) {
        tulbur = [
          {
            ognoo: new Date(),
            turul: "Fitness",
            dun: 3000,
          },
        ];
      } else {
        tulbur = [
          {
            ognoo: new Date(),
            turul: "Fitness",
            dun: 3000,
          },
          {
            ognoo: new Date(),
            turul: req.body.turul,
            dun: req.body.paid_amount,
          },
        ];
      }
    } else if (req.body.ajiltniiId == "6746b7b1e3a4bd05bbac6880") {
      if (req.body.paid_amount == 0) {
        tulbur = [
          {
            ognoo: new Date(),
            turul: "Соёолж Ц/Д",
            dun: 4000,
          },
        ];
      } else {
        tulbur = [
          {
            ognoo: new Date(),
            turul: "Соёолж Ц/Д",
            dun: 4000,
          },
          {
            ognoo: new Date(),
            turul: req.body.turul,
            dun: req.body.paid_amount,
          },
        ];
      }
    } else if (req.body.barilgiinId === "673d88133987e97992f77c03") {
      if (req.body.paid_amount == 0) {
        tulbur = [
          {
            ognoo: new Date(),
            turul: "Хөнгөлөлт",
            dun: 3000,
          },
        ];
      } else {
        tulbur = [
          {
            ognoo: new Date(),
            turul: "Хөнгөлөлт",
            dun: 3000,
          },
          {
            ognoo: new Date(),
            turul: req.body.turul,
            dun: req.body.paid_amount,
          },
        ];
      }
    } else
      tulbur = [
        {
          ognoo: new Date(),
          turul: req.body.turul,
          dun: req.body.paid_amount,
        },
      ];
    var oldsonMashin;
    var tukhainKholbolt;
    var tukhainObject;
    var tukhainZogsool;
    var bodsonDun = 0;
    const zogsool = req.body.zogsooliinId
      ? await Parking(req.body.tukhainBaaziinKholbolt).findOne({
          _id: req.body.zogsooliinId,
        })
      : await Parking(req.body.tukhainBaaziinKholbolt).findOne({
          baiguullagiinId: req.body.baiguullagiinId,
          barilgiinId: req.body.barilgiinId,
          "khaalga.ajiltnuud.id": req.body.ajiltniiId,
        });
    if (!!zogsool) {
      oldsonMashin = await Uilchluulegch(
        req.body.tukhainBaaziinKholbolt
      ).findOne({
        _id: req.body.uilchluulegchiinId,
      });
      if (!!oldsonMashin && !!oldsonMashin.mashiniiDugaar) {
        tukhainKholbolt = req.body.tukhainBaaziinKholbolt;
        tukhainZogsool = zogsool;
        tukhainObject = oldsonMashin;
      }
    }
    if (
      !!tukhainObject?.tuukh?.[0].tsagiinTuukh?.[0].garsanTsag &&
      tukhainObject.niitDun > 0
    ) {
      bodsonDun = tukhainObject.niitDun;
    } else
      bodsonDun = await zogsooliinDunAvya(
        tukhainZogsool,
        tukhainObject,
        tukhainKholbolt
      );
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
        ) {
          if (req.body.ajiltniiId == "66384a9061eeda747d01a320") {
            if (tukhainObject.tuukh[0].tulbur.find((x) => x.turul == "Fitness"))
              throw new Error("Хөнгөлөлт оруулсан байна!");
          }
          else if (req.body.ajiltniiId == "6746b7b1e3a4bd05bbac6880") {
            if (tukhainObject.tuukh[0].tulbur.find((x) => x.turul == "Соёолж Ц/Д"))
              throw new Error("Хөнгөлөлт оруулсан байна!");
          }
          else if (req.body.barilgiinId === "673d88133987e97992f77c03") {
            if (tukhainObject.tuukh[0].tulbur.find((x) => x.turul == "Хөнгөлөлт"))
              throw new Error("Хөнгөлөлт оруулсан байна!");
          }
          tukhainObject.tuukh[0].tulbur.push(...tulbur);
        } else tukhainObject.tuukh[0].tulbur = tulbur;
      var set = {
        "tuukh.$[t].tulbur": tukhainObject.tuukh[0].tulbur,
      };
      if (bodsonDun > 0) {
        if (bodsonDun == req.body.paid_amount) {
          if (!!tukhainObject.tuukh[0]?.tsagiinTuukh[0]?.garsanTsag) {
            set["tuukh.$[t].tuluv"] = 1;
            if (!!tukhainObject.tuukh[0]?.garsanKhaalga) {
              const io = req.app.get("socketio");
              io.emit(`zogsool${tukhainObject.baiguullagiinId}`, {
                khaalgaTurul: "oroh",
                cameraIP: tukhainObject.tuukh[0]?.garsanKhaalga,
              });
            }
          }
          set["tuukh.$[t].burtgesenAjiltaniiId"] = req.body.ajiltniiId;
          set["tuukh.$[t].burtgesenAjiltaniiNer"] = req.body.ajiltniiNer;
          set["garakhTsag"] = new Date(
            new Date().getTime() + (tukhainZogsool?.garakhTsag || 30) * 60000
          );
        }
      }
      await Uilchluulegch(tukhainKholbolt).findByIdAndUpdate(
        tukhainObject._id,
        {
          $set: set,
        },
        {
          arrayFilters: [
            {
              "t.zogsooliinId": tukhainZogsool._id,
            },
          ],
        }
      );
      res.send("Amjilttai");
    }
  } catch (err) {
    next(err);
  }
});

router
  .route("/v1/kioskEbarimtAvya")
  .post(tokenShalgakh, async (req, res, next) => {
    var tukhainKholbolt = req.body.tukhainBaaziinKholbolt;
    var tukhainObject = await Uilchluulegch(tukhainKholbolt).findById(
      req.body.uilchluulegchiinId
    );
    tukhainObject.niitDun = req.body.paid_amount;
    const { db } = require("zevbackv2");
    var baiguullaga = await Baiguullaga(db.erunkhiiKholbolt).findById(
      tukhainObject.baiguullagiinId
    );
    tuxainSalbar = baiguullaga?.barilguud?.find(
      (e) => e._id.toString() == tukhainObject.barilgiinId
    )?.tokhirgoo;
    var nuatTulukhEsekh = baiguullaga.barilguud.find(
      (x) => x._id.toString() == tukhainObject.barilgiinId
    )?.tokhirgoo?.nuatTulukhEsekh;
    console.log("tuxainSalbar", tuxainSalbar);
    if (nuatTulukhEsekh != false) nuatTulukhEsekh = true;
    if (!!tuxainSalbar?.eBarimtShine)
      ebarimt = await zogsooloosEbarimtShineUusgye(
        tukhainObject,
        req.body.customerNo,
        req.body.customerTin,
        tuxainSalbar.merchantTin, //"37900846788",
        tuxainSalbar.districtCode, //,"0023"
        tukhainKholbolt,
        nuatTulukhEsekh
      );
    else
      var ebarimt = await zogsooloosEbarimtUusgye(
        tukhainObject,
        req.body.customer_no,
        req.body.individual ? null : "3",
        tukhainKholbolt,
        nuatTulukhEsekh
      );
    butsaakhMethod = function (d, khariuObject) {
      try {
        if (d?.status != "SUCCESS" && !d.success) throw new Error(d.message);
        var ebarimt;
        if (!!tuxainSalbar.eBarimtShine)
          ebarimt = new EbarimtShine(tukhainKholbolt)(d);
        else ebarimt = new Ebarimt(tukhainKholbolt)(d);
        ebarimt.zogsooliinId = khariuObject._id;
        ebarimt.baiguullagiinId = khariuObject.baiguullagiinId;
        ebarimt.barilgiinId = khariuObject.barilgiinId;
        ebarimt.mashiniiDugaar = khariuObject.mashiniiDugaar;
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
        var butsaakhKhariu = {
          success: true,
          message: "Amjilttai",
        };
        butsaakhKhariu.data = d;
        res.send(butsaakhKhariu);
      } catch (err) {
        next(err);
      }
    };
    ebarimtDuudya(ebarimt, butsaakhMethod, next, tuxainSalbar.eBarimtShine);
  });

router.route("/mashinUpdate").post(tokenShalgakh, async (req, res, next) => {
  try {
    console.log(req.body);
    const { db } = require("zevbackv2");
    var baiguullaga = await Baiguullaga(db.erunkhiiKholbolt).findOne({
      register: req.body.register,
    });
    var tukhainKholbolt;
    tukhainKholbolt = db.kholboltuud.find(
      (a) => a.baiguullagiinId == baiguullaga._id
    );
    var orsonTsag = new Date(new Date.getTime() - 15 * 60000);
    Uilchluulegch(tukhainKholbolt).updateOne(
      {
        mashiniiDugaar: req.body.mashiniiDugaar,
        "tuukh.0.tuluv": { $ne: -2 },
        "tuukh.0.tsagiinTuukh.garsanTsag": { $exists: false },
      },
      {
        "tuukh.0.tsagiinTuukh.0.orsonTsag": orsonTsag,
      }
    );
    res.send("Amjilttai");
  } catch (error) {
    next(error);
  }
});

router.route("/mashinUpdate1").post(async (req, res, next) => {
  try {
    console.log("req.body", req.body);
    console.log("req.headers", req.headers);
    res.send("Amjilttai");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
