const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const dansSchema = new Schema({
  dugaar: Number,
  dansniiNer:String,
  baiguullagiinId: String,
  barilgiinId: String,
  bank: String,
  valiut:String,
  corporateAshiglakhEsekh:Boolean
}, {
  timestamps: true
});

module.exports = mongoose.model("dans", dansSchema);