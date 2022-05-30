const express = require("express");
const router = express.Router();
const Sonorduulga = require("../components/sonorduulga");
const { tokenShalgakh, crud, UstsanBarimt } = require("zevback");
const { sonorduulgaIlgeeye } = require("../controller/appNotification");
const Daalgavar = require("../models/daalgavar");
const Ajiltan = require("../models/ajiltan");
const moment = require("moment");

crud(router, "daalgavar", Daalgavar, UstsanBarimt);

router.post("/daalgavarOruulya", tokenShalgakh, async (req, res, next) => {
  try {
    var daalgavar = new Daalgavar(req.body);
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
    }
    res.send("Amjilttai");
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
