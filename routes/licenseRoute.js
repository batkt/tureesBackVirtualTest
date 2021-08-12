const express = require('express');
const router = express.Router();
const {
    tokenShalgakh
} = require("../middlewares/tokenShalgakh");
const License = require("../models/license");
const si = require('systeminformation');
const {
    crudWithFile,
    crud
} = require('../components/crud');

crud(router, 'license', License);


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