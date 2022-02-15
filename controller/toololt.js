const asyncHandler = require("express-async-handler");
const Geree = require("../models/geree");
const Khariltsagch = require("../models/khariltsagch");
const moment = require("moment");
const BankniiGuilgee = require("../models/bankniiGuilgee");

exports.gereeniiToololtAvya = asyncHandler(async (req, res, next) => {
  let query = [
    {
      '$match': {
        'baiguullagiinId': req.body.baiguullagiinId,
        'barilgiinId': req.body.barilgiinId
      }
    }, {
      '$project': {
        'khugatsaaKhetersen': {
          '$cond': [
            {
              '$lt': [
                '$duusakhOgnoo', new Date()
              ],
              '$ne':[
                '$tuluv',-1
              ]
            }, 1, 0
          ]
        },
        'kheviin': {
          '$cond': [
            {
              '$gte': [
                '$duusakhOgnoo', new Date()
              ]
            }, 1, 0
          ]
        },
        'sungakh': {
          '$cond': [
            {
              '$lte': [
                '$duusakhOgnoo', moment(new Date).add(1, 'month')
              ]
            }, 1, 0
          ]
        },
        'tsutsalsan': {
          '$cond': [
            {
              '$eq': [
                '$tuluv', -1
              ]
            }, 1, 0
          ]
        }
      }
    }, {
      '$group': {
        '_id': 'Too',
        'khugatsaaKhetersen': {
          '$sum': '$khugatsaaKhetersen'
        },
        'kheviin': {
          '$sum': '$kheviin'
        },
        'sungakh': {
          '$sum': '$sungakh'
        },
        'tsutsalsan': {
          '$sum': '$tsutsalsan'
        }
      }
    }
  ]
  Geree.aggregate(query).then((result) => {
    res.send(result);
  })
    .catch((err) => {
      next(err);
    });;
});

exports.guilgeeniiToololtAvya = asyncHandler(async (req, res, next) => {
  try {
    var ekhlekhOgnoo = new Date(req.body.ekhlekhOgnoo);
    var duusakhOgnoo = new Date(req.body.duusakhOgnoo);
    let query = [
      {
        '$unwind': {
          'path': '$avlaga.guilgeenuud'
        }
      }, {
        '$match': {
          'avlaga.guilgeenuud.ognoo': {
            '$lt': ekhlekhOgnoo
          },
          'baiguullagiinId': req.body.baiguullagiinId,
          'barilgiinId': req.body.barilgiinId,
          'tuluv': {
            '$ne': -1
          }
        }
      }, {
        '$group': {
          '_id': '$gereeniiDugaar',
          'tulukh': {
            '$sum': '$avlaga.guilgeenuud.tulukhDun'
          },
          'khyamdral': {
            '$sum': '$avlaga.guilgeenuud.khyamdral'
          },
          'tulsun': {
            '$sum': '$avlaga.guilgeenuud.tulsunDun'
          }
        }
      }, {
        '$project': {
          'dun': {
            '$subtract': [
              '$tulukh', {
                '$sum': [
                  '$tulsun', '$khyamdral'
                ]
              }
            ]
          }
        }
      }, {
        '$match': {
          'dun': {
            '$gt': 0
          }
        }
      }, {
        '$group': {
          '_id': 'avlaga',
          'dun': {
            '$sum': '$dun'
          }
        }
      }
    ]
    var avlaga = await Geree.aggregate(query);
    query = [
      {
        '$unwind': {
          'path': '$avlaga.guilgeenuud'
        }
      }, {
        '$match': {
          'avlaga.guilgeenuud.ognoo': {
            '$lte': duusakhOgnoo
          },
          'baiguullagiinId': req.body.baiguullagiinId,
          'barilgiinId': req.body.barilgiinId,
          'tuluv': {
            '$ne': -1
          }
        }
      }, {
        '$group': {
          '_id': '$gereeniiDugaar',
          'tulukh': {
            '$sum': '$avlaga.guilgeenuud.tulukhDun'
          },
          'khyamdral': {
            '$sum': '$avlaga.guilgeenuud.khyamdral'
          },
          'tulsun': {
            '$sum': '$avlaga.guilgeenuud.tulsunDun'
          }
        }
      }, {
        '$project': {
          'dun': {
            '$subtract': [{
              '$sum': [
                '$tulsun', '$khyamdral'
              ]
            },
              '$tulukh'
            ]
          }
        }
      }, {
        '$match': {
          'dun': {
            '$gt': 0
          }
        }
      }, {
        '$group': {
          '_id': 'uglugu',
          'dun': {
            '$sum': '$dun'
          }
        }
      }
    ]
    var uglug = await Geree.aggregate(query);
    query = [
      {
        '$match': {
          'daraagiinTulukhOgnoo': {
            '$lte': duusakhOgnoo
          },
          'baiguullagiinId': req.body.baiguullagiinId,
          'barilgiinId': req.body.barilgiinId,
          'tuluv': {
            '$ne': -1
          },
          "uldegdel": {
            "$gte": 0
          }
        }
      }, {
        '$unwind': {
          'path': '$avlaga.guilgeenuud'
        }
      }, {
        '$match': {
          'avlaga.guilgeenuud.ognoo': {
            '$lte': duusakhOgnoo
          }
        }
      }, {
        '$group': {
          '_id': 'khugatsaaKhetersen',
          'tulukh': {
            '$sum': '$avlaga.guilgeenuud.tulukhDun'
          },
          'khyamdral': {
            '$sum': '$avlaga.guilgeenuud.khyamdral'
          },
          'tulsun': {
            '$sum': '$avlaga.guilgeenuud.tulsunDun'
          }
        }
      }, {
        '$project': {
          'dun': {
            '$subtract': [
              '$tulukh', {
                '$sum': [
                  '$tulsun', '$khyamdral'
                ]
              }
            ]
          }
        }
      }
    ];

    var khugatsaaKhetersen = await Geree.aggregate(query);
    query = [
      {
        '$unwind': {
          'path': '$avlaga.guilgeenuud'
        }
      }, {
        '$match': {
          'avlaga.guilgeenuud.ognoo': {
            '$gte': ekhlekhOgnoo,
            '$lte': duusakhOgnoo
          },
          'baiguullagiinId': req.body.baiguullagiinId,
          'barilgiinId': req.body.barilgiinId,
          'tuluv': {
            '$ne': -1
          }
        }
      }, {
        '$group': {
          '_id': 'tulukh',
          'tulukh': {
            '$sum': '$avlaga.guilgeenuud.tulukhDun'
          },
          'khyamdral': {
            '$sum': '$avlaga.guilgeenuud.khyamdral'
          }
        }
      }, {
        '$project': {
          'dun': {
            '$subtract': [
              '$tulukh', '$khyamdral'
            ]
          }
        }
      }
    ]
    var eneSardTulukh = await Geree.aggregate(query);
    query = [
      {
        '$unwind': {
          'path': '$avlaga.guilgeenuud'
        }
      }, {
        '$match': {
          'avlaga.guilgeenuud.ognoo': {
            '$gte': ekhlekhOgnoo,
            '$lte': duusakhOgnoo
          },
          'baiguullagiinId': req.body.baiguullagiinId,
          'barilgiinId': req.body.barilgiinId,
          'avlaga.guilgeenuud.turul': {
            '$nin': ["baritsaa"]
          }
        }
      }, {
        '$group': {
          '_id': 'tulsun',
          'dun': {
            '$sum': '$avlaga.guilgeenuud.tulsunDun'
          }
        }
      }
    ]
    var eneSardTulsun = await Geree.aggregate(query);

    query = [
      {
        '$unwind': {
          'path': '$avlaga.guilgeenuud'
        }
      }, {
        '$match': {
          'avlaga.guilgeenuud.ognoo': {
            '$gte': ekhlekhOgnoo,
            '$lte': duusakhOgnoo
          },
          'baiguullagiinId': req.body.baiguullagiinId,
          'barilgiinId': req.body.barilgiinId,
          'tuluv': {
            $ne: -1
          }
        }
      }, {
        '$project': {
          'khyamdral': {
            '$ifNull': [
              '$avlaga.guilgeenuud.khyamdral', 0
            ]
          }
        }
      }, {
        '$group': {
          '_id': 'khyamdral',
          'dun': {
            '$sum': '$khyamdral'
          }
        }
      }
    ]
    var khungulult = await Geree.aggregate(query);

    query = [
      {
        '$match': {
          'baiguullagiinId': req.body.baiguullagiinId,
          'barilgiinId': req.body.barilgiinId,
          'tuluv': {
            '$eq': -1
          }
        }
      }, {
        '$unwind': {
          'path': '$avlaga.guilgeenuud'
        }
      }, {
        '$group': {
          '_id': 'tsutslagdsanAvlaga',
          'tulukh': {
            '$sum': '$avlaga.guilgeenuud.tulukhDun'
          },
          'khyamdral': {
            '$sum': '$avlaga.guilgeenuud.khyamdral'
          },
          'tulsun': {
            '$sum': '$avlaga.guilgeenuud.tulsunDun'
          }
        }
      }, {
        '$project': {
          'dun': {
            '$subtract': [
              '$tulukh', {
                '$sum': [
                  '$tulsun', '$khyamdral'
                ]
              }
            ]
          }
        }
      }
    ];
    var tsutslagdsanAvlaga = await Geree.aggregate(query);
    res.json({ avlaga, uglug, khugatsaaKhetersen, eneSardTulukh, eneSardTulsun, khungulult, tsutslagdsanAvlaga });
  }
  catch (err) {
    next(err);
  }
});

exports.bankniiGuilgeeToololtAvya = asyncHandler(async (req, res, next) => {
  let query;
  if (req.body.bank == "tdb")
    query = [
      {
        '$match': {
          'baiguullagiinId': req.body.baiguullagiinId,
          'barilgiinId': req.body.barilgiinId,
          'dansniiDugaar': req.body.dansniiDugaar,
          "TxDt": {
            $gte: new Date(req.body.ekhlekhOgnoo),
            $lte: new Date(req.body.duusakhOgnoo)
          },
          "Amt": {
            $gte: 0
          }
        }
      }, {
        $facet: {
          kholboson: [{
            $match: {
              "kholbosonGereeniiId.0": {
                $exists: true
              }
            }
          },
          {
            $group: {
              "_id": "''",
              "niit": {
                $sum: 1
              }
            }
          }
          ],
          magadlaltai: [{
            $match: {
              "magadlaltaiGereenuud": {
                $exists: true
              },
              $or: [
                {
                  "kholbosonGereeniiId": {
                    $exists: false
                  }
                },
                {
                  "kholbosonGereeniiId": {
                    $size: 0
                  }
                }
              ]
            }
          },
          {
            $group: {
              "_id": "",
              "niit": {
                $sum: 1
              }
            }
          }
          ],
          "todorkhoigui": [{
            "$match": {
              "magadlaltaiGereenuud.0": {
                $exists: false
              },
              "kholbosonGereeniiId.0": {
                $exists: false
              }
            }
          }, {
            "$group": {
              "_id": "",
              "niit": {
                $sum: 1
              }
            }
          }]
        }
      }
    ]
  else
    query = [
      {
        '$match': {
          'baiguullagiinId': req.body.baiguullagiinId,
          'barilgiinId': req.body.barilgiinId,
          'dansniiDugaar': req.body.dansniiDugaar,
          "tranDate": {
            $gte: new Date(req.body.ekhlekhOgnoo),
            $lte: new Date(req.body.duusakhOgnoo)
          },
          "amount": {
            $gte: 0
          }
        }
      }, {
        $facet: {
          kholboson: [{
            $match: {
              "kholbosonGereeniiId.0": {
                $exists: true
              }
            }
          },
          {
            $group: {
              "_id": "''",
              "niit": {
                $sum: 1
              }
            }
          }
          ],
          magadlaltai: [{
            $match: {
              "magadlaltaiGereenuud": {
                $exists: true
              },
              $or: [
                {
                  "kholbosonGereeniiId": {
                    $exists: false
                  }
                },
                {
                  "kholbosonGereeniiId": {
                    $size: 0
                  }
                }
              ]
            }
          },
          {
            $group: {
              "_id": "",
              "niit": {
                $sum: 1
              }
            }
          }
          ],
          "todorkhoigui": [{
            "$match": {
              "magadlaltaiGereenuud.0": {
                $exists: false
              },
              "kholbosonGereeniiId.0": {
                $exists: false
              }
            }
          }, {
            "$group": {
              "_id": "",
              "niit": {
                $sum: 1
              }
            }
          }]
        }
      }
    ]
  BankniiGuilgee.aggregate(query).then((result) => {
    console.log("bankniiGuilgee", result);
    if (result && result.length > 0) {
      var butsaakh = {
        kholboson: 0,
        magadlaltai: 0,
        todorkhoigui: 0
      }
      if (result[0].kholboson[0]) butsaakh.kholboson = result[0].kholboson[0].niit;
      if (result[0].magadlaltai[0]) butsaakh.magadlaltai = result[0].magadlaltai[0].niit;
      if (result[0].todorkhoigui[0]) butsaakh.todorkhoigui = result[0].todorkhoigui[0].niit;
      butsaakh.niit = butsaakh.kholboson + butsaakh.magadlaltai + butsaakh.todorkhoigui;
      res.send(butsaakh);
    }
    else
      res.send(result);
  })
    .catch((err) => {
      next(err);
    });;
});


exports.khariltsagchiinTooAvya = asyncHandler(async (req, res, next) => {
  let query = [
    {
      '$match': {
        'baiguullagiinId': req.body.baiguullagiinId,
        'barilgiinId': req.params.barilgiinId
      }
    }, {
      '$group': {
        '_id': '$turul',
        'too': {
          '$sum': 1
        }
      }
    }
  ]
  Khariltsagch.aggregate(query).then((result) => {
    res.send(result);
  })
    .catch((err) => {
      next(err);
    });;
});

