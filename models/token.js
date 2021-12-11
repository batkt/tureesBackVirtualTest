const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const tokenSchema = new Schema({
  baiguullagiinId: String,
  token: String,
  turul: String,
  refreshToken: String,
  ognoo: Date
}, {
  timestamps: true
});

module.exports = mongoose.model("token", tokenSchema);