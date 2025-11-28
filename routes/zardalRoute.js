const express = require("express");
const router = express.Router();
const Zardal = require("../models/zardal");
const BankniiGuilgee = require("../models/bankniiGuilgee");
const Geree = require("../models/geree");
const AshiglaltiinZardluud = require("../models/ashiglaltiinZardluud");
const { backAvya } = require("../controller/backup");
//const UstsanBarimt = require("../models/ustsanBarimt");
const { tokenShalgakh, crud, UstsanBarimt } = require("zevbackv2");
crud(router, "zardal", Zardal, UstsanBarimt);

router.post("/zardliinDunAvya", tokenShalgakh, async (req, res, next) => {
  var query = [
    {
      $match: {
        baiguullagiinId: req.body.baiguullagiinId,
        barilgiinId: req.body.barilgiinId,
        zardliinBulgiinId: {
          $in: req.body.idnuud,
        },
        $or: [
          {
            TxDt: {
              $gte: new Date(req.body.ekhlekhOgnoo),
              $lte: new Date(req.body.duusakhOgnoo),
            },
          },
          {
            tranDate: {
              $gte: new Date(req.body.ekhlekhOgnoo),
              $lte: new Date(req.body.duusakhOgnoo),
            },
          },
        ],
      },
    },
    {
      $group: {
        _id: "aa",
        niitDun: {
          $sum: {
            $add: [{ $ifNull: ["$Amt", 0] }, { $ifNull: ["$amount", 0] }],
          },
        },
      },
    },
  ];
  BankniiGuilgee(req.body.tukhainBaaziinKholbolt, true)
    .aggregate(query)
    .then((result) => {
      var dun = 0;
      if (result && result.length > 0) {
        dun = result[0].niitDun;
      }
      res.send(dun.toString());
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/zardalKhuvaarilya", tokenShalgakh, async (req, res, next) => {
  BankniiGuilgee(req.body.tukhainBaaziinKholbolt)
    .updateOne(
      { _id: req.body.guilgeeniiId },
      { $set: { zardliinBulgiinId: req.body.zardliinId } }
    )
    .then((result) => {
      res.send("Amjilttai");
    })
    .then((err) => {
      next(err);
    });
});

router.post("/zardalTsutslaya", tokenShalgakh, async (req, res, next) => {
  BankniiGuilgee(req.body.tukhainBaaziinKholbolt)
    .updateOne(
      { _id: req.body.guilgeeniiId },
      { $set: { zardliinBulgiinId: null } }
    )
    .then((result) => {
      res.send("Amjilttai");
    })
    .then((err) => {
      next(err);
    });
});
router.post("/backTest", tokenShalgakh, async (req, res, next) => {
  backAvya();
  res.send("Amjilttai");
});

router.post("/huwisakhZardalTootsyo", tokenShalgakh, async (req, res, next) => {
  try {
    const {
      baiguullagiinId,
      barilgiinId,
      zardliinTurul,
      tukhainBaaziinKholbolt,
      zardliinId,
    } = req.body;

    if (!baiguullagiinId || !barilgiinId || !zardliinTurul) {
      return res
        .status(400)
        .send(
          "baiguullagiinId, barilgiinId, zardliinTurul заавал шаардлагатай"
        );
    }
    var ObjectId = require("mongodb").ObjectId;
    const gereenuud = await Geree(tukhainBaaziinKholbolt)
      .find({
        baiguullagiinId: baiguullagiinId,
        barilgiinId: barilgiinId,
        tuluv: { $ne: -1 },
        gereeniiDugaar: "ГД2505151",
        "zardluud._id": new ObjectId(req.body.zardliinId),
      })
      .select("+avlaga");
    console.log("geree log ssss length --------------->>>" + gereenuud?.length);
    console.log("--------------->>>" + JSON.stringify(gereenuud));
    for await (const geree of gereenuud) {
      console.log(
        "geree log ssss --------------->>>" +
          JSON.stringify(geree.avlaga.guilgeenuud)
      );
    }

    // const zardal = geree.zardluud.find((z) => z.ner === zardliinTurul);

    // if (!zardal) {
    //   return res.status(404).send(`"${zardliinTurul}" нэртэй зардал олдсонгүй`);
    // }

    // let suuliinZaaltNum = 0;
    // let umnukhZaaltNum = 0;

    // if (
    //   geree.avlaga &&
    //   geree.avlaga.guilgeenuud &&
    //   geree.avlaga.guilgeenuud.length > 0
    // ) {
    //   const matchingGuilgeenuud = geree.avlaga.guilgeenuud
    //     .filter((g) => g.tailbar === zardliinTurul)
    //     .sort((a, b) => new Date(b.ognoo) - new Date(a.ognoo));

    //   if (matchingGuilgeenuud.length > 0) {
    //     const specificGuilgee = matchingGuilgeenuud[0];
    //     suuliinZaaltNum = specificGuilgee.suuliinZaalt || 0;
    //     umnukhZaaltNum = specificGuilgee.umnukhZaalt || 0;
    //   }
    // }

    // const odooniiZaalt = suuliinZaaltNum - umnukhZaaltNum;

    // let tulukhDun = 0;

    // if (
    //   zardal.ner === "Цахилгаан" ||
    //   zardal.ner === "Халуун ус" ||
    //   zardal.ner === "Хүйтэн ус"
    // ) {
    //   const ashiglaltiinZardal = await AshiglaltiinZardluud(
    //     tukhainBaaziinKholbolt
    //   ).findOne({
    //     baiguullagiinId: baiguullagiinId,
    //     barilgiinId: barilgiinId,
    //     ner: zardal.ner,
    //   });

    //   if (ashiglaltiinZardal) {
    //     if (zardal.ner === "Цахилгаан") {
    //       const tsakhilgaanUrjver = ashiglaltiinZardal.tsakhilgaanUrjver || 0;
    //       const tsakhilgaanChadal = ashiglaltiinZardal.tsakhilgaanChadal || 0;
    //       const tsakhilgaanDemjikh = ashiglaltiinZardal.tsakhilgaanDemjikh || 0;

    //       tulukhDun =
    //         odooniiZaalt * tsakhilgaanUrjver +
    //         odooniiZaalt * tsakhilgaanChadal +
    //         odooniiZaalt * tsakhilgaanDemjikh;
    //     } else if (zardal.ner === "Халуун ус") {
    //       const bokhirUsDun = ashiglaltiinZardal.bokhirUsDun || 0;
    //       const tseverUsDun = ashiglaltiinZardal.tseverUsDun || 0;
    //       const usKhalaasniiDun = ashiglaltiinZardal.usKhalaasniiDun || 0;

    //       tulukhDun =
    //         odooniiZaalt * bokhirUsDun +
    //         odooniiZaalt * tseverUsDun +
    //         odooniiZaalt * usKhalaasniiDun;
    //     } else if (zardal.ner === "Хүйтэн ус") {
    //       const bokhirUsDun = ashiglaltiinZardal.bokhirUsDun || 0;
    //       const tseverUsDun = ashiglaltiinZardal.tseverUsDun || 0;

    //       tulukhDun = odooniiZaalt * bokhirUsDun + odooniiZaalt * tseverUsDun;
    //     }
    //   }
    // } else {
    //   const bokhirUsDun = zardal.bokhirUsDun || 0;
    //   const tseverUsDun = zardal.tseverUsDun || 0;
    //   const usKhalaasniiDun = zardal.usKhalaasniiDun || 0;

    //   tulukhDun =
    //     odooniiZaalt * bokhirUsDun +
    //     odooniiZaalt * tseverUsDun +
    //     odooniiZaalt * usKhalaasniiDun;
    // }

    // zardal.tulukhDun = tulukhDun;

    // await geree.save();

    res.json(gereenuud);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
