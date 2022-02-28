const Zogsool = require("../models/zogsool");
const Mashin = require("../models/mashin");

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