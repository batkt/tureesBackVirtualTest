const Baiguullaga = require("../models/baiguullaga");
const { msgIlgeeye } = require("./khariltsagch");
const { Mashin: ParkingMashin } = require("parking-v1");
const moment = require("moment");

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
