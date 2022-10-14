const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const sanalGomdolSchema = new Schema(
  {
    khariltsagchiinId: String,
    khariltsagchiinNer: String,
    baiguullagiinId: String,
    barilgiinId: String,
    zurguud: [String],
    turul: String,
    tuluv: {
      type: Number,
      default: 0
    },
    ognoo: Date,
    title: String,
    message: String,
    kharsanEsekh: Boolean
  },
  { timestamps: true }
);

module.exports = mongoose.model("sanalGomdol", sanalGomdolSchema);
