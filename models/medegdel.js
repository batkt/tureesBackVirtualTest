const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const medegdelSchema = new Schema(
  {
    khariltsagchiinId: String,
    khariltsagchiinNer: String,
    baiguullagiinId: String,
    barilgiinId: String,
    ognoo: Date,
    turul: {
      type: String,
      enum: ["chat", "sanal", "gomdol"],
      default: "chat",
    },
    message: String,
    baiguullagaKharsanEsekh: Boolean,
    khariltsagchKharsanEsekh: Boolean,
    reply: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("medegdel", medegdelSchema);
