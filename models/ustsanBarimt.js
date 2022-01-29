const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const ustsanBarimtSchema = new Schema({
  class: String,
  object: Schema.Types.Mixed,
  baiguullagiinId: String,
  ajiltniiId: String,
  ajiltniiNer: String
}, {
  timestamps: true
});

module.exports = mongoose.model("ustsanBarimt", ustsanBarimtSchema);