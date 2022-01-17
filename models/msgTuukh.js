const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const msgTuukhSchema = new Schema(
  {
    baiguullagiinId: String,
    gereeniiId: String,
    dugaar: [String],
    msg: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("msgTuukh", msgTuukhSchema);
