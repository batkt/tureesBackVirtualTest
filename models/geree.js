const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const gereeSchema = new Schema(
  {
    id: String,
    gereeniiDugaar: String,
    gereeniiOgnoo: Date,
    turul: String,
    ovog: String,
    ner: String,
    register: String,
    albanTushaal: String,
    zakhirliinOvog: String,
    zakhirliinNer: String,
    utas: String,
    khayag: String,
    khugatsaa: Number,
    duusakhOgnoo: Date,
    khungulukhKhugatsaa: Number,
    sariinTurees: Number,
    gerchilgeeniiZurag: String,
    unemlekhniiZurag: String,
    zuvshuurliinZurag: String,
    languuniiDugaar: String,
    talbainNegjUne: Number,
    talbainNiitUne: Number,
    talbainKhemjee: Number,
    davkhar: Number,
    baritsaaAvakhDun: Number,
    baritsaaBairshuulakhKhugatsaa: Number,
    baritsaaAvakhKhugatsaa: Number,
    baiguullagiinId: String,
    baiguullagiinNer: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("geree", gereeSchema);
