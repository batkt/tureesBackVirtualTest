const asyncHandler = require("express-async-handler");
const Geree = require("../models/geree");
const BankniiGuilgee = require("../models/bankniiGuilgee");
const lodash = require('lodash')

exports.tulultKhadgalya = asyncHandler(async (req, res, next) => {
  var tulbur = {
    turul: req.body.turul,
    tulsunDun: req.body.tulsunDun,
    ognoo: req.body.ognoo,
    guilgeeniiId: req.body.guilgeeniiId,
    dansniiDugaar: req.body.dansniiDugaar,
    tulsunDans: req.body.tulsunDans,
    guilgeeKhiisenOgnoo: new Date(),
  }
  if (req.body.nevtersenAjiltniiToken) {
    tulbur.guilgeeKhiisenAjiltniiNer = req.body.nevtersenAjiltniiToken.ner;
    tulbur.guilgeeKhiisenAjiltniiId = req.body.nevtersenAjiltniiToken.id
  }
  Geree.findByIdAndUpdate({ _id: req.body.gereeniiId }, {
    $push: {
      [`avlaga.guilgeenuud`]: tulbur
    },
    $inc: { "uldegdel": - req.body.tulsunDun }
  }).then((result) => {
    daraagiinTulukhOgnooZasya(req.body.gereeniiId);
    if (req.body.guilgeeniiId)
      BankniiGuilgee.updateOne({ _id: req.body.guilgeeniiId }, { $set: { kholbosonGereeniiId: req.body.gereeniiId, kholbosonTalbainId: result.talbainDugaar, magadlaltaiGereenuud: null } }).then((result1) => {
        res.send(result1);
      })
        .catch((err) => {
          next(err);
        });
    else
      res.send(result);
  })
    .catch((err) => {
      next(err);
    });
});

exports.gereeniiGuilgeeKhadgalya = asyncHandler(async (req, res, next) => {
  var guilgee = req.body.guilgee;
  console.log("guilgee", guilgee);
  var guilgeeniiDun = (guilgee?.tulsunDun || 0) - (guilgee?.tulukhDun || 0);
  guilgee.guilgeeKhiisenOgnoo = new Date();
  if (req.body.nevtersenAjiltniiToken) {
    guilgee.guilgeeKhiisenAjiltniiNer = req.body.nevtersenAjiltniiToken.ner;
    guilgee.guilgeeKhiisenAjiltniiId = req.body.nevtersenAjiltniiToken.id
  }
  Geree.findByIdAndUpdate({ _id: guilgee.gereeniiId }, {
    $push: {
      [`avlaga.guilgeenuud`]: guilgee
    },
    $inc: { "uldegdel": - guilgeeniiDun }
  }).then((result) => {
    daraagiinTulukhOgnooZasya(guilgee.gereeniiId);
    if (guilgee.guilgeeniiId) {
      console.log("guilgee.guilgeeniiId", guilgee.guilgeeniiId);
      BankniiGuilgee.updateOne({ _id: guilgee.guilgeeniiId }, { $set: { kholbosonGereeniiId: guilgee.gereeniiId, kholbosonTalbainId: result.talbainDugaar, magadlaltaiGereenuud: null } }).then((result1) => {
        res.send(result1);
      })
        .catch((err) => {
          next(err);
        });
    }
    else
      res.send(result);
  })
    .catch((err) => {
      next(err);
    });
});

module.exports.tulultTaniya = async function tulultTaniya() {
  var guilgeenuud = await BankniiGuilgee.find({ "createdAt": { $gte: new Date(new Date().getTime() - 5 * 60000) }, "amount": { $gt: 0 } });
  console.log("tulult taniya", guilgeenuud);
  var khaikhNukhtsul;
  var tailbar = []
  if (guilgeenuud != null && guilgeenuud.length > 0) {
    try {
      guilgeenuud.forEach(async (x) => {
        khaikhNukhtsul = [];
        tailbar = x.description.split(" ")
        if (x.relatedAccount != null)
          khaikhNukhtsul.push({ "avlaga.guilgeenuud.dansniiDugaar": x.relatedAccount })
        tailbar.forEach(y => {
          khaikhNukhtsul.push({ "utas": y });
          khaikhNukhtsul.push({ "register": y });
          y = y.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
          khaikhNukhtsul.push({ "talbainDugaar": { $regex: '.*' + y + '.*' } });

        });
        console.log(khaikhNukhtsul);
        var oldsonGereenuud = await Geree.find({ $or: khaikhNukhtsul });
        if (oldsonGereenuud != null && oldsonGereenuud.length > 0) {
          oldsonGereenuud.forEach(a => {
            if (x.magadlaltaiGereenuud != null && !x.magadlaltaiGereenuud.includes(a._id))
              x.magadlaltaiGereenuud.push(a._id)
            else
              x.magadlaltaiGereenuud = [a._id];
          });
          x.isNew = false;
          x.save();
        }
      });
    }
    catch (error) {
      next(error);
    }
  }
}


exports.tulultUstgaya = asyncHandler(async (req, res, next) => {
  Geree.findByIdAndUpdate({ _id: req.body.gereeniiId }, {
    $pull: {
      [`avlaga.guilgeenuud`]: {
        _id: req.body.objectiinId
      }
    },
    $inc: { "uldegdel": req.body.tulsunDun ? req.body.tulsunDun : 0 }
  }).then((result) => {
    daraagiinTulukhOgnooZasya(req.body.gereeniiId);
    if (req.body.guilgeeniiId)
      BankniiGuilgee.updateOne({ _id: req.body.guilgeeniiId }, { $set: { kholbosonGereeniiId: null, kholbosonTalbainId: null } }).then((result1) => {
        res.send(result1);
      })
        .catch((err) => {
          next(err);
        });
    else
      res.send(result);
  })
    .catch((err) => {
      next(err);
    });
});

async function daraagiinTulukhOgnooZasya(gereeniiId) {
  var geree = await Geree.findById(gereeniiId).select('avlaga');
  var jagsaalt = []
  if (lodash.isArray(lodash.get(geree, 'avlaga.guilgeenuud'))) {
    jagsaalt = lodash.get(geree, 'avlaga.guilgeenuud');
  }
  var niitTulsunDun = lodash.sumBy(jagsaalt, function (object) {
    return object.tulsunDun;
  });
  console.log("niitTulsunDun", niitTulsunDun);
  jagsaalt = lodash.filter(jagsaalt, a => a.tulukhDun != null);
  jagsaalt = lodash.orderBy(jagsaalt, ['ognoo'], ['asc']);
  var tulukhOgnoo;
  jagsaalt.forEach(element => {
    if (niitTulsunDun > 0) {
      tulukhOgnoo = element.ognoo;
      niitTulsunDun = niitTulsunDun - element.tulukhDun;
    }
  });
  Geree.findByIdAndUpdate(gereeniiId, { $set: { daraagiinTulukhOgnoo: tulukhOgnoo } }).then((result) => {
    console.log("amjilttai", result)
  }).catch((err) => {
    console.log("aldaatai", err)
  })
}

