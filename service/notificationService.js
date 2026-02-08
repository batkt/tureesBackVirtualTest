const Sonorduulga = require("../models/sonorduulga");
const { khariltsagchidSonorduulgaIlgeeye, } = require("../controller/appNotification");

exports.sendFirebase = async (
  firebaseToken,
  medeelel,
  req,
  khariltsagchiinId
) => {
  return new Promise((resolve, reject) => {
    khariltsagchidSonorduulgaIlgeeye(
      firebaseToken,
      medeelel,
      async () => {
        try {
          const sonorduulga = new (Sonorduulga(
            req.body.tukhainBaaziinKholbolt
          ))();

          sonorduulga.khariltsagchiinId = khariltsagchiinId;
          sonorduulga.baiguullagiinId = req.body.baiguullagiinId;
          sonorduulga.barilgiinId = req.body.barilgiinId;
          sonorduulga.zurgiinId = req.body.zurgiinId;
          sonorduulga.khuleenAvagchiinId = khariltsagchiinId;
          sonorduulga.turul = "medegdel";
          sonorduulga.title = medeelel.title;
          sonorduulga.message = medeelel.body;
          sonorduulga.kharsanEsekh = false;

          await sonorduulga.save();

          const io = req.app.get("socketio");
          if (io) {
            io.emit("khariltsagch" + khariltsagchiinId, sonorduulga);
          }

          resolve(true);
        } catch (err) {
          reject(err);
        }
      },
      reject
    );
  });
};
