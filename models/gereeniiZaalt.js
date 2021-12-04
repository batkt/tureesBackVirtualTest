const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const gereeniiZaaltSchema = new Schema(
  {
    id: String,
    baiguullagiinId: String,
    baiguullagiinNer: String,
    barilgiinId: String,
    kharagdakhDugaar: String,
    zaalt: String,
    khamragdsanGereenuud: Array,
    khamaarakhKheseg: String,
    ashilgakhEsekh: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("gereeniiZaalt", gereeniiZaaltSchema);
