const express = require("express");
const router = express.Router();
const Zardal = require("../models/zardal");
const BankniiGuilgee = require("../models/bankniiGuilgee");
const Geree = require("../models/geree");
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
    const { baiguullagiinId, barilgiinId, zardliinTurul } = req.body;

    // Validate required fields
    if (!baiguullagiinId || !barilgiinId || !zardliinTurul) {
      return res.status(400).send("baiguullagiinId, barilgiinId, zardliinTurul заавал шаардлагатай");
    }

    // Find Geree document with avlaga included (since it's select: false by default)
    const geree = await Geree(req.body.tukhainBaaziinKholbolt)
      .findOne({
        baiguullagiinId: baiguullagiinId,
        barilgiinId: barilgiinId
      })
      .select('+avlaga');

    if (!geree) {
      return res.status(404).send("Гэрээ олдсонгүй");
    }

    // Find matching zardal in zardluud array
    const zardal = geree.zardluud.find(z => z.ner === zardliinTurul);

    if (!zardal) {
      return res.status(404).send(`"${zardliinTurul}" нэртэй зардал олдсонгүй`);
    }

    // Calculate for "Хүйтэн ус"
    if (zardliinTurul === "Хүйтэн ус") {
      // Check if avlaga and guilgeenuud exist
      if (!geree.avlaga || !geree.avlaga.guilgeenuud || geree.avlaga.guilgeenuud.length === 0) {
        return res.status(404).send("Гэрээнд авлагын гүйлгээ олдсонгүй");
      }

      // Get current month start and end dates
      const now = new Date();
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

      // Find the latest guilgee entry that matches the zardliinTurul and is in the current month
      const matchingGuilgeenuud = geree.avlaga.guilgeenuud
        .filter(g => {
          const guilgeeOgnoo = new Date(g.ognoo);
          return g.zardliinTurul === zardliinTurul &&
                 guilgeeOgnoo >= currentMonthStart &&
                 guilgeeOgnoo <= currentMonthEnd;
        })
        .sort((a, b) => new Date(b.ognoo) - new Date(a.ognoo));

      if (matchingGuilgeenuud.length === 0) {
        return res.status(404).send(`Энэ сард "${zardliinTurul}"-ийн гүйлгээ олдсонгүй`);
      }

      const latestGuilgee = matchingGuilgeenuud[0];

      // Get suuliinZaalt and umnukhZaalt from the latest guilgee
      const suuliinZaalt = latestGuilgee.suuliinZaalt || 0;
      const umnukhZaalt = latestGuilgee.umnukhZaalt || 0;

      // Calculate odooniiZaalt
      const odooniiZaalt = suuliinZaalt - umnukhZaalt;

      // Calculate tulukhDun = (bokhirUsDun * odooniiZaalt) + (tseverUsDun * odooniiZaalt)
      const bokhirUsDun = zardal.bokhirUsDun || 0;
      const tseverUsDun = zardal.tseverUsDun || 0;
      const tulukhDun = (bokhirUsDun * odooniiZaalt) + (tseverUsDun * odooniiZaalt);

      // Update tulukhDun in the zardal
      zardal.tulukhDun = tulukhDun;

      // Save the updated geree
      await geree.save();

      // Return the updated geree
      res.json(geree);
    } else {
      return res.status(400).send("Одоогоор зөвхөн 'Хүйтэн ус' дэмжигдэнэ");
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
