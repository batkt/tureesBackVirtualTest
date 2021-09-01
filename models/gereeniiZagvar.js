const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

mongoose.pluralize(null);

const gereeniiZaaltSchema = new Schema(
  {
    id: String,
    ner: String,
    baiguullagiinId: String,
    baiguullagiinNer: String,
    tolgoi: String,
    baruunTolgoi: String,
    zuunTolgoi: String,
    khul: String,
    dedKhesguud: Array,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("gereeniiZagvar", gereeniiZaaltSchema);
