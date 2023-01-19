const asyncHandler = require("express-async-handler");
const Geree = require("../models/geree");
const BankniiGuilgee = require("../models/bankniiGuilgee");
const Baiguullaga = require("../models/baiguullaga");
const Zardal = require("../models/zardal");
const lodash = require("lodash");
const moment = require("moment");

const unguud = [
  "rgba(255, 99, 132, 0.5)",
  "rgba(53, 162, 235, 0.5)",
  "rgba(0, 255, 0, 0.5)",
  "rgba(255, 0, 255, 0.5)",
  "rgba(0, 0, 255, 0.5)",
  "rgba(255, 255, 0, 0.5)",
  "rgba(0, 192, 192, 0.5)",
];

const chartUnguud = [
  "#30A76C",
  "#F0A542",
  "#F6C854",
  "#54B6F6",
  "#C054F6",
  "#F654DB",
  "#F65491",
  "#F65454",
  "#F6E554",
  "#9BF654",
  "#54F6CA",
  "#54C0F6",
  "#548FF6",
  "#5456F6",
  "#BE54F6",
];

exports.analitikTailanAvya = asyncHandler(async (req, res, next) => {
  try {
    var gereenuud = await Geree.find({
      baiguullagiinId: req.body.baiguullagiinId,
      barilgiinId: req.body.barilgiinId,
    }).select("+avlaga");
    res.send(gereenuud);
  } catch (err) {
    next(err);
  }
});

exports.zardaliinTailanAvya = asyncHandler(async (req, res, next) => {
  var group = {
    _id: {},
    dun: {
      $sum: "$dun",
    },
  };
  var sort = {};
  if (req.body.nariivchlal == "year") {
    group["_id"]["year"] = {
      $year: { date: "$ognoo", timezone: "Asia/Ulaanbaatar" },
    };
    sort["_id.year"] = 1;
  } else if (req.body.nariivchlal == "month") {
    group["_id"]["year"] = {
      $year: { date: "$ognoo", timezone: "Asia/Ulaanbaatar" },
    };
    group["_id"]["month"] = {
      $month: { date: "$ognoo", timezone: "Asia/Ulaanbaatar" },
    };
    sort["_id.year"] = 1;
    sort["_id.month"] = 1;
  } else if (req.body.nariivchlal == "day") {
    group["_id"]["year"] = {
      $year: { date: "$ognoo", timezone: "Asia/Ulaanbaatar" },
    };
    group["_id"]["month"] = {
      $month: { date: "$ognoo", timezone: "Asia/Ulaanbaatar" },
    };
    group["_id"]["day"] = {
      $dayOfMonth: { date: "$ognoo", timezone: "Asia/Ulaanbaatar" },
    };
    sort["_id.year"] = 1;
    sort["_id.month"] = 1;
    sort["_id.day"] = 1;
  }
  let query = [
    {
      $match: {
        baiguullagiinId: req.body.baiguullagiinId,
        barilgiinId: req.body.barilgiinId,
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
                Amt: {
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
                amount: {
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
        ognoo: { $ifNull: ["$TxDt", "$tranDate"] },
      },
    },
    {
      $group: group,
    },
    {
      $sort: sort,
    },
  ];
  var zardluud = await Zardal.find({
    barilgiinId: req.body.barilgiinId,
    baiguullagiinId: req.body.baiguullagiinId,
  }).lean();
  var zardliinDunguud = await BankniiGuilgee.aggregate([
    {
      $match: {
        baiguullagiinId: req.body.baiguullagiinId,
        barilgiinId: req.body.barilgiinId,
        zardliinBulgiinId: {
          $ne: null,
        },
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
                Amt: {
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
                amount: {
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
        zardliinBulgiinId: "$zardliinBulgiinId",
      },
    },
    {
      $group: {
        _id: "$zardliinBulgiinId",
        dun: {
          $sum: "$dun",
        },
      },
    },
  ]);
  BankniiGuilgee.aggregate(query)
    .then(async (result) => {
      if (result && result.length > 0) {
        var jagsaalt = [];
        var labels = [];
        var zardluud = [];
        result.forEach((a) => {
          if (req.body.nariivchlal == "year") labels.push(a["_id"].year);
          else if (req.body.nariivchlal == "month")
            labels.push(a["_id"].year + "/" + a["_id"].month);
          else if (req.body.nariivchlal == "day")
            labels.push(
              a["_id"].year + "/" + a["_id"].month + "/" + a["_id"].day
            );
          zardluud.push((a.dun * -1).toFixed(2));
        });
        if (
          zardliinDunguud &&
          zardliinDunguud.length > 0 &&
          zardluud &&
          zardluud.length > 0
        ) {
          var idnuud = [];
          var unguniiId = 0;
          zardluud.forEach((zardal) => {
            idnuud = [zardal._id];
            if (zardal.dedKhesguud && zardal.dedKhesguud.length > 0)
              zardal.dedKhesguud.forEach((a) => {
                console.log(typeof a._id);
                idnuud.push(a._id);
              });
            var shuugdsenZardluud = lodash.filter(zardliinDunguud, (a) =>
              JSON.stringify(idnuud).includes(a._id)
            );
            var niitDun = lodash.sumBy(shuugdsenZardluud, function (object) {
              return object.dun * -1;
            });
            if (niitDun > 0) {
              jagsaalt.push({
                ner: zardal.ner,
                dun: niitDun,
                ungu: unguud[unguniiId],
              });
              unguniiId++;
            }
          });
        }
        if (jagsaalt) jagsaalt = lodash.orderBy(jagsaalt, ["dun"], ["desc"]);
        var data = {
          labels,
          jagsaalt,
          datasets: [
            {
              label: "Зардал",
              data: zardluud,
              backgroundColor: "rgba(255, 99, 132, 0.5)",
              borderColor: "rgba(255, 99, 132, 0.5)",
              fill: false,
              lineWidth: 10,
            },
          ],
        };
        res.send(data);
      } else res.send(result);
    })
    .catch((err) => {
      next(err);
    });
});

exports.borluulaltiinTailanAvya = asyncHandler(async (req, res, next) => {
  var group = {
    _id: {},
    tulukh: {
      $sum: "$avlaga.guilgeenuud.tulukhDun",
    },
    tulsun: {
      $sum: "$avlaga.guilgeenuud.tulsunDun",
    },
    khyamdral: {
      $sum: "$avlaga.guilgeenuud.khyamdral",
    },
  };
  var sort = {};
  if (req.body.nariivchlal == "year") {
    group["_id"]["year"] = {
      $year: {
        date: "$avlaga.guilgeenuud.ognoo",
        timezone: "Asia/Ulaanbaatar",
      },
    };
    sort["_id.year"] = 1;
  } else if (req.body.nariivchlal == "month") {
    group["_id"]["year"] = {
      $year: {
        date: "$avlaga.guilgeenuud.ognoo",
        timezone: "Asia/Ulaanbaatar",
      },
    };
    group["_id"]["month"] = {
      $month: {
        date: "$avlaga.guilgeenuud.ognoo",
        timezone: "Asia/Ulaanbaatar",
      },
    };
    sort["_id.year"] = 1;
    sort["_id.month"] = 1;
  } else if (req.body.nariivchlal == "day") {
    group["_id"]["year"] = {
      $year: {
        date: "$avlaga.guilgeenuud.ognoo",
        timezone: "Asia/Ulaanbaatar",
      },
    };
    group["_id"]["month"] = {
      $month: {
        date: "$avlaga.guilgeenuud.ognoo",
        timezone: "Asia/Ulaanbaatar",
      },
    };
    group["_id"]["day"] = {
      $dayOfMonth: {
        date: "$avlaga.guilgeenuud.ognoo",
        timezone: "Asia/Ulaanbaatar",
      },
    };
    sort["_id.year"] = 1;
    sort["_id.month"] = 1;
    sort["_id.day"] = 1;
  }
  let query = [
    {
      $match: {
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
        tuluv: {
          $ne: -1,
        },
        "avlaga.guilgeenuud.ognoo": {
          $gte: new Date(req.body.ekhlekhOgnoo),
          $lte: new Date(req.body.duusakhOgnoo),
        },
        "avlaga.guilgeenuud.guilgeeKhiisenAjiltniiNer": {
          $ne: "System",
        },
        "avlaga.guilgeenuud.turul": {
          $nin: ["baritsaa"],
        },
      },
    },
    {
      $group: group,
    },
    {
      $sort: sort,
    },
  ];
  var turluur = await Geree.aggregate([
    {
      $unwind: {
        path: "$avlaga.guilgeenuud",
      },
    },
    {
      $match: {
        baiguullagiinId: req.body.baiguullagiinId,
        barilgiinId: req.body.barilgiinId,
        tuluv: {
          $ne: -1,
        },
        "avlaga.guilgeenuud.guilgeeKhiisenAjiltniiNer": {
          $ne: "System",
        },
        "avlaga.guilgeenuud.ognoo": {
          $gte: new Date(req.body.ekhlekhOgnoo),
          $lte: new Date(req.body.duusakhOgnoo),
        },
        "avlaga.guilgeenuud.turul": {
          $nin: ["baritsaa"],
        },
      },
    },
    {
      $group: {
        _id: "$avlaga.guilgeenuud.turul",
        tulsun: {
          $sum: {
            $ifNull: ["$avlaga.guilgeenuud.tulsunDun", 0],
          },
        },
      },
    },
    {
      $sort: {
        tulsun: -1,
      },
    },
  ]);
  Geree.aggregate(query)
    .then((result) => {
      if (result && result.length > 0) {
        var labels = [];
        var tuluvluguunuud = [];
        var guitsetgeluud = [];
        //var tuluvluguu = 0;
        console.log("result", result);
        result.forEach((a) => {
          if (req.body.nariivchlal == "year") labels.push(a["_id"].year);
          else if (req.body.nariivchlal == "month")
            labels.push(a["_id"].year + "/" + a["_id"].month);
          else if (req.body.nariivchlal == "day")
            labels.push(
              a["_id"].year + "/" + a["_id"].month + "/" + a["_id"].day
            );
          //tuluvluguu = tuluvluguu + a.tulukh - a.tulsun - a.khyamdral;
          tuluvluguunuud.push(a.tulukh.toFixed(2));
          guitsetgeluud.push(a.tulsun.toFixed(2));
        });
        var jagsaalt = [];
        if (turluur && turluur.length > 0) {
          turluur.forEach((x) => {
            if (x._id == "bank") {
              jagsaalt.push({
                ner: "Харилцах",
                dun: x.tulsun,
                ungu: "rgba(255, 99, 132, 0.5)",
              });
            } else if (x._id == "barter") {
              jagsaalt.push({
                ner: "Бартер",
                dun: x.tulsun,
                ungu: "rgba(53, 162, 235, 0.5)",
              });
            } else if (x._id == "qpay") {
              jagsaalt.push({
                ner: "Qpay",
                dun: x.tulsun,
                ungu: "rgba(0, 255, 0, 0.5)",
              });
            } else if (x._id == "voucher") {
              jagsaalt.push({
                ner: "Ваучер",
                dun: x.tulsun,
                ungu: "rgba(255, 0, 255, 0.5)",
              });
            }
          });
        }
        var data = {
          labels,
          jagsaalt,
          datasets: [
            {
              label: "Төлөвлөгөө",
              data: tuluvluguunuud,
              backgroundColor: "rgba(255, 99, 132, 0.5)",
              borderColor: "rgba(255, 99, 132, 0.5)",
              fill: false,
              lineWidth: 10,
            },
            {
              label: "Гүйцэтгэл",
              data: guitsetgeluud,
              fill: false,
              borderColor: "rgba(53, 162, 235, 0.5)",
              backgroundColor: "rgba(53, 162, 235, 0.5)",
              lineWidth: 10,
            },
          ],
        };
        res.send(data);
      }
      res.send(result);
    })
    .catch((err) => {
      next(err);
    });
});

exports.ashigiinTailanAvya = asyncHandler(async (req, res, next) => {
  try {
    var group = {
      _id: {},
      dun: {
        $sum: "$dun",
      },
    };
    var sort = {};
    if (req.body.nariivchlal == "year") {
      group["_id"]["year"] = {
        $year: { date: "$ognoo", timezone: "Asia/Ulaanbaatar" },
      };
      sort["_id.year"] = 1;
    } else if (req.body.nariivchlal == "month") {
      group["_id"]["year"] = {
        $year: { date: "$ognoo", timezone: "Asia/Ulaanbaatar" },
      };
      group["_id"]["month"] = {
        $month: { date: "$ognoo", timezone: "Asia/Ulaanbaatar" },
      };
      sort["_id.year"] = 1;
      sort["_id.month"] = 1;
    } else if (req.body.nariivchlal == "day") {
      group["_id"]["year"] = {
        $year: { date: "$ognoo", timezone: "Asia/Ulaanbaatar" },
      };
      group["_id"]["month"] = {
        $month: { date: "$ognoo", timezone: "Asia/Ulaanbaatar" },
      };
      group["_id"]["day"] = {
        $dayOfMonth: { date: "$ognoo", timezone: "Asia/Ulaanbaatar" },
      };
      sort["_id.year"] = 1;
      sort["_id.month"] = 1;
      sort["_id.day"] = 1;
    }
    let query = [
      {
        $match: {
          baiguullagiinId: req.body.baiguullagiinId,
          barilgiinId: req.body.barilgiinId,
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
                  Amt: {
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
                  amount: {
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
          ognoo: { $ifNull: ["$TxDt", "$tranDate"] },
        },
      },
      {
        $group: group,
      },
      {
        $sort: sort,
      },
    ];
    var zardluud = await BankniiGuilgee.aggregate(query);
    query = [
      {
        $match: {
          baiguullagiinId: req.body.baiguullagiinId,
          barilgiinId: req.body.barilgiinId,
          "kholbosonGereeniiId.0": {
            $exists: true,
          },
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
                  Amt: {
                    $gt: 0,
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
                  amount: {
                    $gt: 0,
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
          ognoo: { $ifNull: ["$TxDt", "$tranDate"] },
        },
      },
      {
        $group: group,
      },
      {
        $sort: sort,
      },
    ];
    var orloguud = await BankniiGuilgee.aggregate(query);
    var niitZardal = 0;
    var niitOrlogo = 0;
    var zardliinObjectuud = [];
    var orlogiinObjectuud = [];
    if (zardluud && zardluud.length > 0) {
      zardluud.forEach((a) => {
        var zardliinObject = {};
        if (req.body.nariivchlal == "year")
          zardliinObject.ognoo = new Date(a["_id"].year, 0, 1);
        //zardliinObject.ognoo = a["_id"].year;
        else if (req.body.nariivchlal == "month")
          zardliinObject.ognoo = new Date(a["_id"].year, a["_id"].month - 1, 1);
        //zardliinObject.ognoo = a["_id"].year + "/" + a["_id"].month;
        else if (req.body.nariivchlal == "day")
          zardliinObject.ognoo = new Date(
            a["_id"].year,
            a["_id"].month - 1,
            a["_id"].day
          );
        //zardliinObject.ognoo = a["_id"].year + "/" + a["_id"].month + "/" + a["_id"].day;
        zardliinObject.dun = (a.dun * -1).toFixed(2);
        niitZardal = niitZardal + a.dun * -1;
        zardliinObjectuud.push(zardliinObject);
      });
    }

    if (orloguud && orloguud.length > 0) {
      orloguud.forEach((a) => {
        var orlogiinObject = {};
        if (req.body.nariivchlal == "year")
          orlogiinObject.ognoo = new Date(a["_id"].year, 0, 1);
        //orlogiinObject.ognoo = a["_id"].year;
        else if (req.body.nariivchlal == "month")
          orlogiinObject.ognoo = new Date(a["_id"].year, a["_id"].month - 1, 1);
        //orlogiinObject.ognoo = a["_id"].year + "/" + a["_id"].month;
        else if (req.body.nariivchlal == "day")
          orlogiinObject.ognoo = new Date(
            a["_id"].year,
            a["_id"].month - 1,
            a["_id"].day
          );
        //orlogiinObject.ognoo = a["_id"].year + "/" + a["_id"].month + "/" + a["_id"].day;
        orlogiinObject.dun = a.dun.toFixed(2);
        niitOrlogo = niitOrlogo + a.dun;
        orlogiinObjectuud.push(orlogiinObject);
      });
    }

    var labels = [];
    var orlogoDatanuud = [];
    var zarlagaDatanuud = [];
    if (zardliinObjectuud && orlogiinObjectuud) {
      zardliinObjectuud.forEach((x) => {
        var oldson = orlogiinObjectuud.find(
          (element) => element.ognoo.getTime() === x.ognoo.getTime()
        );
        if (!oldson)
          orlogiinObjectuud.push({
            ognoo: x.ognoo,
            dun: 0,
          });
      });
      orlogiinObjectuud.forEach((x) => {
        var oldson = zardliinObjectuud.find(
          (element) => element.ognoo.getTime() === x.ognoo.getTime()
        );
        if (!oldson)
          zardliinObjectuud.push({
            ognoo: x.ognoo,
            dun: 0,
          });
      });
      zardliinObjectuud = lodash.orderBy(zardliinObjectuud, ["ognoo"], ["asc"]);
      orlogiinObjectuud = lodash.orderBy(orlogiinObjectuud, ["ognoo"], ["asc"]);
      zardliinObjectuud.forEach((a) => {
        if (req.body.nariivchlal == "year")
          labels.push(moment(a.ognoo).format("YYYY"));
        else if (req.body.nariivchlal == "month")
          labels.push(moment(a.ognoo).format("YYYY/MM"));
        else if (req.body.nariivchlal == "day")
          labels.push(moment(a.ognoo).format("YYYY/MM/DD"));
        zarlagaDatanuud.push(a.dun);
      });
      orlogiinObjectuud.forEach((a) => {
        orlogoDatanuud.push(a.dun);
      });
    }
    var jagsaalt = [
      {
        ner: "Орлого",
        dun: niitOrlogo,
        ungu: unguud[0],
      },
      {
        ner: "Зарлага",
        dun: niitZardal,
        ungu: unguud[1],
      },
      {
        ner: "Ашиг",
        dun: niitOrlogo - niitZardal,
        ungu: unguud[2],
      },
    ];
    var data = {
      labels,
      jagsaalt,
      datasets: [
        {
          label: "Зарлага",
          data: zarlagaDatanuud,
          backgroundColor: unguud[0],
          borderColor: unguud[0],
          fill: false,
          lineWidth: 10,
        },
        {
          label: "Орлого",
          data: orlogoDatanuud,
          fill: false,
          borderColor: unguud[1],
          backgroundColor: unguud[1],
          lineWidth: 10,
        },
      ],
    };
    res.send(data);
  } catch (err) {
    next(err);
  }
});

exports.avlagiinTailanAvya = asyncHandler(async (req, res, next) => {
  var group = {
    _id: {},
    tulukh: {
      $sum: "$avlaga.guilgeenuud.tulukhDun",
    },
    tulsun: {
      $sum: "$avlaga.guilgeenuud.tulsunDun",
    },
    khyamdral: {
      $sum: "$avlaga.guilgeenuud.khyamdral",
    },
  };
  var sort = {};
  if (req.body.nariivchlal == "year") {
    group["_id"]["year"] = {
      $year: {
        date: "$avlaga.guilgeenuud.ognoo",
        timezone: "Asia/Ulaanbaatar",
      },
    };
    sort["_id.year"] = 1;
  } else if (req.body.nariivchlal == "month") {
    group["_id"]["year"] = {
      $year: {
        date: "$avlaga.guilgeenuud.ognoo",
        timezone: "Asia/Ulaanbaatar",
      },
    };
    group["_id"]["month"] = {
      $month: {
        date: "$avlaga.guilgeenuud.ognoo",
        timezone: "Asia/Ulaanbaatar",
      },
    };
    sort["_id.year"] = 1;
    sort["_id.month"] = 1;
  } else if (req.body.nariivchlal == "day") {
    group["_id"]["year"] = {
      $year: {
        date: "$avlaga.guilgeenuud.ognoo",
        timezone: "Asia/Ulaanbaatar",
      },
    };
    group["_id"]["month"] = {
      $month: {
        date: "$avlaga.guilgeenuud.ognoo",
        timezone: "Asia/Ulaanbaatar",
      },
    };
    group["_id"]["day"] = {
      $dayOfMonth: {
        date: "$avlaga.guilgeenuud.ognoo",
        timezone: "Asia/Ulaanbaatar",
      },
    };
    sort["_id.year"] = 1;
    sort["_id.month"] = 1;
    sort["_id.day"] = 1;
  }
  let query = [
    {
      $match: {
        baiguullagiinId: req.body.baiguullagiinId,
        barilgiinId: req.body.barilgiinId,
        tuluv: {
          $ne: -1,
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
        "avlaga.guilgeenuud.guilgeeKhiisenAjiltniiNer": {
          $ne: "System",
        },
        "avlaga.guilgeenuud.ognoo": {
          $lte: new Date(req.body.duusakhOgnoo),
        },
        "avlaga.guilgeenuud.turul": {
          $nin: ["baritsaa"],
        },
      },
    },
    {
      $group: group,
    },
    {
      $sort: sort,
    },
  ];
  var turluur = await Geree.aggregate([
    {
      $match: {
        barilgiinId: req.body.barilgiinId,
        baiguullagiinId: req.body.baiguullagiinId,
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
          $lte: new Date(req.body.duusakhOgnoo),
        },
        "avlaga.guilgeenuud.guilgeeKhiisenAjiltniiNer": {
          $ne: "System",
        },
        "avlaga.guilgeenuud.turul": {
          $nin: ["baritsaa"],
        },
      },
    },
    {
      $facet: {
        tsutslagdsan: [
          {
            $match: {
              tuluv: -1,
            },
          },
          {
            $project: {
              uldegdel: {
                $subtract: [
                  {
                    $ifNull: ["$avlaga.guilgeenuud.tulukhDun", 0],
                  },
                  {
                    $add: [
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
              _id: "tsutslagdsan",
              uldegdel: {
                $sum: "$uldegdel",
              },
            },
          },
        ],
        khurimtlagdsan: [
          {
            $match: {
              "avlaga.guilgeenuud.ognoo": {
                $lt: new Date(req.body.ekhlekhOgnoo),
              },
              tuluv: {
                $ne: -1,
              },
            },
          },
          {
            $group: {
              _id: "$gereeniiDugaar",
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
              dun: {
                $subtract: [
                  "$tulukh",
                  {
                    $sum: ["$tulsun", "$khyamdral"],
                  },
                ],
              },
            },
          },
          {
            $match: {
              dun: {
                $gt: 0,
              },
            },
          },
          {
            $group: {
              _id: "umnukhSariin",
              uldegdel: {
                $sum: "$dun",
              },
            },
          },
        ],
        eneSariin: [
          {
            $match: {
              "avlaga.guilgeenuud.ognoo": {
                $lte: new Date(req.body.duusakhOgnoo),
                $gte: new Date(req.body.ekhlekhOgnoo),
              },
              tuluv: {
                $ne: -1,
              },
            },
          },
          {
            $project: {
              uldegdel: {
                $subtract: [
                  {
                    $ifNull: ["$avlaga.guilgeenuud.tulukhDun", 0],
                  },
                  {
                    $add: [
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
              _id: "niit",
              uldegdel: {
                $sum: "$uldegdel",
              },
            },
          },
        ],
        niit: [
          {
            $project: {
              uldegdel: {
                $subtract: [
                  {
                    $ifNull: ["$avlaga.guilgeenuud.tulukhDun", 0],
                  },
                  {
                    $add: [
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
                $sum: "$uldegdel",
              },
            },
          },
          {
            $match: {
              uldegdel: {
                $gt: 0,
              },
            },
          },
          {
            $group: {
              _id: "niit",
              uldegdel: {
                $sum: "$uldegdel",
              },
            },
          },
        ],
      },
    },
  ]);
  console.log("turluur", JSON.stringify(turluur, null, 4));
  Geree.aggregate(query)
    .then((result) => {
      if (result && result.length > 0) {
        var labels = [];
        var tuluvluguunuud = [];
        var guitsetgeluud = [];
        var ekhlekhSar = new Date(req.body.ekhlekhOgnoo).getMonth() + 1; // returns 0 - 11
        var ekhlekhOn = new Date(req.body.ekhlekhOgnoo).getFullYear();
        var ekhlekhUdur = new Date(req.body.ekhlekhOgnoo).getDate();
        var niitAvlaga = 0;
        result.forEach((a) => {
          niitAvlaga = niitAvlaga + a.tulukh;
          niitAvlaga = niitAvlaga - a.tulsun;
          niitAvlaga = niitAvlaga - a.khyamdral;
          if (
            a["_id"].year > ekhlekhOn ||
            (a["_id"].year == ekhlekhOn && a["_id"].month >= ekhlekhSar) ||
            (a["_id"].year == ekhlekhOn &&
              a["_id"].month == ekhlekhSar &&
              a["_id"].day >= ekhlekhUdur)
          ) {
            if (req.body.nariivchlal == "year") labels.push(a["_id"].year);
            else if (req.body.nariivchlal == "month")
              labels.push(a["_id"].year + "/" + a["_id"].month);
            else if (req.body.nariivchlal == "day")
              labels.push(
                a["_id"].year + "/" + a["_id"].month + "/" + a["_id"].day
              );
            tuluvluguunuud.push(niitAvlaga.toFixed(2));
            guitsetgeluud.push(a.tulsun.toFixed(2));
          }
        });
        var jagsaalt = [];
        if (turluur && turluur.length > 0) {
          if (
            turluur[0] &&
            turluur[0].tsutslagdsan &&
            turluur[0].tsutslagdsan.length > 0
          )
            jagsaalt.push({
              ner: "Цуцлагдсан",
              dun: turluur[0].tsutslagdsan[0].uldegdel,
              ungu: unguud[0],
            });
          if (
            turluur[0] &&
            turluur[0].khurimtlagdsan &&
            turluur[0].khurimtlagdsan.length > 0
          )
            jagsaalt.push({
              ner: "Хуримтлагдсан",
              dun: turluur[0].khurimtlagdsan[0].uldegdel,
              ungu: unguud[1],
            });
          if (
            turluur[0] &&
            turluur[0].eneSariin &&
            turluur[0].eneSariin.length > 0
          )
            jagsaalt.push({
              ner: "Энэ сарын",
              dun: turluur[0].eneSariin[0].uldegdel,
              ungu: unguud[3],
            });
          if (turluur[0] && turluur[0].niit && turluur[0].niit.length > 0)
            jagsaalt.push({
              ner: "Нийт",
              dun: turluur[0].niit[0].uldegdel,
              ungu: unguud[2],
            });
        }
        var data = {
          labels,
          jagsaalt,
          datasets: [
            {
              label: "Нийт авлага",
              data: tuluvluguunuud,
              backgroundColor: "rgba(255, 99, 132, 0.5)",
              borderColor: "rgba(255, 99, 132, 0.5)",
              fill: false,
              lineWidth: 10,
            },
            {
              label: "Нийт төлсөн",
              data: guitsetgeluud,
              fill: false,
              borderColor: "rgba(53, 162, 235, 0.5)",
              backgroundColor: "rgba(53, 162, 235, 0.5)",
              lineWidth: 10,
            },
          ],
        };
        res.send(data);
      } else res.send(result);
    })
    .catch((err) => {
      next(err);
    });
});

exports.avlagiinChartSalbaraarAvya = asyncHandler(async (req, res, next) => {
  var baiguullaga = await Baiguullaga.findById(req.body.baiguullagiinId);
  var group = {
    _id: "$barilgiinId",
    tulukh: {
      $sum: "$avlaga.guilgeenuud.tulukhDun",
    },
    tulsun: {
      $sum: "$avlaga.guilgeenuud.tulsunDun",
    },
    khyamdral: {
      $sum: "$avlaga.guilgeenuud.khyamdral",
    },
  };
  let query = [
    {
      $match: {
        baiguullagiinId: req.body.baiguullagiinId,
      },
    },
    {
      $unwind: {
        path: "$avlaga.guilgeenuud",
      },
    },
    {
      $unwind: {
        path: "$avlaga.guilgeenuud.ognoo",
      },
    },
    {
      $match: {
        tuluv: {
          $ne: -1,
        },
        "avlaga.guilgeenuud.guilgeeKhiisenAjiltniiNer": {
          $ne: "System",
        },
        "avlaga.guilgeenuud.ognoo": {
          $gte: new Date("2022-01-01 00:00:00"),
          $lte: new Date("2022-12-31 23:59:59"),
        },
        "avlaga.guilgeenuud.turul": {
          $nin: ["baritsaa"],
        },
      },
    },
    {
      $group: group,
    },
  ];
  var khariu = await Geree.aggregate(query);
  var niitAvlaga = 0;
  var labels = [];
  var series = [];
  khariu.forEach((a) => {
    niitAvlaga = niitAvlaga + a.tulukh;
    niitAvlaga = niitAvlaga - a.tulsun;
    niitAvlaga = niitAvlaga - a.khyamdral;
    series.push(niitAvlaga.toFixed(2));
    var barilgiinNer = "";
    try {
      barilgiinNer = baiguullaga.barilguud.find((x) => x._id == a._id).ner;
    } catch (aldaa) {}
    labels.push(barilgiinNer);
  });
  var data = {
    series,
    backgroundColor: chartUnguud,
    options: {
      dataLabels: {
        enabled: false,
      },
      theme: {
        palette: "palette1",
      },
      labels,
      legend: {
        horizontalAlign: "left",
        show: true,
        position: "bottom",
        fontSize: "13px",
        itemMargin: {
          horizontal: 20,
          vertical: 3,
        },
      },
    },
  };
  res.send(data);
});

exports.orlogiinChartSalbaraarAvya = asyncHandler(async (req, res, next) => {
  var baiguullaga = await Baiguullaga.findById(req.body.baiguullagiinId);
  var group = {
    _id: "$barilgiinId",
    tulsun: {
      $sum: "$avlaga.guilgeenuud.tulsunDun",
    },
  };
  let query = [
    {
      $match: {
        baiguullagiinId: req.body.baiguullagiinId,
      },
    },
    {
      $unwind: {
        path: "$avlaga.guilgeenuud",
      },
    },
    {
      $unwind: {
        path: "$avlaga.guilgeenuud.ognoo",
      },
    },
    {
      $match: {
        tuluv: {
          $ne: -1,
        },
        "avlaga.guilgeenuud.guilgeeKhiisenAjiltniiNer": {
          $ne: "System",
        },
        "avlaga.guilgeenuud.ognoo": {
          $gte: new Date("2022-01-01 00:00:00"),
          $lte: new Date("2022-12-31 23:59:59"),
        },
        "avlaga.guilgeenuud.turul": {
          $nin: ["baritsaa"],
        },
      },
    },
    {
      $group: group,
    },
  ];
  var khariu = await Geree.aggregate(query);
  var labels = [];
  var series = [];
  khariu.forEach((a) => {
    series.push(a.tulsun.toFixed(2));
    var barilgiinNer = "";
    try {
      barilgiinNer = baiguullaga.barilguud.find((x) => x._id == a._id).ner;
    } catch (aldaa) {}
    labels.push(barilgiinNer);
  });
  var data = {
    series,
    backgroundColor: chartUnguud,
    options: {
      dataLabels: {
        enabled: false,
      },
      theme: {
        palette: "palette1",
      },
      labels,
      legend: {
        horizontalAlign: "left",
        show: true,
        position: "bottom",
        fontSize: "13px",
        itemMargin: {
          horizontal: 20,
          vertical: 3,
        },
      },
    },
  };
  res.send(data);
});

exports.orlogiinChartSalbarKhugatsaagaarAvya = asyncHandler(
  async (req, res, next) => {
    var baiguullaga = await Baiguullaga.findById(req.body.baiguullagiinId);
    //aldax nukhtsul
    var nariivchlal = req.body.nariivchlal ? req.body.nariivchlal : "month";
    var ekhlekhOgnoo = req.body.ekhlekhOgnoo
      ? req.body.ekhlekhOgnoo
      : "2022-01-01 00:00:00";
    var duusakhOgnoo = req.body.duusakhOgnoo
      ? req.body.duusakhOgnoo
      : "2022-12-31 23:59:59";
    ekhlekhOgnoo = new Date(ekhlekhOgnoo);
    duusakhOgnoo = new Date(duusakhOgnoo);
    var group = {
      _id: {
        barilgiinId: "$barilgiinId",
      },
      tulsun: {
        $sum: "$avlaga.guilgeenuud.tulsunDun",
      },
    };
    if (nariivchlal == "year") {
      group["_id"]["year"] = {
        $year: {
          date: "$avlaga.guilgeenuud.ognoo",
          timezone: "Asia/Ulaanbaatar",
        },
      };
    } else if (nariivchlal == "month") {
      group["_id"]["year"] = {
        $year: {
          date: "$avlaga.guilgeenuud.ognoo",
          timezone: "Asia/Ulaanbaatar",
        },
      };
      group["_id"]["month"] = {
        $month: {
          date: "$avlaga.guilgeenuud.ognoo",
          timezone: "Asia/Ulaanbaatar",
        },
      };
    } else if (nariivchlal == "day") {
      group["_id"]["year"] = {
        $year: {
          date: "$avlaga.guilgeenuud.ognoo",
          timezone: "Asia/Ulaanbaatar",
        },
      };
      group["_id"]["month"] = {
        $month: {
          date: "$avlaga.guilgeenuud.ognoo",
          timezone: "Asia/Ulaanbaatar",
        },
      };
      group["_id"]["day"] = {
        $dayOfMonth: {
          date: "$avlaga.guilgeenuud.ognoo",
          timezone: "Asia/Ulaanbaatar",
        },
      };
    }
    let query = [
      {
        $match: {
          baiguullagiinId: req.body.baiguullagiinId,
        },
      },
      {
        $unwind: {
          path: "$avlaga.guilgeenuud",
        },
      },
      {
        $match: {
          tuluv: {
            $ne: -1,
          },
          "avlaga.guilgeenuud.guilgeeKhiisenAjiltniiNer": {
            $ne: "System",
          },
          "avlaga.guilgeenuud.ognoo": {
            $gte: ekhlekhOgnoo,
            $lte: duusakhOgnoo,
          },
          "avlaga.guilgeenuud.turul": {
            $nin: ["baritsaa"],
          },
        },
      },
      {
        $group: group,
      },
    ];
    var khariu = await Geree.aggregate(query);
    var categories = [];
    const chartData = {
      series: baiguullaga.barilguud.map((mur, index) => ({
        backgroundColor: chartUnguud[index],
        borderColor: chartUnguud[index],
        fill: false,
        _id: mur._id,
        label: mur.ner,
        data: [],
      })),
      categories: [],
    };
    khariu.forEach((a) => {
      if (nariivchlal == "year") {
        if (!categories.find((b) => b.year === a["_id"].year))
          categories.push({
            year: a["_id"].year,
          });
      } else if (nariivchlal == "month") {
        if (
          !categories.find(
            (b) => b.year === a["_id"].year && b.month === a["_id"].month
          )
        )
          categories.push({
            year: a["_id"].year,
            month: a["_id"].month,
          });
      } else if (nariivchlal == "day") {
        if (
          !categories.find(
            (b) =>
              b.year === a["_id"].year &&
              b.month === a["_id"].month &&
              b.day === a["_id"].day
          )
        )
          categories.push({
            year: a["_id"].year,
            month: a["_id"].month,
            day: a["_id"].day,
          });
      }
    });
    if (nariivchlal == "year")
      categories.sort(function (a, b) {
        return a.year - b.year;
      });
    else if (nariivchlal == "month")
      categories.sort(function (a, b) {
        return a.year - b.year || a.month - b.month;
      });
    else if (nariivchlal == "day")
      categories.sort(function (a, b) {
        return a.year - b.year || a.month - b.month || a.day - b.day;
      });
    categories.forEach((category) => {
      var catList;
      if (nariivchlal == "year")
        catList = khariu.filter((a) => a["_id"].year == category.year);
      else if (nariivchlal == "month")
        catList = khariu.filter(
          (a) =>
            a["_id"].year == category.year && a["_id"].month == category.month
        );
      else if (nariivchlal == "day")
        catList = khariu.filter(
          (a) =>
            a["_id"].year == category.year &&
            a["_id"].month == category.month &&
            a["_id"].day == category.day
        );
      chartData.series.forEach(({ data, _id }) => {
        const barilgaData = catList.find(
          (mur) => mur["_id"].barilgiinId == _id
        );
        console.log("barilgaData", barilgaData);
        if (barilgaData?.tulsun > 0) data.push(barilgaData.tulsun.toFixed(2));
        else data.push(0);
      });
      if (nariivchlal == "year") chartData.categories.push(`${category.year}`);
      else if (nariivchlal == "month")
        chartData.categories.push(`${category.year}-${category.month}`);
      else if (nariivchlal == "day")
        chartData.categories.push(
          `${category.year}-${category.month}-${category.day}`
        );
    });

    var data = {
      labels: chartData.categories,
      datasets: chartData.series,
    };
    res.send(data);
  }
);
