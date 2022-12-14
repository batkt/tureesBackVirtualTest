const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const nevtreltiinTuukhSchema = new Schema(
  {
    ajiltniiId: String,
    ajiltniiNer: String,
    ognoo: Date,
    uildliinSystem: String,
    ip: String,
    browser: String,
    baiguullagiinId: String,
    barilgiinId: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("nevtreltiinTuukh", nevtreltiinTuukhSchema);
