const express = require("express");
const router = express.Router();
const Sonorduulga = require("../components/sonorduulga");
const SonorduulgiinModel = require("../models/sonorduulga");
const { tokenShalgakh, crud, UstsanBarimt } = require("zevback");
const { sonorduulgaIlgeeye } = require("../controller/appNotification");
const Daalgavar = require("../models/daalgavar");
const Setgegdel = require("../models/setgegdel");
const Ajiltan = require("../models/ajiltan");
const Dugaarlalt = require("../models/dugaarlalt");
const moment = require("moment");

crud(router, "daalgavar", Daalgavar, UstsanBarimt);
crud(router, "setgegdel", Setgegdel, UstsanBarimt);

async function pad(num, size) {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
}

router.post("/daalgavarOruulya", tokenShalgakh, async (req, res, next) => {
  try {
    var daalgavar = new Daalgavar(req.body);
    var khuseltiinDugaar = await Dugaarlalt.aggregate([
      {
        '$match': {
          'turul': "daalgavar",
          'baiguullagiinId': daalgavar.baiguullagiinId,
          'barilgiinId': daalgavar.barilgiinId
        }
      }, {
        '$group': {
          '_id': 'aaa',
          'max': {
            '$max': {
              $toDouble: "$dugaar"
            }
          }
        }
      }]);
    if (khuseltiinDugaar.length > 0)
      daalgavar.dugaar = "D-" + await pad(khuseltiinDugaar[0].max, 5);
    else
      daalgavar.dugaar = "D-" + await pad(0, 5);
    daalgavar.tuluv = 0;
    daalgavar.ognoo = new Date();
    await daalgavar.save();
    Sonorduulga.ilgeeye(io = req.app.get('socketio'), { ...daalgavar.toObject(), turul: "daalgavar" });
    res.status(200).send("Amjilttai");
  } catch (err) {
    throw new Error(err);
  }
}
);

router.post("/daalgavarKhuleejAvlaa", tokenShalgakh, async (req, res, next) => {
  try {
    let filter = {
      _id: req.body.id,
    };
    let update = {
      tuluv: 1,
      khuleejAvsanOgnoo: new Date(),
      ajiltniiId: req.body.nevtersenAjiltniiToken.id,
      ajiltniiNer: req.body.nevtersenAjiltniiToken.ner
    }
    var result = await Daalgavar.findOneAndUpdate(filter, update, { new: true });
    if (result && result.baiguullagiinId) {
      var zakhiral = await Ajiltan.findOne({ erkh: "Admin", baiguullagiinId: result.baiguullagiinId });
      if (zakhiral.firebaseToken) {
        sonorduulgaIlgeeye(zakhiral.firebaseToken, {
          title: "Ажлыг хүлээж авлаа!",
          body: req.body.nevtersenAjiltniiToken.ner + " таны даалгасан ажлыг хүлээж авлаа!",
          icon: "default",
          sound: 'default',
          badge: '1',
        }, null, next)
      }
      var notif = new SonorduulgiinModel();
      notif.baiguullagiinId = result.baiguullagiinId;
      notif.barilgiinId = result.barilgiinId;
      notif.turul = "medegdel";
      notif.ognoo = new Date();
      notif.ajiltniiId = zakhiral._id;
      notif.kharsanEsekh = false;
      notif.message = req.body.nevtersenAjiltniiToken.ner + " таны даалгасан ажлыг хүлээж авлаа!";
      notif.object = result;
      await notif.save();
    }
    res.send("Amjilttai");
  } catch (err) {
    throw new Error(err);
  }
}
);
router.post("/daalgavarDuusgalaa", tokenShalgakh, async (req, res, next) => {
  try {
    let filter = {
      _id: req.body.id,
    };
    let update = {
      tuluv: 2,
      shiidsenOgnoo: new Date()
    }
    var daalgavar = await Daalgavar.findOne(filter);
    update.zartsuulsanKhugatsaa = await moment(new Date()).diff(moment(daalgavar.khuleejAvsanOgnoo), 'hour');
    var result = await Daalgavar.findOneAndUpdate(filter, update, { new: true });
    if (result && result.baiguullagiinId) {
      var zakhiral = await Ajiltan.findOne({ erkh: "Admin", baiguullagiinId: result.baiguullagiinId });
      if (zakhiral.firebaseToken) {
        sonorduulgaIlgeeye(zakhiral.firebaseToken, {
          title: "Ажлыг хийж дууслаа!",
          body: req.body.nevtersenAjiltniiToken.ner + " таны даалгасан ажлыг хийж дууслаа!",
          icon: "default",
          sound: 'default',
          badge: '1',
        }, null, next)
      }
      var notif = new SonorduulgiinModel();
      notif.baiguullagiinId = result.baiguullagiinId;
      notif.barilgiinId = result.barilgiinId;
      notif.turul = "medegdel";
      notif.ognoo = new Date();
      notif.ajiltniiId = zakhiral._id;
      notif.kharsanEsekh = false;
      notif.message = req.body.nevtersenAjiltniiToken.ner + " таны даалгасан ажлыг хүлээж авлаа!";
      notif.object = result;
      await notif.save();
    }
    res.send("Amjilttai");
  } catch (err) {
    throw new Error(err);
  }
});

router.post("/daalgavarTsutsalya", tokenShalgakh, async (req, res, next) => {
  try {
    let filter = {
      _id: req.body.id,
    };
    let update = {
      tuluv: -1
    }
    var result = await Daalgavar.findOneAndUpdate(filter, update, { new: true });
    Sonorduulga.ilgeeye(io = req.app.get('socketio'), { ...result.toObject(), turul: "daalgavar" });
    res.send("Amjilttai");
  } catch (err) {
    throw new Error(err);
  }
});

router.post("/daalgavarTooAvya", tokenShalgakh, async (req, res, next) => {
  try {
    let match = {
      'baiguullagiinId': req.body.baiguullagiinId,
      'barilgiinId': req.body.barilgiinId
    }
    if (req.body.ajiltniiId)
      match['ajiltniiId'] = req.body.ajiltniiId;
    let query = [
      {
        '$match': match
      }, {
        '$group': {
          '_id': '$tuluv',
          'too': {
            '$sum': 1
          }
        }
      }
    ]
    var result = await Daalgavar.aggregate(query);
    res.send(result);
  } catch (err) {
    throw new Error(err);
  }
});

router.post("/setgegdelBichie", tokenShalgakh, async (req, res, next) => {
  try {
    var setgegdel = new Setgegdel(req.body);
    setgegdel.ognoo = new Date();
    setgegdel.ajiltniiId = req.body.nevtersenAjiltniiToken.id;
    setgegdel.ajiltniiNer = req.body.nevtersenAjiltniiToken.ner;
    await setgegdel.save();
    Sonorduulga.ilgeeye(io = req.app.get('socketio'), { ...setgegdel.toObject(), turul: "setgegdel" });
    res.status(200).send("Amjilttai");
  } catch (err) {
    throw new Error(err);
  }
});

module.exports.tuluvluguuniiSanuulgaIlgeeye = async function tuluvluguuniiSanuulgaIlgeeye() {
  var duusaaguiDaalgavruud = await Daalgavar.find({ tuluv: { $ne: 2 }, duusakhOgnoo: { $lte: new Date() } });
  if (duusaaguiDaalgavruud && duusaaguiDaalgavruud.length > 0) {
    for await (const daalgavar of duusaaguiDaalgavruud) {
      sonorduulgaIlgeeye(zakhiral.firebaseToken, {
        title: "Хугацаа хэтэрсэн ажлын мэдэгдэл",
        body: daalgavar.ajiltniiNer + " ажилтанд даалгасан ажлын хугацаа хэтэрсэн байна!",
        icon: "default",
        sound: 'default',
        badge: '1',
      }, null, next)
    }
  }
};

module.exports = router;
