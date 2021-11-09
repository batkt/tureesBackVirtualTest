const express = require("express");
const router = express.Router();
const BankniiGuilgee = require("../models/bankniiGuilgee");

const {
  crud
} = require('../components/crud');
const {
  tokenShalgakh
} = require("../middlewares/tokenShalgakh");
const bankniiGuilgee = require("../models/bankniiGuilgee");

crud(router, 'bankniiGuilgee', BankniiGuilgee)

router.post("/bankniiKhuulgaToololtAvya", (req, res, next) => {
  let query = [{
    '$group': {
      '_id': {
        '$gt': [
          '$kholbosonGereeniiId', null
        ]
      },
      'count': {
        '$sum': 1
      }
    }
  }]
  BankniiGuilgee.aggregate(query).then(async (result) => {
    res.send(result);
  })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;