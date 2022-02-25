const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const mashinSchema = new Schema({
  id: String,
  baiguullagiinId: String,
  barilgiinId: String,
  turul: String,
  dugaar: String,
  ezemshigchiinNer: String,
  ezemshigchiinRegister: String,
  ezemshigchiinUtas: String
}, {
  timestamps: true
});

module.exports = mongoose.model("mashin", mashinSchema);