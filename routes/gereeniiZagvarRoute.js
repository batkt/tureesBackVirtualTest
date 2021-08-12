const express = require('express');
const router = express.Router();
const GereeniiZagvar = require('../models/gereeniiZagvar')
const {
    crudWithFile,
    crud
} = require('../components/crud');
const multer = require('multer');
const storage = multer.memoryStorage();
const uploadFile = multer({
    storage: storage
});

crud(router, 'gereeniiZagvar', GereeniiZagvar);

const {
    gereeniiZagvarTatya
} = require('../controller/gereeniiZagvar')

router.route('/gereeniiZagvarTatya').post(uploadFile.single('file'), gereeniiZagvarTatya);

module.exports = router;