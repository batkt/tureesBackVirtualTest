const asyncHandler = require("express-async-handler");
const Geree = require("../models/geree");
const Khariltsagch = require("../models/khariltsagch");
const moment = require("moment");
const BankniiGuilgee = require("../models/bankniiGuilgee");

exports.gereeniiToololtAvya = asyncHandler(async (req, res, next) => {
  let query = [
    {
      $match: {
        baiguullagiinId: req.body.baiguullagiinId,
        barilgiinId: req.body.barilgiinId,
      },
    },
    {
      $facet: {
        tsutsalsan: [
          {
            $project: {
              tsutsalsan: {
                $cond: [
                  {
                    $eq: ["$tuluv", -1],
                  },
                  1,
                  0,
                ],
              },
            },
          },
          {
            $group: {
              _id: "Too",
              tsutsalsan: {
                $sum: "$tsutsalsan",
              },
            },
          },
        ],
        busad: [
          {
            $match: {
              tuluv: {
                $nin: [-1],
              },
            },
          },
          {
            $project: {
              khugatsaaKhetersen: {
                $cond: [
                  {
                    $lt: ["$duusakhOgnoo", new Date()],
                  },
                  1,
                  0,
                ],
              },
              kheviin: {
                $cond: [
                  {
                    $gte: ["$duusakhOgnoo", new Date()],
                  },
                  1,
                  0,
                ],
              },
              sungakh: {
                $cond: [
                  {
                    $and: [
                      { $ne: ["$turGereeEsekh", true] },
                      {
                        $lte: [
                          "$duusakhOgnoo",
                          new Date(moment(new Date()).add(1, "month")),
                        ],
                      },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
          },
          {
            $group: {
              _id: "Too",
              khugatsaaKhetersen: {
                $sum: "$khugatsaaKhetersen",
              },
              kheviin: {
                $sum: "$kheviin",
              },
              sungakh: {
                $sum: "$sungakh",
              },
            },
          },
        ],
      },
    },
  ];
  var turQuery = [
    {
      $match: {
        baiguullagiinId: req.body.baiguullagiinId,
        barilgiinId: req.body.barilgiinId,
        tuluv: {
          $nin: [-1],
        },
      },
    },
    {
      $group: {
        _id: "$turGereeEsekh",
        too: {
          $sum: 1,
        },
      },
    },
  ];
  var turGeree = await Geree.aggregate(turQuery);
  Geree.aggregate(query)
    .then((result) => {
      if (result && result.length > 0) {
        if (
          result[0].tsutsalsan &&
          result[0].tsutsalsan.length > 0 &&
          result[0].busad &&
          result[0].busad.length > 0
        )
          result[0].busad[0].tsutsalsan = result[0].tsutsalsan[0].tsutsalsan;
        result = result[0].busad;
        if (turGeree && turGeree.length > 0 && result && result.length > 0) {
          result[0].turGeree = turGeree.find((a) => a._id)?.too;
          result[0].undsenGeree = turGeree.find((a) => !a._id)?.too;
        }
      }
      res.send(result);
    })
    .catch((err) => {
      next(err);
    });
});

exports.guilgeeniiToololtAvya = asyncHandler(async (req, res, next) => {
  try {
    var ekhlekhOgnoo = new Date(req.body.ekhlekhOgnoo);
    var duusakhOgnoo = new Date(req.body.duusakhOgnoo);
    let query = [
      {
        $unwind: {
          path: "$avlaga.guilgeenuud",
        },
      },
      {
        $match: {
          "avlaga.guilgeenuud.ognoo": {
            $lt: ekhlekhOgnoo,
          },
          "avlaga.guilgeenuud.guilgeeKhiisenAjiltniiNer": {
            $ne: "System",
          },
          "avlaga.guilgeenuud.turul": {
            $nin: ["baritsaa"],
          },
          baiguullagiinId: req.body.baiguullagiinId,
          barilgiinId: req.body.barilgiinId,
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
          _id: "avlaga",
          dun: {
            $sum: "$dun",
          },
          too: {
            $sum: 1,
          },
        },
      },
    ];
    var avlaga = await Geree.aggregate(query);
    query = [
      {
        $unwind: {
          path: "$avlaga.guilgeenuud",
        },
      },
      {
        $match: {
          "avlaga.guilgeenuud.ognoo": {
            $lte: duusakhOgnoo,
            $gte: ekhlekhOgnoo,
          },
          "avlaga.guilgeenuud.guilgeeKhiisenAjiltniiNer": {
            $ne: "System",
          },
          "avlaga.guilgeenuud.turul": "voucher",
          baiguullagiinId: req.body.baiguullagiinId,
          barilgiinId: req.body.barilgiinId,
          tuluv: {
            $ne: -1,
          },
        },
      },
      {
        $group: {
          _id: "uglugu",
          dun: {
            $sum: {
              $ifNull: ["$avlaga.guilgeenuud.tulsunDun", 0],
            },
          },
          too: {
            $sum: 1,
          },
        },
      },
    ];
    var voucher = await Geree.aggregate(query);
    query = [
      {
        $match: {
          daraagiinTulukhOgnoo: {
            $lte: duusakhOgnoo,
          },
          "avlaga.guilgeenuud.guilgeeKhiisenAjiltniiNer": {
            $ne: "System",
          },
          "avlaga.guilgeenuud.turul": {
            $nin: ["baritsaa"],
          },
          baiguullagiinId: req.body.baiguullagiinId,
          barilgiinId: req.body.barilgiinId,
          tuluv: {
            $ne: -1,
          },
          uldegdel: {
            $gte: 0,
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
          "avlaga.guilgeenuud.ognoo": {
            $lte: duusakhOgnoo,
          },
        },
      },
      {
        $group: {
          _id: "khugatsaaKhetersen",
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
    ];

    var khugatsaaKhetersen = await Geree.aggregate(query);
    query = [
      {
        $unwind: {
          path: "$avlaga.guilgeenuud",
        },
      },
      {
        $match: {
          "avlaga.guilgeenuud.ognoo": {
            $gte: ekhlekhOgnoo,
            $lte: duusakhOgnoo,
          },
          baiguullagiinId: req.body.baiguullagiinId,
          barilgiinId: req.body.barilgiinId,
          "avlaga.guilgeenuud.guilgeeKhiisenAjiltniiNer": {
            $ne: "System",
          },
          "avlaga.guilgeenuud.turul": {
            $nin: ["baritsaa"],
          },
          tuluv: {
            $ne: -1,
          },
        },
      },
      {
        $group: {
          _id: "tulukh",
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
        },
      },
      {
        $project: {
          dun: {
            $subtract: ["$tulukh", "$khyamdral"],
          },
        },
      },
    ];
    var eneSardTulukh = await Geree.aggregate(query);
    query = [
      {
        $unwind: {
          path: "$avlaga.guilgeenuud",
        },
      },
      {
        $match: {
          "avlaga.guilgeenuud.ognoo": {
            $gte: ekhlekhOgnoo,
            $lte: duusakhOgnoo,
          },
          "avlaga.guilgeenuud.guilgeeKhiisenAjiltniiNer": {
            $ne: "System",
          },
          baiguullagiinId: req.body.baiguullagiinId,
          barilgiinId: req.body.barilgiinId,
          "avlaga.guilgeenuud.turul": {
            $nin: ["baritsaa"],
          },
        },
      },
      {
        $group: {
          _id: "tulsun",
          dun: {
            $sum: {
              $ifNull: ["$avlaga.guilgeenuud.tulsunDun", 0],
            },
          },
        },
      },
    ];
    var eneSardTulsun = await Geree.aggregate(query);

    query = [
      {
        $unwind: {
          path: "$avlaga.guilgeenuud",
        },
      },
      {
        $match: {
          "avlaga.guilgeenuud.ognoo": {
            $gte: ekhlekhOgnoo,
            $lte: duusakhOgnoo,
          },
          "avlaga.guilgeenuud.guilgeeKhiisenAjiltniiNer": {
            $ne: "System",
          },
          "avlaga.guilgeenuud.turul": {
            $nin: ["baritsaa"],
          },
          baiguullagiinId: req.body.baiguullagiinId,
          barilgiinId: req.body.barilgiinId,
          tuluv: {
            $ne: -1,
          },
        },
      },
      {
        $project: {
          khyamdral: {
            $ifNull: ["$avlaga.guilgeenuud.khyamdral", 0],
          },
        },
      },
      {
        $group: {
          _id: "khyamdral",
          dun: {
            $sum: "$khyamdral",
          },
        },
      },
    ];
    var khungulult = await Geree.aggregate(query);

    query = [
      {
        $match: {
          baiguullagiinId: req.body.baiguullagiinId,
          barilgiinId: req.body.barilgiinId,
          tuluv: -1,
        },
      },
      {
        $unwind: {
          path: "$avlaga.guilgeenuud",
        },
      },
      {
        $match: {
          "avlaga.guilgeenuud.turul": {
            $nin: ["baritsaa"],
          },
          "avlaga.guilgeenuud.ognoo": {
            $lte: duusakhOgnoo,
          },
          "avlaga.guilgeenuud.guilgeeKhiisenAjiltniiNer": {
            $ne: "System",
          },
        },
      },
      {
        $group: {
          _id: "tsutslagdsanAvlaga",
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
    ];
    var tsutslagdsanAvlaga = await Geree.aggregate(query);
    res.json({
      avlaga,
      voucher,
      khugatsaaKhetersen,
      eneSardTulukh,
      eneSardTulsun,
      khungulult,
      tsutslagdsanAvlaga,
    });
  } catch (err) {
    next(err);
  }
});

exports.bankniiGuilgeeToololtAvya = asyncHandler(async (req, res, next) => {
  let query;
  if (req.body.bank == "tdb")
    query = [
      {
        $match: {
          baiguullagiinId: req.body.baiguullagiinId,
          barilgiinId: req.body.barilgiinId,
          dansniiDugaar: req.body.dansniiDugaar,
          TxDt: {
            $gte: new Date(req.body.ekhlekhOgnoo),
            $lte: new Date(req.body.duusakhOgnoo),
          },
          Amt: {
            $gte: 0,
          },
        },
      },
      {
        $facet: {
          kholboson: [
            {
              $match: {
                "kholbosonGereeniiId.0": {
                  $exists: true,
                },
              },
            },
            {
              $group: {
                _id: "''",
                niit: {
                  $sum: 1,
                },
              },
            },
          ],
          magadlaltai: [
            {
              $match: {
                magadlaltaiGereenuud: {
                  $exists: true,
                },
                $or: [
                  {
                    kholbosonGereeniiId: {
                      $exists: false,
                    },
                  },
                  {
                    kholbosonGereeniiId: {
                      $size: 0,
                    },
                  },
                ],
              },
            },
            {
              $group: {
                _id: "",
                niit: {
                  $sum: 1,
                },
              },
            },
          ],
          todorkhoigui: [
            {
              $match: {
                "magadlaltaiGereenuud.0": {
                  $exists: false,
                },
                "kholbosonGereeniiId.0": {
                  $exists: false,
                },
              },
            },
            {
              $group: {
                _id: "",
                niit: {
                  $sum: 1,
                },
              },
            },
          ],
        },
      },
    ];
  else
    query = [
      {
        $match: {
          baiguullagiinId: req.body.baiguullagiinId,
          barilgiinId: req.body.barilgiinId,
          dansniiDugaar: req.body.dansniiDugaar,
          tranDate: {
            $gte: new Date(req.body.ekhlekhOgnoo),
            $lte: new Date(req.body.duusakhOgnoo),
          },
          amount: {
            $gte: 0,
          },
        },
      },
      {
        $facet: {
          kholboson: [
            {
              $match: {
                "kholbosonGereeniiId.0": {
                  $exists: true,
                },
              },
            },
            {
              $group: {
                _id: "''",
                niit: {
                  $sum: 1,
                },
              },
            },
          ],
          magadlaltai: [
            {
              $match: {
                magadlaltaiGereenuud: {
                  $exists: true,
                },
                $or: [
                  {
                    kholbosonGereeniiId: {
                      $exists: false,
                    },
                  },
                  {
                    kholbosonGereeniiId: {
                      $size: 0,
                    },
                  },
                ],
              },
            },
            {
              $group: {
                _id: "",
                niit: {
                  $sum: 1,
                },
              },
            },
          ],
          todorkhoigui: [
            {
              $match: {
                "magadlaltaiGereenuud.0": {
                  $exists: false,
                },
                "kholbosonGereeniiId.0": {
                  $exists: false,
                },
              },
            },
            {
              $group: {
                _id: "",
                niit: {
                  $sum: 1,
                },
              },
            },
          ],
        },
      },
    ];
  BankniiGuilgee.aggregate(query)
    .then((result) => {
      console.log("bankniiGuilgee", result);
      if (result && result.length > 0) {
        var butsaakh = {
          kholboson: 0,
          magadlaltai: 0,
          todorkhoigui: 0,
        };
        if (result[0].kholboson[0])
          butsaakh.kholboson = result[0].kholboson[0].niit;
        if (result[0].magadlaltai[0])
          butsaakh.magadlaltai = result[0].magadlaltai[0].niit;
        if (result[0].todorkhoigui[0])
          butsaakh.todorkhoigui = result[0].todorkhoigui[0].niit;
        butsaakh.niit =
          butsaakh.kholboson + butsaakh.magadlaltai + butsaakh.todorkhoigui;
        res.send(butsaakh);
      } else res.send(result);
    })
    .catch((err) => {
      next(err);
    });
});

exports.khariltsagchiinTooAvya = asyncHandler(async (req, res, next) => {
  try {
    let query = [
      {
        $match: {
          baiguullagiinId: req.body.baiguullagiinId,
          barilgiinId: req.params.barilgiinId,
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
    var khariuTurul = await Khariltsagch.aggregate(query);
    query = [
      {
        $match: {
          baiguullagiinId: req.body.baiguullagiinId,
          barilgiinId: req.params.barilgiinId,
        },
      },
      {
        $project: {
          idevkhiteiEsekh: { $ifNull: ["$idevkhiteiEsekh", false] },
        },
      },
      {
        $group: {
          _id: "$idevkhiteiEsekh",
          too: {
            $sum: 1,
          },
        },
      },
    ];
    var khariu = await Khariltsagch.aggregate(query);
    if (
      khariuTurul &&
      khariuTurul.length > 0 &&
      khariuTurul &&
      khariuTurul.length > 0
    )
      khariuTurul.push(...khariu);
    else if (!khariuTurul && khariuTurul && khariuTurul.length > 0)
      khariuTurul = khariu;
    res.send(khariuTurul);
  } catch (err) {
    next(err);
  }
});

exports.khyanakhSambariinUgugdul = asyncHandler(async (req, res, next) => {
  try {
    var ekhlekhOgnoo = new Date(req.body.ekhlekhOgnoo);
    var duusakhOgnoo = new Date(req.body.duusakhOgnoo);
    var query = [
      {
        $unwind: {
          path: "$avlaga.guilgeenuud",
        },
      },
      {
        $match: {
          "avlaga.guilgeenuud.ognoo": {
            $gte: ekhlekhOgnoo,
            $lte: duusakhOgnoo,
          },
          baiguullagiinId: req.body.baiguullagiinId,
          "avlaga.guilgeenuud.guilgeeKhiisenAjiltniiNer": {
            $ne: "System",
          },
          "avlaga.guilgeenuud.turul": {
            $nin: ["baritsaa"],
          },
          tuluv: {
            $ne: -1,
          },
        },
      },
      {
        $group: {
          _id: "tulukh",
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
        },
      },
      {
        $project: {
          dun: {
            $subtract: ["$tulukh", "$khyamdral"],
          },
        },
      },
    ];
    var eneSardTulukh = await Geree.aggregate(query);
    query = [
      {
        $unwind: {
          path: "$avlaga.guilgeenuud",
        },
      },
      {
        $match: {
          "avlaga.guilgeenuud.ognoo": {
            $gte: ekhlekhOgnoo,
            $lte: duusakhOgnoo,
          },
          "avlaga.guilgeenuud.guilgeeKhiisenAjiltniiNer": {
            $ne: "System",
          },
          baiguullagiinId: req.body.baiguullagiinId,
          "avlaga.guilgeenuud.turul": {
            $nin: ["baritsaa"],
          },
        },
      },
      {
        $group: {
          _id: "tulsun",
          dun: {
            $sum: {
              $ifNull: ["$avlaga.guilgeenuud.tulsunDun", 0],
            },
          },
        },
      },
    ];
    var eneSardTulsun = await Geree.aggregate(query);
    var tulukhDun =
      eneSardTulukh && eneSardTulukh.length > 0 && eneSardTulukh[0].dun
        ? eneSardTulukh[0].dun
        : 0;
    var tulsunDun =
      eneSardTulsun && eneSardTulsun.length > 0 && eneSardTulsun[0].dun
        ? eneSardTulsun[0].dun
        : 0;
    var dutuu = tulukhDun - tulsunDun;
    query = [
      {
        $match: {
          baiguullagiinId: req.body.baiguullagiinId,
        },
      },
      {
        $project: {
          idevkhiteiEsekh: { $ifNull: ["$idevkhiteiEsekh", false] },
        },
      },
      {
        $group: {
          _id: "$idevkhiteiEsekh",
          too: {
            $sum: 1,
          },
        },
      },
    ];
    var khariu = await Khariltsagch.aggregate(query);
    res.send({ dutuu, tulsunDun, khariu });
  } catch (err) {
    next(err);
  }
});
