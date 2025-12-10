const express = require("express");
const router = express.Router();
const {
  tokenShalgakh,
  khuudaslalt,
  crud,
  UstsanBarimt,
  db,
} = require("zevbackv2");
const {
  Parking,
  Mashin,
  BlockMashin,
  Uilchluulegch,
  ZurchilteiMashin,
  ZogsooliinTulbur,
  uilchluulegchdiinToo,
  zogsoolTusBurUilchluulegchdiinToo,
  sdkData,
  uilchluulegchTseverliy,
  zogsooliinDunAvya,
  TokiMashin,
  uilchluulegchGaraasBurtgey,
} = require("parking-v2");
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
const KassCameraKhaalt = require("../models/kassCameraKhaalt");
const uneguiMashin = require("../models/uneguiMashin");

const {
  khariltsagchidSonorduulgaIlgeeye,
} = require("../controller/appNotification");
const lodash = require("lodash");
const moment = require("moment");
const Baiguullaga = require("../models/baiguullaga");
const { zogsoolNiitDungeerEbarimtShivye } = require("../routes/ebarimtRoute");
const { msgIlgeeye } = require("../controller/khariltsagch");
const MsgTuukh = require("../models/msgTuukh");
const client = require("../routes/redisClient");
/*crud(router, "parking", Parking, UstsanBarimt, async (req, res, next) => {
});*/
crud(router, "parking", Parking, UstsanBarimt);
crud(router, "zurchilteiMashin", ZurchilteiMashin, UstsanBarimt);
crud(router, "mashin", Mashin, UstsanBarimt);
crud(router, "blockMashin", BlockMashin, UstsanBarimt);
crud(router, "zogsoolUilchluulegch", Uilchluulegch, UstsanBarimt);
// crud(router, "zogsoolUilchluulegch", (conn) => Uilchluulegch(conn, true), UstsanBarimt);
crud(router, "uilchluulegch", Uilchluulegch, UstsanBarimt);
crud(router, "kassCameraKhaalt", KassCameraKhaalt, UstsanBarimt);
/*
crud(router, "zogsoolUilchluulegch", async (req, res, next) => {
});
*/

/*router.post("/khaalganiiErkh", tokenShalgakh, async (req, res, next) => {
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
                })
                .catch((err) => {
                });

    } catch (error) {
        next(error);
    }
});*/

router.get("/zogsoolJagsaalt", tokenShalgakh, async (req, res, next) => {
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
            } </p>
          </div>
          </span>`,
        };
        firebaseToken = kharilltsagch.firebaseToken;
        if (!!firebaseToken) {
          khariltsagchidSonorduulgaIlgeeye(
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
      }
    };
    const uneguiMashinOldson = await uneguiMashin(db.erunkhiiKholbolt).findOne({
      mashiniiDugaar: req.body.mashiniiDugaar,
      "zogsool.baiguullagiinId": req.body.baiguullagiinId,
    });

    if (uneguiMashinOldson) {
      const randomMinutes = Math.floor(Math.random() * 15) + 1;
      const orsonTsag = new Date(Date.now() - randomMinutes * 60000);
      const uilchluulegchModel = Uilchluulegch(req.body.tukhainBaaziinKholbolt);
      const oldsonUilchluulegch = await uilchluulegchModel
        .findOne({
          mashiniiDugaar: req.body.mashiniiDugaar,
          "tuukh.0.tuluv": 0,
          "tuukh.0.garsanKhaalga": { $exists: false },
        })
        .sort({ createdAt: -1 });

      if (oldsonUilchluulegch && oldsonUilchluulegch._id) {
        await uilchluulegchModel.findOneAndUpdate(
          { _id: oldsonUilchluulegch._id },
          {
            $set: {
              "tuukh.0.tsagiinTuukh.0.orsonTsag": orsonTsag,
            },
          }
        );
      }
    }
    const khariu = await sdkData(req, medegdel);
    res.send(khariu);
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
        var ebarimtAvakhDun = 0;
        guilgeenuud.map((guilgee) => {
          ebarimtAvakhDun +=
            guilgee.turul == "khariult" ||
            guilgee.turul == "khungulult" ||
            guilgee.turul?.includes("Божон") ||
            guilgee.turul == "Соёолж Ц/Д" ||
            guilgee.turul == "Хөнгөлөлт/ 24 цаг" ||
            guilgee.turul == "Хөнгөлөлт/ 2 цаг" ||
            guilgee.turul == "Fitness"
              ? 0
              : guilgee.dun;
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
              ebarimtAvakhDun: ebarimtAvakhDun,
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

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

router.route("/zogsooliinTulburOrjIrlee").post(async (req, res, next) => {
  try {
    var baiguullagiinId = req.body.baiguullagiinId;
    var barilgiinId = req.body.barilgiinId;
    var zogsooliinId = req.body.zogsooliinId;
    var nemeltUtga = req.body.nemeltUtga;
    var tulsunDun = Number(req.body.tulsunDun);
    var shineDun = 0;
    if (baiguullagiinId == "663da696aa6bedd9ae0567f0") {
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
    };
    if (baiguullagiinId == "6115f350b35689cdbf1b9da3") {
      if (
        !!nemeltUtga &&
        (nemeltUtga.includes("Хаалт 1") || nemeltUtga.includes("ХААЛТ 1"))
      ) {
        query["tuukh.0.garsanKhaalga"] = "192.168.1.202";
      } else if (
        !!nemeltUtga &&
        (nemeltUtga.includes("Хаалт 2") || nemeltUtga.includes("ХААЛТ 2"))
      ) {
        query["tuukh.0.garsanKhaalga"] = "192.168.1.204";
      } else if (
        !!nemeltUtga &&
        (nemeltUtga.includes("Хаалт 3") || nemeltUtga.includes("ХААЛТ 3"))
      ) {
        query["tuukh.0.garsanKhaalga"] = "192.168.1.231";
      } else if (
        !!nemeltUtga &&
        (nemeltUtga.includes("Хаалт 4") || nemeltUtga.includes("ХААЛТ 4"))
      ) {
        query["tuukh.0.garsanKhaalga"] = "192.168.1.229";
      }
    }
    if (baiguullagiinId === "674042c8640d59bcf2e95a9a") {
      // NaranTuul Office
      if (
        !!nemeltUtga &&
        (nemeltUtga.includes("office2") || nemeltUtga.includes("OFFICE2"))
      ) {
        query["tuukh.0.garsanKhaalga"] = "192.168.1.102";
      } else if (
        !!nemeltUtga &&
        (nemeltUtga.includes("office1") || nemeltUtga.includes("OFFICE1"))
      ) {
        query["tuukh.0.garsanKhaalga"] = "192.168.1.102";
      }
    }
    if (baiguullagiinId == "6731b43bc23730ac1908da2d") {
      // soyolj
      if (
        !!nemeltUtga &&
        (nemeltUtga.includes("Хаалт 1") || nemeltUtga.includes("ХААЛТ 1"))
      ) {
        query["tuukh.0.garsanKhaalga"] = "192.168.2.21";
      } else if (
        !!nemeltUtga &&
        (nemeltUtga.includes("Хаалт 2") || nemeltUtga.includes("ХААЛТ 2"))
      ) {
        query["tuukh.0.garsanKhaalga"] = "192.168.2.24";
      } else if (
        !!nemeltUtga &&
        (nemeltUtga.includes("Хаалт 3") || nemeltUtga.includes("ХААЛТ 3"))
      ) {
        query["tuukh.0.garsanKhaalga"] = "192.168.2.25";
      } else if (
        !!nemeltUtga &&
        (nemeltUtga.includes("Хаалт 4") || nemeltUtga.includes("ХААЛТ 4"))
      ) {
        query["tuukh.0.garsanKhaalga"] = "192.168.2.26";
      }
    }
    if (baiguullagiinId == "67dfebe55b92ee004ba43ad2") {
      // chingeltei
      if (
        !!nemeltUtga &&
        (nemeltUtga.includes("Хаалт 1") || nemeltUtga.includes("ХААЛТ 1"))
      ) {
        query["tuukh.0.garsanKhaalga"] = "192.168.1.122";
      } else if (
        !!nemeltUtga &&
        (nemeltUtga.includes("Хаалт 2") || nemeltUtga.includes("ХААЛТ 2"))
      ) {
        query["tuukh.0.garsanKhaalga"] = "192.168.1.121";
      }
    }
    if (baiguullagiinId == "6800b91480a007fe5ab34436") {
      // khavdar
      if (
        !!nemeltUtga &&
        (nemeltUtga.includes("Хаалт 1") || nemeltUtga.includes("ХААЛТ 1"))
      ) {
        query["tuukh.0.garsanKhaalga"] = "192.168.1.103";
      } else if (
        !!nemeltUtga &&
        (nemeltUtga.includes("Хаалт 2") || nemeltUtga.includes("ХААЛТ 2"))
      ) {
        query["tuukh.0.garsanKhaalga"] = "192.168.1.104";
      }
    }
    if (baiguullagiinId == "63c0f31efe522048bf02086d") {
      // foodcity
      if (
        !!nemeltUtga &&
        (nemeltUtga.includes("Гарах-1") || nemeltUtga.includes("ГАРАХ-1"))
      ) {
        query["tuukh.0.garsanKhaalga"] = "192.168.2.236";
      } else if (
        !!nemeltUtga &&
        (nemeltUtga.includes("Гарах-2") || nemeltUtga.includes("ГАРАХ-2"))
      ) {
        query["tuukh.0.garsanKhaalga"] = "192.168.2.237";
      }
    }
    let regex = /\b\d{4}[А-ЯӨҮ]{2,3}\b/gu;
    let result = nemeltUtga?.match(regex);
    if (result) query["mashiniiDugaar"] = result[0];
    var oldsonData = await Uilchluulegch(kholbolt, true).findOne(query);
    if (oldsonData) {
      await Uilchluulegch(kholbolt).findByIdAndUpdate(
        oldsonData._id,
        {
          $set: {
            "tuukh.$[t].burtgesenAjiltaniiNer": "system",
            "tuukh.$[t].tulbur": [
              {
                ognoo: new Date(),
                turul:
                  nemeltUtga?.includes("qpay") || nemeltUtga?.includes("QPAY")
                    ? "bankQR"
                    : "khariltsakh",
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
      var baiguullaga = await Baiguullaga(db.erunkhiiKholbolt).findById(
        kholbolt.baiguullagiinId
      );
      var tuxainSalbar = baiguullaga?.barilguud?.find(
        (e) => e._id.toString() === barilgiinId
      )?.tokhirgoo;
      if (tuxainSalbar?.eBarimtMessageIlgeekhEsekh && nemeltUtga) {
        var filterDugaar = nemeltUtga
          ?.split(/,| /)
          ?.filter((a) => isNumeric(a) && a.length === 8);
        if (filterDugaar?.length > 0) {
          var shiveeguiTuukhuud = [];
          shiveeguiTuukhuud.push(oldsonData);
          await zogsoolNiitDungeerEbarimtShivye(
            kholbolt,
            tulsunDun,
            barilgiinId,
            next,
            shiveeguiTuukhuud,
            filterDugaar[0]
          );
        }
      }
    }
    res.sendStatus(200);
  } catch (err) {
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
  "/zogsooliinAjiltniiUdriinTailanAvya",
  tokenShalgakh,
  async (req, res, next) => {
    try {
      const ekhlekhOgnoo = new Date(req.body.ekhlekhOgnoo);
      const duusakhOgnoo = new Date(req.body.duusakhOgnoo);

      const baseMatch = {
        baiguullagiinId: req.body.baiguullagiinId,
        barilgiinId: req.body.barilgiinId
          ? req.body.barilgiinId
          : { $exists: true },
      };

      const ajiltanDateMatch = req.body.garsanKhaalga
        ? {
            "tuukh.garsanKhaalga": req.body.garsanKhaalga,
            "tuukh.tsagiinTuukh.garsanTsag": {
              $gte: ekhlekhOgnoo,
              $lte: duusakhOgnoo,
            },
          }
        : {
            "tuukh.tulbur.ognoo": { $gte: ekhlekhOgnoo, $lte: duusakhOgnoo },
          };

      const ajiltniiNukhutsul = {};
      if (req.body.burtgesenAjiltaniiId) {
        ajiltniiNukhutsul["tuukh.burtgesenAjiltaniiId"] =
          req.body.burtgesenAjiltaniiId;
      }

      const ajiltniiPipeline = [
        { $match: baseMatch },
        { $unwind: "$tuukh" },
        { $unwind: "$tuukh.tulbur" },
        { $match: { ...ajiltanDateMatch, ...ajiltniiNukhutsul } },
        {
          $group: {
            _id: "$tuukh.tulbur.turul",
            niitDun: { $sum: "$tuukh.tulbur.dun" },
            niitToo: { $sum: 1 },
          },
        },
      ];

      const qrTypes = ["GadaaQR", "DotorQR", "bankQR", "toki", "киоск"];

      const qrDateMatch = {
        "tuukh.tulbur.ognoo": { $gte: ekhlekhOgnoo, $lte: duusakhOgnoo },
      };

      const qrMatch = {
        ...qrDateMatch,
        "tuukh.tulbur.turul": { $in: qrTypes },
      };
      if (req.body.garsanKhaalga) {
        qrMatch["tuukh.garsanKhaalga"] = req.body.garsanKhaalga;
      }

      const qrPipeline = [
        { $match: baseMatch },
        { $unwind: "$tuukh" },
        { $unwind: "$tuukh.tulbur" },
        {
          $match: qrMatch,
        },
        {
          $group: {
            _id: "$tuukh.tulbur.turul",
            niitDun: { $sum: "$tuukh.tulbur.dun" },
            niitToo: { $sum: 1 },
          },
        },
      ];

      const ajiltniiTailan = await Uilchluulegch(
        req.body.tukhainBaaziinKholbolt,
        true
      ).aggregate(ajiltniiPipeline);

      let qrTailan = [];
      if (req.body.burtgesenAjiltaniiId) {
        qrTailan = await Uilchluulegch(
          req.body.tukhainBaaziinKholbolt,
          true
        ).aggregate(qrPipeline);
      }

      let niilberTailan = Array.isArray(ajiltniiTailan)
        ? [...ajiltniiTailan]
        : [];
      if (Array.isArray(qrTailan) && qrTailan.length > 0) {
        const qrTypeSet = new Set(qrTypes);
        niilberTailan = niilberTailan.filter((row) => !qrTypeSet.has(row._id));
        niilberTailan.push(...qrTailan);
      }

      const garaltMatch = {
        "tuukh.tsagiinTuukh.garsanTsag": {
          $gte: ekhlekhOgnoo,
          $lte: duusakhOgnoo,
        },
      };

      if (req.body.garsanKhaalga) {
        garaltMatch["tuukh.garsanKhaalga"] = req.body.garsanKhaalga;
      }
      if (req.body.burtgesenAjiltaniiId) {
        garaltMatch["tuukh.burtgesenAjiltaniiId"] =
          req.body.burtgesenAjiltaniiId;
      }

      const [zurchiltei, unegui] = await Promise.all([
        Uilchluulegch(req.body.tukhainBaaziinKholbolt, true).aggregate([
          { $match: baseMatch },
          { $unwind: "$tuukh" },
          {
            $match: {
              ...garaltMatch,
              "tuukh.tuluv": -2,
            },
          },
          {
            $group: {
              _id: "Зөрчилтэй",
              niitDun: { $sum: "$niitDun" },
              ids: { $addToSet: "$_id" },
            },
          },
          {
            $project: {
              _id: 1,
              niitDun: 1,
              niitToo: { $size: "$ids" },
            },
          },
        ]),
        Uilchluulegch(req.body.tukhainBaaziinKholbolt, true).aggregate([
          { $match: baseMatch },
          { $unwind: "$tuukh" },
          {
            $match: {
              ...garaltMatch,
              "tuukh.uneguiGarsan": { $exists: true },
            },
          },
          {
            $group: {
              _id: "Үнэгүй",
              niitDun: { $sum: "$niitDun" },
              niitToo: { $sum: 1 },
            },
          },
        ]),
      ]);

      if (Array.isArray(zurchiltei) && zurchiltei.length > 0) {
        niilberTailan.push(zurchiltei[0]);
      }
      if (Array.isArray(unegui) && unegui.length > 0) {
        niilberTailan.push(unegui[0]);
      }

      res.status(200).send(niilberTailan);
    } catch (error) {
      next(error);
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
        req.body.tukhainBaaziinKholbolt,
        true
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
        req.body.tukhainBaaziinKholbolt,
        true
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
            niitDun: { $sum: "$niitDun" },
            ids: { $addToSet: "$_id" },
          },
        },
        {
          $project: {
            _id: 1,
            niitDun: 1,
            niitToo: { $size: "$ids" },
          },
        },
      ]);

      var unegui = await Uilchluulegch(
        req.body.tukhainBaaziinKholbolt,
        true
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
      var matchVal = {
        baiguullagiinId: req.body.baiguullagiinId,
        barilgiinId: !!req.body.barilgiinId
          ? req.body.barilgiinId
          : { $exists: true },
        tuluv: 0,
        // createdAt: {
        //   $lte: new Date(moment(req.body.duusakhOgnoo).format("YYYY-MM-DD 23:59:59")),
        // },
      };
      var query = [
        {
          $match: matchVal,
        },
        {
          $group: {
            _id: "Авлага",
            niitDun: {
              $sum: "$niitDun",
            },
            niitToo: {
              $sum: 1,
            },
          },
        },
      ];
      var zurchilteTailan = await ZurchilteiMashin(
        req.body.tukhainBaaziinKholbolt
      ).aggregate(query);
      if (
        !!udriinTailan &&
        udriinTailan.length > 0 &&
        req.body.baiguullagiinId != "657915f5b7453f90155dce6b"
      ) {
        if (!!zurchiltei && zurchiltei.length > 0)
          udriinTailan.push(zurchiltei[0]);
        if (!!unegui && unegui.length > 0) udriinTailan.push(unegui[0]);
        if (zurchilteTailan?.length > 0) udriinTailan.push(zurchilteTailan[0]);
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
        req.body.tukhainBaaziinKholbolt,
        true
      ).aggregate(query);
      res.send(khariu);
    } catch (err) {
      next(err);
    }
  }
);

router.post("/mashiniiTooAvya", tokenShalgakh, async (req, res, next) => {
  try {
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
    var mashinResult = await Mashin(req.body.tukhainBaaziinKholbolt).aggregate(
      query
    );
    query = [
      {
        $match: {
          baiguullagiinId: req.body.baiguullagiinId,
          barilgiinId: req.body.barilgiinId,
        },
      },
      {
        $group: {
          _id: "Block",
          too: {
            $sum: 1,
          },
        },
      },
    ];
    var blockResult = await BlockMashin(
      req.body.tukhainBaaziinKholbolt
    ).aggregate(query);
    mashinResult.push(...blockResult);
    res.send(mashinResult);
  } catch (err) {
    next(err);
  }
});

router.get("/v1/parking", async (req, res, next) => {
  try {
    var jagsaalt = [];
    const { db } = require("zevbackv2");
    var kholboltuud = db.kholboltuud;
    var ekhlekhOgnoo = new Date();
    var duusakhOgnoo = new Date();
    ekhlekhOgnoo.setHours(0, 0, 0, 0);
    duusakhOgnoo.setHours(23, 59, 59, 999);
    var localEsekh = !!req.body.baiguullagiinId;
    if (localEsekh) {
      kholboltuud = kholboltuud.filter(
        (a) => a.baiguullagiinId == req.body.baiguullagiinId
      );
    }
    if (kholboltuud) {
      var query = { tokiNer: { $exists: true } };
      if (!!req.body.baiguullagiinId)
        query["baiguullagiinId"] = req.body.baiguullagiinId;
      for await (const kholbolt of kholboltuud) {
        var zogsooluud = await getParkingFind(
          kholbolt,
          kholbolt.baiguullagiinId,
          query
        );
        for await (const zogsool of zogsooluud) {
          if (!!zogsool) {
            var dotorZogsool;
            if (!!zogsool.dotorZogsooliinId) {
              dotorZogsool = await getDotorZogsoolById(
                kholbolt,
                zogsool.baiguullagiinId,
                zogsool.barilgiinId,
                zogsool.dotorZogsooliinId
              );
            }
            var queryMatch = [
              {
                $match: {
                  createdAt: {
                    $gte: ekhlekhOgnoo,
                    $lte: duusakhOgnoo,
                  },
                  baiguullagiinId: zogsool.baiguullagiinId,
                  barilgiinId: zogsool.barilgiinId,
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
                $project: {
                  zogsooliinId: "$tuukh.zogsooliinId",
                },
              },
              {
                $group: {
                  _id: "$zogsooliinId",
                  too: {
                    $sum: 1,
                  },
                },
              },
            ];
            var parked = 0;
            var inside = {};
            var xariu = await getAggregateUilchluulegch(
              kholbolt,
              zogsool.baiguullagiinId,
              zogsool.barilgiinId,
              queryMatch
            );
            if (xariu && xariu.length > 0) {
              if (!!dotorZogsool && !!zogsool.dotorZogsooliinId) {
                inside.total = dotorZogsool.too;
                inside.parked = xariu.find(
                  (x) => x._id == dotorZogsool._id.toString()
                )?.too;
                if (!inside.parked) inside.parked = 0;
                parked = xariu.find(
                  (x) => x._id == zogsool._id.toString()
                )?.too;
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
              baiguullagiinId: zogsool.baiguullagiinId,
              barilgiinId: zogsool.barilgiinId,
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
  } catch (err) {
    next(err);
  }
});

async function getParkingFind(kholbolt, baiguullagiinId, query) {
  const cacheKey = `parkingFind:${baiguullagiinId}`;
  const cached = await client.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  const zogsooluud = await Parking(kholbolt).find(query);
  await client.setEx(cacheKey, 60, JSON.stringify(zogsooluud));
  return zogsooluud;
}

async function getDotorZogsoolById(kholbolt, baiguullagiinId, barilgiinId, id) {
  const cacheKey = `dotorZogsoolFindById:${baiguullagiinId}:${barilgiinId}:${id}`;
  const cached = await client.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  const dotorZogsool = await Parking(kholbolt).findById(id);
  await client.setEx(cacheKey, 60, JSON.stringify(dotorZogsool));
  return dotorZogsool;
}

async function getAggregateUilchluulegch(
  kholbolt,
  baiguullagiinId,
  barilgiinId,
  query
) {
  const cacheKey = `parkingUilchluulegch:${baiguullagiinId}:${barilgiinId}`;
  const cached = await client.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const xariu = await Uilchluulegch(kholbolt, true).aggregate(query);
  await client.setEx(cacheKey, 60, JSON.stringify(xariu));
  return xariu;
}

async function getUilchluulegchfindOne(
  kholbolt,
  baiguullagiinId,
  barilgiinId,
  query
) {
  const cacheKey = `UilchluulegchFindOne:${baiguullagiinId}:${barilgiinId}`;
  const cached = await client.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const xariu = await Uilchluulegch(kholbolt, true).findOne(query);
  await client.setEx(cacheKey, 60, JSON.stringify(xariu));
  return xariu;
}

router.get("/v2/parking", async (req, res, next) => {
  try {
    var jagsaalt = [];
    const { db } = require("zevbackv2");
    var kholboltuud = db.kholboltuud;
    var ekhlekhOgnoo = new Date();
    var duusakhOgnoo = new Date();
    ekhlekhOgnoo.setHours(0, 0, 0, 0);
    duusakhOgnoo.setHours(23, 59, 59, 999);
    var localEsekh = !!req.body.baiguullagiinId;
    if (localEsekh) {
      kholboltuud = kholboltuud.filter(
        (a) => a.baiguullagiinId == req.body.baiguullagiinId
      );
    }
    if (kholboltuud) {
      var query = { tokiNer: { $exists: true } };
      if (!!req.body.baiguullagiinId)
        query["baiguullagiinId"] = req.body.baiguullagiinId;
      for await (const kholbolt of kholboltuud) {
        var zogsooluud = await getParkingFind(
          kholbolt,
          kholbolt.baiguullagiinId,
          query
        );
        if (zogsooluud?.length > 0)
          for await (const zogsool of zogsooluud) {
            if (!!zogsool) {
              var dotorZogsool;
              if (!!zogsool.dotorZogsooliinId) {
                dotorZogsool = await getDotorZogsoolById(
                  kholbolt,
                  zogsool.baiguullagiinId,
                  zogsool.barilgiinId,
                  zogsool.dotorZogsooliinId
                );
              }
              var queryMatch = [
                {
                  $match: {
                    createdAt: {
                      $gte: ekhlekhOgnoo,
                      $lte: duusakhOgnoo,
                    },
                    baiguullagiinId: zogsool.baiguullagiinId,
                    barilgiinId: zogsool.barilgiinId,
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
                  $project: {
                    zogsooliinId: "$tuukh.zogsooliinId",
                  },
                },
                {
                  $group: {
                    _id: "$zogsooliinId",
                    too: {
                      $sum: 1,
                    },
                  },
                },
              ];
              var parked = 0;
              var inside = {};
              var xariu = await getAggregateUilchluulegch(
                kholbolt,
                zogsool.baiguullagiinId,
                zogsool.barilgiinId,
                queryMatch
              );
              if (xariu && xariu?.length > 0) {
                if (!!dotorZogsool && !!zogsool.dotorZogsooliinId) {
                  inside.total = dotorZogsool.too;
                  inside.parked = xariu?.find(
                    (x) => x._id == dotorZogsool._id.toString()
                  )?.too;
                  if (!inside.parked) inside.parked = 0;
                  parked = xariu?.find(
                    (x) => x._id == zogsool._id.toString()
                  )?.too;
                } else {
                  parked = xariu[0]?.too;
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
                baiguullagiinId: zogsool.baiguullagiinId,
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
  } catch (err) {
    next(err);
  }
});

router.get("/pass/zogsool", tokenShalgakh, async (req, res, next) => {
  try {
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
            var xariu = await Uilchluulegch(kholbolt, true).aggregate([
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
                parked = xariu.find(
                  (x) => x._id == zogsool._id.toString()
                )?.too;
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
            if (!!dotorZogsool && !!zogsool.dotorZogsooliinId)
              slot.dotor = dotor;
            var filterZogsool = jagsaalt.filter(
              (e) => e.id === zogsool._id.toString()
            );
            if (filterZogsool?.length === 0)
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
  } catch (err) {
    next(err);
  }
});

router.get("/v1/search_car/:plate_number", async (req, res, next) => {
  try {
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
        if (req.query.barilgiinId) query["barilgiinId"] = req.query.barilgiinId;
        var zogsooluud = await getParkingFind(
          kholbolt,
          kholbolt.baiguullagiinId,
          query
        );
        for await (const zogsool of zogsooluud) {
          if (!!zogsool) {
            var matchMashin = {
              mashiniiDugaar: req.params.plate_number,
              "tuukh.0.zogsooliinId": zogsool._id,
              "tuukh.0.tuluv": 0,
              zurchil: { $exists: false },
            };
            if (req.query.barilgiinId)
              matchMashin["barilgiinId"] = req.query.barilgiinId;
            oldsonMashin = await Uilchluulegch(kholbolt, true)
              .findOne(matchMashin)
              .sort({ createdAt: -1 })
              .limit(1);
            if ((!!freeze || !!localEsekh) && !!oldsonMashin) {
              oldsonMashin.freezeOgnoo =
                oldsonMashin.tuukh[0].tsagiinTuukh[0].garsanTsag;
              await Uilchluulegch(kholbolt).updateOne(
                { _id: oldsonMashin._id },
                {
                  freezeOgnoo: oldsonMashin.tuukh[0].tsagiinTuukh[0].garsanTsag
                    ? oldsonMashin.tuukh[0].tsagiinTuukh[0].garsanTsag
                    : new Date(),
                }
              );
            }
            if (!!oldsonMashin && !!oldsonMashin.mashiniiDugaar) {
              if (
                zogsool?.togtmolTulburEsekh &&
                zogsool?.togtmolTulburiinDun > 0 &&
                oldsonMashin?.turul == "Дурын"
              )
                bodsonDun = zogsool.togtmolTulburiinDun;
              else {
                bodsonDun = await zogsooliinDunAvya(
                  zogsool,
                  oldsonMashin,
                  kholbolt
                );
              }
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
              parkingUndsenUne: zogsool.undsenUne,
              session_id: oldsonMashin._id,
              garsanCameraIP: oldsonMashin.tuukh[0].garsanKhaalga,
              garsanTsag: oldsonMashin.tuukh[0].tsagiinTuukh[0].garsanTsag
                ? moment(
                    oldsonMashin.tuukh[0].tsagiinTuukh[0].garsanTsag
                  ).format("YYYY/MM/DD HH:mm:ss")
                : null,
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
              pay_amount: oldsonMashin.niitDun ? oldsonMashin.niitDun : 0,
              parking_id: zogsool._id,
              parkingUndsenUne: zogsool.undsenUne,
              session_id: oldsonMashin._id,
              garsanCameraIP: oldsonMashin.tuukh[0].garsanKhaalga,
              garsanTsag: oldsonMashin.tuukh[0].tsagiinTuukh[0].garsanTsag
                ? moment(
                    oldsonMashin.tuukh[0].tsagiinTuukh[0].garsanTsag
                  ).format("YYYY/MM/DD HH:mm:ss")
                : null,
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
  } catch (err) {
    next(err);
  }
});

router.get("/v3/search_car/:plate_number", async (req, res, next) => {
  try {
    const { db } = require("zevbackv2");
    var kholboltuud = db.kholboltuud;
    var bodsonDun = 0;
    var data;
    var dataList = [];
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
        if (req.query.barilgiinId) query["barilgiinId"] = req.query.barilgiinId;
        var zogsooluud = await getParkingFind(
          kholbolt,
          kholbolt.baiguullagiinId,
          query
        );
        for await (const zogsool of zogsooluud) {
          if (!!zogsool) {
            var matchMashin = {
              mashiniiDugaar: req.params.plate_number,
              "tuukh.0.zogsooliinId": zogsool._id,
              "tuukh.0.tuluv": 0,
              zurchil: { $exists: false },
            };
            if (req.query.barilgiinId)
              matchMashin["barilgiinId"] = req.query.barilgiinId;
            oldsonMashin = await Uilchluulegch(kholbolt, true)
              .findOne(matchMashin)
              .sort({ createdAt: -1 })
              .limit(1);
            if ((!!freeze || !!localEsekh) && !!oldsonMashin) {
              oldsonMashin.freezeOgnoo =
                oldsonMashin.tuukh[0].tsagiinTuukh[0].garsanTsag;
              await Uilchluulegch(kholbolt).updateOne(
                { _id: oldsonMashin._id },
                {
                  freezeOgnoo: oldsonMashin.tuukh[0].tsagiinTuukh[0].garsanTsag
                    ? oldsonMashin.tuukh[0].tsagiinTuukh[0].garsanTsag
                    : new Date(),
                }
              );
            }
            if (!!oldsonMashin && !!oldsonMashin.mashiniiDugaar) {
              if (
                zogsool?.togtmolTulburEsekh &&
                zogsool?.togtmolTulburiinDun > 0 &&
                oldsonMashin?.turul == "Дурын"
              )
                bodsonDun = zogsool.togtmolTulburiinDun;
              else {
                bodsonDun = await zogsooliinDunAvya(
                  zogsool,
                  oldsonMashin,
                  kholbolt
                );
              }
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
              parkingUndsenUne: zogsool.undsenUne,
              session_id: oldsonMashin._id,
              garsanCameraIP: oldsonMashin.tuukh[0].garsanKhaalga,
              garsanTsag: oldsonMashin.tuukh[0].tsagiinTuukh[0].garsanTsag
                ? moment(
                    oldsonMashin.tuukh[0].tsagiinTuukh[0].garsanTsag
                  ).format("YYYY/MM/DD HH:mm:ss")
                : null,
            };
            tukhainKholbolt = kholbolt;
            dataList.push(data);
          } else if (oldsonMashin && !!oldsonMashin.mashiniiDugaar) {
            tukhainKholbolt = kholbolt;
            data = {
              plate_number: req.params.plate_number,
              enter_date: moment(
                oldsonMashin.tuukh[0].tsagiinTuukh[0].orsonTsag
              ).format("YYYY/MM/DD HH:mm:ss"),
              pay_amount: oldsonMashin.niitDun ? oldsonMashin.niitDun : 0,
              parking_id: zogsool._id,
              parkingUndsenUne: zogsool.undsenUne,
              session_id: oldsonMashin._id,
              garsanCameraIP: oldsonMashin.tuukh[0].garsanKhaalga,
              garsanTsag: oldsonMashin.tuukh[0].tsagiinTuukh[0].garsanTsag
                ? moment(
                    oldsonMashin.tuukh[0].tsagiinTuukh[0].garsanTsag
                  ).format("YYYY/MM/DD HH:mm:ss")
                : null,
            };
            dataList.push(data);
          }
        }
        //if (data && data.plate_number) break;
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
      dataList,
    };
    res.send(butsaakhKhariu);
  } catch (err) {
    console.log("v3 search_car / ------------>>" + err);
    next(err);
  }
});

router.get("/v2/search_car/:plate_number", async (req, res, next) => {
  try {
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
        var zogsooluud = await getParkingFind(
          kholbolt,
          kholbolt.baiguullagiinId,
          query
        );
        for await (const zogsool of zogsooluud) {
          if (!!zogsool) {
            oldsonMashin = await Uilchluulegch(kholbolt, true)
              .findOne({
                mashiniiDugaar: {
                  $regex: req.params.plate_number,
                  $options: "i",
                },
                "tuukh.0.zogsooliinId": zogsool._id,
                "tuukh.0.tuluv": 0,
                zurchil: { $exists: false },
              })
              .sort({ createdAt: -1 })
              .limit(1);
            if ((!!freeze || !!localEsekh) && !!oldsonMashin) {
              await Uilchluulegch(kholbolt).updateOne(
                { _id: oldsonMashin._id },
                {
                  freezeOgnoo: oldsonMashin.tuukh[0].tsagiinTuukh[0].garsanTsag
                    ? oldsonMashin.tuukh[0].tsagiinTuukh[0].garsanTsag
                    : new Date(),
                }
              );
            }
            if (!!oldsonMashin && !!oldsonMashin.mashiniiDugaar) {
              if (
                zogsool?.togtmolTulburEsekh &&
                zogsool?.togtmolTulburiinDun > 0 &&
                oldsonMashin?.turul == "Дурын"
              )
                bodsonDun = zogsool.togtmolTulburiinDun;
              else
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
              parkingUndsenUne: zogsool.undsenUne,
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
              pay_amount: oldsonMashin.niitDun ? oldsonMashin.niitDun : 0,
              parking_id: zogsool._id,
              parkingUndsenUne: zogsool.undsenUne,
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

router.get("/v1/search_car_unegui/:plate_number", async (req, res, next) => {
  try {
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
        var zogsooluud = await getParkingFind(
          kholbolt,
          kholbolt.baiguullagiinId,
          query
        );
        for await (const zogsool of zogsooluud) {
          if (!!zogsool) {
            tukhainKholbolt = kholbolt;
            oldsonMashin = await Uilchluulegch(kholbolt, true).findOne({
              mashiniiDugaar: req.params.plate_number,
              tuukh: {
                $elemMatch: {
                  zogsooliinId: zogsool._id,
                  tuluv: { $nin: [-2, -3] },
                  $or: [
                    {
                      "tsagiinTuukh.0.garsanTsag": {
                        $gt: new Date(Date.now() - 15 * 100000),
                      },
                    },
                    { "tsagiinTuukh.0.garsanTsag": { $exists: false } },
                  ],
                },
              },
            });
          }
          if (!!localEsekh && !!oldsonMashin) {
            if (req.query.baiguullagiinId === "670f3437b41a478195dd3d4b") {
              data = {
                plate_number: req.params.plate_number,
                text: "Үнэгүй зочид",
              };
              tulburData = [{ ognoo: new Date(), turul: "Үнэгүй", dun: 0 }];
            } else if (
              req.query.baiguullagiinId === "670f3437b41a478195dd3d4b"
            ) {
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
  } catch (err) {
    next(err);
  }
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
    var freeze = req.query.freeze;
    var tukhainKholbolt;
    if (kholboltuud) {
      for await (const kholbolt of kholboltuud) {
        var query = {
          passNer: { $exists: true },
        };
        var zogsooluud = await getParkingFind(
          kholbolt,
          kholbolt.baiguullagiinId,
          query
        );
        for await (const zogsool of zogsooluud) {
          if (!!zogsool) {
            oldsonMashin = await Uilchluulegch(kholbolt, true).findOne({
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
          oldsonMashin = await Uilchluulegch(kholbolt, true).findById(
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
          oldsonMashin = await Uilchluulegch(kholbolt, true).findById(
            session_id
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
    const { db } = require("zevbackv2");
    var kholboltuud = db.kholboltuud;
    var message = "Amjilttai";
    var oldsonMashin;
    var tukhainKholbolt;
    var tukhainObject;
    var tukhainZogsool;
    var success = true;
    var bodsonDun = 0;
    var localEsekh = !!req.body.baiguullagiinId;
    if (localEsekh) {
      kholboltuud = kholboltuud.filter(
        (a) => a.baiguullagiinId == req.body.baiguullagiinId
      );
    }
    if (kholboltuud) {
      var query = { tokiNer: { $exists: true } };
      if (!!req.body.baiguullagiinId)
        query["baiguullagiinId"] = req.body.baiguullagiinId;
      for await (const kholbolt of kholboltuud) {
        var zogsooluud = await getParkingFind(
          kholbolt,
          kholbolt.baiguullagiinId,
          query
        );
        for await (const zogsool of zogsooluud) {
          if (!!zogsool) {
            const plateNumber = req.body.plate_number;
            const zogsoolId = zogsool._id;
            const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
            oldsonMashin = await Uilchluulegch(kholbolt, true).findOne({
              mashiniiDugaar: plateNumber,
              "tuukh.0.zogsooliinId": zogsoolId,
              "tuukh.0.tuluv": { $nin: [-2, -3] },
              updatedAt: { $gt: fiveMinutesAgo },
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
    } else {
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
          ) {
            var tulburDun = tukhainObject.tuukh[0].tulbur?.reduce(
              (a, b) => a + (b.dun || 0),
              0
            );
            if (tulburDun > 0 && bodsonDun > 0) {
              if (bodsonDun == req.body.paid_amount + tulburDun)
                tukhainObject.tuukh[0].tulbur.push(...tulbur);
              else if (bodsonDun < req.body.paid_amount + tulburDun)
                res.send({ success: false, message: "Төлөлт хийгдсэн байна!" });
            }
          } else tukhainObject.tuukh[0].tulbur = tulbur;
        var set = {
          "tuukh.$[t].tulbur": tukhainObject.tuukh[0].tulbur,
          tokiId: "toki",
        };
        if (bodsonDun > 0) {
          var tulburDun = tukhainObject.tuukh[0].tulbur?.reduce(
            (a, b) => a + (b.dun || 0),
            0
          );
          if (bodsonDun == tulburDun) {
            if (!req.body.manually_open)
              set["garakhTsag"] = new Date(
                new Date().getTime() +
                  (tukhainZogsool?.garakhTsag || 30) * 60000
              );
            if (!!tukhainObject.tuukh[0].garsanKhaalga)
              set["tuukh.$[t].tuluv"] = 1;
          }
        }
        if (
          !!tukhainObject.tuukh[0].tsagiinTuukh?.[0].garsanTsag &&
          tukhainObject.tuukh[0].tsagiinTuukh[0].garsanTsag >
            new Date(Date.now() - 600000)
        )
          //10 * 60 * 1000
          req.body.manually_open = true;
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
        if (!!req.body.manually_open) {
          if (
            !!tukhainZogsool.kamerDavkharAshiglakh &&
            !tukhainObject?.tuukh[0]?.garsanKhaalga
          ) {
            var nemeltZogsool = await Parking(tukhainKholbolt).findOne({
              _id: { $ne: tukhainZogsool._id },
            });
            var garsanObject = await Uilchluulegch(
              tukhainKholbolt,
              true
            ).findOne({
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
        if (!!tuxainSalbar?.eBarimtShine) {
          var ebarimt = await zogsooloosEbarimtShineUusgye(
            tukhainObject,
            req.body.customerNo,
            req.body.customerTin,
            tuxainSalbar.merchantTin, //"37900846788",
            tuxainSalbar.districtCode, //,"0023"
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
                butsaakhKhariu.data = d;
                if (!res.headersSent) {
                  res.send(butsaakhKhariu);
                }
              } else {
                var ebarimt;
                if (!!tuxainSalbar.eBarimtShine)
                  ebarimt = new EbarimtShine(tukhainKholbolt)(d);
                else ebarimt = new Ebarimt(tukhainKholbolt)(d);
                ebarimt.zogsooliinId = tukhainObject._id;
                ebarimt.baiguullagiinId = khariuObject.baiguullagiinId;
                ebarimt.barilgiinId = khariuObject.barilgiinId;
                ebarimt.mashiniiDugaar = khariuObject.mashiniiDugaar;
                ebarimt.save().catch((err) => {
                  if (!res.headersSent && next) next(err);
                });
                var update = {
                  ebarimtAvsanEsekh: true,
                  ebarimtAvsanDun: ebarimt.cashAmount || ebarimt.totalAmount,
                };
                if (ebarimt.customerNo)
                  update = {
                    ...update,
                    ebarimtRegister: ebarimt.customerNo,
                  };
                Uilchluulegch(tukhainKholbolt)
                  .findByIdAndUpdate(tukhainObject._id, update)
                  .then((xariu) => {})
                  .catch((err) => {
                    if (!res.headersSent && next) next(err);
                  });
                delete d.baiguullagiinId;
                delete d.zogsooliinId;
                delete d.barilgiinId;
                delete d._id;
                butsaakhKhariu.data = d;
                if (!res.headersSent) {
                  res.send(butsaakhKhariu);
                }
              }
            } catch (err) {
              if (!res.headersSent && next) next(err);
            }
          };
          ebarimtDuudya(
            ebarimt,
            butsaakhMethod,
            next,
            tuxainSalbar.eBarimtShine
          );
        } else {
          butsaakhKhariu.success = true;
          butsaakhKhariu.message = "ИБаримт dll холболт хийгдээгүй байна!";
          res.send(butsaakhKhariu);
        }
      }
    }
  } catch (err) {
    next(err);
  }
});

router.route("/v2/pay").post(async (req, res, next) => {
  try {
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
    var bodsonDun = 0;
    var localEsekh = !!req.body.baiguullagiinId;
    if (localEsekh) {
      kholboltuud = kholboltuud.filter(
        (a) => a.baiguullagiinId == req.body.baiguullagiinId
      );
    }
    if (kholboltuud) {
      var query = { tokiNer: { $exists: true } };
      if (!!req.body.baiguullagiinId)
        query["baiguullagiinId"] = req.body.baiguullagiinId;
      for await (const kholbolt of kholboltuud) {
        var zogsooluud = await getParkingFind(
          kholbolt,
          kholbolt.baiguullagiinId,
          query
        );
        for await (const zogsool of zogsooluud) {
          if (!!zogsool) {
            const plateNumber = req.body.plate_number;
            const zogsoolId = zogsool._id;
            const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
            var queryOne = {
              mashiniiDugaar: plateNumber,
              "tuukh.0.zogsooliinId": zogsoolId,
              "tuukh.0.tuluv": { $nin: [-2, -3] },
              updatedAt: { $gt: fiveMinutesAgo },
            };
            oldsonMashin = await getUilchluulegchfindOne(
              kholbolt,
              zogsool.baiguullagiinId,
              zogsool.barilgiinId,
              queryOne
            );
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
    } else {
      res.send(butsaakhKhariu);
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
            oldsonMashin = await Uilchluulegch(kholbolt, true).findOne({
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
    } else {
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
                new Date().getTime() +
                  (tukhainZogsool?.garakhTsag || 30) * 60000
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
        if (!!req.body.manually_open) {
          if (
            !!tukhainZogsool.kamerDavkharAshiglakh &&
            !tukhainObject?.tuukh[0]?.garsanKhaalga
          ) {
            var nemeltZogsool = await Parking(tukhainKholbolt).findOne({
              _id: { $ne: tukhainZogsool._id },
            });
            var garsanObject = await Uilchluulegch(
              tukhainKholbolt,
              true
            ).findOne({
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
          var ebarimt = await zogsooloosEbarimtShineUusgye(
            tukhainObject,
            req.body.customerNo,
            req.body.customerTin,
            tuxainSalbar.merchantTin, //"37900846788",
            tuxainSalbar.districtCode, //,"0023"
            tukhainKholbolt,
            nuatTulukhEsekh
          );
          butsaakhMethod = function (d, khariuObject) {
            try {
              if (d?.status != "SUCCESS" && !d.success)
                throw new Error(d.message);
              var ebarimt;
              if (!!tuxainSalbar.eBarimtShine)
                ebarimt = new EbarimtShine(tukhainKholbolt)(d);
              else ebarimt = new Ebarimt(tukhainKholbolt)(d);
              ebarimt.zogsooliinId = tukhainObject._id;
              ebarimt.baiguullagiinId = khariuObject.baiguullagiinId;
              ebarimt.barilgiinId = khariuObject.barilgiinId;
              ebarimt.mashiniiDugaar = khariuObject.mashiniiDugaar;
              ebarimt.save().catch((err) => {
                if (!res.headersSent && next) next(err);
              });
              var update = {
                ebarimtAvsanEsekh: true,
                ebarimtAvsanDun: ebarimt.cashAmount || ebarimt.totalAmount,
              };
              if (ebarimt.customerNo)
                update = {
                  ...update,
                  ebarimtRegister: ebarimt.customerNo,
                };
              Uilchluulegch(tukhainKholbolt)
                .findByIdAndUpdate(tukhainObject._id, update)
                .then((xariu) => {})
                .catch((err) => {
                  if (!res.headersSent && next) next(err);
                });
              delete d.baiguullagiinId;
              delete d.zogsooliinId;
              delete d.barilgiinId;
              delete d._id;
              butsaakhKhariu.data = d;
              if (!res.headersSent) {
                res.send(butsaakhKhariu);
              }
            } catch (err) {
              if (!res.headersSent && next) next(err);
            }
          };
          ebarimtDuudya(
            ebarimt,
            butsaakhMethod,
            next,
            tuxainSalbar.eBarimtShine
          );
        } else
          res.send({
            success: true,
            message: "ИБаримт dll холболт хийгдээгүй байна!",
          });
      }
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
            dun: 4000,
          },
        ];
      } else {
        tulbur = [
          {
            ognoo: new Date(),
            turul: "Fitness",
            dun: 4000,
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
    } else if (req.body.ajiltniiId == "67d92062513ec21e26bdb604") {
      if (req.body.paid_amount == 0) {
        tulbur = [
          {
            ognoo: new Date(),
            turul: "Бассэйн",
            dun: 7000,
          },
        ];
      } else {
        tulbur = [
          {
            ognoo: new Date(),
            turul: "Бассэйн",
            dun: 7000,
          },
          {
            ognoo: new Date(),
            turul: req.body.turul,
            dun: req.body.paid_amount,
          },
        ];
      }
    } else if (
      req.body.ajiltniiId == "68357e846653c13643908698" &&
      !!req.body.khungulukhTsag &&
      !!req.body.zogsoolUndsenUne
    ) {
      if (req.body.paid_amount == 0) {
        tulbur = [
          {
            ognoo: new Date(),
            turul: "Божон/ " + req.body.khungulukhTsag + " цаг",
            dun: req.body.zogsoolUndsenUne * req.body.khungulukhTsag,
          },
        ];
      } else {
        tulbur = [
          {
            ognoo: new Date(),
            turul: "Божон/ " + req.body.khungulukhTsag + " цаг",
            dun: req.body.zogsoolUndsenUne * req.body.khungulukhTsag,
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
    } else if (req.body.ajiltniiId === "68425acd7611dd8da7e7a7d2") {
      if (req.body.paid_amount == 0) {
        tulbur = [
          {
            ognoo: new Date(),
            turul: "Хөнгөлөлт",
            dun: req.body.khungulult,
          },
        ];
      } else {
        tulbur = [
          {
            ognoo: new Date(),
            turul: "Хөнгөлөлт",
            dun: req.body.khungulult,
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
        req.body.tukhainBaaziinKholbolt,
        true
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
    bodsonDun -= tukhainObject.tuukh[0].tulbur.reduce(
      (a, b) => a + (b.dun || 0),
      0
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
        ) {
          if (req.body.ajiltniiId == "66384a9061eeda747d01a320") {
            if (tukhainObject.tuukh[0].tulbur.find((x) => x.turul == "Fitness"))
              throw new Error("Хөнгөлөлт оруулсан байна!");
          } else if (req.body.ajiltniiId == "6746b7b1e3a4bd05bbac6880") {
            if (
              tukhainObject.tuukh[0].tulbur.find((x) => x.turul == "Соёолж Ц/Д")
            )
              throw new Error("Хөнгөлөлт оруулсан байна!");
          } else if (req.body.ajiltniiId == "67d92062513ec21e26bdb604") {
            if (tukhainObject.tuukh[0].tulbur.find((x) => x.turul == "Бассэйн"))
              throw new Error("Хөнгөлөлт оруулсан байна!");
          } else if (req.body.ajiltniiId == "68357e846653c13643908698") {
            if (
              tukhainObject.tuukh[0].tulbur.find((x) =>
                x.turul?.includes("Божон")
              )
            )
              throw new Error("Хөнгөлөлт оруулсан байна!");
          } else if (req.body.barilgiinId === "673d88133987e97992f77c03") {
            if (
              tukhainObject.tuukh[0].tulbur.find((x) => x.turul == "Хөнгөлөлт")
            )
              throw new Error("Хөнгөлөлт оруулсан байна!");
          } else if (req.body.ajiltniiId === "68425acd7611dd8da7e7a7d2") {
            if (
              tukhainObject.tuukh[0].tulbur.find((x) =>
                x.turul?.includes("Хөнгөлөлт")
              )
            )
              throw new Error("Хөнгөлөлт оруулсан байна!");
          } else if (req.body.barilgiinId === "67e0ca757d7ac716ef9c3cc5") {
            if (
              tukhainObject.tuukh[0].tulbur.find(
                (x) => x.turul === req.body.turul
              )
            )
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
          set["garakhTsag"] = new Date(
            new Date().getTime() + (tukhainZogsool?.garakhTsag || 30) * 60000
          );
          set["tuukh.$[t].burtgesenAjiltaniiId"] = req.body.ajiltniiId;
          set["tuukh.$[t].burtgesenAjiltaniiNer"] = req.body.ajiltniiNer;
        }
      }
      if (req.body.turul == "Пос үнэгүй") {
        set = {
          "tuukh.$[t].uneguiGarsan": req.body.uneguiGarsan,
          turul: req.body.turul,
        };
        if (!!tukhainObject.tuukh[0]?.tsagiinTuukh[0]?.garsanTsag) {
          set["tuukh.$[t].tuluv"] = -1;
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
              "t.zogsooliinId": tukhainZogsool.gadnaZogsooliinId
                ? tukhainZogsool.gadnaZogsooliinId
                : tukhainZogsool._id,
            },
          ],
        }
      );
      res.send("Amjilttai");
    }
  } catch (err) {
    if (next) next(err);
  }
});

router
  .route("/v1/kioskEbarimtAvya")
  .post(tokenShalgakh, async (req, res, next) => {
    try {
      var tukhainKholbolt = req.body.tukhainBaaziinKholbolt;
      var tukhainObject = await Uilchluulegch(tukhainKholbolt, true).findById(
        req.body.uilchluulegchiinId
      );
      if (!!tukhainObject) {
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
            if (d?.status != "SUCCESS" && !d.success)
              throw new Error(d.message);
            var ebarimt;
            if (!!tuxainSalbar.eBarimtShine)
              ebarimt = new EbarimtShine(tukhainKholbolt)(d);
            else ebarimt = new Ebarimt(tukhainKholbolt)(d);
            ebarimt.zogsooliinId = tukhainObject._id;
            ebarimt.baiguullagiinId = khariuObject.baiguullagiinId;
            ebarimt.barilgiinId = khariuObject.barilgiinId;
            ebarimt.mashiniiDugaar = khariuObject.mashiniiDugaar;
            ebarimt.save().catch((err) => {
              if (!res.headersSent && next) next(err);
            });
            var update = {
              ebarimtAvsanEsekh: true,
              ebarimtAvsanDun: ebarimt.cashAmount || ebarimt.totalAmount,
            };
            if (ebarimt.customerNo)
              update = {
                ...update,
                ebarimtRegister: ebarimt.customerNo,
              };
            Uilchluulegch(tukhainKholbolt)
              .findByIdAndUpdate(tukhainObject._id, update)
              .then((xariu) => {})
              .catch((err) => {
                if (!res.headersSent && next) next(err);
              });
            delete d.baiguullagiinId;
            delete d.zogsooliinId;
            delete d.barilgiinId;
            delete d._id;
            var butsaakhKhariu = {
              success: true,
              message: "Amjilttai",
            };
            butsaakhKhariu.data = d;
            if (!res.headersSent) {
              res.send(butsaakhKhariu);
            }
          } catch (err) {
            if (!res.headersSent && next) next(err);
          }
        };
        ebarimtDuudya(ebarimt, butsaakhMethod, next, tuxainSalbar.eBarimtShine);
      } else res.send(null);
    } catch (err) {
      next(err);
    }
  });

router.route("/mashinUpdate").post(tokenShalgakh, async (req, res, next) => {
  try {
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
    res.send("Amjilttai");
  } catch (error) {
    next(error);
  }
});

router.post(
  "/turluurZogsoolIdOruulakh",
  tokenShalgakh,
  async (req, res, next) => {
    try {
      var match = {
        baiguullagiinId: req.body.baiguullagiinId,
        barilgiinId: req.body.barilgiinId,
        ebarimtAvsanEsekh: true,
        mashiniiDugaar: { $exists: true },
        "tuukh.tulbur.turul": req.body.turul,
      };
      if (!!req.body.mashiniiDugaar)
        match["mashiniiDugaar"] = req.body.mashiniiDugaar;
      var uilchluulegchuud = await Uilchluulegch(
        req.body.tukhainBaaziinKholbolt,
        true
      ).find(match);
      var ebarimtuud = [];
      if (uilchluulegchuud?.length > 0) {
        for await (const data of uilchluulegchuud) {
          ebarimtuud = await EbarimtShine(req.body.tukhainBaaziinKholbolt).find(
            {
              baiguullagiinId: req.body.baiguullagiinId,
              barilgiinId: req.body.barilgiinId,
              ustgasanOgnoo: { $exists: false },
              zogsooliinId: data?._id,
            }
          );
          if (ebarimtuud?.length === 0) {
            ebarimtuud = await EbarimtShine(
              req.body.tukhainBaaziinKholbolt
            ).find({
              baiguullagiinId: req.body.baiguullagiinId,
              barilgiinId: req.body.barilgiinId,
              ustgasanOgnoo: { $exists: false },
              mashiniiDugaar: data?.mashiniiDugaar,
              createdAt: {
                $gte: moment(data.tuukh[0]?.tulbur[0]?.ognoo).format(
                  "YYYY-MM-DD 00:00:00"
                ),
                $lte: moment(data.tuukh[0]?.tulbur[0]?.ognoo).format(
                  "YYYY-MM-DD 23:59:59"
                ),
              },
            });
            if (ebarimtuud?.length > 0) {
              for await (const saveEBarimt of ebarimtuud) {
                saveEBarimt.zogsooliinId = data?._id;
                await saveEBarimt.save().catch((err) => {
                  next(err);
                });
              }
            }
          }
        }
      }
      res.send(ebarimtuud);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/ebarimtAvsanDunOruulakh",
  tokenShalgakh,
  async (req, res, next) => {
    try {
      var match = {
        baiguullagiinId: req.body.baiguullagiinId,
        barilgiinId: req.body.barilgiinId,
        mashiniiDugaar: { $exists: true },
        zogsooliinId: { $exists: true },
      };
      var ebarimtuud = await EbarimtShine(req.body.tukhainBaaziinKholbolt).find(
        match
      );
      if (ebarimtuud?.length > 0) {
        for await (const ebarimt of ebarimtuud) {
          var update = {
            ebarimtAvsanDun: ebarimt.cashAmount || ebarimt.totalAmount,
          };
          Uilchluulegch(req.body.tukhainBaaziinKholbolt)
            .findByIdAndUpdate(ebarimt.zogsooliinId, update)
            .then((xariu) => {})
            .catch((err) => {
              next(err);
            });
        }
      }
      res.send("Амжилттай");
    } catch (err) {
      next(err);
    }
  }
);

router.post("/davkharBarimtZasakh", tokenShalgakh, async (req, res, next) => {
  try {
    var match = {
      baiguullagiinId: req.body.baiguullagiinId,
      barilgiinId: req.body.barilgiinId,
      mashiniiDugaar: { $exists: true },
      "tuukh.tulbur": { $size: req.body.count },
      "tuukh.tulbur.turul": req.body.turul,
    };
    if (!!req.body.mashiniiDugaar)
      match["mashiniiDugaar"] = req.body.mashiniiDugaar;
    var uilchluulegchuud = await Uilchluulegch(
      req.body.tukhainBaaziinKholbolt,
      true
    ).find(match);
    if (uilchluulegchuud?.length > 0) {
      for await (const data of uilchluulegchuud) {
        var filteredData = data.tuukh[0]?.tulbur?.filter(
          (a) => a.turul === req.body.turul
        );
        if (filteredData?.length === req.body.count) {
          await Uilchluulegch(req.body.tukhainBaaziinKholbolt).updateOne(
            { _id: data._id },
            {
              "tuukh.0.tulbur": [filteredData[0]],
            }
          );
        }
      }
    }
    res.send("Амжилттай");
  } catch (err) {
    next(err);
  }
});

router.post(
  "/niitZurchilteiMashinOlokh",
  tokenShalgakh,
  async (req, res, next) => {
    try {
      var query = {
        baiguullagiinId: req.body.baiguullagiinId,
        barilgiinId: req.body.barilgiinId,
        gadnaZogsooliinId: { $exists: false },
        zurchulMsgeerSanuulakh: true,
      };
      var zogsool = await Parking(req.body.tukhainBaaziinKholbolt).findOne(
        query
      );
      if (zogsool?.zurchulMsgeerSanuulakh) {
        const zurchilteiUilchluulegch = await Uilchluulegch(
          req.body.tukhainBaaziinKholbolt,
          true
        ).find({
          baiguullagiinId: zogsool?.baiguullagiinId,
          barilgiinId: zogsool.barilgiinId,
          "tuukh.zogsooliinId": zogsool?._id.toString(),
          "tuukh.tulbur": [],
          "tuukh.tsagiinTuukh.garsanTsag": { $exists: true },
          "tuukh.garsanKhaalga": { $exists: true },
          niitDun: { $gt: zogsool?.tulburiinLimitDun || 0 },
        });
        if (zurchilteiUilchluulegch?.length > 0) {
          for await (const zurchil of zurchilteiUilchluulegch) {
            const zurchilteiData = await ZurchilteiMashin(
              req.body.tukhainBaaziinKholbolt
            ).findOne({
              baiguullagiinId: zurchil?.baiguullagiinId,
              barilgiinId: zurchil?.barilgiinId,
              uilchluulegchiinId: zurchil?._id.toString(),
              zogsooliinId: zurchil?.tuukh[0]?.zogsooliinId,
              mashiniiDugaar: zurchil?.mashiniiDugaar,
            });
            if (!zurchilteiData) {
              const zurchilModel = new ZurchilteiMashin(
                req.body.tukhainBaaziinKholbolt
              )();
              zurchilModel.baiguullagiinId = zurchil?.baiguullagiinId;
              zurchilModel.barilgiinId = zurchil?.barilgiinId;
              zurchilModel.uilchluulegchiinId = zurchil?._id.toString();
              zurchilModel.mashiniiDugaar = zurchil?.mashiniiDugaar;
              zurchilModel.zogsooliinId = zurchil?.tuukh[0]?.zogsooliinId;
              zurchilModel.niitKhugatsaa = zurchil?.niitKhugatsaa;
              zurchilModel.orsonKhaalga = zurchil?.tuukh[0].orsonKhaalga;
              zurchilModel.garsanKhaalga = zurchil?.tuukh[0].garsanKhaalga;
              zurchilModel.orsonTsag =
                zurchil?.tuukh[0].tsagiinTuukh[0].orsonTsag;
              zurchilModel.garsanTsag =
                zurchil?.tuukh[0].tsagiinTuukh[0].garsanTsag;
              zurchilModel.niitDun = zurchil?.niitDun;
              zurchilModel.turul = zurchil?.turul;
              zurchilModel.tuluv = 0;
              zurchilModel.save();
            }
          }
        }
      }
      return res.send("Amjilttai");
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/zurchilteiMashinMsgilgeekh",
  tokenShalgakh,
  async (req, res, next) => {
    try {
      var query = {
        baiguullagiinId: req.body.baiguullagiinId,
        barilgiinId: req.body.barilgiinId,
        gadnaZogsooliinId: { $exists: false },
        zurchulMsgeerSanuulakh: true,
      };
      var zogsool = await Parking(req.body.tukhainBaaziinKholbolt).findOne(
        query
      );
      var msgnuud = [];
      if (!!zogsool && zogsool?.zurchilMsgilgeekhDugaar?.length > 0) {
        var match = {
          baiguullagiinId: req.body.baiguullagiinId,
          barilgiinId: req.body.barilgiinId,
          zogsooliinId: zogsool?._id?.toString(),
          mashiniiDugaar: req.body.mashiniiDugaar,
          tuluv: { $ne: 1 },
        };
        var query = [
          {
            $match: match,
          },
          {
            $group: {
              _id: "$mashiniiDugaar",
              dun: {
                $sum: "$niitDun",
              },
            },
          },
        ];
        var zurchiluud = await ZurchilteiMashin(
          req.body.tukhainBaaziinKholbolt
        ).aggregate(query);
        if (zurchiluud?.length > 0) {
          for await (const dugaar of zogsool?.zurchilMsgilgeekhDugaar) {
            var msg = new MsgTuukh(req.body.tukhainBaaziinKholbolt)();
            msg.baiguullagiinId = req.body.baiguullagiinId;
            msg.barilgiinId = req.body.barilgiinId;
            msg.mashiniiDugaar = zurchiluud[0]._id;
            msg.dugaar = dugaar;
            msg.turul = "zurchil";
            msg.msg =
              formatNumber(zurchiluud[0].dun, 0) +
              " zurchiltei " +
              (zurchiluud[0]._id || "") +
              " dugaartai mashin newterlee";
            msg.save();
            msgnuud.push({ to: dugaar, text: msg.msg });
          }
        }
        if (msgnuud?.length > 0) {
          var msgIlgeekhKey = "aa8e588459fdd9b7ac0b809fc29cfae3";
          var msgIlgeekhDugaar = "72002032";
          msgIlgeeye(
            msgnuud,
            msgIlgeekhKey,
            msgIlgeekhDugaar,
            [],
            0,
            req.body.tukhainBaaziinKholbolt,
            req.body.baiguullagiinId
          );
        }
      }
      return res.send(msgnuud);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/zurchiluudTulsunBolgoy",
  tokenShalgakh,
  async (req, res, next) => {
    try {
      await ZurchilteiMashin(req.body.tukhainBaaziinKholbolt).updateMany(
        { _id: { $in: req.body.utguud } },
        {
          $set: {
            tuluv: 1,
            tailbar: req.body.shaltgaan,
          },
        }
      );
      res.send("Amjilttai");
    } catch (err) {
      next(err);
    }
  }
);

function formatNumber(num, fixed = 2) {
  if (num === undefined || num === null || num === "")
    return formatNumber("0.00", fixed);
  var fixedNum = parseFloat(num).toFixed(fixed).toString();
  var numSplit = fixedNum.split(".");
  if (numSplit === null || numSplit.length === 0) {
    return formatNumber("0.00", fixed);
  }
  var firstFormatNum = numSplit[0]
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  if (lodash.isNaN(firstFormatNum)) firstFormatNum = "0";
  if (fixed === 0) return firstFormatNum;
  return firstFormatNum + "." + numSplit[1];
}

router.post(
  "/zogsooliinTuluuguiMashiniiTailanAvya",
  tokenShalgakh,
  async (req, res, next) => {
    try {
      var match = {
        baiguullagiinId: req.body.baiguullagiinId,
        barilgiinId: !!req.body.barilgiinId
          ? req.body.barilgiinId
          : { $exists: true },
        mashiniiDugaar: !!req.body.searchUtga
          ? { $regex: req.body.searchUtga, $options: "i" }
          : { $exists: true },
        tuluv: 0,
        createdAt: {
          $lte: new Date(moment(req.body.ognoo).format("YYYY-MM-DD 23:59:59")),
        },
      };
      var query = [
        {
          $match: match,
        },
        {
          $group: {
            _id: "$mashiniiDugaar",
            dun: {
              $sum: "$niitDun",
            },
            too: {
              $sum: 1,
            },
          },
        },
      ];
      var tailan = await ZurchilteiMashin(
        req.body.tukhainBaaziinKholbolt
      ).aggregate(query);
      res.send(tailan);
    } catch (err) {
      next(err);
    }
  }
);

router.get("/notTokiParking", async (req, res, next) => {
  try {
    const { db } = require("zevbackv2");
    var kholboltuud = db.kholboltuud;
    var localEsekh = !!req.body.baiguullagiinId;
    if (localEsekh) {
      kholboltuud = kholboltuud.filter(
        (a) => a.baiguullagiinId == req.body.baiguullagiinId
      );
    }
    var result = [];
    if (kholboltuud) {
      var query = { tokiNer: { $exists: false } };
      if (!!req.body.baiguullagiinId)
        query["baiguullagiinId"] = req.body.baiguullagiinId;
      for await (const kholbolt of kholboltuud) {
        var baiguullaga = await Baiguullaga(db.erunkhiiKholbolt).findById(
          kholbolt.baiguullagiinId
        );
        var zogsooluud = await getParkingFind(
          kholbolt,
          kholbolt.baiguullagiinId,
          query
        );
        if (zogsooluud?.length > 0)
          result.push({ ner: baiguullaga.ner, register: baiguullaga.register });
      }
    }
    res.send(result);
  } catch (err) {
    next(err);
  }
});

router.post(
  "/dotorZogsoolDavhkardsanMashin",
  tokenShalgakh,
  async (req, res, next) => {
    try {
      var match = {
        baiguullagiinId: req.body.baiguullagiinId,
        barilgiinId: req.body.barilgiinId,
        tuukh: { $size: req.body.size },
        "tuukh.zogsooliinId": req.body.zogsooliinId,
        "tuukh.orsonKhaalga": req.body.cameraIP,
        "tuukh.tsagiinTuukh.garsanTsag": { $exists: true },
      };
      if (req.body.mashiniiDugaar)
        match["mashiniiDugaar"] = req.body.mashiniiDugaar;
      var mashinuud = await Uilchluulegch(
        req.body.tukhainBaaziinKholbolt,
        true
      ).find(match);
      var result = [];
      for await (const data of mashinuud) {
        var tuukh = data.tuukh?.filter(
          (e) => e.orsonKhaalga === req.body.cameraIPGadna
        );
        var filtered = data.tuukh?.filter(
          (e) => e.orsonKhaalga === req.body.cameraIP
        );
        tuukh.push(filtered[0]);
        data.tuukh = tuukh;
        await Uilchluulegch(req.body.tukhainBaaziinKholbolt).findByIdAndUpdate(
          data._id,
          {
            $set: {
              tuukh: tuukh,
            },
          }
        );
        result.push(data);
      }
      res.send(result);
    } catch (err) {
      next(err);
    }
  }
);
router.post("/zochinAjiltaniiIdTseverlekh", async (req, res, next) => {
  try {
    const { db } = require("zevbackv2");
    var kholboltuud = db.kholboltuud;
    var localEsekh = !!req.body.baiguullagiinId;
    if (localEsekh) {
      kholboltuud = kholboltuud.filter(
        (a) => a.baiguullagiinId == req.body.baiguullagiinId
      );
    }
    var result = [];
    if (kholboltuud) {
      var query = { "tuukh.burtgesenAjiltaniiId": "zochin" };
      if (!!req.body.baiguullagiinId)
        query["baiguullagiinId"] = req.body.baiguullagiinId;
      for await (const kholbolt of kholboltuud) {
        var mashinuud = await Uilchluulegch(kholbolt, true).find(query);
        if (mashinuud?.length > 0) {
          for await (const data of mashinuud) {
            await Uilchluulegch(kholbolt).findByIdAndUpdate(data._id, {
              $unset: {
                "tuukh.0.burtgesenAjiltaniiId": 1,
              },
            });
            result.push(data);
          }
        }
      }
    }
    res.send(result);
  } catch (err) {
    next(err);
  }
});

router.post("/mashiniiDugaarZasakh", tokenShalgakh, async (req, res, next) => {
  try {
    var uilchluulegch = await Uilchluulegch(
      req.body.tukhainBaaziinKholbolt,
      true
    )
      .findOne({
        baiguullagiinId: req.body.baiguullagiinId,
        barilgiinId: req.body.barilgiinId,
        mashiniiDugaar: req.body.mashiniiDugaar,
        "tuukh.garsanKhaalga": { $exists: false },
        "tuukh.0.tsagiinTuukh.0.garsanTsag": { $exists: false },
        "tuukh.0.tuluv": { $ne: -2 },
      })
      .sort({ createdAt: -1 })
      .limit(1);
    if (!!uilchluulegch && !!uilchluulegch?._id && !!req.body.mashin) {
      await Uilchluulegch(req.body.tukhainBaaziinKholbolt).findByIdAndUpdate(
        uilchluulegch?._id.toString(),
        {
          $set: {
            turul: req.body.mashin?.turul,
            mashin: req.body.mashin,
          },
        }
      );
      res.send("Amjilttai");
    } else res.send("Amjiltgui");
  } catch (error) {
    if (next) next(error);
  }
});

router.post(
  "/mashiniiDugaarZaiArilgakh",
  tokenShalgakh,
  async (req, res, next) => {
    try {
      var mashinuud = await Mashin(req.body.tukhainBaaziinKholbolt).find({
        baiguullagiinId: req.body.baiguullagiinId,
      });
      if (mashinuud?.length > 0) {
        for await (const mashin of mashinuud) {
          await Mashin(req.body.tukhainBaaziinKholbolt).findByIdAndUpdate(
            mashin?._id.toString(),
            {
              $set: {
                dugaar: mashin.dugaar?.trim().replace(/\s/g, ""),
              },
            }
          );
        }
      }
      // var uilchluulegchuud = await Uilchluulegch(
      //   req.body.tukhainBaaziinKholbolt
      // ).find({
      //   baiguullagiinId: req.body.baiguullagiinId,
      // });
      // if (uilchluulegchuud?.length > 0) {
      //   for await (const data of uilchluulegchuud) {
      //     await Uilchluulegch(
      //       req.body.tukhainBaaziinKholbolt
      //     ).findByIdAndUpdate(data?._id.toString(), {
      //       $set: {
      //         dugaar: data.mashiniiDugaar?.trim().replace(/\s/g, ""),
      //       },
      //     });
      //   }
      // }
      res.send("Амжилттай");
    } catch (error) {
      if (next) next(error);
    }
  }
);

module.exports = router;
