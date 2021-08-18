const express = require("express");
const router = express.Router();
const Languu = require("../models/languu");
const { crudWithFile, crud } = require("../components/crud");
const multer = require("multer");
const storage = multer.memoryStorage();
const uploadFile = multer({
  storage: storage,
});
crud(router, "languu", Languu);

const { languuTatya, languuniiZagvarAvya } = require("../controller/excel");

router.route("/languuTatya").post(uploadFile.single("file"), languuTatya);
router.route("/languuniiZagvarAvya").get(languuniiZagvarAvya);
module.exports = router;
