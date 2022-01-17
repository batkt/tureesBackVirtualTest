const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const dansSchema = new Schema({
  dugaar: Number,
  baiguullagiinId: String,
  barilgiinId: String,
  bank: String,
}, {
  timestamps: true
});

module.exports = mongoose.model("dans", dansSchema);