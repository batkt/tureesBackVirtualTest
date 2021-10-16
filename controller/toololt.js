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

