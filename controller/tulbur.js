const asyncHandler = require("express-async-handler");
const Geree = require("../models/geree");
const BankniiGuilgee = require("../models/bankniiGuilgee");
const QpayObject = require("../models/qpayObject");
const { QuickQpayObject } = require("quickqpaypackv2");
const Baiguullaga = require("../models/baiguullaga");
const Talbai = require("../models/talbai");
const AshiglaltiinZardluud = require("../models/ashiglaltiinZardluud");
const { UstsanBarimt } = require("zevbackv2");
const lodash = require("lodash");
const moment = require("moment");
const mongoose = require("mongoose");
const KhungulultiinTuukh = require("../models/khungulultiinTuukh");

exports.tulultOlnoorKhadgalya = asyncHandler(async (req, res, next) => {
  var guilgeenuud = req.body.guilgeenuud;
  const session = await req.body.tukhainBaaziinKholbolt.kholbolt.startSession();
  session.startTransaction();
  try {
    var aldaaniiMsg;
    for await (const tulbur of guilgeenuud) {
      tulbur.guilgeeKhiisenOgnoo = new Date();
      var dun = await tooZasya(
        (tulbur.tulsunDun ? tulbur.tulsunDun : 0) +
          (tulbur.tulsunAldangi ? tulbur.tulsunAldangi : 0)
      );
      if (req.body.nevtersenAjiltniiToken) {
        tulbur.guilgeeKhiisenAjiltniiNer = req.body.nevtersenAjiltniiToken.ner;
        tulbur.guilgeeKhiisenAjiltniiId = req.body.nevtersenAjiltniiToken.id;
      }
      var inc = {
        uldegdel: -(tulbur?.tulsunDun || 0),
      };
      if (tulbur.tulsunAldangi && tulbur.tulsunAldangi > 0)
        inc["aldangiinUldegdel"] = -tulbur.tulsunAldangi;

      var updatedGeree = await Geree(req.body.tukhainBaaziinKholbolt)
        .findByIdAndUpdate(
          { _id: tulbur.gereeniiId },
          {
            $push: {
              [`avlaga.guilgeenuud`]: tulbur,
            },
            $inc: inc,
          }
        )
        .catch((err) => {
          next(err);
        });
      await daraagiinTulukhOgnooZasya(
        tulbur.gereeniiId,
        req.body.tukhainBaaziinKholbolt
      );
      if (tulbur.guilgeeniiId) {
        console.log("updatedGeree", updatedGeree);
        await BankniiGuilgee(req.body.tukhainBaaziinKholbolt)
          .updateOne(
            { _id: tulbur.guilgeeniiId },
            {
              $push: {
                kholbosonGereeniiId: tulbur.gereeniiId,
                kholbosonTalbainId: updatedGeree.talbainDugaar,
              },
            }
          )
          .catch((err) => {
            next(err);
          });
        await BankniiGuilgee(req.body.tukhainBaaziinKholbolt)
          .updateOne({ _id: tulbur.guilgeeniiId }, [
            {
              $set: {
                kholbosonDun: {
                  $add: [{ $ifNull: ["$kholbosonDun", 0] }, dun],
                },
              },
            },
          ])
          .catch((err) => {
            next(err);
          });
      }
    }
    if (!aldaaniiMsg) {
      console.log("aldaaniiMsg", aldaaniiMsg);
      await session.commitTransaction();
    } else {
      console.log("aldaaniiMsg1", aldaaniiMsg);
      await session.abortTransaction();
    }
    session.endSession();
    res.send("Amjilttai");
  } catch (err1) {
    await session.abortTransaction();
    next(err1);
  }
});

exports.baritsaaniiGuilgeeKhiie = asyncHandler(async (req, res, next) => {
  var guilgee = req.body;
  const session = await req.body.tukhainBaaziinKholbolt.kholbolt.startSession();
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
        [`avlaga.baritsaa`]: guilgee,
      },
    };
    if (guilgee.zarlaga > 0) {
      var tulbur = guilgee;
      tulbur.tulsunDun = guilgee.zarlaga;
      tulbur.turul = "baritsaa";
      updatequery["$push"]["avlaga.guilgeenuud"] = tulbur;
    }
    await Geree(req.body.tukhainBaaziinKholbolt)
      .findByIdAndUpdate({ _id: guilgee.gereeniiId }, updatequery)
      .then((result) => console.log(result))
      .catch((err) => {
        aldaaniiMsg = aldaaniiMsg + err.message;
        next(err);
      });
    var updatedGeree = await Geree(req.body.tukhainBaaziinKholbolt)
      .findByIdAndUpdate({ _id: guilgee.gereeniiId }, [
        {
          $set: {
            baritsaaniiUldegdel: {
              $add: [
                { $ifNull: ["$baritsaaniiUldegdel", 0] },
                guilgee.orlogo - guilgee.zarlaga,
              ],
            },
          },
        },
      ])
      .catch((err) => {
        aldaaniiMsg = aldaaniiMsg + err.message;
        next(err);
      });
    if (guilgee.guilgeeniiId) {
      console.log("updatedGeree", updatedGeree);
      await BankniiGuilgee(req.body.tukhainBaaziinKholbolt)
        .updateOne(
          { _id: guilgee.guilgeeniiId },
          {
            $push: {
              kholbosonGereeniiId: guilgee.gereeniiId,
              kholbosonTalbainId: updatedGeree.talbainDugaar,
            },
          }
        )
        .catch((err) => {
          aldaaniiMsg = aldaaniiMsg + err.message;
          next(err);
        });
      await BankniiGuilgee(req.body.tukhainBaaziinKholbolt)
        .updateOne({ _id: guilgee.guilgeeniiId }, [
          {
            $set: {
              kholbosonDun: {
                $add: [
                  { $ifNull: ["$kholbosonDun", 0] },
                  guilgee.orlogo - guilgee.zarlaga,
                ],
              },
            },
          },
        ])
        .catch((err) => {
          aldaaniiMsg = aldaaniiMsg + err.message;
          next(err);
        });
    }
    daraagiinTulukhOgnooZasya(
      guilgee.gereeniiId,
      req.body.tukhainBaaziinKholbolt
    );
    if (!aldaaniiMsg) {
      console.log("aldaaniiMsg", aldaaniiMsg);
      await session.commitTransaction();
    } else {
      console.log("aldaaniiMsg1", aldaaniiMsg);
      await session.abortTransaction();
    }
    session.endSession();
    res.send("Amjilttai");
  } catch (err1) {
    await session.abortTransaction();
    next(err1);
  }
});

exports.gereeniiGuilgeeKhadgalya = asyncHandler(async (req, res, next) => {
  try {
    var guilgee = req.body.guilgee;
    if (guilgee.guilgeeniiId) {
      var shalguur = await BankniiGuilgee(
        req.body.tukhainBaaziinKholbolt
      ).findOne({
        "guilgee.guilgeeniiId": guilgee.guilgeeniiId,
        kholbosonGereeniiId: guilgee.gereeniiId,
      });
      if (shalguur)
        throw new Error("Тухайн гүйлгээ тухайн гэрээнд холбогдсон байна!");
    }
    if (
      (guilgee.turul == "barter" ||
        guilgee.turul == "avlaga" ||
        guilgee.turul == "aldangi") &&
      !guilgee.tailbar
    ) {
      throw new Error("Тайлбар заавал оруулна уу?");
    }
    guilgee.guilgeeKhiisenOgnoo = new Date();
    if (req.body.nevtersenAjiltniiToken) {
      guilgee.guilgeeKhiisenAjiltniiNer = req.body.nevtersenAjiltniiToken.ner;
      guilgee.guilgeeKhiisenAjiltniiId = req.body.nevtersenAjiltniiToken.id;
    }
    var inc = {
      uldegdel: -(guilgee?.tulsunDun || 0),
    };
    if (guilgee.turul == "aldangi")
      inc["aldangiinUldegdel"] = -guilgee.tulsunAldangi;
    Geree(req.body.tukhainBaaziinKholbolt)
      .findByIdAndUpdate(
        { _id: guilgee.gereeniiId },
        {
          $push: {
            [`avlaga.guilgeenuud`]: guilgee,
          },
          $inc: inc,
        }
      )
      .then((result) => {
        daraagiinTulukhOgnooZasya(
          guilgee.gereeniiId,
          req.body.tukhainBaaziinKholbolt
        );
        if (guilgee.guilgeeniiId) {
          console.log("guilgee.guilgeeniiId", guilgee.guilgeeniiId);
          BankniiGuilgee(req.body.tukhainBaaziinKholbolt)
            .updateOne(
              { _id: guilgee.guilgeeniiId },
              {
                $set: {
                  kholbosonGereeniiId: guilgee.gereeniiId,
                  kholbosonTalbainId: result.talbainDugaar,
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
      });
  } catch (aldaa) {
    next(aldaa);
  }
});

exports.khuvaariUusgey = asyncHandler(async (req, res, next) => {
  try {
    var body = req.body;
    var dun = body.dun;
    var zardluud = body.zardluud;
    var khugatsaa = Number(body.khugatsaa) + 1;
    if (body.turGereeEsekh) khugatsaa = 1;
    var tulukhUdruud = body.tulukhUdruud;
    var ekhlekhOgnoo = new Date(body.ekhlekhOgnoo);
    var duusakhOgnoo = new Date(body.duusakhOgnoo);
    if (body.turGereeEsekh) tulukhUdruud = [ekhlekhOgnoo.getDate()];
    var butsaakhJagsaalt = [];
    var ognoo = new Date(ekhlekhOgnoo);
    var turOgnoo;
    var tukhainSar = new Date(moment(ognoo).set("date", 1));
    var suuliinUdur;
    var duussanEsekh = false;
    if (tulukhUdruud && tulukhUdruud.length > 1)
      tulukhUdruud.sort(function (a, b) {
        return a - b;
      });
    await new Array(khugatsaa).fill("").map((mur, index) => {
      tulukhUdruud.forEach((udur) => {
        if (!duussanEsekh) {
          console.log("tukhainSar", tukhainSar);
          suuliinUdur = moment(tukhainSar).endOf("month").date();
          console.log("suuliinUdur", suuliinUdur);
          if (suuliinUdur < udur) {
            turOgnoo = new Date(moment(tukhainSar).set("date", suuliinUdur));
            console.log("if ruu orson => ", turOgnoo);
          } else {
            turOgnoo = new Date(moment(tukhainSar).set("date", udur));
            console.log("else ruu orson => ", turOgnoo);
          }
          if (turOgnoo >= ekhlekhOgnoo) {
            if (
              turOgnoo.getMonth() == duusakhOgnoo.getMonth() &&
              turOgnoo.getFullYear() == duusakhOgnoo.getFullYear()
            )
              duussanEsekh = true;
            if (dun > 0)
              butsaakhJagsaalt.push({
                turul: "khuvaari",
                ognoo: turOgnoo,
                tulukhDun: dun,
                undsenDun: dun,
              });
            if (zardluud && zardluud.length > 0) {
              zardluud.forEach((zardal) => {
                if (zardal) {
                  if (zardal.turul == "1м2")
                    zardal.dun = tooZasyaSync(zardal.tariff * body.mk);
                  if (zardal.turul == "1м3/талбай")
                    zardal.dun = tooZasyaSync(zardal.tariff * body.metrKube);
                  if (zardal.turul == "Тогтмол") zardal.dun = zardal.tariff;
                  butsaakhJagsaalt.push({
                    turul: "avlaga",
                    tailbar: zardal.ner,
                    ognoo: turOgnoo,
                    tulukhDun: zardal.dun,
                  });
                }
              });
            }
          }
          ognoo = new Date(turOgnoo);
        }
      });
      tukhainSar = new Date(moment(tukhainSar).add(1, "month"));
    });
    res.send(butsaakhJagsaalt);
  } catch (aldaa) {
    next(aldaa);
  }
});

module.exports.tulultTaniya = async function tulultTaniya() {
  const { db } = require("zevbackv2");
  var kholboltuud = db.kholboltuud;
  if (kholboltuud) {
    for await (const kholbolt of kholboltuud) {
      var guilgeenuud = await BankniiGuilgee(kholbolt).find({
        createdAt: { $gte: new Date(new Date().getTime() - 5 * 60000) },
        $or: [
          {
            amount: { $gt: 0 },
          },
          {
            Amt: { $gt: 0 },
          },
        ],
      });
      var khaikhNukhtsul;
      var tailbar = [];
      if (guilgeenuud != null && guilgeenuud.length > 0) {
        try {
          guilgeenuud.forEach(async (x) => {
            if (
              (x.description && x.description.toLowerCase().includes("qpay")) ||
              (x.TxAddInf && x.TxAddInf.toLowerCase().includes("qpay"))
            ) {
              khaikhNukhtsul = [];
              if (x.description) tailbar = x.description.split(/,| /);
              else if (x.TxAddInf) tailbar = x.TxAddInf.split(/,| /);
              tailbar.forEach((y) => {
                khaikhNukhtsul.push({ gereeniiDugaar: y });
              });
              var oldsonGereenuud = await Geree(kholbolt).find({
                $or: khaikhNukhtsul,
                tuluv: 1,
                barilgiinId: guilgeenuud.barilgiinId,
              });
              if (oldsonGereenuud != null && oldsonGereenuud.length == 1) {
                x.kholbosonGereeniiId = [oldsonGereenuud[0]._id];
                x.isNew = false;
                x.save();
              }
            } else {
              khaikhNukhtsul = [];
              if (x.description) tailbar = x.description.split(" ");
              else if (x.TxAddInf) tailbar = x.TxAddInf.split(" ");
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
                khaikhNukhtsul.push({
                  talbainDugaar: { $regex: ".*" + y + ".*" },
                });
              });
              console.log(khaikhNukhtsul);
              var oldsonGereenuud = await Geree(kholbolt).find({
                $or: khaikhNukhtsul,
                tuluv: 1,
                barilgiinId: guilgeenuud.barilgiinId,
              });
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
            }
          });
        } catch (error) {
          next(error);
        }
      }
    }
  }
};

module.exports.aldangiBodyo = async function aldangiBodyo(
  baiguullagiinId = null
) {
  try {
    const { db } = require("zevbackv2");
    var kholboltuud = db.kholboltuud;
    if (kholboltuud) {
      var query = {
        "barilguud.tokhirgoo.aldangiinKhuvi": { $gt: 0 },
      };
      if (!!baiguullagiinId) {
        var ObjectId = require("mongodb").ObjectId;
        query["_id"] = new ObjectId(baiguullagiinId);
      }
      var baiguullaguud = await Baiguullaga(db.erunkhiiKholbolt)
        .find(query)
        .lean();
      if (baiguullaguud && baiguullaguud.length > 0) {
        for await (const baiguullaga of baiguullaguud) {
          var kholbolt = kholboltuud.find(
            (a) => a.baiguullagiinId == baiguullaga._id.toString()
          );
          console.log("kholbolt -> ", kholbolt);
          for await (const barilga of baiguullaga.barilguud) {
            console.log("aldangiBodyo -> barilguud ->");
            if (
              barilga.tokhirgoo &&
              barilga.tokhirgoo.aldangiinKhuvi &&
              barilga.tokhirgoo.aldangiBodojEkhlekhOgnoo &&
              barilga.tokhirgoo.aldangiBodojEkhlekhOgnoo < new Date()
            ) {
              console.log("aldangiBodyo -> barilga ->", barilga);
              var ognoo = new Date();
              var aldagiinKhuvi =
                barilga.tokhirgoo && barilga.tokhirgoo.aldangiinKhuvi
                  ? barilga.tokhirgoo.aldangiinKhuvi
                  : 0.5;
              var aldangiChuluulukhKhonog =
                barilga.tokhirgoo && barilga.tokhirgoo.aldangiChuluulukhKhonog
                  ? barilga.tokhirgoo.aldangiChuluulukhKhonog
                  : 0;
              if (aldangiChuluulukhKhonog > 0) {
                ognoo =
                  new Date().getTime() - 86400000 * aldangiChuluulukhKhonog;
                ognoo = new Date(ognoo);
              }
              var gereenuud = await Geree(kholbolt).aggregate([
                {
                  $match: {
                    barilgiinId: barilga._id.toString(),
                    daraagiinTulukhOgnoo: {
                      $lte: ognoo,
                    },
                  },
                },
                {
                  $unwind: {
                    path: "$avlaga.guilgeenuud",
                  },
                },
                {
                  $match: {
                    $or: [
                      {
                        $and: [
                          {
                            "avlaga.guilgeenuud.ognoo": {
                              $lte: new Date(),
                            },
                          },
                          {
                            "avlaga.guilgeenuud.tulsunDun": {
                              $gt: 0,
                            },
                          },
                        ],
                      },
                      {
                        "avlaga.guilgeenuud.ognoo": {
                          $lte: ognoo,
                        },
                      },
                    ],
                    "avlaga.guilgeenuud.turul": {
                      $nin: ["baritsaa"],
                    },
                  },
                },
                {
                  $group: {
                    _id: {
                      _id: "$_id",
                      daraagiinTulukhOgnoo: "$daraagiinTulukhOgnoo",
                    },
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
              ]);
              console.log("gereenuud", gereenuud.length);
              if (gereenuud && gereenuud.length > 0) {
                var bulkOps = [];
                for (const geree of gereenuud) {
                  if (
                    geree.uldegdel > 0 &&
                    new Date() >
                      new Date(
                        moment(new Date(geree._id.daraagiinTulukhOgnoo)).add(
                          aldangiChuluulukhKhonog,
                          "days"
                        )
                      )
                  ) {
                    var bodogdsonKhuu = tooZasyaSync(
                      (geree.uldegdel * aldagiinKhuvi) / 100
                    );
                    let upsertDoc = {
                      updateOne: {
                        filter: { _id: geree._id._id },
                        update: [
                          {
                            $set: {
                              aldangiinUldegdel: {
                                $add: [
                                  { $ifNull: ["$aldangiinUldegdel", 0] },
                                  bodogdsonKhuu,
                                ],
                              },
                            },
                          },
                        ],
                      },
                    };
                    bulkOps.push(upsertDoc);
                  } else continue;
                }
              }
            }
          }
          if (bulkOps && bulkOps.length > 0)
            await Geree(kholbolt)
              .bulkWrite(bulkOps)
              .then((bulkWriteOpResult) => {
                console.log("BULK update OK", bulkWriteOpResult);
              })
              .catch((err) => {
                console.log("BULK update error", err);
              });
        }
      }
    }
  } catch (error) {
    console.log("aldangiBodyo aldaa garlaa ==> ", error);
  }
};

async function tooZasya(too) {
  var zassanToo = (await Math.round((too + Number.EPSILON) * 100)) / 100;
  return +zassanToo.toFixed(2);
}

function tooZasyaSync(too) {
  var zassanToo = Math.round((too + Number.EPSILON) * 100) / 100;
  return +zassanToo.toFixed(2);
}

exports.tulultUstgaya = asyncHandler(async (req, res, next) => {
  if (!req.body.tailbar) throw new Error("Тайлбар заавал оруулна уу?");
  if (req.body.guilgeeniiId) {
    var bankGuilgee = await BankniiGuilgee(
      req.body.tukhainBaaziinKholbolt
    ).findOne({
      _id: req.body.guilgeeniiId,
    });
    if (bankGuilgee && bankGuilgee.ebarimtAvsanEsekh)
      throw new Error(
        "ИБаримт авсан гүйлгээг устгах боломжгүй! ИБаримтын гүйлгээг устгасны дараа устгах боломжтой!"
      );
  }
  const session = await req.body.tukhainBaaziinKholbolt.kholbolt.startSession();
  session.startTransaction();
  try {
    var ObjectId = require("mongodb").ObjectId;
    var ustgaxObject = await Geree(req.body.tukhainBaaziinKholbolt).aggregate([
      {
        $unwind: "$avlaga.guilgeenuud",
      },
      {
        $match: {
          _id: new ObjectId(req.body.gereeniiId),
          "avlaga.guilgeenuud._id": new ObjectId(req.body.objectiinId),
        },
      },
    ]);
    var tuxainGuilgee = ustgaxObject[0].avlaga.guilgeenuud;
    var inc = {
      uldegdel: tuxainGuilgee?.tulsunDun || 0,
    };
    if (tuxainGuilgee.tulsunAldangi && tuxainGuilgee.tulsunAldangi > 0)
      inc["aldangiinUldegdel"] = tuxainGuilgee.tulsunAldangi;

    await Geree(req.body.tukhainBaaziinKholbolt)
      .findByIdAndUpdate(
        { _id: req.body.gereeniiId },
        {
          $pull: {
            [`avlaga.guilgeenuud`]: {
              _id: req.body.objectiinId,
            },
          },
          $inc: inc,
        }
      )
      .catch((err) => {
        next(err);
      });

    if (tuxainGuilgee) {
      var ustsanBarimt = new UstsanBarimt(req.body.tukhainBaaziinKholbolt)();
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
      var dun = await tooZasya(
        (tuxainGuilgee.tulsunDun ? tuxainGuilgee.tulsunDun : 0) +
          (tuxainGuilgee.tulsunAldangi ? tuxainGuilgee.tulsunAldangi : 0)
      );
      await BankniiGuilgee(req.body.tukhainBaaziinKholbolt)
        .updateOne({ _id: req.body.guilgeeniiId }, [
          {
            $set: {
              kholbosonDun: {
                $add: [{ $ifNull: ["$kholbosonDun", 0] }, dun * -1],
              },
            },
          },
        ])
        .catch((err) => {
          next(err);
        });
      await BankniiGuilgee(req.body.tukhainBaaziinKholbolt)
        .updateOne(
          { _id: req.body.guilgeeniiId },
          {
            $pull: {
              kholbosonGereeniiId: req.body.gereeniiId,
              kholbosonTalbainId: req.body.talbainDugaar,
            },
          }
        )
        .catch((err) => {
          next(err);
        });
    }
    await session.commitTransaction();
    session.endSession();
    daraagiinTulukhOgnooZasya(
      req.body.gereeniiId,
      req.body.tukhainBaaziinKholbolt
    );
    res.send("Amjilttai");
  } catch (err) {
    await session.abortTransaction();
    next(err);
  }
});

exports.baritsaaniiGuilgeeUstgaya = asyncHandler(async (req, res, next) => {
  const session = await req.body.tukhainBaaziinKholbolt.kholbolt.startSession();
  session.startTransaction();
  try {
    await Geree(req.body.tukhainBaaziinKholbolt)
      .findByIdAndUpdate(
        { _id: req.body.gereeniiId },
        {
          $pull: {
            [`avlaga.guilgeenuud`]: {
              _id: req.body.objectiinId,
            },
            [`avlaga.baritsaa`]: {
              _id: req.body.objectiinId,
            },
          },
        }
      )
      .catch((err) => {
        next(err);
      });

    var updatedGeree = await Geree(req.body.tukhainBaaziinKholbolt)
      .findByIdAndUpdate({ _id: req.body.gereeniiId }, [
        {
          $set: {
            baritsaaniiUldegdel: {
              $add: [
                { $ifNull: ["$baritsaaniiUldegdel", 0] },
                req.body.zarlaga - req.body.orlogo,
              ],
            },
          },
        },
      ])
      .catch((err) => {
        next(err);
      });
    if (req.body.guilgeeniiId) {
      await BankniiGuilgee(req.body.tukhainBaaziinKholbolt)
        .updateOne({ _id: req.body.guilgeeniiId }, [
          {
            $set: {
              kholbosonDun: {
                $add: [
                  { $ifNull: ["$kholbosonDun", 0] },
                  req.body.zarlaga - req.body.orlogo,
                ],
              },
            },
          },
        ])
        .catch((err) => {
          next(err);
        });
      await BankniiGuilgee(req.body.tukhainBaaziinKholbolt)
        .updateOne(
          { _id: req.body.guilgeeniiId },
          {
            $pull: {
              kholbosonGereeniiId: req.body.gereeniiId,
              kholbosonTalbainId: updatedGeree.talbainDugaar,
            },
          }
        )
        .catch((err) => {
          next(err);
        });
    }
    await daraagiinTulukhOgnooZasya(
      req.body.gereeniiId,
      req.body.tukhainBaaziinKholbolt
    );
    await session.commitTransaction();
    session.endSession();
    res.send("Amjilttai");
  } catch (err) {
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
        tuluv: { $nin: [-1] },
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
          $nin: ["baritsaa"],
        },
      },
    },
    {
      $group: {
        _id: "aaa",
        tulukh: {
          $sum: {
            $ifNull: ["$avlaga.guilgeenuud.tulukhDun", 0],
          },
        },
        khyamdral: {
          $sum: {
            $ifNull: ["$avlaga.guilgeenuud.khyamdral", 0],
          },
        },
        tulsun: {
          $sum: {
            $ifNull: ["$avlaga.guilgeenuud.tulsunDun", 0],
          },
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
  Geree(req.body.tukhainBaaziinKholbolt)
    .aggregate(query)
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
    const session =
      await req.body.tukhainBaaziinKholbolt.kholbolt.startSession();
    session.startTransaction();
    try {
      var khungulult = new KhungulultiinTuukh(req.body.tukhainBaaziinKholbolt)(
        req.body
      );
      gereeniiDugaaruud = [];
      khungulult.khamaataiGereenuud.forEach((x) => {
        if (typeof x === "object") {
          gereeniiDugaaruud.push(x.gereeniiId);
        } else {
          gereeniiDugaaruud.push(x);
        }
      });
      khungulult.guilgeeKhiisenOgnoo = new Date();
      khungulult.guilgeeKhiisenAjiltniiNer =
        req.body.nevtersenAjiltniiToken?.ner;
      khungulult.guilgeeKhiisenAjiltniiId = req.body.nevtersenAjiltniiToken?.id;
      khariu = await khungulult.save();
      console.log("khariu", khariu);
      var gereenuud = await Geree(req.body.tukhainBaaziinKholbolt).find({
        _id: { $in: gereeniiDugaaruud },
      });
      for await (const geree of gereenuud) {
        khyamdraluud = [];
        var khungulultiinDun = khungulult.khamaataiGereenuud?.find(
          (x) => x.gereeniiId == geree._id
        )?.khymdarsanDun;
        for await (const ognoo of khungulult.ognoonuud) {
          khyamdral = {
            tulukhDun: 0,
            ognoo: ognoo,
            turul: "khungulult",
            khyamdral: khungulultiinDun,
            nemeltTailbar: khungulult.shaltgaan,
            tailbar: req.body.tailbar,
            khyamdraliinId: khariu._id,
            guilgeeKhiisenOgnoo: new Date(),
            guilgeeKhiisenAjiltniiNer: req.body.nevtersenAjiltniiToken?.ner,
            guilgeeKhiisenAjiltniiId: req.body.nevtersenAjiltniiToken?.id,
          };
          khyamdraluud.push(khyamdral);
        }
        await Geree(req.body.tukhainBaaziinKholbolt).updateOne(
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
    const session =
      await req.body.tukhainBaaziinKholbolt.kholbolt.startSession();
    session.startTransaction();
    try {
      var khungulult = await KhungulultiinTuukh(
        req.body.tukhainBaaziinKholbolt
      ).findOne({ _id: req.body.id });
      gereeniiDugaaruud = [];
      khungulult.khamaataiGereenuud.forEach((x) => {
        if (typeof x === "object") {
          gereeniiDugaaruud.push(x.gereeniiId);
        } else {
          gereeniiDugaaruud.push(x);
        }
      });
      for await (const gereeniiDugaar of gereeniiDugaaruud) {
        khyamdraluud = [];
        await Geree(req.body.tukhainBaaziinKholbolt).findOneAndUpdate(
          { _id: gereeniiDugaar },
          {
            $pull: { "avlaga.guilgeenuud": { khyamdraliinId: khungulult._id } },
          }
        );
      }
      var ustsanBarimt = new UstsanBarimt(req.body.tukhainBaaziinKholbolt)();
      ustsanBarimt.class = "khungulult";
      ustsanBarimt.tailbar = req.body.tailbar;
      ustsanBarimt.object = khungulult;
      if (req.body.nevtersenAjiltniiToken) {
        ustsanBarimt.ajiltniiNer = req.body.nevtersenAjiltniiToken.ner;
        ustsanBarimt.ajiltniiId = req.body.nevtersenAjiltniiToken.id;
      }
      ustsanBarimt.baiguullagiinId = khungulult.baiguullagiinId;
      await ustsanBarimt.save();
      await KhungulultiinTuukh(req.body.tukhainBaaziinKholbolt).deleteOne({
        _id: khungulult._id,
      });
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

exports.tukhainOgnoogoorZardalBodojOruulya = asyncHandler(
  async (req, res, next) => {
    try {
      var gereenuud = await Geree(req.body.tukhainBaaziinKholbolt).find({
        barilgiinId: req.body.barilgiinId,
      });
      var khariu = [];
      console.log("gereenuud", gereenuud);
      if (gereenuud)
        for await (const element of gereenuud) {
          if (element.zardluud && element.zardluud.length > 0) {
            var butsaakhJagsaalt = [];
            element.zardluud.forEach((zardal) => {
              if (zardal) {
                if (zardal.turul == "1м2")
                  zardal.dun = tooZasyaSync(
                    zardal.tariff * geree.talbainKhemjee
                  );
                if (zardal.turul == "1м3/талбай")
                  zardal.dun = tooZasyaSync(
                    zardal.tariff * geree.talbainKhemjeeMetrKube
                  );
                if (zardal.turul == "Тогтмол") zardal.dun = zardal.tariff;
                butsaakhJagsaalt.push({
                  turul: "avlaga",
                  tailbar: zardal.ner,
                  tulukhDun: zardal.dun,
                  ognoo: moment(req.body.duusakhOgnoo).set(
                    "date",
                    element.tulukhUdur[0]
                  ),
                });
              }
            });
            Geree(req.body.tukhainBaaziinKholbolt)
              .updateOne(
                { _id: element._id },
                {
                  $push: {
                    ["avlaga.guilgeenuud"]: {
                      $each: butsaakhJagsaalt,
                    },
                  },
                }
              )
              .then(async (result) => {
                console.log("result", result);
                khariu.push(result);
              });
          }
        }
      res.send(khariu);
    } catch (err) {
      next(err);
    }
  }
);

exports.tukhainOgnoogoorAvlagaBodojOruulya = asyncHandler(
  async (req, res, next) => {
    try {
      var gereenuud = await Geree(req.body.tukhainBaaziinKholbolt)
        .find({
          tuluv: 1,
          baiguullagiinId: req.body.baiguullagiinId,
        })
        .select("+avlaga");
      var khariu = [];
      var object;
      if (gereenuud)
        for await (const element of gereenuud) {
          var oruulakhOgnoo = moment(req.body.duusakhOgnoo).set(
            "date",
            element.tulukhUdur[0]
          );
          object = {
            tulukhDun: element.sariinTurees,
            undsenDun: element.sariinTurees,
            turul: "khuvaari",
            ognoo: oruulakhOgnoo,
            khyamdral: 0,
          };
          console.log("object", object);
          var baigaa = element?.avlaga?.guilgeenuud?.find((a) => {
            return (
              a.undsenDun == element.sariinTurees &&
              a.tulukhDun == element.sariinTurees &&
              moment(a.ognoo).isSame(oruulakhOgnoo, "day")
            );
          });
          if (!baigaa) {
            var result = await Geree(req.body.tukhainBaaziinKholbolt).updateOne(
              { _id: element._id },
              {
                $push: {
                  ["avlaga.guilgeenuud"]: object,
                },
              }
            );
            khariu.push(result);
          }
        }
      res.send(khariu);
    } catch (err) {
      next(err);
    }
  }
);

exports.tukhainOgnoogoorAvlagaZasajOruulya = asyncHandler(
  async (req, res, next) => {
    try {
      var gereenuud = await Geree(req.body.tukhainBaaziinKholbolt).find({
        barilgiinId: req.body.barilgiinId,
        "talbainIdnuud.1": { $exists: true },
      });
      var khariu = [];
      console.log("gereenuud", gereenuud.length);
      if (gereenuud)
        for await (const element of gereenuud) {
          await Geree(req.body.tukhainBaaziinKholbolt).findOneAndUpdate(
            { gereeniiDugaar: element.gereeniiDugaar },
            {
              $set: {
                "avlaga.guilgeenuud.$[t].tulukhDun": element.sariinTurees,
                "avlaga.guilgeenuud.$[t].undsenDun": element.sariinTurees,
              },
            },
            {
              arrayFilters: [
                {
                  "t.turul": "khuvaari",
                  "t.ognoo": {
                    $gte: new Date(req.body.ekhlekhOgnoo),
                    $lte: new Date(req.body.duusakhOgnoo),
                  },
                },
              ],
            }
          );
        }
      res.send(khariu);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
);

exports.talbainIdnuudOruulya = asyncHandler(async (req, res, next) => {
  try {
    var gereenuud = await Geree(req.body.tukhainBaaziinKholbolt).find({
      talbainDugaar: { $exists: true },
      $or: [
        {
          "talbainIdnuud.0": { $exists: false },
        },
        {
          talbainIdnuud: { $exists: false },
        },
      ],
    });
    var bulkOps = [];
    if (gereenuud)
      for await (const element of gereenuud) {
        var dugaaruud = element.talbainDugaar.split(",");
        var talbainuud = await Talbai(req.body.tukhainBaaziinKholbolt)
          .find({
            kod: { $in: dugaaruud },
            barilgiinId: element.barilgiinId,
          })
          .lean();
        console.log("talbainuud", talbainuud);
        if (talbainuud && talbainuud.length > 0) {
          var idnuud = talbainuud.map((a) => a._id);
          let upsertDoc = {
            updateOne: {
              filter: { _id: element._id },
              update: { talbainIdnuud: idnuud },
            },
          };
          console.log("upsertDoc", upsertDoc);
          bulkOps.push(upsertDoc);
        }
      }
    await Geree(req.body.tukhainBaaziinKholbolt)
      .bulkWrite(bulkOps)
      .then((bulkWriteOpResult) => {
        console.log("BULK ==>", bulkOps);
        console.log("BULK update OK", bulkWriteOpResult);
      })
      .catch((err) => {
        console.log("BULK ==>", bulkOps);
        console.log("BULK update error", err);
      });
    res.send("zasagdsanToo : " + gereenuud.length);
  } catch (err) {
    next(err);
  }
});

exports.bankniiGuilgeegeerOruulya = asyncHandler(async (req, res, next) => {
  try {
    var ekhlekhOgnoo = new Date(req.body.ekhlekhOgnoo);
    var duusakhOgnoo = new Date(req.body.duusakhOgnoo);
    var guilgeenuud = await BankniiGuilgee(
      req.body.tukhainBaaziinKholbolt
    ).find({
      "kholbosonGereeniiId.0": { $exists: true },
      TxPostDate: { $gte: ekhlekhOgnoo, $lte: duusakhOgnoo },
    });
    console.log("guilgeenuud", guilgeenuud);
    var oldooguiGuilgeenuud = [];
    for await (const guilgee of guilgeenuud) {
      var geree = await Geree(req.body.tukhainBaaziinKholbolt).findOne({
        $or: [
          { "avlaga.guilgeenuud.guilgeeniiId": guilgee._id },
          { "avlaga.baritsaa.guilgeeniiId": guilgee._id },
        ],
      });
      if (!geree) oldooguiGuilgeenuud.push(guilgee._id);
    }
    res.send(oldooguiGuilgeenuud);
  } catch (err) {
    next(err);
  }
});

exports.aldaataiBankniiGuilgeeZasya = asyncHandler(async (req, res, next) => {
  try {
    var idnuud = req.body.idnuud;
    console.log("idnuud", idnuud);
    var ObjectId = require("mongodb").ObjectId;
    var guilgeenuud = await BankniiGuilgee(
      req.body.tukhainBaaziinKholbolt
    ).find({ _id: { $in: idnuud } });
    for await (const guilgee of guilgeenuud) {
      var geree = await Geree(req.body.tukhainBaaziinKholbolt).findOne({
        $or: [
          { "avlaga.guilgeenuud.guilgeeniiId": guilgee._id },
          { "avlaga.baritsaa.guilgeeniiId": guilgee._id },
        ],
      });
      if (!geree) {
        var oruulakhObject = {
          turul: "bank",
          ognoo: guilgee.TxPostDate ? guilgee.TxPostDate : guilgee.postDate,
          tulsunDun: guilgee.Amt ? guilgee.Amt : guilgee.amount,
          guilgeeniiId: guilgee._id,
          dansniiDugaar: guilgee.dansniiDugaar,
          tulsunDans: guilgee.CtAcntOrg
            ? guilgee.CtAcntOrg
            : guilgee.relatedAccount,
        };
        await Geree(req.body.tukhainBaaziinKholbolt).updateOne(
          { _id: new ObjectId(guilgee.kholbosonGereeniiId[0]) },
          {
            $push: {
              ["avlaga.guilgeenuud"]: oruulakhObject,
            },
          }
        );
      }
    }
    res.send("Amjilttai");
  } catch (err) {
    next(err);
  }
});

exports.qpayGuilgeeGereeOnooyo = asyncHandler(async (req, res, next) => {
  try {
    var qpayGuilgeenuud = await BankniiGuilgee(
      req.body.tukhainBaaziinKholbolt
    ).find({
      $and: [
        {
          kholbosonGereeniiId: [],
        },
        {
          $or: [
            {
              $and: [
                {
                  TxAddInf: { $regex: "qpay", $options: "i" },
                },
                {
                  TxAddInf: { $regex: "Түрээсийн төлбөр", $options: "i" },
                },
              ],
            },
            {
              $and: [
                {
                  description: { $regex: "qpay", $options: "i" },
                },
                {
                  description: { $regex: "Түрээсийн төлбөр", $options: "i" },
                },
              ],
            },
          ],
        },
      ],
    });
    var khaikhNukhtsul;
    for await (const x of qpayGuilgeenuud) {
      khaikhNukhtsul = [];
      var tailbar;
      if (x.description) tailbar = x.description.split(/,| /);
      else if (x.TxAddInf) tailbar = x.TxAddInf.split(/,| /);
      tailbar.forEach((y) => {
        khaikhNukhtsul.push({ gereeniiDugaar: y });
      });
      var oldsonGereenuud = await Geree(req.body.tukhainBaaziinKholbolt).find({
        $or: khaikhNukhtsul,
        tuluv: 1,
        barilgiinId: x.barilgiinId,
      });
      if (oldsonGereenuud != null && oldsonGereenuud.length == 1) {
        x.kholbosonGereeniiId = [oldsonGereenuud[0]._id];
        x.isNew = false;
        x.save();
      }
    }
    res.send("Amjilttai");
  } catch (err) {
    next(err);
  }
});

exports.qpayGuilgeeTalbainDugaarOnooyo = asyncHandler(
  async (req, res, next) => {
    try {
      var guilgeenuud = await BankniiGuilgee(
        req.body.tukhainBaaziinKholbolt
      ).find({
        $and: [
          {
            "kholbosonGereeniiId.0": { $exists: true },
          },
          {
            kholbosonTalbainId: [],
          },
          {
            $or: [
              {
                $and: [
                  {
                    TxAddInf: { $regex: "qpay", $options: "i" },
                  },
                  {
                    TxAddInf: { $regex: "Түрээсийн төлбөр", $options: "i" },
                  },
                ],
              },
              {
                $and: [
                  {
                    description: { $regex: "qpay", $options: "i" },
                  },
                  {
                    description: { $regex: "Түрээсийн төлбөр", $options: "i" },
                  },
                ],
              },
            ],
          },
        ],
      });
      for await (const guilgee of guilgeenuud) {
        var oldsonGeree = await Geree(req.body.tukhainBaaziinKholbolt).findById(
          guilgee.kholbosonGereeniiId[0]
        );
        if (oldsonGeree) {
          await BankniiGuilgee(req.body.tukhainBaaziinKholbolt).updateOne(
            { _id: guilgee._id },
            {
              $set: {
                kholbosonTalbainId: [oldsonGeree.talbainDugaar],
              },
            }
          );
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
      var gereenuud = await Geree(req.body.tukhainBaaziinKholbolt)
        .find({
          barilgiinId: req.body.barilgiinId,
          "avlaga.guilgeenuud.0": {
            $exists: true,
          },
          "tulukhUdur.0": {
            $exists: true,
          },
        })
        .select("+avlaga");
      var ajillakhGereenuud = [];
      for await (const x of gereenuud) {
        var tukhainSariinMur = await x.avlaga.guilgeenuud.find(
          (a) =>
            a.ognoo > new Date(req.body.ekhlekhOgnoo) &&
            a.ognoo < new Date(req.body.duusakhOgnoo) &&
            a.undsenDun > 0
        );
        console.log("tukhainSariinMur", tukhainSariinMur);
        if (!tukhainSariinMur) ajillakhGereenuud.push(x);
      }
      var khariu = [];
      console.log("ajillakhGereenuud", ajillakhGereenuud);
      var object;
      var duusakhOgnoo = new Date(req.body.duusakhOgnoo);
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
          await Geree(req.body.tukhainBaaziinKholbolt)
            .updateOne(
              { _id: element._id },
              {
                $push: {
                  ["avlaga.guilgeenuud"]: object,
                },
              }
            )
            .then(async (result) => {
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

exports.gereenuudedZalruulgaOruulya = asyncHandler(async (req, res, next) => {
  try {
    var bodokhOgnoo = new Date(req.body.bodokhOgnoo);
    var oruulakhOgnoo = new Date(req.body.oruulakhOgnoo);
    var baiguullagiinId = req.body.baiguullagiinId;
    var barilgiinId = req.body.barilgiinId;
    var zoruu = 0;
    objectuud = req.body.objectuud;
    var khariu = [];
    var object;
    if (
      !req.body.bodokhOgnoo ||
      !req.body.oruulakhOgnoo ||
      !req.body.barilgiinId ||
      !req.body.oruulakhOgnoo ||
      !req.body.objectuud
    )
      throw new Error("Талбар дутуу!");
    if (objectuud)
      for await (const element of objectuud) {
        var geree = await Geree(req.body.tukhainBaaziinKholbolt).aggregate([
          {
            $unwind: {
              path: "$avlaga.guilgeenuud",
            },
          },
          {
            $match: {
              baiguullagiinId: baiguullagiinId,
              barilgiinId: barilgiinId,
              talbainDugaar: element.gereeniiDugaar,
              tuluv: 1,
              "avlaga.guilgeenuud.ognoo": {
                $lte: bodokhOgnoo,
              },
            },
          },
          {
            $project: {
              gereeniiDugaar: "$gereeniiDugaar",
              tulukhDun: {
                $subtract: [
                  {
                    $ifNull: ["$avlaga.guilgeenuud.tulukhDun", 0],
                  },
                  {
                    $sum: [
                      {
                        $ifNull: ["$avlaga.guilgeenuud.tulsunDun", 0],
                      },
                      {
                        $ifNull: ["$avlaga.guilgeenuud.khyamdral", 0],
                      },
                    ],
                  },
                ],
              },
            },
          },
          {
            $group: {
              _id: "$gereeniiDugaar",
              uldegdel: {
                $sum: "$tulukhDun",
              },
            },
          },
        ]);
        if (geree && geree.length > 0 && geree[0].uldegdel !== element.dun) {
          console.log("geree", geree);
          console.log("element", element);
          zoruu = element.dun - geree[0].uldegdel;
          if (zoruu !== 0) {
            object = {
              tulukhDun: zoruu > 0 ? zoruu : 0,
              tulsunDun: zoruu < 0 ? zoruu * -1 : 0,
              ognoo: oruulakhOgnoo,
              tailbar: "Залруулга гүйлгээ",
              turul: "System",
              guilgeeKhiisenAjiltniiNer: "System",
              khyamdral: 0,
            };
            await Geree(req.body.tukhainBaaziinKholbolt)
              .updateOne(
                { gereeniiDugaar: geree[0]._id },
                {
                  $push: {
                    ["avlaga.guilgeenuud"]: object,
                  },
                }
              )
              .then(async (result) => {
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
});

exports.tsutsalgdanGuilgeeZasya = asyncHandler(async (req, res, next) => {
  try {
    var query = [
      {
        $unwind: {
          path: "$gereeniiTuukhuud",
        },
      },
      {
        $match: {
          tuluv: -1,
          "gereeniiTuukhuud.turul": "Tsutslakh",
        },
      },
      {
        $group: {
          _id: "$_id",
          ognoo: {
            $max: "$gereeniiTuukhuud.khiisenOgnoo",
          },
        },
      },
    ];
    var jagsaalt = await Geree(req.body.tukhainBaaziinKholbolt).aggregate(
      query
    );
    if (jagsaalt && jagsaalt.length > 0) {
      var bulkOps = [];
      for await (const x of jagsaalt) {
        let upsertDoc = {
          updateOne: {
            filter: { _id: x._id },
            update: {
              $pull: {
                "avlaga.guilgeenuud": {
                  ognoo: { $gte: x.ognoo },
                  undsenDun: { $gte: 0 },
                },
              },
            },
            multi: true,
          },
        };
        bulkOps.push(upsertDoc);
      }
      await Geree(req.body.tukhainBaaziinKholbolt)
        .bulkWrite(bulkOps)
        .then((bulkWriteOpResult) => {
          console.log("BULK ==>", bulkOps);
          console.log("BULK update OK", bulkWriteOpResult);
        })
        .catch((err) => {
          console.log("BULK ==>", bulkOps);
          console.log("BULK update error", err);
        });
      res.send(jagsaalt.length.toString());
    } else res.send("0");
  } catch (err) {
    next(err);
  }
});

exports.tukhainOgnoogoorGuilgeegOruulya = asyncHandler(
  async (req, res, next) => {
    try {
      var guilgeenuud = await BankniiGuilgee(
        req.body.tukhainBaaziinKholbolt
      ).find({
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
          var geree = await Geree(req.body.tukhainBaaziinKholbolt).findOne({
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
            await Geree(req.body.tukhainBaaziinKholbolt)
              .findByIdAndUpdate(
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

exports.testiinBankniiGuilgee = asyncHandler(async (req, res, next) => {
  try {
    console.log("testiinBankniiGuilgee");
    if (!req.body.dans || !req.body.barilgiinId)
      throw new Error("dans, barilgiinId alga!");
    var guilgeenuud = await BankniiGuilgee(
      req.body.tukhainBaaziinKholbolt
    ).find({
      createdAt: {
        $gte: new Date(req.body.ekhlekhOgnoo),
        $lte: new Date(req.body.duusakhOgnoo),
      },
      dansniiDugaar: req.body.dans,
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
    var khariu = await BankniiGuilgee(
      req.body.tukhainBaaziinKholbolt
    ).insertMany(guilgeenuud);
    res.send(khariu);
  } catch (err) {
    next(err);
  }
});

exports.testiinBankniiGuilgeeOruulya = asyncHandler(async (req, res, next) => {
  try {
    if (!req.body.dans || !req.body.barilgiinId)
      throw new Error("dans, barilgiinId alga!");
    var guilgeenuud = [];
    var guilgee = new BankniiGuilgee(req.body.tukhainBaaziinKholbolt)();
    for (let i = 1; i <= 10; i++) {
      guilgee = new BankniiGuilgee(req.body.tukhainBaaziinKholbolt)();
      if (req.body.bank == "tdb") {
        guilgee.TxDt = req.body.ognoo;
        guilgee.TxPostDate = req.body.ognoo;
        guilgee.CtAcct = "5012345678";
        guilgee.CtActnName = "TEST DANS";
        guilgee.Amt = i < 6 ? i * 100000 : i * -100000;
        guilgee.TxAddInf = "Test " + i.toString();
        guilgee.CtAcntOrg = "TEST DANS";
      } else {
        guilgee.tranDate = req.body.ognoo;
        guilgee.postDate = req.body.ognoo;
        guilgee.code = i;
        guilgee.record = i;
        guilgee.amount = i < 6 ? i * 100000 : i * -100000;
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
      guilgee.dansniiDugaar = req.body.dans;
      guilgeenuud.push(guilgee);
    }
    var khariu = await BankniiGuilgee(
      req.body.tukhainBaaziinKholbolt
    ).insertMany(guilgeenuud);
    res.send(khariu);
  } catch (err) {
    next(err);
  }
});

exports.gereeAutomataarSungaya = asyncHandler(async (req, res, next) => {
  try {
    const { db } = require("zevbackv2");
    var kholboltuud = db.kholboltuud;
    if (kholboltuud) {
      for await (const kholbolt of kholboltuud) {
        var baiguullaguud = await Baiguullaga(db.erunkhiiKholbolt).find({
          "tokhirgoo.gereeAvtomataarSungakhEsekh": true,
        });
        var tulultiinJagsaalt = [];
        if (baiguullaguud)
          for await (const baiguullaga of baiguullaguud) {
            console.log("baiguullaga", baiguullaga);
            var gereenuud = await Geree(kholbolt).find({
              tuluv: {
                $ne: -1,
              },
              baiguullagiinId: baiguullaga._id,
              duusakhOgnoo: {
                $lte: new Date(),
              },
            });
            if (gereenuud) {
              for await (const geree of gereenuud) {
                tulultiinJagsaalt = [];
                var shineDuusakhOgnoo = new Date(
                  moment(geree.duusakhOgnoo).add(geree.khugatsaa, "month")
                );
                await new Array(geree.khugatsaa).fill("").map((mur, index) => {
                  geree.tulukhUdur.forEach((udur) => {
                    var ognoo = new Date();
                    var uusgexOgnoo = moment(ognoo)
                      .add(index, "month")
                      .set("date", udur);
                    if (uusgexOgnoo <= moment(geree.duusakhOgnoo))
                      tulultiinJagsaalt.push({
                        ognoo: moment(ognoo)
                          .add(index, "month")
                          .set("date", udur),
                        khyamdral: 0,
                        undsenDun: geree.sariinTurees,
                        tulukhDun: geree.sariinTurees,
                      });
                  });
                });
                var shineDuusakhOgnoo = new Date(
                  moment(geree.duusakhOgnoo).add(geree.khugatsaa, "month")
                );
                if (tulultiinJagsaalt)
                  await Geree(kholbolt)
                    .findByIdAndUpdate(
                      { _id: geree._id },
                      {
                        $push: {
                          [`avlaga.guilgeenuud`]: {
                            $each: tulultiinJagsaalt,
                          },
                          [`gereeniiTuukhuud`]: geree,
                        },
                        $set: {
                          duusakhOgnoo: shineDuusakhOgnoo,
                        },
                      }
                    )
                    .catch((err) => {
                      console.log(err);
                      if (next) next(err);
                    });
                console.log("tulultiinJagsaalt", tulultiinJagsaalt);
              }
            }
            console.log("iim toonii geree sungalaa", gereenuud.length);
          }
      }
    }
    if (res) res.send(khariu);
  } catch (err) {
    console.log(err);
    if (next) next(err);
  }
});

async function daraagiinTulukhOgnooZasya(gereeniiId, tukhainBaaziinKholbolt) {
  var geree = await Geree(tukhainBaaziinKholbolt)
    .findById(gereeniiId)
    .select("avlaga");
  var jagsaalt = [];
  if (lodash.isArray(lodash.get(geree, "avlaga.guilgeenuud"))) {
    jagsaalt = lodash.get(geree, "avlaga.guilgeenuud");
  }
  jagsaalt = lodash.filter(jagsaalt, (a) => a.turul != "baritsaa");
  var niitTulsunDun = lodash.sumBy(jagsaalt, function (object) {
    if (object.ognoo < new Date()) return object.tulsunDun;
    else return 0;
  });
  var niitKhyamdral = lodash.sumBy(jagsaalt, function (object) {
    if (object.ognoo < new Date()) return object.khyamdral;
    else return 0;
  });
  niitTulsunDun = niitTulsunDun + niitKhyamdral;
  jagsaalt = lodash.filter(jagsaalt, (a) => a.tulukhDun != null);
  jagsaalt = lodash.orderBy(jagsaalt, ["ognoo"], ["asc"]);
  var tulukhOgnoo;
  if (jagsaalt && jagsaalt.length > 0) tulukhOgnoo = jagsaalt[0].ognoo;
  jagsaalt.forEach((element) => {
    if (niitTulsunDun >= 0) {
      tulukhOgnoo = element.ognoo;
      niitTulsunDun = niitTulsunDun - element.tulukhDun;
    }
  });
  Geree(tukhainBaaziinKholbolt)
    .findByIdAndUpdate(gereeniiId, {
      $set: { daraagiinTulukhOgnoo: tulukhOgnoo },
    })
    .then((result) => {
      console.log("amjilttai", result);
    })
    .catch((err) => {
      console.log("aldaatai", err);
    });
}

exports.tulukhOgnooZasya = asyncHandler(async (req, res, next) => {
  try {
    var idnuud = req.body.idnuud;
    console.log("idnuud");
    for await (const id of idnuud) {
      await daraagiinTulukhOgnooZasya(id, req.body.tukhainBaaziinKholbolt);
    }
    res.send("Amjilttai");
  } catch (err) {
    console.log(err);
    if (next) next(err);
  }
});

exports.gereenuudedAvlagaOruulya = asyncHandler(async (req, res, next) => {
  try {
    var oruulakhOgnoo = new Date(req.body.oruulakhOgnoo);
    var objectuud = req.body.objectuud;
    var turul = req.body.turul ? req.body.turul : "khuvaari";
    var khariu = [];
    var object;
    if (!req.body.oruulakhOgnoo || !req.body.objectuud)
      throw new Error("Талбар дутуу!");
    if (objectuud)
      for await (const element of objectuud) {
        var geree = await Geree(req.body.tukhainBaaziinKholbolt)
          .findOne({
            gereeniiDugaar: element.gereeniiDugaar,
            tuluv: 1,
          })
          .select("+avlaga");
        var baigaa = geree?.avlaga?.guilgeenuud?.find((a) => {
          return (
            a.turul == turul &&
            a.tulukhDun == element.dun &&
            a.ognoo == oruulakhOgnoo
          );
        });
        if (geree && !baigaa) {
          object = {
            tulukhDun: element.dun,
            ognoo: oruulakhOgnoo,
            negj: element.negj,
            khemjikhNegj: element?.khemjikhNegj,
            tariff: element?.tariff,
            suuliinZaalt: element.suuliinZaalt ? element.suuliinZaalt : 0,
            umnukhZaalt: element.umnukhZaalt ? element.umnukhZaalt : 0,
            tailbar: element.tailbar,
            turul,
          };
          await Geree(req.body.tukhainBaaziinKholbolt)
            .updateOne(
              { gereeniiDugaar: geree.gereeniiDugaar, tuluv: 1 },
              {
                $push: {
                  ["avlaga.guilgeenuud"]: object,
                },
              }
            )
            .then(async (result) => {
              console.log("result", result);
              khariu.push(result);
            });
        }
      }
    res.send(khariu);
  } catch (err) {
    next(err);
  }
});

exports.khungulultNukhujOruulya = asyncHandler(async (req, res, next) => {
  try {
    var khariu = [];
    var gereenuud = await Geree(req.body.tukhainBaaziinKholbolt)
      .find({
        tuluv: 1,
        "avlaga.guilgeenuud.khyamdral": { $gt: 0 },
      })
      .select("+avlaga")
      .lean();
    if (gereenuud)
      for await (const geree of gereenuud) {
        if (geree) {
          var objectuud = [];
          if (geree?.avlaga?.guilgeenuud) {
            var guilgeenuud = geree.avlaga.guilgeenuud.filter(
              (x) => x.ognoo < new Date(2024, 0, 2) && x.khyamdral > 0
            );
            console.log("guilgeenuud", guilgeenuud);
            if (!!guilgeenuud) {
              for await (const mur of guilgeenuud) {
                objectuud.push({
                  ognoo: new Date(2023, 11, 1),
                  khyamdral: mur.khyamdral,
                  tailbar: mur.tailbar,
                  nemeltTailbar: mur.nemeltTailbar,
                  turul: "khungulult",
                });
              }
            }
          }
          if (objectuud && objectuud.length > 0) {
            await Geree(req.body.tukhainBaaziinKholbolt)
              .updateOne(
                { gereeniiDugaar: geree.gereeniiDugaar, tuluv: 1 },
                {
                  $push: {
                    ["avlaga.guilgeenuud"]: {
                      $each: objectuud,
                    },
                  },
                }
              )
              .then(async (result) => {
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
});

exports.talbainKubeOruulya = asyncHandler(async (req, res, next) => {
  try {
    var gereenuud = await Geree(req.body.tukhainBaaziinKholbolt)
      .find({
        tuluv: 1,
        "zardluud.turul": "1м3/талбай",
        talbainKhemjeeMetrKube: { $exists: false },
      })
      .lean();
    if (gereenuud)
      for await (const geree of gereenuud) {
        var talbai = await Talbai(req.body.tukhainBaaziinKholbolt).findOne({
          baiguullagiinId: geree.baiguullagiinId,
          kod: geree.talbainDugaar,
        });
        if (!!talbai) {
          await Geree(req.body.tukhainBaaziinKholbolt).updateOne(
            { _id: geree._id },
            { talbainKhemjeeMetrKube: talbai.talbainKhemjeeMetrKube }
          );
        }
      }
    res.send({ too: gereenuud.length });
  } catch (err) {
    next(err);
  }
});

exports.gereenuudZasya = asyncHandler(async (req, res, next) => {
  try {
    var gereenuud = await Geree(req.body.tukhainBaaziinKholbolt)
      .find({
        tuluv: { $ne: -1 },
      })
      .select("+avlaga +gereeniiTuukhuud");
    if (gereenuud) {
      var ashiglaltiinZardluud = await AshiglaltiinZardluud(
        req.body.tukhainBaaziinKholbolt
      ).find({
        baiguullagiinId: req.body.baiguullagiinId,
      });
      for await (const geree of gereenuud) {
        var talbai = await Talbai(req.body.tukhainBaaziinKholbolt).findOne({
          baiguullagiinId: geree.baiguullagiinId,
          kod: geree.talbainDugaar,
        });
        if (!!geree.zardluud && !!ashiglaltiinZardluud) {
          for await (const zardal of geree.zardluud) {
            var tukhainZardal = ashiglaltiinZardluud.find(
              (x) => x.ner == zardal.ner
            );
            if (!!tukhainZardal) {
              zardal.turul = tukhainZardal.turul;
              zardal.tariff = tukhainZardal.tariff;
              zardal.suuriKhuraamj = tukhainZardal.suuriKhuraamj;
            }
          }
        }
        var khuvaariud = geree.avlaga.guilgeenuud;
        khuvaariud = khuvaariud.filter(
          (x) =>
            x.ognoo <= new Date() || x.turul == "khyamdral" || x.khyamdral > 0
        );
        var today = new Date();
        var unuudur = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          0,
          0,
          0
        );
        new Array((geree.khugatsaa || 0) + 12).fill("").map((mur, index) => {
          geree.tulukhUdur.forEach((udur) => {
            if (
              moment(unuudur).add(index, "month").set("date", udur) <=
                moment(geree.duusakhOgnoo) &&
              moment(unuudur).add(index, "month").set("date", udur) >
                moment(new Date())
            ) {
              var tukhainUdur = moment(unuudur)
                .add(index, "month")
                .set("date", udur);
              //undsen tulultiin xuwaari)
              var baigaa = khuvaariud.find((a) => {
                return (
                  a.turul == "khuvaari" &&
                  a.tulukhDun == talbai.talbainNiitUne &&
                  moment(a.ognoo).isSame(tukhainUdur, "day")
                );
              });
              if (!baigaa && talbai.talbainNiitUne > 0)
                khuvaariud.push({
                  ognoo: tukhainUdur,
                  khyamdral: 0,
                  turul: "khuvaari",
                  undsenDun: talbai.talbainNiitUne,
                  tulukhDun: talbai.talbainNiitUne,
                });
              if (!!geree.zardluud && geree.zardluud.length > 0) {
                geree.zardluud.forEach((zardal) => {
                  if (
                    zardal.turul == "1м3/талбай" &&
                    talbai.talbainKhemjeeMetrKube > 0
                  ) {
                    baigaa = khuvaariud.find((a) => {
                      return (
                        a.turul == "avlaga" &&
                        a.tulukhDun ==
                          tooZasyaSync(
                            zardal.tariff * talbai.talbainKhemjeeMetrKube
                          ) &&
                        moment(a.ognoo).isSame(tukhainUdur, "day") &&
                        a.tailbar == zardal.ner
                      );
                    });
                    if (!baigaa)
                      khuvaariud.push({
                        ognoo: tukhainUdur,
                        khyamdral: 0,
                        turul: "avlaga",
                        tailbar: zardal.ner,
                        tulukhDun: tooZasyaSync(
                          zardal.tariff * talbai.talbainKhemjeeMetrKube
                        ),
                      });
                  } else if (
                    zardal.turul == "1м2" &&
                    talbai.talbainKhemjee > 0
                  ) {
                    baigaa = khuvaariud.find((a) => {
                      return (
                        a.turul == "avlaga" &&
                        a.tulukhDun ==
                          tooZasyaSync(zardal.tariff * talbai.talbainKhemjee) &&
                        moment(a.ognoo).isSame(tukhainUdur, "day") &&
                        a.tailbar == zardal.ner
                      );
                    });
                    if (!baigaa)
                      khuvaariud.push({
                        ognoo: tukhainUdur,
                        khyamdral: 0,
                        turul: "avlaga",
                        tailbar: zardal.ner,
                        tulukhDun: tooZasyaSync(
                          zardal.tariff * talbai.talbainKhemjee
                        ),
                      });
                  } else if (zardal.turul == "Тогтмол") {
                    baigaa = khuvaariud.find((a) => {
                      return (
                        a.turul == "avlaga" &&
                        a.tulukhDun == zardal.tariff &&
                        moment(a.ognoo).isSame(tukhainUdur, "day") &&
                        a.tailbar == zardal.ner
                      );
                    });
                    if (!baigaa)
                      khuvaariud.push({
                        ognoo: tukhainUdur,
                        khyamdral: 0,
                        turul: "avlaga",
                        tailbar: zardal.ner,
                        tulukhDun: zardal.tariff,
                      });
                  }
                });
              }
            }
          });
        });
        await Geree(req.body.tukhainBaaziinKholbolt).findOneAndUpdate(
          { _id: geree._id },
          {
            $set: {
              "avlaga.guilgeenuud": khuvaariud,
              talbainDugaar: talbai.kod,
              talbainNegjUne: talbai.talbainNegjUne,
              talbainNiitUne: talbai.talbainNiitUne,
              sariinTurees: talbai.talbainNiitUne,
              talbainKhemjee: talbai.talbainKhemjee,
              davkhar: talbai.davkhar,
            },
          }
        );
      }
    }
    res.send({ too: gereenuud.length });
  } catch (err) {
    next(err);
  }
});

exports.fcZasvarKhiie = asyncHandler(async (req, res, next) => {
  try {
    var gereenuud = await Geree(req.body.tukhainBaaziinKholbolt)
      .find({
        barilgiinId: req.body.barilgiinId,
        "avlaga.guilgeenuud.0": {
          $exists: true,
        },
        "tulukhUdur.0": {
          $exists: true,
        },
      })
      .select("+avlaga");
    var bulkOps = [];
    if (gereenuud)
      for await (const geree of gereenuud) {
        var khuuchinUnetei = true;
        for await (const guilgee of geree?.avlaga?.guilgeenuud) {
          if (
            guilgee.tailbar == "Түрээс хуучин үнэ 8/01-8/15 хооронд" ||
            guilgee.tailbar == "Түрээс шинэ үнэ 8/16-8/31 хооронд" ||
            guilgee.tailbar == "Менежмент төлбөр хуучин" ||
            guilgee.tailbar == "Менежмент төлбөр шинэ"
          ) {
            khuuchinUnetei = false;
            guilgee.negj = geree.talbainKhemjee;
            if (guilgee.tailbar == "Менежмент төлбөр хуучин") {
              guilgee.tariff = 5800;
            } else if (guilgee.tailbar == "Менежмент төлбөр шинэ") {
              guilgee.tariff = 7300;
            } else if (
              guilgee.tailbar == "Түрээс хуучин үнэ 8/01-8/15 хооронд"
            ) {
              guilgee.tariff = (guilgee.tulukhDun / geree.talbainKhemjee) * 2;
            } else if (guilgee.tailbar == "Түрээс шинэ үнэ 8/16-8/31 хооронд") {
              guilgee.tariff = (guilgee.tulukhDun / geree.talbainKhemjee) * 2;
            }
          }
        }
        if (!!khuuchinUnetei && !!geree?.avlaga?.guilgeenuud) {
          if (!!geree.zardluud?.find((x) => x.ner == "Менежментийн төлбөр"))
            geree?.avlaga?.guilgeenuud.push({
              turul: "avlaga",
              tailbar: "Менежментийн төлбөр",
              ognoo: new Date(2024, 7, 1, 0, 0, 0),
              tulukhDun: geree.talbainKhemjee * 5800,
            });
        }

        let upsertDoc = {
          updateOne: {
            filter: { _id: geree._id },
            update: [
              {
                $set: {
                  "avlaga.guilgeenuud": geree.avlaga.guilgeenuud,
                },
              },
            ],
          },
        };
        bulkOps.push(upsertDoc);
      }

    if (bulkOps.length > 0)
      await Geree(req.body.tukhainBaaziinKholbolt)
        .bulkWrite(bulkOps)
        .then((bulkWriteOpResult) => {
          console.log("BULK ==>", bulkOps);
          console.log("BULK update OK", bulkWriteOpResult);
        })
        .catch((err) => {
          console.log("BULK ==>", bulkOps);
          console.log("BULK update error", err);
        });
    res.send(bulkOps.length.toString());
  } catch (err) {
    next(err);
  }
});
