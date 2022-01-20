const asyncHandler = require("express-async-handler");
const Geree = require("../models/geree");
const BankniiGuilgee = require("../models/bankniiGuilgee");
const Baiguullaga = require("../models/baiguullaga");
const lodash = require("lodash");
const moment = require("moment");
const mongoose = require("mongoose");
const KhungulultiinTuukh = require("../models/khungulultiinTuukh");

/*exports.tulultKhadgalya = asyncHandler(async (req, res, next) => {
  var tulbur = {
    turul: req.body.turul,
    tulsunDun: req.body.tulsunDun,
    ognoo: req.body.ognoo,
    guilgeeniiId: req.body.guilgeeniiId,
    dansniiDugaar: req.body.dansniiDugaar,
    tulsunDans: req.body.tulsunDans,
    guilgeeKhiisenOgnoo: new Date(),
  };
  if (req.body.nevtersenAjiltniiToken) {
    tulbur.guilgeeKhiisenAjiltniiNer = req.body.nevtersenAjiltniiToken.ner;
    tulbur.guilgeeKhiisenAjiltniiId = req.body.nevtersenAjiltniiToken.id;
  }
  Geree.findByIdAndUpdate(
    { _id: req.body.gereeniiId },
    {
      $push: {
        [`avlaga.guilgeenuud`]: tulbur,
      },
      $inc: { uldegdel: -req.body.tulsunDun },
    }
  )
    .then((result) => {
      daraagiinTulukhOgnooZasya(req.body.gereeniiId);
      if (req.body.guilgeeniiId)
        BankniiGuilgee.updateOne(
          { _id: req.body.guilgeeniiId },
          {
            $set: {
              kholbosonGereeniiId: req.body.gereeniiId,
              kholbosonTalbainId: result.talbainDugaar
            },
          }
        )
          .then((result1) => {
            res.send(result1);
          })
          .catch((err) => {
            next(err);
          });
      else res.send(result);
    })
    .catch((err) => {
      next(err);
    });
});*/

exports.tulultOlnoorKhadgalya = asyncHandler(async (req, res, next) => {
  var guilgeenuud = req.body.guilgeenuud;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    var aldaaniiMsg;
    for await (const tulbur of guilgeenuud) {
      tulbur.guilgeeKhiisenOgnoo = new Date();
      if (req.body.nevtersenAjiltniiToken) {
        tulbur.guilgeeKhiisenAjiltniiNer = req.body.nevtersenAjiltniiToken.ner;
        tulbur.guilgeeKhiisenAjiltniiId = req.body.nevtersenAjiltniiToken.id;
      }
      var updatedGeree = await Geree.findByIdAndUpdate(
        { _id: tulbur.gereeniiId },
        {
          $push: {
            [`avlaga.guilgeenuud`]: tulbur,
          }
        }
      ).catch((err) => {
        next(err);
      });

      daraagiinTulukhOgnooZasya(tulbur.gereeniiId);
      if (tulbur.guilgeeniiId) {
        console.log("updatedGeree", updatedGeree);
        await BankniiGuilgee.updateOne(
          { _id: tulbur.guilgeeniiId },
          {
            $push: {
              "kholbosonGereeniiId": tulbur.gereeniiId,
              "kholbosonTalbainId": updatedGeree.talbainDugaar
            }
          }
        ).catch((err) => {
          next(err);
        });
        await BankniiGuilgee.updateOne(
          { _id: tulbur.guilgeeniiId },
          [{
            $set: {
              "kholbosonDun": {
                "$add": [
                  { $ifNull: ["$kholbosonDun", 0] }, tulbur.tulsunDun
                ]
              }
            }
          }]
        ).catch((err) => {
          next(err);
        });
      }
    }
    if (!aldaaniiMsg) {
      console.log("aldaaniiMsg", aldaaniiMsg);
      await session.commitTransaction();
    }
    else {
      console.log("aldaaniiMsg1", aldaaniiMsg);
      await session.abortTransaction();
    }
    session.endSession();
    res.send("Amjilttai");
  }
  catch (err1) {
    await session.abortTransaction();
    next(err1);
  }
});

exports.baritsaaniiGuilgeeKhiie = asyncHandler(async (req, res, next) => {
  var guilgee = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    var aldaaniiMsg;
    var id = new mongoose.Types.ObjectId();
    guilgee._id = id;
    guilgee.guilgeeKhiisenOgnoo = new Date();
    if (req.body.nevtersenAjiltniiToken) {
      guilgee.guilgeeKhiisenAjiltniiNer = req.body.nevtersenAjiltniiToken.ner;
      guilgee.guilgeeKhiisenAjiltniiId = req.body.nevtersenAjiltniiToken.id;
    }
    var updatequery = {
      $push: {
        [`avlaga.baritsaa`]: guilgee
      }
    }
    if (guilgee.zarlaga > 0) {
      var tulbur = guilgee;
      tulbur.tulsunDun = guilgee.zarlaga;
      tulbur.turul = "baritsaa";
      updatequery["$push"]["avlaga.guilgeenuud"] = tulbur
    }
    await Geree.findByIdAndUpdate(
      { _id: guilgee.gereeniiId },
      updatequery
    ).then((result) => console.log(result)).catch((err) => {
      next(err);
    });
    updatequery = [{
      $set: {
        "baritsaaniiUldegdel": {
          "$add": [
            { $ifNull: ["$baritsaaniiUldegdel", 0] }, (guilgee.orlogo - guilgee.zarlaga)
          ]
        }
      }
    }]
    await Geree.findByIdAndUpdate(
      { _id: guilgee.gereeniiId },
      updatequery
    ).then((result) => console.log(result)).catch((err) => {
      next(err);
    });

    await daraagiinTulukhOgnooZasya(guilgee.gereeniiId);
    if (!aldaaniiMsg) {
      console.log("aldaaniiMsg", aldaaniiMsg);
      await session.commitTransaction();
    }
    else {
      console.log("aldaaniiMsg1", aldaaniiMsg);
      await session.abortTransaction();
    }
    session.endSession();
    res.send("Amjilttai");
  }
  catch (err1) {
    await session.abortTransaction();
    next(err1);
  }
});

exports.gereeniiGuilgeeKhadgalya = asyncHandler(async (req, res, next) => {
  var guilgee = req.body.guilgee;
  console.log("guilgee", guilgee);
  var guilgeeniiDun = (guilgee?.tulsunDun || 0) - (guilgee?.tulukhDun || 0);
  guilgee.guilgeeKhiisenOgnoo = new Date();
  if (req.body.nevtersenAjiltniiToken) {
    guilgee.guilgeeKhiisenAjiltniiNer = req.body.nevtersenAjiltniiToken.ner;
    guilgee.guilgeeKhiisenAjiltniiId = req.body.nevtersenAjiltniiToken.id;
  }
  Geree.findByIdAndUpdate(
    { _id: guilgee.gereeniiId },
    {
      $push: {
        [`avlaga.guilgeenuud`]: guilgee,
      },
      $inc: { uldegdel: -guilgeeniiDun },
    }
  )
    .then((result) => {
      daraagiinTulukhOgnooZasya(guilgee.gereeniiId);
      if (guilgee.guilgeeniiId) {
        console.log("guilgee.guilgeeniiId", guilgee.guilgeeniiId);
        BankniiGuilgee.updateOne(
          { _id: guilgee.guilgeeniiId },
          {
            $set: {
              kholbosonGereeniiId: guilgee.gereeniiId,
              kholbosonTalbainId: result.talbainDugaar
            },
          }
        )
          .then((result1) => {
            res.send(result1);
          })
          .catch((err) => {
            next(err);
          });
      } else res.send(result);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports.tulultTaniya = async function tulultTaniya() {
  var guilgeenuud = await BankniiGuilgee.find({
    createdAt: { $gte: new Date(new Date().getTime() - 5 * 60000) },
    amount: { $gt: 0 },
  });
  console.log("tulult taniya", guilgeenuud);
  var khaikhNukhtsul;
  var tailbar = [];
  if (guilgeenuud != null && guilgeenuud.length > 0) {
    try {
      guilgeenuud.forEach(async (x) => {
        khaikhNukhtsul = [];
        tailbar = x.description.split(" ");
        if (x.relatedAccount != null)
          khaikhNukhtsul.push({
            "avlaga.guilgeenuud.dansniiDugaar": x.relatedAccount,
          });
        tailbar.forEach((y) => {
          khaikhNukhtsul.push({ utas: y });
          khaikhNukhtsul.push({ register: y });
          y = y.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "");
          khaikhNukhtsul.push({ talbainDugaar: { $regex: ".*" + y + ".*" } });
        });
        console.log(khaikhNukhtsul);
        var oldsonGereenuud = await Geree.find({ $or: khaikhNukhtsul });
        if (oldsonGereenuud != null && oldsonGereenuud.length > 0) {
          oldsonGereenuud.forEach((a) => {
            if (
              x.magadlaltaiGereenuud != null &&
              !x.magadlaltaiGereenuud.includes(a._id)
            )
              x.magadlaltaiGereenuud.push(a._id);
            else x.magadlaltaiGereenuud = [a._id];
          });
          x.isNew = false;
          x.save();
        }
      });
    } catch (error) {
      next(error);
    }
  }
};

exports.tulultUstgaya = asyncHandler(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await Geree.findByIdAndUpdate(
      { _id: req.body.gereeniiId },
      {
        $pull: {
          [`avlaga.guilgeenuud`]: {
            _id: req.body.objectiinId,
          },
        }
      }
    ).catch((err) => {
      next(err);
    });

    daraagiinTulukhOgnooZasya(req.body.gereeniiId);
    if (req.body.guilgeeniiId) {
      await BankniiGuilgee.updateOne(
        { _id: req.body.guilgeeniiId },

        [{
          $set: {
            "kholbosonDun": {
              "$add": [
                { $ifNull: ["$kholbosonDun", 0] }, req.body.tulsunDun * (-1)
              ]
            }
          }
        }]
      ).catch((err) => {
        next(err);
      });
      await BankniiGuilgee.updateOne(
        { _id: req.body.guilgeeniiId },
        {
          $pull: { "kholbosonGereeniiId": req.body.gereeniiId, kholbosonTalbainId: req.body.talbainDugaar },
        }
      ).catch((err) => {
        next(err);
      });
    }
    await session.commitTransaction();
    session.endSession();
    res.send("Amjilttai");
  }
  catch (err) {
    await session.abortTransaction();
    next(err);
  }
});

exports.baritsaaniiGuilgeeUstgaya = asyncHandler(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await Geree.findByIdAndUpdate(
      { _id: req.body.gereeniiId },
      {
        $pull: {
          [`avlaga.guilgeenuud`]: {
            _id: req.body.objectiinId,
          },
          [`avlaga.baritsaa`]: {
            _id: req.body.objectiinId,
          }
        }
      }
    ).catch((err) => {
      next(err);
    });
    await daraagiinTulukhOgnooZasya(req.body.gereeniiId);
    await session.commitTransaction();
    session.endSession();
    res.send("Amjilttai");
  }
  catch (err) {
    await session.abortTransaction();
    next(err);
  }
});

exports.uldegdelBodyo = asyncHandler(async (req, res, next) => {
  var query = [
    {
      $match: {
        gereeniiDugaar: req.body.gereeniiDugaar,
        baiguullagiinId: req.body.baiguullagiinId,
        barilgiinId: req.body.barilgiinId,
      },
    },
    {
      $unwind: {
        path: "$avlaga.guilgeenuud",
      },
    },
    {
      $match: {
        "avlaga.guilgeenuud.ognoo": {
          $lte: new Date(),
        },
      },
    },
    {
      $group: {
        _id: "aaa",
        tulukh: {
          $sum: "$avlaga.guilgeenuud.tulukhDun",
        },
        khyamdral: {
          $sum: "$avlaga.guilgeenuud.khyamdral",
        },
        tulsun: {
          $sum: "$avlaga.guilgeenuud.tulsunDun",
        },
      },
    },
    {
      $project: {
        uldegdel: {
          $subtract: [
            "$tulukh",
            {
              $sum: ["$tulsun", "$khyamdral"],
            },
          ],
        },
      },
    },
  ];
  Geree.aggregate(query)
    .then((result) => {
      res.send({
        uldegdel: result[0]?.uldegdel || 0,
      });
    })
    .catch((err) => {
      next(err);
      console.log("aldaatai", err);
    });
});

exports.khungulultKhadgalya = asyncHandler(async (req, res, next) => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      var khungulult = new KhungulultiinTuukh(req.body);
      gereeniiDugaaruud = [];
      khungulult.khamaataiGereenuud.forEach((x) => gereeniiDugaaruud.push(x));
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
            guilgeeKhiisenOgnoo: new Date(),
            guilgeeKhiisenAjiltniiNer: req.body.nevtersenAjiltniiToken?.ner,
            guilgeeKhiisenAjiltniiId: req.body.nevtersenAjiltniiToken?.id,
          };
          khyamdraluud.push(khyamdral);
        }
        await Geree.updateOne(
          { _id: geree._id },
          { $push: { "avlaga.guilgeenuud": { $each: khyamdraluud } } }
        );
      }
      await session.commitTransaction();
      session.endSession();
      res.send("Amjilttai");
    } catch (err1) {
      console.log("err1", err1);
      await session.abortTransaction();
      next(err1);
    }
  } catch (err) {
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
      khungulult.khamaataiGereenuud.forEach((x) => gereeniiDugaaruud.push(x));
      for await (const gereeniiDugaar of gereeniiDugaaruud) {
        khyamdraluud = [];
        await Geree.findOneAndUpdate(
          { _id: gereeniiDugaar },
          {
            $pull: { "avlaga.guilgeenuud": { khyamdraliinId: khungulult._id } },
          }
        );
      }
      await KhungulultiinTuukh.deleteOne({ _id: khungulult._id });
      await session.commitTransaction();
      session.endSession();
      res.send("Amjilttai");
    } catch (err1) {
      console.log("err1", err1);
      await session.abortTransaction();
      next(err1);
    }
  } catch (err) {
    next(err);
  }
});

exports.tukhainOgnoogoorAvlagaBodojOruulya = asyncHandler(
  async (req, res, next) => {
    try {
      var gereeniiDugaar = req.body.gereeniiDugaar;
      var gereenuud = await Geree.find({
        gereeniiDugaar: {
          $in: gereeniiDugaar,
        },
      });
      var khariu = [];
      console.log("gereenuud", gereenuud);
      var object;
      if (gereenuud)
        for await (const element of gereenuud) {
          object = {
            tulukhDun: element.sariinTurees,
            undsenDun: element.sariinTurees,
            ognoo: moment(req.body.duusakhOgnoo).set(
              "date",
              element.tulukhUdur[0]
            ),
            khyamdral: 0,
          };
          console.log("object", object);
          Geree.updateOne(
            { _id: element._id },
            {
              $push: {
                ["avlaga.guilgeenuud"]: object,
              },
            }
          ).then(async (result) => {
            console.log("result", result);
            khariu.push(result);
          });
        }
      res.send(khariu);
    } catch (err) {
      next(err);
    }
  }
);

exports.tukhainOgnoogoorGuilgeegOruulya = asyncHandler(
  async (req, res, next) => {
    try {
      var guilgeenuud = await BankniiGuilgee.find({
        tranDate: {
          $gte: new Date(req.body.ekhlekhOgnoo),
          $lte: new Date(req.body.duusakhOgnoo),
        },
        kholbosonGereeniiId: {
          $exists: true,
          $ne: null,
        },
      });
      var khariu = [];
      console.log("guilgeenuud", guilgeenuud);
      if (guilgeenuud) {
        for await (const guilgee of guilgeenuud) {
          var geree = await Geree.findOne({
            _id: guilgee.kholbosonGereeniiId,
            "avlaga.guilgeenuud.guilgeeniiId": { $nin: [guilgee._id] },
          });
          console.log(geree);
          var oroxGuilgee = {
            dansniiDugaar: guilgee.dansniiDugaar,
            guilgeeniiId: guilgee._id,
            ognoo: guilgee.tranDate,
            tulsunDans: guilgee.relatedAccount,
            tulsunDun: guilgee.amount,
            turul: "bank",
          };
          oroxGuilgee.guilgeeKhiisenOgnoo = new Date();
          if (req.body.nevtersenAjiltniiToken) {
            oroxGuilgee.guilgeeKhiisenAjiltniiNer =
              req.body.nevtersenAjiltniiToken.ner;
            oroxGuilgee.guilgeeKhiisenAjiltniiId =
              req.body.nevtersenAjiltniiToken.id;
          }
          if (geree) {
            await Geree.findByIdAndUpdate(
              { _id: geree._id },
              {
                $push: {
                  [`avlaga.guilgeenuud`]: oroxGuilgee,
                },
              }
            )
              .then((result) => {
                khariu.push(result);
              })
              .catch((err) => {
                next(err);
              });
          }
        }
      }
      res.send(khariu);
    } catch (err) {
      next(err);
    }
  }
);

exports.gereeAutomataarSungaya = asyncHandler(
  async (req, res, next) => {
    try {
      var baiguullaguud = await Baiguullaga.find({ "tokhirgoo.gereeAvtomataarSungakhEsekh": true });
      var tulultiinJagsaalt = [];
      if (baiguullaguud)
        for await (const baiguullaga of baiguullaguud) {
          console.log("baiguullaga", baiguullaga);
          var gereenuud = await Geree.find({
            "tuluv": {
              $ne: -1
            },
            "baiguullagiinId": baiguullaga._id,
            "duusakhOgnoo": {
              $lte: new Date()
            }
          });
          if (gereenuud) {
            for await (const geree of gereenuud) {
              tulultiinJagsaalt = [];
              for (index = 0; index < geree.khugatsaa; index++) {
                for await (const udur of geree.tulukhUdur) {
                  var ognoo = new Date()
                  var uusgexOgnoo = moment(ognoo).add(index, 'month').set('date', udur);
                  if (uusgexOgnoo <= moment(geree.duusakhOgnoo))
                    tulultiinJagsaalt.push({
                      ognoo: moment(ognoo).add(index, 'month').set('date', udur),
                      khyamdral: 0,
                      undsenDun: geree.talbainNiitUne,
                      tulukhDun: geree.talbainNiitUne
                    })
                }
              }
              var shineDuusakhOgnoo = new Date(moment(geree.duusakhOgnoo).add(geree.khugatsaa, 'month'));
              if (tulultiinJagsaalt)
                await Geree.findByIdAndUpdate(
                  { _id: geree._id },
                  {
                    $push: {
                      [`avlaga.guilgeenuud`]: {
                        $each: tulultiinJagsaalt,
                      },
                      [`gereeniiTuukhuud`]: geree,
                    },
                    $set: {
                      duusakhOgnoo: shineDuusakhOgnoo
                    }
                  }
                ).catch((err) => {
                  console.log(err)
                  if (next)
                    next(err);
                });
              console.log("tulultiinJagsaalt", tulultiinJagsaalt);
            }
          }
          console.log("iim toonii geree sungalaa", gereenuud.length);
        }
      if (res)
        res.send(khariu);
    } catch (err) {
      console.log(err)
      if (next)
        next(err);
    }
  }
);

async function daraagiinTulukhOgnooZasya(gereeniiId) {
  var geree = await Geree.findById(gereeniiId).select("avlaga");
  var jagsaalt = [];
  if (lodash.isArray(lodash.get(geree, "avlaga.guilgeenuud"))) {
    jagsaalt = lodash.get(geree, "avlaga.guilgeenuud");
  }
  var niitTulsunDun = lodash.sumBy(jagsaalt, function (object) {
    return object.tulsunDun;
  });
  jagsaalt = lodash.filter(jagsaalt, (a) => a.tulukhDun != null);
  jagsaalt = lodash.orderBy(jagsaalt, ["ognoo"], ["asc"]);
  var tulukhOgnoo;
  jagsaalt.forEach((element) => {
    if (niitTulsunDun > 0) {
      tulukhOgnoo = element.ognoo;
      niitTulsunDun = niitTulsunDun - element.tulukhDun;
    }
  });
  Geree.findByIdAndUpdate(gereeniiId, {
    $set: { daraagiinTulukhOgnoo: tulukhOgnoo },
  })
    .then((result) => {
      console.log("amjilttai", result);
    })
    .catch((err) => {
      console.log("aldaatai", err);
    });
}
