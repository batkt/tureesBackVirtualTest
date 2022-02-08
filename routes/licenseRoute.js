const express = require('express');
const router = express.Router();
//const { tokenShalgakh } = require("../middlewares/tokenShalgakh");
//const { crud } = require('../components/crud');
const UstsanBarimt = require("../models/ustsanBarimt");
const { crud } = require("zevback");
const License = require("../models/license");
const si = require('systeminformation');

crud(router, 'license', License, UstsanBarimt);


router.get("/systemiinMedeelelAvya", (req, res, next) => {
    try {
        si.mem()
            .then((data) => {
                res.send(data);
            })
            .catch(error => console.error(error));
    } catch (error) {
        next(error);
    }
});


module.exports = router;