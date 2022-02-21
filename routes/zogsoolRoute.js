const express = require("express");
const router = express.Router();
const { tokenShalgakh, crud } = require("zevback");
const UstsanBarimt = require("../models/ustsanBarimt");
const { Pool } = require('pg')
const Zogsool = require("../models/zogsool");
crud(router, "zogsool", Zogsool, UstsanBarimt);

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '123',
  port: 5432,
})


router.get("/zogsooloosTatya",
  (req, res, next) => {
    pool.query("select a.car_number, a.check_in_time, min(b.check_out_time) as check_out_time,"
      + "(DATE_PART('day', min(check_out_time) - check_in_time) * 24 +"
      + "DATE_PART('hour', min(check_out_time) - check_in_time)) * 60 +"
      + "DATE_PART('minute', min(check_out_time) - check_in_time) as khugatsaa"
      + " from park_park_recordin a inner join park_recordout b on a.car_number = b.car_number "
      + "where a.check_in_time < b.check_out_time  group by a.car_number, a.check_in_time "
      + "order by check_in_time", (err, res1) => {
        console.log(err, res1)
        if (err)
          throw err;
        var niitMur = 0;
        if (res1.rows && res1.rows.length > 0) {
          Zogsool.insertMany(res1.rows);
          niitMur = res1.rows.length
        }
        pool.end();
        res.send("Amjilttai  niitMur :" + niitMur);
      })
  }
);

router.post("/zogsoolOlnoorKhadgalya",
  (req, res, next) => {
    Zogsool.insertMany(req.body.jagsaalt).catch((err) => next(err));
    res.send("Amjilttai");
  });

module.exports = router;
