const Sonorduulga = require("../components/sonorduulga");
const { tokenShalgakh, crud, UstsanBarimt } = require("zevback");
const { sonorduulgaIlgeeye } = require("../controller/appNotification");
const Daalgavar = require("../model/daalgavar");
const Ajiltan = require("../model/ajiltan");

crud(router, "daalgavar", Daalgavar, UstsanBarimt);

router.post("/daalgavarOruulya", tokenShalgakh, (req, res, next) => {
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

router.get("/daalgavar", tokenShalgakh, (req, res, next) => {
  try {
    var daalgavar = new Daalgavar(req.body);
    daalgavar.tuluv = 0;
    await daalgavar.save();
    daalgavar.turul = "daalgavar";
    Sonorduulga.ilgeeye(io = req.app.get('socketio'), daalgavar);
    res.status(200).send("Amjilttai");
  } catch (err) {
    throw new Error(err);
  }
}
);

router.post("/daalgavarKhuleejAvlaa", tokenShalgakh, (req, res, next) => {
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
    Daalgavar.findOneAndUpdate(filter, update)
      .then(async (result) => {
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
      })
      .catch((err) => {
        next(err);
      });
  } catch (err) {
    throw new Error(err);
  }
}
);
router.post("/daalgavarDuusgalaa", tokenShalgakh, (req, res, next) => {
  try {
    let filter = {
      _id: req.body.id,
    };
    let update = {
      tuluv: 2,
      shiidsenOgnoo: new Date()
    }
    Daalgavar.findOneAndUpdate(filter, update)
      .then((result) => {
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
      })
      .catch((err) => {
        next(err);
      });
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = router;
