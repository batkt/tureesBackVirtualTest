const express = require("express");
const router = express.Router();
const dans = require("../models/dans");
//const { crud } = require("../components/crud");
//const UstsanBarimt = require("../models/ustsanBarimt");
const { crud, UstsanBarimt } = require("zevback");
crud(router, "dans", dans, UstsanBarimt);
module.exports = router;
