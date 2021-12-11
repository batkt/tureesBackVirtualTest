const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const qpayObjectSchema = new Schema({
  gereeniiId: String,
  ognoo: Date,
  khariu: Schema.Types.Mixed
}, {
  timestamps: true
});

module.exports = mongoose.model("qpayObject", qpayObjectSchema);