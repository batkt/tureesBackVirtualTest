const Zogsool = require("../models/zogsool");
const Mashin = require("../models/mashin");
const Baiguullaga = require("../models/baiguullaga");
const { Mashin: ParkingMashin } = require("parking-v1");
const moment = require("moment");

module.exports.mashinTaniya = async function mashinTaniya() {
  const { db } = require("zevbackv2");
  var kholboltuud = db.kholboltuud;
  if (kholboltuud) {
    for await (const kholbolt of kholboltuud) {
      var mashinuud = await Mashin(kholbolt).find();
      var bulkOps = [];
      mashinuud.forEach((mashin) => {
        let upsertDoc = {
          updateOne: {
            filter: { car_number: mashin.dugaar, turul: { $exists: false } },
            update: {
              mashin: mashin,
              turul: mashin.turul,
            },
          },
        };
        bulkOps.push(upsertDoc);
      });
      Zogsool(kholbolt)
        .bulkWrite(bulkOps)
        .then((bulkWriteOpResult) => {
          console.log("BULK update OK", bulkWriteOpResult);
        })
        .catch((err) => {
          console.log("BULK update error", err);
        });
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

module.exports.tulburZooyo = async function tulburZooyo() {
  const { db } = require("zevbackv2");
  var kholboltuud = db.kholboltuud;
  if (kholboltuud) {
    for await (const kholbolt of kholboltuud) {
      var baiguullaguud = await Baiguullaga(db.erunkhiiKholbolt).find({
        "tokhirgoo.zogsooliinMinut": { $exists: true },
        "tokhirgoo.zogsooliinDun": { $exists: true },
      });
      if (baiguullaguud) {
        baiguullaguud.forEach((baiguullaga) => {
          var bulkOps = [];
          let upsertDoc = {
            updateMany: {
              filter: {
                tulbur: { $exists: false },
                turul: {
                  $nin: ["Гэрээт", "Түрээслэгч", "Дотоод"],
                },
                khugatsaa: {
                  $gt: baiguullaga.tokhirgoo.zogsooliinKhungulukhMinut,
                },
                baiguullagiinId: baiguullaga._id,
              },
              update: [
                {
                  $set: {
                    tulbur: {
                      $multiply: [
                        {
                          $ceil: {
                            $divide: [
                              "$khugatsaa",
                              baiguullaga.tokhirgoo.zogsooliinMinut,
                            ],
                          },
                        },
                        baiguullaga.tokhirgoo.zogsooliinDun,
                      ],
                    },
                  },
                },
              ],
            },
          };
          bulkOps.push(upsertDoc);
          Zogsool(kholbolt)
            .bulkWrite(bulkOps)
            .then((bulkWriteOpResult) => {
              console.log("BULK update OK", bulkWriteOpResult);
            })
            .catch((err) => {
              console.log("BULK update error", err);
            });
        });
      }
    }
  }
};
