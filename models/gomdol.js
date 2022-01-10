const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const gomdolSchema = new Schema(
  {
    khariltsagchiinId: String,
    khariltsagchiinNer: String,
    ajiltniiId: String,
    ajiltniiNer: String,
    baiguullagiinId: String,
    barilgiinId: String,
    ognoo: Date,
    title: String,
    message: String,
    khariu: [Schema.Types.Mixed],
    kharsanEsekh: Boolean
  },
  { timestamps: true }
);

module.exports = mongoose.model("gomdol", gomdolSchema);
