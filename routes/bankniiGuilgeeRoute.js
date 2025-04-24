const express = require("express");
const router = express.Router();
const BankniiGuilgee = require("../models/bankniiGuilgee");
const { tdbcer } = require("../kholbolt/tdbcer");
const { bankniiGuilgeeToololtAvya } = require("../controller/toololt");
//const UstsanBarimt = require("../models/ustsanBarimt");
const { tokenShalgakh, crud, UstsanBarimt } = require("zevbackv2");
//const { crud } = require('../components/crud');
//const { tokenShalgakh } = require("../middlewares/tokenShalgakh");

crud(router, "bankniiGuilgee", BankniiGuilgee, UstsanBarimt);
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
    console.log("turluur", JSON.stringify(query, null, 4));
    BankniiGuilgee(req.body.tukhainBaaziinKholbolt)
      .aggregate(query)
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        next(err);
      });
  });

  router
  .route("/davkhardsanDansniiKhuulga")
  .post(tokenShalgakh, async (req, res, next) => {
    var match = {
      baiguullagiinId: req.body.baiguullagiinId,
      barilgiinId: req.body.barilgiinId,
    }
    if(!!req.body.NtryRef)  
      match["NtryRef"] = req.body.NtryRef
    let query = [
      {
        $match: match,
      },
      {
        $group: {
          _id: "$NtryRef",
          countRef: {
            $sum: 1,
          },
        },
      }]

    var result = await BankniiGuilgee(req.body.tukhainBaaziinKholbolt).aggregate(query);
    var filterResult = result?.filter((e) => e.countRef > 1);
    for await (const val of filterResult)
    {
      match = {
        baiguullagiinId: req.body.baiguullagiinId,
        barilgiinId: req.body.barilgiinId,
        NtryRef: val?._id
      }
      var resultRef = await BankniiGuilgee(req.body.tukhainBaaziinKholbolt).find(match);
      if(resultRef?.length > 0)
      {
        // var filterKholboson =  resultRef?.filter((e) => e.kholbosonTalbainId?.length > 0);
        // if(filterKholboson?.length > 0)
        // {
        //   var filterRemove = resultRef?.filter((e) => e.kholbosonTalbainId?.length === 0);
        //   await BankniiGuilgee(req.body.tukhainBaaziinKholbolt).deleteMany({ _id: { $in: filterRemove?.map((e) => e._id) }, });
        // }
        // else
        // {
          var ustgakhJagsaalt = [];
          ustgakhJagsaalt.push(resultRef[0]);
          var fRemove = resultRef.filter((el) => !ustgakhJagsaalt.includes(el));
          await BankniiGuilgee(req.body.tukhainBaaziinKholbolt).deleteMany({ _id: { $in: fRemove?.map((e) => e._id) }, });
        // }
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
    }
    if(!!req.body.record)  
      match["record"] = req.body.record;
    
    var result = await BankniiGuilgee(req.body.tukhainBaaziinKholbolt).find(match);
    for await (const val of result)
    {
      match = {
        baiguullagiinId: req.body.baiguullagiinId,
        barilgiinId: req.body.insertBarilgiinId,
        dansniiDugaar: req.body.dansniiDugaar,
        record: val.record,
      }
      var resultRef = await BankniiGuilgee(req.body.tukhainBaaziinKholbolt).find(match);
      if(resultRef?.length === 0)
      {
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

module.exports = router;
