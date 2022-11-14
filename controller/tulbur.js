const asyncHandler = require("express-async-handler");
const Geree = require("../models/geree");
const BankniiGuilgee = require("../models/bankniiGuilgee");
const Baiguullaga = require("../models/baiguullaga");
const Talbai = require("../models/talbai");
const { UstsanBarimt } = require("zevback");
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
      var dun = await tooZasya((tulbur.tulsunDun ? tulbur.tulsunDun : 0) + (tulbur.tulsunAldangi ? tulbur.tulsunAldangi : 0))
      if (req.body.nevtersenAjiltniiToken) {
        tulbur.guilgeeKhiisenAjiltniiNer = req.body.nevtersenAjiltniiToken.ner;
        tulbur.guilgeeKhiisenAjiltniiId = req.body.nevtersenAjiltniiToken.id;
      }
      var inc = {
        uldegdel: -(tulbur?.tulsunDun || 0)
      }
      if (tulbur.tulsunAldangi && tulbur.tulsunAldangi > 0)
        inc["aldangiinUldegdel"] = -tulbur.tulsunAldangi

      var updatedGeree = await Geree.findByIdAndUpdate(
        { _id: tulbur.gereeniiId },
        {
          $push: {
            [`avlaga.guilgeenuud`]: tulbur,
          },
          $inc: inc,
        }
      ).catch((err) => {
        next(err);
      });
      await daraagiinTulukhOgnooZasya(tulbur.gereeniiId);
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
                  { $ifNull: ["$kholbosonDun", 0] }, dun
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
      aldaaniiMsg = aldaaniiMsg + err.message;
      next(err);
    });
    var updatedGeree = await Geree.findByIdAndUpdate(
      { _id: guilgee.gereeniiId },
      [{
        $set: {
          "baritsaaniiUldegdel": {
            "$add": [
              { $ifNull: ["$baritsaaniiUldegdel", 0] }, (guilgee.orlogo - guilgee.zarlaga)
            ]
          }
        }
      }]
    ).catch((err) => {
      aldaaniiMsg = aldaaniiMsg + err.message;
      next(err);
    });
    if (guilgee.guilgeeniiId) {
      console.log("updatedGeree", updatedGeree);
      await BankniiGuilgee.updateOne(
        { _id: guilgee.guilgeeniiId },
        {
          $push: {
            "kholbosonGereeniiId": guilgee.gereeniiId,
            "kholbosonTalbainId": updatedGeree.talbainDugaar
          }
        }
      ).catch((err) => {
        aldaaniiMsg = aldaaniiMsg + err.message;
        next(err);
      });
      await BankniiGuilgee.updateOne(
        { _id: guilgee.guilgeeniiId },
        [{
          $set: {
            "kholbosonDun": {
              "$add": [
                { $ifNull: ["$kholbosonDun", 0] }, (guilgee.orlogo - guilgee.zarlaga)
              ]
            }
          }
        }]
      ).catch((err) => {
        aldaaniiMsg = aldaaniiMsg + err.message;
        next(err);
      });
    }
    daraagiinTulukhOgnooZasya(guilgee.gereeniiId);
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
  try {
    var guilgee = req.body.guilgee;
    if (guilgee.guilgeeniiId) {
      var shalguur = await BankniiGuilgee.findOne({ "guilgee.guilgeeniiId": guilgee.guilgeeniiId, "kholbosonGereeniiId": guilgee.gereeniiId });
      if (shalguur)
        throw new Error("Тухайн гүйлгээ тухайн гэрээнд холбогдсон байна!");
    }
    if ((guilgee.turul == "barter" || guilgee.turul == "avlaga" || guilgee.turul == "aldangi") && !guilgee.tailbar) {
      throw new Error("Тайлбар заавал оруулна уу?");
    }
    guilgee.guilgeeKhiisenOgnoo = new Date();
    if (req.body.nevtersenAjiltniiToken) {
      guilgee.guilgeeKhiisenAjiltniiNer = req.body.nevtersenAjiltniiToken.ner;
      guilgee.guilgeeKhiisenAjiltniiId = req.body.nevtersenAjiltniiToken.id;
    }
    var inc = {
      uldegdel: -(guilgee?.tulsunDun || 0)
    }
    if (guilgee.turul == "aldangi")
      inc["aldangiinUldegdel"] = -guilgee.tulsunAldangi
    Geree.findByIdAndUpdate(
      { _id: guilgee.gereeniiId },
      {
        $push: {
          [`avlaga.guilgeenuud`]: guilgee,
        },
        $inc: inc,
      }
    )
      .then((result) => {
        if (guilgee.tulsunDun && guilgee.tulsunDun > 0)
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
  }
  catch (aldaa) {
    next(aldaa);
  }
});

exports.khuvaariUusgey = asyncHandler(async (req, res, next) => {
  try {
    var body = req.body;
    var dun = body.dun;
    var zardluud = body.zardluud;
    var khugatsaa = Number(body.khugatsaa)
    if (body.turGereeEsekh)
      khugatsaa = 1;
    var tulukhUdruud = body.tulukhUdruud;
    var ekhlekhOgnoo = new Date(body.ekhlekhOgnoo);
    var duusakhOgnoo = new Date(body.duusakhOgnoo);
    if (body.turGereeEsekh)
      tulukhUdruud = [ekhlekhOgnoo.getDate()];
    var butsaakhJagsaalt = []
    var ognoo = new Date(ekhlekhOgnoo);
    var turOgnoo;
    var tukhainSar = new Date(moment(ognoo).set('date', 1));
    var suuliinUdur;
    var duussanEsekh = false;
    if (tulukhUdruud && tulukhUdruud.length > 1)
      tulukhUdruud.sort(function (a, b) {
        return a - b;
      });
    await new Array(khugatsaa).fill('').map((mur, index) => {
      tulukhUdruud.forEach((udur) => {
        if (!duussanEsekh) {
          console.log('tukhainSar', tukhainSar);
          suuliinUdur = moment(tukhainSar).endOf('month').date();
          console.log('suuliinUdur', suuliinUdur);
          if (suuliinUdur < udur) {
            turOgnoo = new Date(moment(tukhainSar).set('date', suuliinUdur))
            console.log("if ruu orson => ", turOgnoo)
          }
          else {
            turOgnoo = new Date(moment(tukhainSar).set('date', udur))
            console.log("else ruu orson => ", turOgnoo)
          }
          if (turOgnoo >= ekhlekhOgnoo) {
            if (turOgnoo > moment(duusakhOgnoo)) {
              turOgnoo = new Date(duusakhOgnoo)
              duussanEsekh = true;
            }
            butsaakhJagsaalt.push({
              turul: "khuvaari",
              ognoo: turOgnoo,
              tulukhDun: dun,
              undsenDun: dun
            })
            if (zardluud && zardluud.length > 0) {
              zardluud.forEach(async (zardal) => {
                if (zardal) {
                  if (zardal.turul == "1м2")
                    zardal.dun = await tooZasya(zardal.tariff * body.mk);
                  if (zardal.turul == "Тогтмол")
                    zardal.dun = zardal.tariff;
                  butsaakhJagsaalt.push({
                    turul: "avlaga",
                    tailbar: zardal.ner,
                    ognoo: turOgnoo,
                    tulukhDun: zardal.dun
                  })
                }
              })
            }
          }
          ognoo = new Date(turOgnoo);
        }
      })
      tukhainSar = new Date(moment(tukhainSar).add(1, 'month'));
    })
    res.send(butsaakhJagsaalt);
  }
  catch (aldaa) {
    next(aldaa);
  }
});

module.exports.tulultTaniya = async function tulultTaniya() {
  var guilgeenuud = await BankniiGuilgee.find({
    createdAt: { $gte: new Date(new Date().getTime() - 5 * 60000) },
    $or: [
      {
        amount: { $gt: 0 },
      },
      {
        Amt: { $gt: 0 },
      }
    ]
  });
  console.log("tulult taniya", guilgeenuud);
  var khaikhNukhtsul;
  var tailbar = [];
  if (guilgeenuud != null && guilgeenuud.length > 0) {
    try {
      guilgeenuud.forEach(async (x) => {
        khaikhNukhtsul = [];
        if (x.description)
          tailbar = x.description.split(" ");
        else if (x.TxAddInf)
          tailbar = x.TxAddInf.split(" ");
        if (x.relatedAccount != null)
          khaikhNukhtsul.push({
            "avlaga.guilgeenuud.dansniiDugaar": x.relatedAccount,
          });
        else if (x.CtAcntOrg != null)
          khaikhNukhtsul.push({
            "avlaga.guilgeenuud.dansniiDugaar": x.CtAcntOrg,
          });
        tailbar.forEach((y) => {
          khaikhNukhtsul.push({ utas: y });
          khaikhNukhtsul.push({ register: y });
          y = y.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "");
          khaikhNukhtsul.push({ talbainDugaar: { $regex: ".*" + y + ".*" } });
        });
        console.log(khaikhNukhtsul);
        var oldsonGereenuud = await Geree.find({ $or: khaikhNukhtsul, barilgiinId: guilgeenuud.barilgiinId });
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

module.exports.aldangiBodyo = async function aldangiBodyo() {
  try {
    var baiguullaguud = await Baiguullaga.find({ "tokhirgoo.aldangiinKhuvi": { $gt: 0 } }).lean();
    if (baiguullaguud && baiguullaguud.length > 0)
      for (const baiguullaga of baiguullaguud) {
        console.log("aldangiBodyo -> baiguullaga ->", baiguullaga)
        var ognoo = new Date();
        var aldagiinKhuvi = (baiguullaga.tokhirgoo && baiguullaga.tokhirgoo.aldangiinKhuvi) ? baiguullaga.tokhirgoo.aldangiinKhuvi : 0.5
        var aldangiChuluulukhKhonog = (baiguullaga.tokhirgoo && baiguullaga.tokhirgoo.aldangiChuluulukhKhonog) ? baiguullaga.tokhirgoo.aldangiChuluulukhKhonog : 0
        var gereenuud = await Geree.aggregate([
          {
            '$match': {
              'baiguullagiinId': baiguullaga._id.toString(),
              'daraagiinTulukhOgnoo': {
                '$lte': ognoo
              }
            }
          }, {
            '$unwind': {
              'path': '$avlaga.guilgeenuud'
            }
          }, {
            '$match': {
              'avlaga.guilgeenuud.ognoo': {
                '$lte': ognoo
              },
              'avlaga.guilgeenuud.turul': {
                '$nin': [
                  'baritsaa'
                ]
              }
            }
          }, {
            '$group': {
              '_id': {
                '_id': '$_id',
                'daraagiinTulukhOgnoo': '$daraagiinTulukhOgnoo'
              },
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
        ])
        console.log("gereenuud", gereenuud)
        if (gereenuud && gereenuud.length > 0) {
          var bulkOps = [];
          for (const geree of gereenuud) {
            if (geree.uldegdel > 0 && new Date() > new Date(moment(new Date(geree._id.daraagiinTulukhOgnoo)).add(aldangiChuluulukhKhonog, 'days'))) {
              var bodogdsonKhuu = (geree.uldegdel * aldagiinKhuvi / 100);
              let upsertDoc = {
                'updateOne': {
                  'filter': { '_id': geree._id._id },
                  update: [{
                    $set: {
                      "aldangiinUldegdel": {
                        "$add": [
                          { $ifNull: ["$aldangiinUldegdel", 0] }, bodogdsonKhuu
                        ]
                      }
                    }
                  }]
                }
              };
              bulkOps.push(upsertDoc);
            }
            else
              continue;
          }
          console.log("bulkOps", bulkOps)
          await Geree.bulkWrite(bulkOps)
            .then(bulkWriteOpResult => {
              console.log('BULK ==>', bulkOps);
              console.log('BULK update OK', bulkWriteOpResult);
            })
            .catch(err => {
              console.log('BULK ==>', bulkOps);
              console.log('BULK update error', err);
            });
        }
      }
  }
  catch (error) {
    console.log("aldangiBodyo aldaa garlaa ==> ", error)
  }
};

async function tooZasya(too) {
  var zassanToo = await Math.round((too + Number.EPSILON) * 100) / 100;
  return +zassanToo.toFixed(2)
}

exports.tulultUstgaya = asyncHandler(async (req, res, next) => {
  if (!req.body.tailbar)
    throw new Error("Тайлбар заавал оруулна уу?");
  if (req.body.guilgeeniiId) {
    var bankGuilgee = await BankniiGuilgee.findOne({ _id: req.body.guilgeeniiId });
    if (bankGuilgee && bankGuilgee.ebarimtAvsanEsekh)
      throw new Error("ИБаримт авсан гүйлгээг устгах боломжгүй! ИБаримтын гүйлгээг устгасны дараа устгах боломжтой!");
  }
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    var ObjectId = require('mongodb').ObjectId;
    var ustgaxObject = await Geree.aggregate([
      {
        $unwind: "$avlaga.guilgeenuud"
      },
      {
        $match: {
          "_id": new ObjectId(req.body.gereeniiId),
          "avlaga.guilgeenuud._id": new ObjectId(req.body.objectiinId)
        }
      }
    ]);
    var tuxainGuilgee = ustgaxObject[0].avlaga.guilgeenuud;
    var inc = {
      uldegdel: (tuxainGuilgee?.tulsunDun || 0)
    }
    if (tuxainGuilgee.tulsunAldangi && tuxainGuilgee.tulsunAldangi > 0)
      inc["aldangiinUldegdel"] = tuxainGuilgee.tulsunAldangi

    await Geree.findByIdAndUpdate(
      { _id: req.body.gereeniiId },
      {
        $pull: {
          [`avlaga.guilgeenuud`]: {
            _id: req.body.objectiinId,
          },
        },
        $inc: inc,
      }
    ).catch((err) => {
      next(err);
    });

    if (tuxainGuilgee) {
      var ustsanBarimt = new UstsanBarimt();
      ustsanBarimt.class = "gereeniiGuilgee";
      ustsanBarimt.tailbar = req.body.tailbar;
      ustsanBarimt.object = tuxainGuilgee;
      if (req.body.nevtersenAjiltniiToken) {
        ustsanBarimt.ajiltniiNer = req.body.nevtersenAjiltniiToken.ner;
        ustsanBarimt.ajiltniiId = req.body.nevtersenAjiltniiToken.id;
      }
      ustsanBarimt.baiguullagiinId = req.body.baiguullagiinId;
      await ustsanBarimt.save();
    }
    if (req.body.guilgeeniiId) {
      var dun = await tooZasya((tuxainGuilgee.tulsunDun ? tuxainGuilgee.tulsunDun : 0) + (tuxainGuilgee.tulsunAldangi ? tuxainGuilgee.tulsunAldangi : 0))
      await BankniiGuilgee.updateOne(
        { _id: req.body.guilgeeniiId },
        [{
          $set: {
            "kholbosonDun": {
              "$add": [
                { $ifNull: ["$kholbosonDun", 0] }, dun * (-1)
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
    daraagiinTulukhOgnooZasya(req.body.gereeniiId);
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

    var updatedGeree = await Geree.findByIdAndUpdate(
      { _id: req.body.gereeniiId },
      [{
        $set: {
          "baritsaaniiUldegdel": {
            "$add": [
              { $ifNull: ["$baritsaaniiUldegdel", 0] }, (req.body.zarlaga - req.body.orlogo)
            ]
          }
        }
      }]
    ).catch((err) => {
      next(err);
    });
    if (req.body.guilgeeniiId) {
      await BankniiGuilgee.updateOne(
        { _id: req.body.guilgeeniiId },
        [{
          $set: {
            "kholbosonDun": {
              "$add": [
                { $ifNull: ["$kholbosonDun", 0] }, (req.body.zarlaga - req.body.orlogo)
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
          $pull: { "kholbosonGereeniiId": req.body.gereeniiId, kholbosonTalbainId: updatedGeree.talbainDugaar },
        }
      ).catch((err) => {
        next(err);
      });
    }
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
        "avlaga.guilgeenuud.turul": {
          $nin: ["baritsaa"]
        }
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
      khungulult.guilgeeKhiisenOgnoo = new Date();
      khungulult.guilgeeKhiisenAjiltniiNer = req.body.nevtersenAjiltniiToken?.ner;
      khungulult.guilgeeKhiisenAjiltniiId = req.body.nevtersenAjiltniiToken?.id;
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

exports.talbainIdnuudOruulya = asyncHandler(
  async (req, res, next) => {
    try {
      var gereenuud = await Geree.find({
        talbainDugaar: { $exists: true },
        "talbainIdnuud.0": { $exists: false }
      });
      var bulkOps = [];
      if (gereenuud)
        for await (const element of gereenuud) {
          var dugaaruud = element.talbainDugaar.split(",");
          var talbainuud = await Talbai.find({ kod: { $in: dugaaruud }, barilgiinId: element.barilgiinId }).lean();
          console.log("talbainuud", talbainuud);
          if (talbainuud && talbainuud.length > 0) {
            var idnuud = talbainuud.map(a => a._id);
            let upsertDoc = {
              'updateOne': {
                'filter': { '_id': element._id },
                update: { "talbainIdnuud": idnuud }
              }
            };
            console.log("upsertDoc", upsertDoc);
            bulkOps.push(upsertDoc);
          }
        }
      await Geree.bulkWrite(bulkOps)
        .then(bulkWriteOpResult => {
          console.log('BULK ==>', bulkOps);
          console.log('BULK update OK', bulkWriteOpResult);
        })
        .catch(err => {
          console.log('BULK ==>', bulkOps);
          console.log('BULK update error', err);
        });
      res.send("zasagdsanToo : " + gereenuud.length);
    } catch (err) {
      next(err);
    }
  }
);

exports.bankniiGuilgeegeerOruulya = asyncHandler(
  async (req, res, next) => {
    try {
      var ekhlekhOgnoo = new Date(req.body.ekhlekhOgnoo);
      var duusakhOgnoo = new Date(req.body.duusakhOgnoo);
      var guilgeenuud = await BankniiGuilgee.find({ "kholbosonGereeniiId.0": { $exists: true }, "TxPostDate": { $gte: ekhlekhOgnoo, $lte: duusakhOgnoo } });
      console.log("guilgeenuud", guilgeenuud);
      var oldooguiGuilgeenuud = []
      for await (const guilgee of guilgeenuud) {
        var geree = await Geree.findOne({
          $or:
            [
              { "avlaga.guilgeenuud.guilgeeniiId": guilgee._id },
              { "avlaga.baritsaa.guilgeeniiId": guilgee._id }
            ]
        });
        if (!geree)
          oldooguiGuilgeenuud.push(guilgee._id);
      }
      res.send(oldooguiGuilgeenuud);
    } catch (err) {
      next(err);
    }
  }
);

exports.aldaataiBankniiGuilgeeZasya = asyncHandler(
  async (req, res, next) => {
    try {
      var idnuud = req.body.idnuud;
      console.log("idnuud", idnuud);
      var ObjectId = require('mongodb').ObjectId;
      var guilgeenuud = await BankniiGuilgee.find({ "_id": { $in: idnuud } });
      for await (const guilgee of guilgeenuud) {
        var geree = await Geree.findOne({
          $or:
            [
              { "avlaga.guilgeenuud.guilgeeniiId": guilgee._id },
              { "avlaga.baritsaa.guilgeeniiId": guilgee._id }
            ]
        });
        if (!geree) {
          var oruulakhObject = {
            turul: "bank",
            ognoo: guilgee.TxPostDate ? guilgee.TxPostDate : guilgee.postDate,
            tulsunDun: guilgee.Amt ? guilgee.Amt : guilgee.amount,
            guilgeeniiId: guilgee._id,
            dansniiDugaar: guilgee.dansniiDugaar,
            tulsunDans: guilgee.CtAcntOrg ? guilgee.CtAcntOrg : guilgee.relatedAccount
          }
          await Geree.updateOne(
            { _id: new ObjectId(guilgee.kholbosonGereeniiId[0]) },
            {
              $push: {
                ["avlaga.guilgeenuud"]: oruulakhObject,
              },
            })
        }
      }
      res.send("Amjilttai");
    } catch (err) {
      next(err);
    }
  }
);

exports.tukhainOgnoogoorBukhAvlagaBodojOruulya = asyncHandler(
  async (req, res, next) => {
    try {
      var gereenuud = await Geree.find({
        barilgiinId: req.body.barilgiinId,
        "avlaga.guilgeenuud.0": {
          $exists: true
        },
        "tulukhUdur.0": {
          $exists: true
        }
      }).select("+avlaga");
      var ajillakhGereenuud = [];
      for await (const x of gereenuud) {
        var tukhainSariinMur = await x.avlaga.guilgeenuud.find((a) => a.ognoo > new Date(req.body.ekhlekhOgnoo) && a.ognoo < new Date(req.body.duusakhOgnoo) && a.undsenDun > 0)
        console.log("tukhainSariinMur", tukhainSariinMur)
        if (!tukhainSariinMur)
          ajillakhGereenuud.push(x);
      }
      var khariu = [];
      console.log("ajillakhGereenuud", ajillakhGereenuud);
      var object;
      var duusakhOgnoo = new Date(req.body.duusakhOgnoo)
      duusakhOgnoo.setHours(0, 0, 0, 0);
      if (gereenuud)
        for await (const element of ajillakhGereenuud) {
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

exports.gereenuudedZalruulgaOruulya = asyncHandler(
  async (req, res, next) => {
    try {
      var bodokhOgnoo = new Date(req.body.bodokhOgnoo);
      var oruulakhOgnoo = new Date(req.body.oruulakhOgnoo);
      var baiguullagiinId = req.body.baiguullagiinId;
      var barilgiinId = req.body.barilgiinId;
      var zoruu = 0;
      objectuud = req.body.objectuud
      var khariu = [];
      var object;
      if (!req.body.bodokhOgnoo || !req.body.oruulakhOgnoo || !req.body.barilgiinId || !req.body.oruulakhOgnoo || !req.body.objectuud)
        throw new Error("Талбар дутуу!");
      if (objectuud)
        for await (const element of objectuud) {
          var geree = await Geree.aggregate([
            {
              '$unwind': {
                'path': '$avlaga.guilgeenuud'
              }
            }, {
              '$match': {
                'baiguullagiinId': baiguullagiinId,
                'barilgiinId': barilgiinId,
                'talbainDugaar': element.gereeniiDugaar,
                'tuluv': 1,
                'avlaga.guilgeenuud.ognoo': {
                  '$lte': bodokhOgnoo
                }
              }
            }, {
              '$project': {
                'gereeniiDugaar': '$gereeniiDugaar',
                'tulukhDun': {
                  '$subtract': [
                    {
                      "$ifNull": ["$avlaga.guilgeenuud.tulukhDun", 0]
                    }
                    , {
                      '$sum': [
                        {
                          "$ifNull": ['$avlaga.guilgeenuud.tulsunDun', 0]
                        }
                        ,
                        {
                          "$ifNull": ['$avlaga.guilgeenuud.khyamdral', 0]
                        }
                      ]
                    }
                  ]
                }
              }
            }, {
              '$group': {
                '_id': '$gereeniiDugaar',
                'uldegdel': {
                  '$sum': '$tulukhDun'
                }
              }
            }
          ]);
          if (geree && geree.length > 0 && geree[0].uldegdel !== element.dun) {
            console.log('geree', geree);
            console.log('element', element);
            zoruu = element.dun - geree[0].uldegdel;
            if (zoruu !== 0) {
              object = {
                tulukhDun: zoruu > 0 ? zoruu : 0,
                tulsunDun: zoruu < 0 ? (zoruu * -1) : 0,
                ognoo: oruulakhOgnoo,
                tailbar: "Залруулга гүйлгээ",
                turul: "System",
                guilgeeKhiisenAjiltniiNer: "System",
                khyamdral: 0,
              };
              await Geree.updateOne(
                { gereeniiDugaar: geree[0]._id },
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
          }
        }
      res.send(khariu);
    } catch (err) {
      next(err);
    }
  }
);

exports.tsutsalgdanGuilgeeZasya = asyncHandler(
  async (req, res, next) => {
    try {
      var query = [
        {
          '$unwind': {
            'path': '$gereeniiTuukhuud'
          }
        }, {
          '$match': {
            'tuluv': -1,
            'gereeniiTuukhuud.turul': 'Tsutslakh'
          }
        }, {
          '$group': {
            '_id': '$_id',
            'ognoo': {
              '$max': '$gereeniiTuukhuud.khiisenOgnoo'
            }
          }
        }
      ]
      var jagsaalt = await Geree.aggregate(query);
      if (jagsaalt && jagsaalt.length > 0) {
        var bulkOps = [];
        for await (const x of jagsaalt) {
          let upsertDoc = {
            'updateOne': {
              'filter': { '_id': x._id },
              update: { $pull: { "avlaga.guilgeenuud": { ognoo: { $gte: x.ognoo }, undsenDun: { $gte: 0 } } } },
              multi: true
            }
          };
          bulkOps.push(upsertDoc);
        }
        await Geree.bulkWrite(bulkOps)
          .then(bulkWriteOpResult => {
            console.log('BULK ==>', bulkOps);
            console.log('BULK update OK', bulkWriteOpResult);
          })
          .catch(err => {
            console.log('BULK ==>', bulkOps);
            console.log('BULK update error', err);
          });
        res.send(jagsaalt.length.toString());
      }
      else
        res.send("0");
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

exports.testiinBankniiGuilgee = asyncHandler(
  async (req, res, next) => {
    try {
      console.log("testiinBankniiGuilgee");
      if (!req.body.dans || !req.body.barilgiinId)
        throw new Error("dans, barilgiinId alga!");
      var guilgeenuud = await BankniiGuilgee.find({
        createdAt: {
          $gte: new Date(req.body.ekhlekhOgnoo),
          $lte: new Date(req.body.duusakhOgnoo),
        },
        dansniiDugaar: req.body.dans
      });
      console.log("guilgeenuud ->", guilgeenuud.length);
      if (guilgeenuud) {
        for await (const guilgee of guilgeenuud) {
          guilgee._id = null;
          guilgee.baiguullagiinId = req.body.baiguullagiinId;
          guilgee.barilgiinId = req.body.barilgiinId;
          guilgee.kholbosonGereeniiId = [];
          guilgee.kholbosonDun = 0;
          guilgee.zardliinBulgiinId = null;
          guilgee.zardliinBulgiinNer = null;
          guilgee.kholbosonTalbainId = [];
        }
      }
      var khariu = await BankniiGuilgee.insertMany(guilgeenuud);
      res.send(khariu);
    } catch (err) {
      next(err);
    }
  }
);

exports.testiinBankniiGuilgeeOruulya = asyncHandler(
  async (req, res, next) => {
    try {
      if (!req.body.dans || !req.body.barilgiinId)
        throw new Error("dans, barilgiinId alga!");
      var guilgeenuud = []
      var guilgee = new BankniiGuilgee();
      for (let i = 1; i <= 10; i++) {
        guilgee = new BankniiGuilgee();
        if (req.body.bank == "tdb") {
          guilgee.TxDt = req.body.ognoo;
          guilgee.TxPostDate = req.body.ognoo;
          guilgee.CtAcct = "5012345678";
          guilgee.CtActnName = "TEST DANS";
          guilgee.Amt = (i < 6) ? i * 100000 : i * -100000;
          guilgee.TxAddInf = "Test " + i.toString();
          guilgee.CtAcntOrg = "TEST DANS";
        }
        else {
          guilgee.tranDate = req.body.ognoo;
          guilgee.postDate = req.body.ognoo;
          guilgee.code = i;
          guilgee.record = i;
          guilgee.amount = (i < 6) ? i * 100000 : i * -100000;
          guilgee.balance = i * 100000;
          guilgee.debit = 0;
          guilgee.correction = 0;
          guilgee.description = "Test " + i.toString();
          guilgee.relatedAccount = "5012345678";
        }
        guilgee.baiguullagiinId = req.body.baiguullagiinId;
        guilgee.barilgiinId = req.body.barilgiinId;
        guilgee.kholbosonGereeniiId = [];
        guilgee.kholbosonDun = 0;
        guilgee.zardliinBulgiinId = null;
        guilgee.zardliinBulgiinNer = null;
        guilgee.kholbosonTalbainId = [];
        guilgee.dansniiDugaar = req.body.dans
        guilgeenuud.push(guilgee);
      }
      var khariu = await BankniiGuilgee.insertMany(guilgeenuud);
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
                      undsenDun: geree.sariinTurees,
                      tulukhDun: geree.sariinTurees
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
  var niitKhyamdral = lodash.sumBy(jagsaalt, function (object) {
    return object.khyamdral;
  });
  niitTulsunDun = niitTulsunDun + niitKhyamdral;
  jagsaalt = lodash.filter(jagsaalt, (a) => a.tulukhDun != null);
  jagsaalt = lodash.orderBy(jagsaalt, ["ognoo"], ["asc"]);
  var tulukhOgnoo;
  if (jagsaalt && jagsaalt.length > 0)
    tulukhOgnoo = jagsaalt[0].ognoo;
  jagsaalt.forEach((element) => {
    if (niitTulsunDun >= 0) {
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
