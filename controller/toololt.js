const asyncHandler = require("express-async-handler");
const Geree = require("../models/geree");

exports.toololtAvya = asyncHandler(async (req, res, next) => {
  let query = [
    {
      '$match': {
        'baiguullagiinId': req.body.baiguullagiinId,
        'avlaga.guilgeenuud.ognoo': {
          '$lte': new Date()
        }
      }
    }, {
      '$project': {
        'gereeniiDugaar': '$gereeniiDugaar',
        'niitTulukh': {
          '$sum': '$avlaga.guilgeenuud.tulukhDun'
        },
        'niitTulsun': {
          '$sum': '$avlaga.guilgeenuud.tulsunDun'
        },
        'uldegdel': {
          '$subtract': [
            {
              '$sum': '$avlaga.guilgeenuud.tulukhDun'
            }, {
              '$sum': '$avlaga.guilgeenuud.tulsunDun'
            }
          ]
        }
      }
    }, {
      '$match': {
        'uldegdel': {
          '$gt': 0
        }
      }
    }, {
      '$count': 'niit'
    }
  ]
  Geree.aggregate(query).then((result) => {
    res.send(result);
  })
    .catch((err) => {
      next(err);
    });;
});

