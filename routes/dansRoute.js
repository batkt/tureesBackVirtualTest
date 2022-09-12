const express = require("express");
const router = express.Router();
const { Dans } = require("zevback");
//const { crud } = require("../components/crud");
//const UstsanBarimt = require("../models/ustsanBarimt");
const { crud, UstsanBarimt } = require("zevback");
crud(router, "dans", Dans, UstsanBarimt);
module.exports = router;
