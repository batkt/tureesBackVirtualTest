const express = require("express");
const router = express.Router();
const GereeniiZagvar = require("../models/gereeniiZagvar");
const GereeniiZaalt = require("../models/gereeniiZaalt");
const { crudWithFile, crud } = require("../components/crud");
const multer = require("multer");
const storage = multer.memoryStorage();
const uploadFile = multer({
  storage: storage,
});

crud(router, "gereeniiZagvar", GereeniiZagvar);
crud(router, "gereeniiZaalt", GereeniiZaalt);

const { gereeniiZagvarTatya } = require("../controller/excel");

router
  .route("/gereeniiZagvarTatya")
  .post(uploadFile.single("file"), gereeniiZagvarTatya);

module.exports = router;
