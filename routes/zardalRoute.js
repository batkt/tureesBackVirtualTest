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

router.get("/huwisakhZardalTootsyo", tokenShalgakh, async (req, res, next) => {
  try {
    const {
      baiguullagiinId,
      barilgiinId,
      zardluud_id,
      umnukhZaalt,
      suuliinZaalt,
      createdAt,
    } = req.query;

    // Validate required fields
    if (
      !baiguullagiinId ||
      !barilgiinId ||
      !zardluud_id ||
      !umnukhZaalt ||
      !suuliinZaalt ||
      !createdAt
    ) {
      return res
        .status(400)
        .send(
          "baiguullagiinId, barilgiinId, zardluud_id, umnukhZaalt, suuliinZaalt, createdAt заавал шаардлагатай"
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

    // Parse input values to numbers
    const suuliinZaaltNum = parseFloat(suuliinZaalt);
    const umnukhZaaltNum = parseFloat(umnukhZaalt);

    // Calculate odooniiZaalt
    const odooniiZaalt = suuliinZaaltNum - umnukhZaaltNum;

    let bokhirUsDun = 0;
    let tseverUsDun = 0;
    let usKhalaasniiDun = 0;

    // Check if zardliinTurul is "Халуун ус" or "Хүйтэн ус"
    if (zardal.ner === "Халуун ус" || zardal.ner === "Хүйтэн ус") {
      // Fetch values from ashiglaltiinZardluud model
      const ashiglaltiinZardal = await AshiglaltiinZardluud().findOne({
        baiguullagiinId: baiguullagiinId,
        barilgiinId: barilgiinId,
        ner: zardal.ner,
      });

      if (ashiglaltiinZardal) {
        bokhirUsDun = ashiglaltiinZardal.bokhirUsDun || 0;
        tseverUsDun = ashiglaltiinZardal.tseverUsDun || 0;
        // Only use usKhalaasniiDun for "Халуун ус"
        if (zardal.ner === "Халуун ус") {
          usKhalaasniiDun = ashiglaltiinZardal.usKhalaasniiDun || 0;
        }
      }
    } else {
      // Use values from geree's zardal
      bokhirUsDun = zardal.bokhirUsDun || 0;
      tseverUsDun = zardal.tseverUsDun || 0;
      usKhalaasniiDun = zardal.usKhalaasniiDun || 0;
    }

    // Calculate individual components
    const tseverUsDunTotal = odooniiZaalt * tseverUsDun;
    const bokhirUsDunTotal = odooniiZaalt * bokhirUsDun;
    const usKhalaasniiDunTotal = odooniiZaalt * usKhalaasniiDun;

    // Calculate tulukhDun = sum of all components
    const tulukhDun =
      tseverUsDunTotal + bokhirUsDunTotal + usKhalaasniiDunTotal;

    // Update tulukhDun in the zardal
    zardal.tulukhDun = tulukhDun;

    // Initialize avlaga if it doesn't exist
    if (!geree.avlaga) {
      geree.avlaga = { guilgeenuud: [], baritsaa: [] };
    }
    if (!geree.avlaga.guilgeenuud) {
      geree.avlaga.guilgeenuud = [];
    }

    // Add new entry to guilgeenuud
    geree.avlaga.guilgeenuud.push({
      ognoo: new Date(createdAt),
      suuliinZaalt: suuliinZaaltNum,
      umnukhZaalt: umnukhZaaltNum,
      tulukhDun: tulukhDun,
      zardliinId: zardluud_id,
      zardliinNer: zardal.ner,
      zardliinTurul: zardal.ner,
      bokhirUsDun: bokhirUsDun,
      tseverUsDun: tseverUsDun,
      usKhalaasniiDun: usKhalaasniiDun,
    });

    // Save the updated geree
    await geree.save();

    // Return the calculated tulukhDun
    res.json({ tulukhDun });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
