const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const uruuSchema = new Schema(
  {
    gishuud: [{
      id: String,
      kharsanEsekh: Boolean
    }],
    baiguullagiinId: String,
    suuliinMsg: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("uruu", uruuSchema);
