const express = require("express");
const router = express.Router();
const Sonorduulga = require("../components/sonorduulga");
const { tokenShalgakh, crud, UstsanBarimt } = require("zevback");
const { sonorduulgaIlgeeye } = require("../controller/appNotification");
const Daalgavar = require("../models/daalgavar");
const Ajiltan = require("../models/ajiltan");

crud(router, "daalgavar", Daalgavar, UstsanBarimt);

router.post("/daalgavarOruulya", tokenShalgakh, async (req, res, next) => {
  try {
    var daalgavar = new Daalgavar(req.body);
    daalgavar.tuluv = 0;
    daalgavar.ognoo = new Date();
    await daalgavar.save();
    daalgavar.turul = "daalgavar";
    Sonorduulga.ilgeeye(io = req.app.get('socketio'), daalgavar);
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
    var result = await Daalgavar.findOneAndUpdate(filter, update);
    var zakhiral = await Ajiltan.findOne({ erkh: "Admin" });
    if (zakhiral.firebaseToken) {
      sonorduulgaIlgeeye(zakhiral.firebaseToken, {
        title: "Ажлыг хүлээж авлаа!",
        body: req.body.nevtersenAjiltniiToken.ner + " таны даалгасан ажлыг хүлээж авлаа!",
        icon: "default",
        sound: 'default',
        badge: '1',
      }, null, next)
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
    var result = await Daalgavar.findOneAndUpdate(filter, update);
    var zakhiral = await Ajiltan.findOne({ erkh: "Admin" });
    if (zakhiral.firebaseToken) {
      sonorduulgaIlgeeye(zakhiral.firebaseToken, {
        title: "Ажлыг хийж дууслаа!",
        body: req.body.nevtersenAjiltniiToken.ner + " таны даалгасан ажлыг хийж дууслаа !",
        icon: "default",
        sound: 'default',
        badge: '1',
      }, null, next)
    }
    res.send("Amjilttai");
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = router;
