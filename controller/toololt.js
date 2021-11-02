const asyncHandler = require("express-async-handler");
const Geree = require("../models/geree");
const Khariltsagch = require("../models/khariltsagch");
const moment = require("moment");

exports.gereeniiToololtAvya = asyncHandler(async (req, res, next) => {
  let query = [
    {
      '$match': {
        'baiguullagiinId': req.body.baiguullagiinId
      }
    }, {
      '$project': {
        'unuudurTulukh': {
          '$cond': [
            {
              '$eq': [
                '$daraagiinTulukhOgnoo', new Date()
              ]
            }, 1, 0
          ]
        },
        'khugatsaaKhetersen': {
          '$cond': [
            {
              '$lt': [
                '$daraagiinTulukhOgnoo', new Date()
              ]
            }, 1, 0
          ]
        },
        'kheviin': {
          '$cond': [
            {
              '$gte': [
                '$daraagiinTulukhOgnoo', new Date()
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
        'unuudurTulukh': {
          '$sum': '$unuudurTulukh'
        },
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
    console.log(ekhlekhOgnoo);
    console.log(duusakhOgnoo);
    console.log(req.body.baiguullagiinId);
    let query = [
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
          'tuluv': {
            '$ne': -1
          },
          "uldegdel": {
            "$gte": 0
          }
        }
      }, {
        '$project': {
          'uldegdel': {
            '$subtract': [
              {
                '$ifNull': [
                  '$avlaga.guilgeenuud.tulukhDun', 0
                ]
              }, {
                '$ifNull': [
                  '$avlaga.guilgeenuud.tulsunDun', 0
                ]
              }
            ]
          }
        }
      }, {
        '$group': {
          '_id': 'avlaga',
          'dun': {
            '$sum': '$uldegdel'
          }
        }
      }
    ]
    var avlaga = await Geree.aggregate(query);
    query = [
      {
        '$match': {
          'daraagiinTulukhOgnoo': {
            '$lte': duusakhOgnoo
          },
          'baiguullagiinId': req.body.baiguullagiinId,
          'tuluv': {
            '$ne': -1
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
        '$project': {
          'avlaga': {
            '$subtract': [
              {
                '$ifNull': [
                  '$avlaga.guilgeenuud.tulukhDun', 0
                ]
              }, {
                '$ifNull': [
                  '$avlaga.guilgeenuud.tulsunDun', 0
                ]
              }
            ]
          }
        }
      }, {
        '$group': {
          '_id': 'khugatsaaKhetersen',
          'dun': {
            '$sum': '$avlaga'
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
          'tuluv': {
            '$ne': -1
          }
        }
      }, {
        '$project': {
          'tulukh': {
            '$ifNull': [
              '$avlaga.guilgeenuud.tulukhDun', 0
            ]
          }
        }
      }, {
        '$group': {
          '_id': 'tulukh',
          'dun': {
            '$sum': '$tulukh'
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
          'tuluv': {
            '$ne': -1
          }
        }
      }, {
        '$project': {
          'tulsun': {
            '$ifNull': [
              '$avlaga.guilgeenuud.tulsunDun', 0
            ]
          }
        }
      }, {
        '$group': {
          '_id': 'tulsun',
          'dun': {
            '$sum': '$tulsun'
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
    res.json({ avlaga, khugatsaaKhetersen, eneSardTulukh, eneSardTulsun, khungulult });
  }
  catch (err) {
    next(err);
  }
});

exports.khariltsagchiinTooAvya = asyncHandler(async (req, res, next) => {
  let query = [
    {
      '$match': {
        'baiguullagiinId': req.body.baiguullagiinId
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

