const express = require("express");
const router = express.Router();
const { tokenShalgakh, crud } = require("zevback");
const UstsanBarimt = require("../models/ustsanBarimt");
const { Pool } = require('pg')
const Zogsool = require("../models/zogsool");
const got = require('got');
const { URL } = require('url');
const instanceJson = got.extend({
  hooks: {
    beforeRequest: [
      options => {
        options.headers['Content-Type'] = "application/json"
        if (options.context && options.context.token) {
          options.headers['Authorization'] = options.context.token;
        }
      }
    ]
  }
});
crud(router, "zogsool", Zogsool, UstsanBarimt);
const { mashiniiExcelAvya } = require("../controller/excel");


router.route("/mashiniiExcelAvya").get(mashiniiExcelAvya);

router.get("/zogsooloosTatya",
  async (req, res, next) => {
    var pool = new Pool({
      user: 'postgres',
      host: 'localhost',
      database: 'postgres',
      password: '123',
      port: 5432,
    })
    pool.query("select a.id, a.car_number, a.check_in_time, min(b.check_out_time) as check_out_time,"
      + "(DATE_PART('day', min(check_out_time) - check_in_time) * 24 +"
      + "DATE_PART('hour', min(check_out_time) - check_in_time)) * 60 +"
      + "DATE_PART('minute', min(check_out_time) - check_in_time) as khugatsaa"
      + " from park_park_recordin a inner join park_recordout b on a.car_number = b.car_number "
      + "where a.check_in_time < b.check_out_time and a.check_in_time > '2022-01-01 10:53:26'"
      + "group by a.id, a.car_number, a.check_in_time "
      + "order by check_in_time", async (err, res1) => {
        console.log(err, res1)
        if (err)
          throw err;
        var niitMur = 0;
        await pool.end();
        if (res1.rows && res1.rows.length > 0) {
          const objectString = JSON.stringify({ jagsaalt: res1.rows });
          var url = new URL("http://103.50.205.33:8081/zogsoolOlnoorKhadgalya/")
          const response = await instanceJson.post(url, { body: objectString });
          console.log("response.body", response.body);
        }
        res.send("Amjilttai");
      })
  }
);

router.post("/zogsoolOlnoorKhadgalya",
  async (req, res, next) => {
    console.log("orj ir")
    var bulkOps = [];
    // for ( ... each gasStation to upsert ...) {
    req.body.jagsaalt.forEach(element => {
      let upsertDoc = {
        'updateOne': {
          'filter': { 'id': element.id },
          'update': element,
          'upsert': true
        }
      };
      bulkOps.push(upsertDoc);
    });
    Zogsool.bulkWrite(bulkOps)
      .then(bulkWriteOpResult => {
        console.log('BULK update OK');
        res.send("Amjilttai");
      })
      .catch(err => {
        console.log('BULK update error');
        next(err)
      });
    //Zogsool.updateMany(req.body.jagsaalt, { upsert: true }).catch((err) => next(err));
  });

module.exports = router;
