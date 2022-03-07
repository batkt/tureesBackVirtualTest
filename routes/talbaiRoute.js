const express = require("express");
const router = express.Router();
const talbai = require("../models/talbai");
const Geree = require("../models/geree");
const multer = require("multer");
const storage = multer.memoryStorage();
//const { tokenShalgakh } = require("../middlewares/tokenShalgakh");
//const { crud } = require("../components/crud");
const UstsanBarimt = require("../models/ustsanBarimt");
const { tokenShalgakh, crud } = require("zevback");
const uploadFile = multer({ storage: storage });

crud(router, "talbai", talbai, UstsanBarimt);

const { talbaiTatya, talbainZagvarAvya } = require("../controller/excel");

router.route("/talbaiTatya").post(uploadFile.single("file"), tokenShalgakh, talbaiTatya);
router.route("/talbainZagvarAvya").get(talbainZagvarAvya);
router.route("/talbainSulEskhiigShalgay").get(tokenShalgakh, async (req, res, next) => {
    var geree = await Geree.findOne({ talbainDugaar: req.query.talbainDugaar, barilgiinId: req.query.barilgiinId, tuluv: 1, duusakhOgnoo: { $gte: new Date() } });
    if (geree)
        res.send(geree.gereeniiDugaar);
    else
        res.sendStatus(200)
});
module.exports = router;
