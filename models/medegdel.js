const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const medegdelSchema = new Schema(
  {
    khariltsagchiinId: String,
    baiguullagiinId: String,
    turul: {
      type: String,
      enum: ["chat", "sanal", "gomdol"],
      default: "chat",
    },
    message: String,
    kharsanEsekh: Boolean,
    reply: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("medegdel", medegdelSchema);
