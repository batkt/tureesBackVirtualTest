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
      BankniiGuilgee.updateOne({ _id: req.body.guilgeeniiId }, { $set: { kholbosonGereeniiId: req.body.gereeniiId, kholbosonTalbainId: result.talbainDugaar } }).then((result1) => {
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


exports.tulultUstgaya = asyncHandler(async (req, res, next) => {
  Geree.findByIdAndUpdate({ _id: req.body.gereeniiId }, {
    $pull: {
      [`avlaga.guilgeenuud`]: {
        _id: req.body.objectiinId
      }
    },
    $inc: { "uldegdel": req.body.tulsunDun }
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

