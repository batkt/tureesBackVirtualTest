const express = require("express");
const router = express.Router();
const BankniiGuilgee = require("../models/bankniiGuilgee");
const { tdbcer } = require("../kholbolt/tdbcer");
const { bankniiGuilgeeToololtAvya } = require("../controller/toololt");
//const UstsanBarimt = require("../models/ustsanBarimt");
const { tokenShalgakh, crud, UstsanBarimt, Dans } = require("zevbackv2");
const Geree = require("../models/geree");
const moment = require("moment");
const { Parking } = require("parking-v2");
const { khuudaslalt } = require("zevbackv2");
//const { crud } = require('../components/crud');
//const { tokenShalgakh } = require("../middlewares/tokenShalgakh");

crud(
  router,
  "bankniiGuilgee",
  (conn) => BankniiGuilgee(conn, true),
  UstsanBarimt
);
router.post(
  "/bankniiGuilgeeToololtAvya",
  tokenShalgakh,
  bankniiGuilgeeToololtAvya
);
router.post("/tdbcer", tdbcer);

router
  .route("/dansniiKhuulgaDunAvya")
  .post(tokenShalgakh, async (req, res, next) => {
    var turul = req.body.turul;
    let query = [
      {
        $match: {
          baiguullagiinId: req.body.baiguullagiinId,
          barilgiinId: req.body.barilgiinId,
          dansniiDugaar: req.body.dansniiDugaar,
          $or: [
            {
              $and: [
                {
                  TxDt: {
                    $gte: new Date(req.body.ekhlekhOgnoo),
                    $lte: new Date(req.body.duusakhOgnoo),
                  },
                },
                {
                  Amt:
                    turul == "orlogo"
                      ? {
                          $gt: 0,
                        }
                      : {
                          $lt: 0,
                        },
                },
              ],
            },
            {
              $and: [
                {
                  tranDate: {
                    $gte: new Date(req.body.ekhlekhOgnoo),
                    $lte: new Date(req.body.duusakhOgnoo),
                  },
                },
                {
                  amount:
                    turul == "orlogo"
                      ? {
                          $gt: 0,
                        }
                      : {
                          $lt: 0,
                        },
                },
              ],
            },
          ],
        },
      },
      {
        $project: {
          dun: { $ifNull: ["$Amt", "$amount"] },
        },
      },
      {
        $group: {
          _id: "dun",
          dun: {
            $sum: "$dun",
          },
        },
      },
    ];
    BankniiGuilgee(req.body.tukhainBaaziinKholbolt, true)
      .aggregate(query)
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        next(err);
      });
  });
router.get(
  "/zogsoolBankniiGuilgeeJagsaalt",
  tokenShalgakh,
  async (req, res, next) => {
    try {
      const body = req.query;
      if (!!body?.query) body.query = JSON.parse(body.query);
      if (!!body?.order) body.order = JSON.parse(body.order);
      if (!!body?.khuudasniiDugaar)
        body.khuudasniiDugaar = Number(body.khuudasniiDugaar);
      if (!!body?.khuudasniiKhemjee)
        body.khuudasniiKhemjee = Number(body.khuudasniiKhemjee);
      if (!!body?.search) body.search = String(body.search);

      const dansniiDugaar = body.dansniiDugaar || body.query?.dansniiDugaar;
      const barilgiinId = body.barilgiinId || body.query?.barilgiinId;
      const baiguullagiinId =
        body.baiguullagiinId || body.query?.baiguullagiinId;

      console.log("🔍 Query:", JSON.stringify(body.query, null, 2));

      if (!dansniiDugaar) {
        return res.status(400).send({
          success: false,
          aldaa: "dansniiDugaar required",
        });
      }

      // Check if dansniiDugaar exists in Parking's zogsooliinDans
      const parkingExists = await Parking(
        req.body.tukhainBaaziinKholbolt
      ).findOne({
        zogsooliinDans: dansniiDugaar,
        barilgiinId: barilgiinId,
        baiguullagiinId: baiguullagiinId,
      });

      console.log(
        `🔍 Parking check for dans ${dansniiDugaar}:`,
        parkingExists ? "Found ✅" : "Not found ❌"
      );

      let collectionName = null;

      // Only use archive if dansniiDugaar is found in Parking
      if (parkingExists && body.query) {
        const extractDate = (dateFilter, preferStart = true) => {
          if (!dateFilter) return null;

          if (preferStart && dateFilter.$gte) {
            return new Date(dateFilter.$gte);
          } else if (!preferStart && dateFilter.$lte) {
            return new Date(dateFilter.$lte);
          } else if (dateFilter.$gte) {
            return new Date(dateFilter.$gte);
          } else if (dateFilter.$lte) {
            return new Date(dateFilter.$lte);
          } else if (dateFilter.$eq) {
            return new Date(dateFilter.$eq);
          } else if (
            typeof dateFilter === "string" ||
            dateFilter instanceof Date
          ) {
            return new Date(dateFilter);
          }
          return null;
        };

        let startDate = null;

        // Check TxDt (TDB bank)
        if (body.query.TxDt) {
          startDate = extractDate(body.query.TxDt, true);
          console.log("📅 Found TxDt:", startDate);
        }

        // Check tranDate (other banks)
        if (!startDate && body.query.tranDate) {
          startDate = extractDate(body.query.tranDate, true);
          console.log("📅 Found tranDate:", startDate);
        }

        // Check in $and array
        if (!startDate && body.query.$and && Array.isArray(body.query.$and)) {
          for (const condition of body.query.$and) {
            // Look for $or with date conditions
            if (condition.$or && Array.isArray(condition.$or)) {
              for (const orCondition of condition.$or) {
                if (orCondition.TxDt) {
                  startDate = extractDate(orCondition.TxDt, true);
                  console.log("📅 Found TxDt in $and/$or:", startDate);
                  break;
                }
                if (orCondition.tranDate) {
                  startDate = extractDate(orCondition.tranDate, true);
                  console.log("📅 Found tranDate in $and/$or:", startDate);
                  break;
                }
              }
            }
            if (startDate) break;
          }
        }

        if (startDate && !isNaN(startDate.getTime())) {
          const year = startDate.getFullYear();
          const month = startDate.getMonth() + 1;
          const now = new Date();
          const currentYear = now.getFullYear();
          const currentMonth = now.getMonth() + 1;

          console.log(
            `📅 Date parsed: ${year}-${month}, Current: ${currentYear}-${currentMonth}`
          );

          // Use archived collection if not current month
          if (year !== currentYear || month !== currentMonth) {
            collectionName = `BankniiGuilgee${year}${String(month).padStart(
              2,
              "0"
            )}`;
            console.log(`📂 Using archived collection: ${collectionName}`);
          } else {
            console.log(`📂 Using main collection (current month)`);
          }
        } else {
          console.log("⚠️ Could not parse date from query");
        }
      }

      // Call BankniiGuilgee with or without collection name
      const model = collectionName
        ? BankniiGuilgee(req.body.tukhainBaaziinKholbolt, false, collectionName)
        : BankniiGuilgee(req.body.tukhainBaaziinKholbolt, true);

      console.log(
        `🗄️ Using model with collection: ${collectionName || "default"}`
      );

      khuudaslalt(model, body)
        .then((result) => {
          console.log(`✅ Result: ${result?.jagsaalt?.length || 0} records`);
          res.send(result);
        })
        .catch((err) => {
          console.error("❌ khuudaslalt error:", err);
          next(err);
        });
    } catch (error) {
      console.error("❌ Route error:", error);
      next(error);
    }
  }
);
router
  .route("/davkhardsanDansniiKhuulga")
  .post(tokenShalgakh, async (req, res, next) => {
    var bank = req.body.bank;
    var match = {
      baiguullagiinId: req.body.baiguullagiinId,
      barilgiinId: req.body.barilgiinId,
      bank: bank,
    };
    if (!!req.body.dugaar) {
      if (bank === "khanbank") match["record"] = req.body.dugaar;
      else if (bank === "golomt") match["tranId"] = req.body.dugaar;
      else if (bank === "bogd") match["recNum"] = req.body.dugaar;
      else if (bank === "tran") match["jrno"] = req.body.dugaar;
      else if (bank === "tdb") match["NtryRef"] = req.body.dugaar;
    }
    var str =
      bank === "khanbank"
        ? "$record"
        : bank === "golomt"
        ? "$tranId"
        : bank === "bogd"
        ? "$recNum"
        : bank === "tran"
        ? "$jrno"
        : bank === "tdb"
        ? "$NtryRef"
        : "$refno";
    let query = [
      {
        $match: match,
      },
      {
        $group: {
          _id: str,
          countRef: {
            $sum: 1,
          },
        },
      },
    ];

    var result = await BankniiGuilgee(
      req.body.tukhainBaaziinKholbolt,
      true
    ).aggregate(query);
    var filterResult = result?.filter((e) => e.countRef > 1);
    for await (const val of filterResult) {
      match = {
        baiguullagiinId: req.body.baiguullagiinId,
        barilgiinId: req.body.barilgiinId,
      };
      if (bank === "khanbank") match["record"] = val?._id;
      else if (bank === "golomt") match["tranId"] = val?._id;
      else if (bank === "bogd") match["recNum"] = val?._id;
      else if (bank === "tran") match["jrno"] = val?._id;
      else if (bank === "tdb") match["NtryRef"] = val?._id;
      var resultRef = await BankniiGuilgee(
        req.body.tukhainBaaziinKholbolt,
        true
      ).find(match);
      if (resultRef?.length > 0) {
        if (req.body.type === 1) {
          // ebarimtAvsanEsekh true baival uldeekh
          var ustgakhJagsaalt = [];
          ustgakhJagsaalt.push(resultRef[0]);
          var fRemove = resultRef.filter(
            (el) => !ustgakhJagsaalt.includes(el) && !el.ebarimtAvsanEsekh
          );
          await BankniiGuilgee(req.body.tukhainBaaziinKholbolt).deleteMany({
            _id: { $in: fRemove?.map((e) => e._id) },
          });
        } else if (req.body.type === 2) {
          // khamgiin ekhnii uldeekh
          var ustgakhJagsaalt = [];
          ustgakhJagsaalt.push(resultRef[0]);
          var fRemove = resultRef.filter((el) => !ustgakhJagsaalt.includes(el));
          await BankniiGuilgee(req.body.tukhainBaaziinKholbolt).deleteMany({
            _id: { $in: fRemove?.map((e) => e._id) },
          });
        } else {
          var filterKholboson = resultRef?.filter(
            (e) => e.kholbosonTalbainId?.length > 0
          );
          if (filterKholboson?.length > 0) {
            var filterRemove = resultRef?.filter(
              (e) => e.kholbosonTalbainId?.length === 0
            );
            await BankniiGuilgee(req.body.tukhainBaaziinKholbolt).deleteMany({
              _id: { $in: filterRemove?.map((e) => e._id) },
            });
          } else {
            var ustgakhJagsaalt = [];
            ustgakhJagsaalt.push(resultRef[0]);
            var fRemove = resultRef.filter(
              (el) => !ustgakhJagsaalt.includes(el) && !el.ebarimtAvsanEsekh
            );
            await BankniiGuilgee(req.body.tukhainBaaziinKholbolt).deleteMany({
              _id: { $in: fRemove?.map((e) => e._id) },
            });
          }
        }
      }
    }
    res.send("Амжилт");
  });

router
  .route("/copyBankniiKhuulga")
  .post(tokenShalgakh, async (req, res, next) => {
    var match = {
      baiguullagiinId: req.body.baiguullagiinId,
      barilgiinId: req.body.barilgiinId,
      dansniiDugaar: req.body.dansniiDugaar,
    };
    if (!!req.body.record) match["record"] = req.body.record;

    var result = await BankniiGuilgee(
      req.body.tukhainBaaziinKholbolt,
      true
    ).find(match);
    for await (const val of result) {
      match = {
        baiguullagiinId: req.body.baiguullagiinId,
        barilgiinId: req.body.insertBarilgiinId,
        dansniiDugaar: req.body.dansniiDugaar,
        record: val.record,
      };
      var resultRef = await BankniiGuilgee(
        req.body.tukhainBaaziinKholbolt,
        true
      ).find(match);
      if (resultRef?.length === 0) {
        var guilgee = new BankniiGuilgee(req.body.tukhainBaaziinKholbolt)();
        guilgee.record = val.record;
        guilgee.tranDate = val.tranDate;
        guilgee.postDate = val.postDate;
        guilgee.time = val.time;
        guilgee.branch = val.branch;
        guilgee.teller = val.teller;
        guilgee.journal = val.journal;
        guilgee.code = val.code;
        guilgee.amount = val.amount;
        guilgee.balance = val.balance;
        guilgee.debit = val.debit;
        guilgee.correction = val.correction;
        guilgee.description = val.description;
        guilgee.relatedAccount = val.relatedAccount;
        guilgee.kholbosonGereeniiId = [];
        guilgee.kholbosonTalbainId = [];
        guilgee.dansniiDugaar = val.dansniiDugaar;
        guilgee.baiguullagiinId = val.baiguullagiinId;
        guilgee.barilgiinId = req.body.insertBarilgiinId;
        guilgee.save();
      }
    }
    res.send("Амжилт");
  });

router.route("/bankniiGuilgeeBankSet").post(async (req, res, next) => {
  try {
    var kholboltuud;
    const { db } = require("zevbackv2");
    if (!!req?.body?.tukhainBaaziinKholbolt) {
      kholboltuud = [req.body.tukhainBaaziinKholbolt];
    } else {
      kholboltuud = db.kholboltuud;
    }
    if (kholboltuud) {
      for await (const kholbolt of kholboltuud) {
        var guilgeenuud = await BankniiGuilgee(kholbolt, true).find({
          baiguullagiinId: kholbolt.baiguullagiinId,
          bank: { $exists: false },
        });
        for await (const guilgee of guilgeenuud) {
          var dans = await Dans(kholbolt).findOne({
            baiguullagiinId: kholbolt.baiguullagiinId,
            dugaar: guilgee.dansniiDugaar,
          });
          if (dans)
            await BankniiGuilgee(kholbolt).findByIdAndUpdate(guilgee._id, {
              bank: dans?.bank,
            });
        }
      }
    }
    res.send("Амжилт");
  } catch (error) {
    next(error);
  }
});

router.route("/bankIndexTalbar").post(async (req, res, next) => {
  try {
    var kholboltuud;
    const { db } = require("zevbackv2");
    if (!!req?.body?.tukhainBaaziinKholbolt) {
      kholboltuud = [req.body.tukhainBaaziinKholbolt];
    } else {
      kholboltuud = db.kholboltuud;
    }
    if (kholboltuud) {
      for await (const kholbolt of kholboltuud) {
        var guilgeenuud = await BankniiGuilgee(kholbolt, true).find({
          baiguullagiinId: kholbolt.baiguullagiinId,
        });
        for await (const guilgee of guilgeenuud) {
          var dugaar =
            guilgee.bank === "khanbank"
              ? guilgee.record
              : guilgee.bank === "golomt"
              ? guilgee.tranId
              : guilgee.bank === "bogd"
              ? guilgee.recNum
              : guilgee.bank === "tran"
              ? guilgee.jrno
              : guilgee.bank === "tdb" && !!guilgee.NtryRef
              ? guilgee.NtryRef
              : guilgee.refno;
          var mungunDun =
            guilgee.bank === "khanbank"
              ? guilgee.amount
              : guilgee.bank === "golomt"
              ? guilgee.tranAmount
              : guilgee.bank === "bogd"
              ? guilgee.amount
              : guilgee.bank === "tran"
              ? guilgee.income > 0
                ? guilgee.income
                : guilgee.outcome
              : guilgee.bank === "tdb"
              ? guilgee.Amt
              : 0;
          indexTalbar =
            guilgee.barilgiinId +
            guilgee.bank +
            guilgee.dansniiDugaar +
            dugaar +
            mungunDun.toString();
          await BankniiGuilgee(kholbolt).findByIdAndUpdate(guilgee._id, {
            indexTalbar: indexTalbar,
          });
        }
      }
    }
    res.send("Амжилт");
  } catch (error) {
    next(error);
  }
});

router
  .route("/bankniiKholboltZasya")
  .post(tokenShalgakh, async (req, res, next) => {
    try {
      let gereeMatch = {
        baiguullagiinId: req.body.baiguullagiinId,
        barilgiinId: req.body.barilgiinId,
        tuluv: -1,
      };
      if (req.body.gereeniiDugaar)
        gereeMatch.gereeniiDugaar = req.body.gereeniiDugaar;
      var gereenuud = await Geree(req.body.tukhainBaaziinKholbolt, true)
        .find(gereeMatch)
        .select("+avlaga");
      if (gereenuud?.length > 0) {
        for (const geree of gereenuud) {
          var filteredGeree = geree?.avlaga?.guilgeenuud.filter(
            (e) =>
              e.ognoo > moment(req.body.ognoo) &&
              e.turul === "bank" &&
              e.dansniiDugaar === "5100229713"
          );
          if (filteredGeree?.length > 0) {
            for (const data of filteredGeree) {
              if (data.dansniiDugaar == "5100229713" && data.turul == "bank") {
                let tulsunDun = data.tulsunDun + (data.tulsunAldangi || 0);
                var match = {
                  amount: tulsunDun,
                  barilgiinId: req.body.barilgiinId,
                  tranDate: data.ognoo,
                  kholbosonGereeniiId: [],
                  kholbosonTalbainId: [],
                };
                var resultRef = await BankniiGuilgee(
                  req.body.tukhainBaaziinKholbolt,
                  true
                ).find(match);
                if (resultRef?.length > 0) {
                  var x = resultRef[0];
                  var jagsaalt = [];
                  var dugaar = geree.talbainDugaar;
                  if (dugaar.includes(",")) {
                    jagsaalt = [...jagsaalt, ...dugaar.split(",")];
                  } else jagsaalt.push(dugaar);
                  x.kholbosonGereeniiId = [geree._id];
                  x.kholbosonTalbainId = jagsaalt;
                  x.kholbosonDun = x.amount || x.Amt || x.tranAmount;
                  x.save();
                }
              }
            }
          }
        }
      }
      res.send("Амжилт");
    } catch (error) {
      next(error);
    }
  });

router.route("/davkhardsanIndexTalbar").post(async (req, res, next) => {
  try {
    var kholboltuud;
    const { db } = require("zevbackv2");
    if (!!req?.body?.tukhainBaaziinKholbolt) {
      kholboltuud = [req.body.tukhainBaaziinKholbolt];
    } else {
      kholboltuud = db.kholboltuud;
    }
    if (kholboltuud) {
      for await (const kholbolt of kholboltuud) {
        // if(kholbolt?.baiguullagiinId !== "6800b91480a007fe5ab34436") continue;
        var guilgeenuud = await BankniiGuilgee(kholbolt, true).aggregate([
          {
            $match: {
              kholbosonGereeniiId: { $size: 0 },
              kholbosonTalbainId: { $size: 0 },
            },
          },
          {
            $group: {
              _id: "$indexTalbar",
              ids: { $push: "$_id" },
              count: { $sum: 1 },
            },
          },
          {
            $match: {
              count: { $gt: 1 },
            },
          },
        ]);
        for await (const guilgee of guilgeenuud) {
          var ustgakhJagsaalt = [];
          ustgakhJagsaalt.push(guilgee.ids[0]);
          var fRemove = guilgee.ids.filter(
            (el) => !ustgakhJagsaalt.includes(el)
          );
          await BankniiGuilgee(kholbolt).deleteMany({ _id: { $in: fRemove } });
        }
      }
    }
    res.send("Амжилт");
  } catch (error) {
    next(error);
  }
});
module.exports = router;
