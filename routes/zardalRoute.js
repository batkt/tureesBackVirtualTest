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
      zardluud_id,
    } = req.body;

    // Validate required fields
    if (
      !baiguullagiinId ||
      !barilgiinId ||
      !zardluud_id
    ) {
      return res
        .status(400)
        .send(
          "baiguullagiinId, barilgiinId, zardluud_id заавал шаардлагатай"
        );
    }

    // Find Geree document with avlaga included
    const geree = await Geree()
      .findOne({
        baiguullagiinId: baiguullagiinId,
        barilgiinId: barilgiinId,
      })
      .select("+avlaga");

    if (!geree) {
      return res.status(404).send("Гэрээ олдсонгүй");
    }

    // Find matching zardal in zardluud array by _id
    const zardal = geree.zardluud.id(zardluud_id);

    if (!zardal) {
      return res.status(404).send(`ID: "${zardluud_id}"-тэй зардал олдсонгүй`);
    }

    // Get the latest guilgee entry for this zardal from avlaga.guilgeenuud
    let suuliinZaaltNum = 0;
    let umnukhZaaltNum = 0;

    if (geree.avlaga && geree.avlaga.guilgeenuud && geree.avlaga.guilgeenuud.length > 0) {
      // Filter guilgeenuud by zardliinId and sort by date (latest first)
      const matchingGuilgeenuud = geree.avlaga.guilgeenuud
        .filter(g => g.zardliinId && g.zardliinId.toString() === zardluud_id)
        .sort((a, b) => new Date(b.ognoo) - new Date(a.ognoo));

      if (matchingGuilgeenuud.length > 0) {
        const latestGuilgee = matchingGuilgeenuud[0];
        suuliinZaaltNum = latestGuilgee.suuliinZaalt || 0;
        umnukhZaaltNum = latestGuilgee.umnukhZaalt || 0;
      }
    }

    // Calculate odooniiZaalt
    const odooniiZaalt = suuliinZaaltNum - umnukhZaaltNum;

    let tulukhDun = 0;

    // Check if zardliinTurul is "Цахилгаан", "Халуун ус" or "Хүйтэн ус"
    if (zardal.ner === "Цахилгаан" || zardal.ner === "Халуун ус" || zardal.ner === "Хүйтэн ус") {
      // Fetch values from ashiglaltiinZardluud model
      const ashiglaltiinZardal = await AshiglaltiinZardluud().findOne({
        baiguullagiinId: baiguullagiinId,
        barilgiinId: barilgiinId,
        ner: zardal.ner,
      });

      if (ashiglaltiinZardal) {
        if (zardal.ner === "Цахилгаан") {
          // For electricity: use tsakhilgaan related fields
          const tsakhilgaanUrjver = ashiglaltiinZardal.tsakhilgaanUrjver || 0;
          const tsakhilgaanChadal = ashiglaltiinZardal.tsakhilgaanChadal || 0;
          const tsakhilgaanDemjikh = ashiglaltiinZardal.tsakhilgaanDemjikh || 0;

          tulukhDun = (odooniiZaalt * tsakhilgaanUrjver) + (odooniiZaalt * tsakhilgaanChadal) + (odooniiZaalt * tsakhilgaanDemjikh);
        } else if (zardal.ner === "Халуун ус") {
          // For hot water: use all three water costs
          const bokhirUsDun = ashiglaltiinZardal.bokhirUsDun || 0;
          const tseverUsDun = ashiglaltiinZardal.tseverUsDun || 0;
          const usKhalaasniiDun = ashiglaltiinZardal.usKhalaasniiDun || 0;

          tulukhDun = (odooniiZaalt * bokhirUsDun) + (odooniiZaalt * tseverUsDun) + (odooniiZaalt * usKhalaasniiDun);
        } else if (zardal.ner === "Хүйтэн ус") {
          // For cold water: use only bokhirUsDun and tseverUsDun
          const bokhirUsDun = ashiglaltiinZardal.bokhirUsDun || 0;
          const tseverUsDun = ashiglaltiinZardal.tseverUsDun || 0;

          tulukhDun = (odooniiZaalt * bokhirUsDun) + (odooniiZaalt * tseverUsDun);
        }
      }
    } else {
      // Use values from geree's zardal for other types
      const bokhirUsDun = zardal.bokhirUsDun || 0;
      const tseverUsDun = zardal.tseverUsDun || 0;
      const usKhalaasniiDun = zardal.usKhalaasniiDun || 0;

      tulukhDun = (odooniiZaalt * bokhirUsDun) + (odooniiZaalt * tseverUsDun) + (odooniiZaalt * usKhalaasniiDun);
    }

    // Update tulukhDun in the zardal
    zardal.tulukhDun = tulukhDun;

    // Save the updated geree
    await geree.save();

    // Return the calculated tulukhDun
    res.json({ tulukhDun });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
