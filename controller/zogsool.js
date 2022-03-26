const Zogsool = require("../models/zogsool");
const Mashin = require("../models/mashin");
const Baiguullaga = require("../models/baiguullaga");

module.exports.mashinTaniya = async function mashinTaniya() {
  var mashinuud = await Mashin.find();
  var bulkOps = [];
  mashinuud.forEach(mashin => {
    let upsertDoc = {
      'updateOne': {
        'filter': { 'car_number': mashin.dugaar, 'turul': { $exists: false } },
        'update': {
          "mashin": mashin,
          "turul": mashin.turul
        }
      }
    };
    bulkOps.push(upsertDoc);
  });
  Zogsool.bulkWrite(bulkOps)
    .then(bulkWriteOpResult => {
      console.log('BULK update OK', bulkWriteOpResult);
    })
    .catch(err => {
      console.log('BULK update error', err);
    });
};

module.exports.tulburZooyo = async function tulburZooyo() {
  var baiguullaguud = await Baiguullaga.find({ "tokhirgoo.zogsooliinMinut": { $exists: true }, "tokhirgoo.zogsooliinDun": { $exists: true } })
  if (baiguullaguud) {
    baiguullaguud.forEach((baiguullaga) => {
      var bulkOps = [];
      let upsertDoc = {
        'updateMany': {
          'filter': {
            'tulbur': { $exists: false },
            'turul': {
              $nin: ["Гэрээт", "Дотоод"]
            },
            'khugatsaa': {
              $gt: baiguullaga.tokhirgoo.zogsooliinKhungulukhMinut
            }
          },
          'update': [{
            $set: {
              "tulbur": {
                $multiply: [
                  {
                    $ceil: { $divide: ["$khugatsaa", baiguullaga.tokhirgoo.zogsooliinMinut] }
                  },
                  baiguullaga.tokhirgoo.zogsooliinDun
                ]
              }
            }
          }]
        }
      }
      bulkOps.push(upsertDoc);
      Zogsool.bulkWrite(bulkOps)
        .then(bulkWriteOpResult => {
          console.log('BULK update OK', bulkWriteOpResult);
        })
        .catch(err => {
          console.log('BULK update error', err);
        });
    })
  }
};