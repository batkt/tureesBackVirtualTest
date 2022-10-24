const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const nekhemjlekhiinZagvarSchema = new Schema(
  {
    ner: String,
    tailbar: String,
    nekhemjlekh: String,
    turul: String,
    burtgesenAjiltan: String,
    baiguullagiinId: String,
    barilgiinId: String,
    khuudasniiKhemjee: String,
    chiglel: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("nekhemjlekhiinZagvar", nekhemjlekhiinZagvarSchema);
