const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const dugaarlaltSchema = new Schema({
  id: String,
  baiguullagiinId: String,
  barilgiinId: String,
  turul: String,
  ognoo: Date,
  dugaar: Number
}, {
  timestamps: true
});

module.exports = mongoose.model("dugaarlalt", dugaarlaltSchema);