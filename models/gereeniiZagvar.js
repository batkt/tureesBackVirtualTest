const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const gereeniiZagvarSchema = new Schema({
  id: String,
  baiguullagiinId: String,
  baiguullagiinNer: String,
  desDugaar: String,
  kharagdakhDugaar: String,
  zaalt: String,
  khamaarakhKheseg: String,
  ashilgakhEsekh: String
}, {
  timestamps: true
});

module.exports = mongoose.model("gereeniiZagvar", gereeniiZagvarSchema);