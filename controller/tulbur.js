const asyncHandler = require("express-async-handler");
const Geree = require("../models/geree");
const BankniiGuilgee = require("../models/bankniiGuilgee");
const lodash = require('lodash')
const moment = require("moment");
const mongoose = require('mongoose');
const KhungulultiinTuukh = require("../models/khungulultiinTuukh");

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
    $inc: { "uldegdel": (req.body.tulsunDun ? req.body.tulsunDun : 0) }
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


exports.uldegdelBodyo = asyncHandler(async (req, res, next) => {
  var query = [
    {
      '$match': {
        'gereeniiDugaar': req.body.gereeniiDugaar,
        'baiguullagiinId': req.body.baiguullagiinId,
        'barilgiinId': req.body.barilgiinId
      }
    }, {
      '$unwind': {
        'path': '$avlaga.guilgeenuud'
      }
    }, {
      '$match': {
        'avlaga.guilgeenuud.ognoo': {
          '$lte': new Date()
        }
      }
    }, {
      '$group': {
        '_id': 'aaa',
        'tulukh': {
          '$sum': '$avlaga.guilgeenuud.tulukhDun'
        },
        'khyamdral': {
          '$sum': '$avlaga.guilgeenuud.khyamdral'
        },
        'tulsun': {
          '$sum': '$avlaga.guilgeenuud.tulsunDun'
        }
      }
    }, {
      '$project': {
        'uldegdel': {
          '$subtract': [
            '$tulukh', {
              '$sum': [
                '$tulsun', '$khyamdral'
              ]
            }
          ]
        }
      }
    }
  ]
  Geree.aggregate(query).then((result) => {
    res.send({
      "uldegdel": (result[0]?.uldegdel || 0)
    });
  }).catch((err) => {
    next(err);
    console.log("aldaatai", err)
  })
});

exports.khungulultKhadgalya = asyncHandler(async (req, res, next) => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      var khungulult = new KhungulultiinTuukh(req.body);
      gereeniiDugaaruud = [];
      khungulult.khamaataiGereenuud.forEach(x => gereeniiDugaaruud.push(x));
      khariu = await khungulult.save();
      console.log("khariu", khariu);
      var gereenuud = await Geree.find({ _id: { $in: gereeniiDugaaruud } });
      for await (const geree of gereenuud) {
        khyamdraluud = [];
        for await (const ognoo of khungulult.ognoonuud) {
          khyamdral = {
            tulukhDun: 0,
            ognoo: ognoo,
            khyamdral: (geree.sariinTurees * khungulult.khungulukhKhuvi) / 100,
            tailbar: khungulult.shaltgaan,
            khyamdraliinId: khariu._id,
            guilgeeKhiisenOgnoo: new Date,
            guilgeeKhiisenAjiltniiNer: req.body.nevtersenAjiltniiToken?.ner,
            guilgeeKhiisenAjiltniiId: req.body.nevtersenAjiltniiToken?.id
          }
          khyamdraluud.push(khyamdral);
        }
        console.log("khyamdraluud", khyamdraluud);
        await Geree.updateOne({ _id: geree._id }, { $push: { "avlaga.guilgeenuud": { $each: khyamdraluud } } });
      }
      await session.commitTransaction();
      session.endSession();
      res.send("Amjilttai")
    }
    catch (err1) {
      console.log("err1", err1);
      await session.abortTransaction();
      next(err1);
    }
  }
  catch (err) {
    next(err);
  }
});

exports.khungulultUstgaya = asyncHandler(async (req, res, next) => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      var khungulult = await KhungulultiinTuukh.findOne({ _id: req.body.id });
      gereeniiDugaaruud = [];
      khungulult.khamaataiGereenuud.forEach(x => gereeniiDugaaruud.push(x));
      for await (const gereeniiDugaar of gereeniiDugaaruud) {
        khyamdraluud = [];
        await Geree.findOneAndUpdate({ _id: gereeniiDugaar }, { $pull: { "avlaga.guilgeenuud": { "khyamdraliinId": khungulult._id } } });
      }
      await KhungulultiinTuukh.deleteOne({ _id: khungulult._id });
      await session.commitTransaction();
      session.endSession();
      res.send("Amjilttai")
    }
    catch (err1) {
      console.log("err1", err1);
      await session.abortTransaction();
      next(err1);
    }
  }
  catch (err) {
    next(err);
  }
});

exports.tukhainOgnoogoorAvlagaBodojOruulya = asyncHandler(async (req, res, next) => {
  try {
    var gereenuud = await Geree.find({
      "avlaga.guilgeenuud.ognoo": {
        $not: {
          $gte: new Date(req.body.ekhlekhOgnoo),
          $lte: new Date(req.body.duusakhOgnoo)
        }
      }
    });
    var khariu = [];
    console.log("gereenuud", gereenuud);
    var object;
    if (gereenuud)
      for await (const element of gereenuud) {
        object = {
          tulukhDun: element.davkhar == element.sariinTurees,
          undsenDun: element.davkhar == element.sariinTurees,
          ognoo: moment(req.body.duusakhOgnoo).set('date', element.tulukhUdur[0]),
          khyamdral: 0
        }
        console.log("object", object)
        Geree.updateOne({ _id: element._id }, {
          $push: {
            ["avlaga.guilgeenuud"]: object
          }
        }).then(async (result) => {
          console.log("result", result);
          khariu.push(result);
        })
      }
    res.send(khariu);
  }
  catch (err) {
    next(err);
  }
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

