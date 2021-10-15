const asyncHandler = require("express-async-handler");
const Geree = require("../models/geree");
const BankniiGuilgee = require("../models/bankniiGuilgee");

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
  Geree.updateOne({ _id: req.body.gereeniiId }, {
    $push: {
      [`avlaga.guilgeenuud`]: tulbur
    },
    $inc: { "uldegdel": - req.body.tulsunDun }
  }).then((result) => {
    if (req.body.guilgeeniiId)
      BankniiGuilgee.updateOne({ _id: req.body.guilgeeniiId }, { $set: { kholbosonGereeniiId: req.body.gereeniiId } }).then((result1) => {
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

