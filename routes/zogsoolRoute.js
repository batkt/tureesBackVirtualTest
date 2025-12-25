const express = require("express");
const router = express.Router();
const { tokenShalgakh, crud, UstsanBarimt } = require("zevbackv2");
const { Uilchluulegch } = require("parking-v2");
//const UstsanBarimt = require("../models/ustsanBarimt");
const { Pool } = require("pg");
const Zogsool = require("../models/zogsool");
const Mashin = require("../models/mashin");
const got = require("got");
const { URL } = require("url");
const instanceJson = got.extend({
  hooks: {
    beforeRequest: [
      (options) => {
        options.headers["Content-Type"] = "application/json";
        if (options.context && options.context.token) {
          options.headers["Authorization"] = options.context.token;
        }
      },
    ],
  },
});
const multer = require("multer");
const storage = multer.memoryStorage();
const uploadFile = multer({ storage: storage });

crud(router, "zogsool", Zogsool, UstsanBarimt);
// crud(router, "mashin", Mashin, UstsanBarimt);
const {
  mashiniiExcelAvya,
  mashiniiExcelTatya,
  blockMashiniiExcelAvya,
  blockMashiniiExcelTatya,
} = require("../controller/excel");

router.route("/mashiniiExcelAvya").get(mashiniiExcelAvya);
router
  .route("/mashiniiExcelTatya")
  .post(uploadFile.single("file"), tokenShalgakh, mashiniiExcelTatya);
router.route("/blockMashiniiExcelAvya").get(blockMashiniiExcelAvya);
router
  .route("/blockMashiniiExcelTatya")
  .post(uploadFile.single("file"), tokenShalgakh, blockMashiniiExcelTatya);

router.get("/zogsooloosTatya", async (req, res, next) => {
  var pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "postgres",
    password: "123",
    port: 5432,
  });
  pool.query(
    "select a.id, a.car_number, a.check_in_time, min(b.check_out_time) as check_out_time," +
      "(DATE_PART('day', min(check_out_time) - check_in_time) * 24 +" +
      "DATE_PART('hour', min(check_out_time) - check_in_time)) * 60 +" +
      "DATE_PART('minute', min(check_out_time) - check_in_time) as khugatsaa" +
      " from park_park_recordin a inner join park_recordout b on a.car_number = b.car_number " +
      "where a.check_in_time < b.check_out_time and a.check_in_time > '2022-01-01 10:53:26'" +
      "group by a.id, a.car_number, a.check_in_time " +
      "order by check_in_time",
    async (err, res1) => {
      if (err) throw err;
      var niitMur = 0;
      await pool.end();
      if (res1.rows && res1.rows.length > 0) {
        const objectString = JSON.stringify({ jagsaalt: res1.rows });
        var url = new URL("http://103.143.40.230:8081/zogsoolOlnoorKhadgalya/");
        const response = await instanceJson.post(url, { body: objectString });
      }
      res.send("Amjilttai");
    }
  );
});

router.post("/zogsoolOlnoorKhadgalya", async (req, res, next) => {
  var bulkOps = [];
  req.body.jagsaalt.forEach((element) => {
    element.baiguullagiinId = "6115f350b35689cdbf1b9da3";
    element.barilgiinId = "619e267fdd4835aa2c168b28";
    let upsertDoc = {
      updateOne: {
        filter: { id: element.id },
        update: element,
        upsert: true,
      },
    };
    bulkOps.push(upsertDoc);
  });
  Zogsool.bulkWrite(bulkOps)
    .then((bulkWriteOpResult) => {
      res.send("Amjilttai");
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/zogsooliinDunAvya", tokenShalgakh, async (req, res, next) => {
  var query = [
    {
      $match: {
        check_in_time: {
          $gte: new Date(req.body.ekhlekhOgnoo),
          $lte: new Date(req.body.duusakhOgnoo),
        },
        baiguullagiinId: req.body.baiguullagiinId,
      },
    },
    {
      $group: {
        _id: "aa",
        too: {
          $sum: "$tulbur",
        },
      },
    },
  ];
  Zogsool(req.body.tukhainBaaziinKholbolt)
    .aggregate(query)
    .then((result) => {
      if (result && result.length > 0) res.send(result[0].too.toString());
      else res.send("0");
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/zogsooliinTooAvya", tokenShalgakh, async (req, res, next) => {
  var query = [
    {
      $match: {
        check_in_time: {
          $gte: new Date(req.body.ekhlekhOgnoo),
          $lte: new Date(req.body.duusakhOgnoo),
        },
        baiguullagiinId: req.body.baiguullagiinId,
      },
    },
    {
      $group: {
        _id: "$turul",
        too: {
          $sum: 1,
        },
      },
    },
  ];
  Zogsool(req.body.tukhainBaaziinKholbolt)
    .aggregate(query)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports.archiveUilchluulegch =
  async function archiveUilchluulegch() {
    try 
    {
        const { db } = require("zevbackv2");
        const kholboltuud = db.kholboltuud;
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;
        if (kholboltuud) {
            for (const kholbolt of kholboltuud) {
                if (kholbolt.baiguullagiinId !== "612f457d185280db676d0b51") continue;
                const months = await Uilchluulegch(kholbolt).aggregate([
                    { $project: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } } },
                    { $group: { _id: { year: "$year", month: "$month" } } },
                    { $sort: { "_id.year": 1, "_id.month": 1 }, },
                ]);
                console.log(`${JSON.stringify(months)} months found for kholbolt: ${kholbolt.baiguullagiinId}`);
                for (const { _id } of months) {
                    const y = _id.year;
                    const m = _id.month;
                    if (y === currentYear && m === currentMonth) continue; // одоогийн сар алгасна
                    const archiveName = `ebarimtShine${y}${String(m).padStart(2, "0")}`;
                    console.log(`📦 Archiving month: ${archiveName}`);
                    const docs = await Uilchluulegch(kholbolt, false, archiveName).find({
                        createdAt: { $gte: new Date(y, m - 1, 1), $lt: new Date(y, m, 1) }
                    });
                    if (docs?.length > 0) continue;
                    // console.log(`📦 docs length: ${docs?.length}`);
                    // // --- Archive ---
                    // await Uilchluulegch(kholbolt, false, archiveName).aggregate([
                    //     { $match: { createdAt: { $gte: new Date(y, m - 1, 1), $lt: new Date(y, m, 1) } } },
                    //     { $out: archiveName }
                    // ]);
                    // // --- Delete ---
                    // const res = await Uilchluulegch(kholbolt, false, archiveName).deleteMany({
                    //     createdAt: { $gte: new Date(y, m - 1, 1), $lt: new Date(y, m, 1) }
                    // });
                    // console.log(`🗑️ Deleted ${res?.deletedCount} docs from ebarimtShine`);
                }
            }
        }
    } catch (error) {
        console.error("Error archiving archiveUilchluulegch:", error);
    }
};

module.exports = router;
