const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const ajiltanSchema = new Schema({
  id: String,
  davkhar: String,
  talbainKhemjee: Number,
  kod: String,
  tailbar: Number,
  baiguullagiinId: String,
  baiguullagiinNer: String
}, {
  timestamps: true
});

module.exports = mongoose.model("ajiltan", ajiltanSchema);