const express = require("express");
const router = express.Router();
const Geree = require("../models/geree");
const Khariltsagch = require("../models/khariltsagch");
const { crud } = require("../components/crud");

crud(router, "geree", Geree, async (req, res, next) => {
  try {
    const khariltsagch = new Khariltsagch(req.body);
    khariltsagch.id = khariltsagch.register;
    khariltsagch
      .save()
      .then((result) => {
        next();
      })
      .catch((err) => {
        next(err);
      });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
