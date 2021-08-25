const express = require("express");
const router = express.Router();
const talbai = require("../models/talbai");
const { crudWithFile, crud } = require("../components/crud");
const multer = require("multer");
const storage = multer.memoryStorage();
const uploadFile = multer({
  storage: storage,
});
crud(router, "talbai", talbai);

const { talbaiTatya, talbainZagvarAvya } = require("../controller/excel");

router.route("/talbaiTatya").post(uploadFile.single("file"), talbaiTatya);
router.route("/talbainZagvarAvya").get(talbainZagvarAvya);
module.exports = router;
