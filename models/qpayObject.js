const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const qpayObjectSchema = new Schema({
  gereeniiId: String,
  baiguullagiinId: String,
  barilgiinId: String,
  tulsunEsekh: Boolean,
  ognoo: Date,
  qpay: Schema.Types.Mixed
}, {
  timestamps: true
});

module.exports = mongoose.model("qpayObject", qpayObjectSchema);