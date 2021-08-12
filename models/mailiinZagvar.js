const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const mailiinZagvarSchema = new Schema({
  id: String,
  baiguullagiinId: String,
  ner: String,
  turul: String,
  zurag: String,
  mail: String
}, {
  timestamps: true
});

module.exports = mongoose.model("mailiinZagvar", mailiinZagvarSchema);