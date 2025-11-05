const Baiguullaga = require("../models/baiguullaga");
const { zogsoolNiitDungeerEbarimtShivye } = require("../routes/ebarimtRoute");
const { msgIlgeeye } = require("./khariltsagch");
const {
  Mashin: ParkingMashin,
  Parking,
  Uilchluulegch,
  zogsooliinDunAvya,
  sdkData,
} = require("parking-v1");
const moment = require("moment");
const got = require("got");
const FormData = require("form-data");

module.exports.khungulultKhugatsaaShinechlyaSar =
  async function khungulultKhugatsaaShinechlyaSar() {
    const { db } = require("zevbackv2");
    const kholboltuud = db.kholboltuud;
    if (kholboltuud) {
      for await (const kholbolt of kholboltuud) {
        const mashinuud = await ParkingMashin(kholbolt).find({baiguullagiinId: "612f457d185280db676d0b51", turul: "Түрээслэгч", khungulultTurul: "togtmolTsag", tsagiinTurul: "Сараар"});
        var bulkOps = [];
        if(mashinuud?.length > 0)
        {
          mashinuud.forEach((mashin) => {
            if (
              mashin.turul === "Түрээслэгч" &&
              (mashin.tuluv === "Хөнгөлөлттэй" ||
                mashin.nemeltTuluv === "Хөнгөлөлттэй") &&
              mashin.khungulultTurul === "togtmolTsag" &&
              mashin.tsagiinTurul === "Сараар"
            ) {
              mashin.uldegdelKhungulukhKhugatsaa = mashin.khungulukhKhugatsaa;
              mashin.khungulujEkhlesenOgnoo = moment();
              var updateOperation = {
                updateOne: {
                  filter: { _id: mashin._id },
                  update: {
                    $set: {
                      uldegdelKhungulukhKhugatsaa: mashin.khungulukhKhugatsaa,
                      khungulujEkhlesenOgnoo: mashin.khungulujEkhlesenOgnoo,
                    },
                  },
                },
              };
              bulkOps.push(updateOperation);
            }
          });
        }
        if (bulkOps.length > 0) {
          await ParkingMashin(kholbolt).bulkWrite(bulkOps);
        }
      }
    }
  };

module.exports.khungulultKhugatsaaShinechlya =
  async function khungulultKhugatsaaShinechlya() {
    const { db } = require("zevbackv2");
    const kholboltuud = db.kholboltuud;
    if (kholboltuud) {
      for await (const kholbolt of kholboltuud) {
        const mashinuud = await ParkingMashin(kholbolt).find();
        var bulkOps = [];
        mashinuud.forEach((mashin) => {
          if (
            mashin.turul === "Түрээслэгч" &&
            (mashin.tuluv === "Хөнгөлөлттэй" ||
              mashin.nemeltTuluv === "Хөнгөлөлттэй") &&
            mashin.khungulultTurul === "togtmolTsag"
          ) {
            if (
              mashin.khungulujEkhlesenOgnoo &&
              mashin.tsagiinTurul === "Сараар"
            ) {
              if (
                moment(new Date()).month() !==
                moment(mashin.khungulujEkhlesenOgnoo).month()
              ) {
                mashin.uldegdelKhungulukhKhugatsaa = mashin.khungulukhKhugatsaa;
                mashin.khungulujEkhlesenOgnoo = moment();
                var updateOperation = {
                  updateOne: {
                    filter: { _id: mashin._id },
                    update: {
                      $set: {
                        uldegdelKhungulukhKhugatsaa: mashin.khungulukhKhugatsaa,
                        khungulujEkhlesenOgnoo: mashin.khungulujEkhlesenOgnoo,
                      },
                    },
                  },
                };
                bulkOps.push(updateOperation);
              }
            } else if (
              mashin.khungulujEkhlesenOgnoo &&
              mashin.tsagiinTurul === "Өдрөөр"
            ) {
              mashin.uldegdelKhungulukhKhugatsaa = mashin.khungulukhKhugatsaa;
              mashin.khungulujEkhlesenOgnoo = moment();
              var updateOperation = {
                updateOne: {
                  filter: { _id: mashin._id },
                  update: {
                    $set: {
                      uldegdelKhungulukhKhugatsaa: mashin.khungulukhKhugatsaa,
                      khungulujEkhlesenOgnoo: mashin.khungulujEkhlesenOgnoo,
                    },
                  },
                },
              };
              bulkOps.push(updateOperation);
            }
          }
        });
        if (bulkOps.length > 0) {
          await ParkingMashin(kholbolt).bulkWrite(bulkOps);
        }
      }
    }
  };

module.exports.zogsoolMsgIlgeeye = async function zogsoolMsgIlgeeye() {
  const { db } = require("zevbackv2");
  var baiguullaguud = await Baiguullaga(db.erunkhiiKholbolt).find({
    "barilguud.tokhirgoo.zogsoolMsgIlgeekh": true,
  });
  if (!!baiguullaguud) {
    var kholboltuud = db.kholboltuud;
    var unuudur = new Date();
    unuudur = new Date(
      unuudur.getFullYear(),
      unuudur.getMonth(),
      unuudur.getDate(),
      0,
      0,
      0
    );
    var daraagiinUdur = new Date();
    daraagiinUdur.setDate(unuudur.getDate() + 3);
    for await (const baiguullaga of baiguullaguud) {
      var tukhainKholbolt = kholboltuud.find(
        (x) => x.baiguullagiinId == baiguullaga._id.toString()
      );
      var msgnuud = [];
      for await (const barilga of baiguullaga.barilguud) {
        var mashinuud = await ParkingMashin(tukhainKholbolt).find({
          barilgiinId: barilga._id.toString(),
          duusakhOgnoo: {
            $gte: unuudur,
            $lte: daraagiinUdur,
          },
          ezemshigchiinUtas: { $exists: true },
        });
        if (!!mashinuud && mashinuud.length > 0) {
          for await (const mashin of mashinuud) {
            var text =
              "Tanii zogsooliin geree " +
              moment(mashin.duusakhOgnoo).format("MM/DD") +
              "nii udur duusna." +
              barilga.ner;
            msgnuud.push({ to: mashin.ezemshigchiinUtas, text });
          }
        }
      }
      if (msgnuud.length > 0) {
        var msgIlgeekhKey = "aa8e588459fdd9b7ac0b809fc29cfae3";
        var msgIlgeekhDugaar = "72002002";
        msgIlgeeye(
          msgnuud,
          msgIlgeekhKey,
          msgIlgeekhDugaar,
          [],
          0,
          tukhainKholbolt,
          baiguullaga._id
        );
      }
    }
  }
};

module.exports.tulburUridchiljTulukh = async (body, next) => {
  try {
    let tulbur = [
      {
        ognoo: new Date(),
        turul: body.turul,
        dun: body.paid_amount,
      },
    ];
    var oldsonMashin;
    var tukhainKholbolt;
    var tukhainObject;
    var tukhainZogsool;
    var bodsonDun = 0;
    const zogsool = body.zogsooliinId
      ? await Parking(body.tukhainBaaziinKholbolt).findOne({
          _id: body.zogsooliinId,
        })
      : await Parking(body.tukhainBaaziinKholbolt).findOne({
          baiguullagiinId: body.baiguullagiinId,
          barilgiinId: body.barilgiinId,
          "khaalga.ajiltnuud.id": body.ajiltniiId,
        });
    if (!!zogsool) {
      oldsonMashin = await Uilchluulegch(body.tukhainBaaziinKholbolt, true).findOne({
        _id: body.uilchluulegchiinId,
      });
      if (!!oldsonMashin && !!oldsonMashin.mashiniiDugaar) {
        tukhainKholbolt = body.tukhainBaaziinKholbolt;
        tukhainZogsool = zogsool;
        tukhainObject = oldsonMashin;
      }
    }
    bodsonDun = await zogsooliinDunAvya(
      tukhainZogsool,
      tukhainObject,
      tukhainKholbolt
    );
    if (!tukhainObject) {
      return "Машины мэдээлэл олдсонгүй!";
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
      var set = {
        "tuukh.0.tulbur": tukhainObject?.tuukh?.[0]?.tulbur || 0,
        "tuukh.0.tuluv": (body.turul === "qpayUridchilsan" ? 0 : 1),
        "tuukh.0.tulukhDun": 0,
      };
      if(body.turul === "qpayUridchilsan")
        set["garakhTsag"] = new Date(Date.now() + (tukhainZogsool?.garakhTsag || 30) * 60000);
      if (bodsonDun > 0 && bodsonDun === body.paid_amount) {
        set["tuukh.0.burtgesenAjiltaniiId"] = body.ajiltniiId;
        set["tuukh.0.burtgesenAjiltaniiNer"] = body.ajiltniiNer;
      }
      await Uilchluulegch(tukhainKholbolt).findByIdAndUpdate(
        tukhainObject._id,
        { $set: set },
        { new: true }
      );
      return "Amjilttai";
    }
  } catch (err) {
    next(err);
  }
};

module.exports.zogsoolTseverlye = async (body, next) => {
  try {
    const { db } = require("zevbackv2");
    const kholboltuud = db.kholboltuud;
    if (kholboltuud) {
      for await (const kholbolt of kholboltuud) {
        var zogsooluud = await Parking(kholbolt).find({
          mashinGargakhKhugatsaa: { $gt: 0 },
          baiguullagiinId: kholbolt.baiguullagiinId,
        });
        if (!!zogsooluud) {
          for await (const zogsool of zogsooluud) {
            var ognoo = new Date();
            ognoo = new Date(
              ognoo.getTime() - zogsool.mashinGargakhKhugatsaa * 60 * 60000
            );
            await Uilchluulegch(kholbolt).updateMany(
              {
                "tuukh.0.garsanKhaalga": {
                  $exists: false,
                },
                "tuukh.0.tsagiinTuukh.0.garsanTsag": {
                  $exists: false,
                },
                createdAt: {
                  $lt: ognoo,
                },
              },
              {
                $set: {
                  "tuukh.0.garsanKhaalga": "tseverlesen",
                  "tuukh.0.tsagiinTuukh.0.garsanTsag": new Date(),
                  "tuukh.0.tuluv": -3, //Tseverlesen tuluv
                  zurchil: "Гарсан цаг тодорхойгүй!",
                },
              }
            );
          }
        }
      }
    }
  } catch (err) {
    next(err);
  }
};

module.exports.zogsooloosUstgay = async (body, next) => {
  try {
    const { db } = require("zevbackv2");
    const kholboltuud = db.kholboltuud;
    if (kholboltuud) {
      for await (const kholbolt of kholboltuud) {
        var zogsooluud = await Parking(kholbolt).find({
          mashinUstgakhKhugatsaa: { $gt: 1 },
          baiguullagiinId: kholbolt.baiguullagiinId,
        });
        if (!!zogsooluud) {
          for await (const zogsool of zogsooluud) {
            var ognoo = new Date();
            ognoo = new Date(
              ognoo.getTime() - zogsool.mashinUstgakhKhugatsaa * 24 * 60 * 60000
            );
            await Uilchluulegch(kholbolt).deleteMany({
              createdAt: {
                $lt: ognoo,
              },
            });
          }
        }
      }
    }
  } catch (err) {
    next(err);
  }
};

module.exports.ebarimtDutuugShivye = async (body, next) => {
  try {
    const { db } = require("zevbackv2");
    var baiguullaguud = await Baiguullaga(db.erunkhiiKholbolt).find({
      "barilguud.tokhirgoo.eBarimtBugdShivikh": true,
    });
    if (!!baiguullaguud) {
      const kholboltuud = db.kholboltuud;
      if (kholboltuud) {
        for await (const baiguullaga of baiguullaguud) {
          var tukhainKholbolt = kholboltuud.find(
            (x) => x.baiguullagiinId == baiguullaga._id.toString()
          );
          var shiveeguiTuukhuud = await Uilchluulegch(tukhainKholbolt, true).find({
            ebarimtAvsanEsekh: { $ne: true },
            "tuukh.0.tulbur": { $exists: true, $not: { $size: 0 } },
            "tuukh.0.tulbur.ognoo": { $gt: new Date(moment(new Date()).add(-1, "day").format("YYYY-MM-DD 23:59:59")) },
          });
          var uilchluulegchBulk = [];
          if (!!shiveeguiTuukhuud) {
            var niitDun = 0;
            for await (const object of shiveeguiTuukhuud) {
              var niilberDun = 0;
              for await (const tulbur of object.tuukh[0]?.tulbur) {
                if(!!tulbur.turul && tulbur.turul != "khungulult" && tulbur.turul != "khariult") 
                  niilberDun += tulbur.dun;
              }
              if(niilberDun > 0)
              {
                niitDun = niitDun + niilberDun;
                let upsert = {
                  updateOne: {
                      filter: { _id: object._id, baiguullagiinId: baiguullaga._id },
                      update: {
                        ebarimtAvsanDun: niilberDun,
                        ebarimtAvsanEsekh: true,
                      },
                    },
                };  
                uilchluulegchBulk.push(upsert);
              }
            }
            if (niitDun > 0) {
              await zogsoolNiitDungeerEbarimtShivye(
                tukhainKholbolt,
                niitDun,
                shiveeguiTuukhuud[0]?.barilgiinId,
                next,
                shiveeguiTuukhuud,
                null,
              );
            }
            if (uilchluulegchBulk)
              Uilchluulegch(tukhainKholbolt)
                .bulkWrite(uilchluulegchBulk)
                  .then((bulkWriteOpResult) => {
                  })
                  .catch((err) => {
                    throw err;
                  });
          }
        }
      }
    }
  } catch (err) {
    if (!!next) {
      next(err);
    } 
  }
};


module.exports.testCloudMongodb = async function testCloudMongodb() {
  try 
  {
    var mashiniiDugaar =  Math.floor(1000 + Math.random() * 9000) + "УУУ";
    // const form = new FormData();
    // form.append('mashiniiDugaar', mashiniiDugaar);
    // form.append('CAMERA_IP', "192.168.1.108");
    // form.append('barilgiinId', "622ca3938e64e5b4f0c36bed");
    const response = await got.post("http://103.143.40.230:8081/zogsoolSdkService", 
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMmY0NTdkMTg1MjgwZGI2NzZkMGI1MyIsIm5lciI6IkNBZG1pbiIsImJhaWd1dWxsYWdpaW5JZCI6IjYxMmY0NTdkMTg1MjgwZGI2NzZkMGI1MSIsImlhdCI6MTc0ODQ4ODQxNX0.FZFqETa5TMm2qVV1eZYDnGTZyOINWp-M9q_7eZf254U",
      },
      body: JSON.stringify({
        "mashiniiDugaar": mashiniiDugaar,
        "CAMERA_IP": "192.168.1.108",
        "barilgiinId": "622ca3938e64e5b4f0c36bed",
      }),
    })
    .catch((err) => {
      throw err;
    });
  } catch (err) {
    throw err;
  }
};