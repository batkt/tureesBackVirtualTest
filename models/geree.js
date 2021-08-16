const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const gereeSchema = new Schema(
  {
    id: String,
    gereeniiDugaar: String,
    gereeniiOgnoo: String,
    turul: String,
    ovog: String,
    ner: String,
    register: String,
    albanTushaal: String,
    zakhirliinOvog: String,
    zakhirliinNer: String,
    utas: String,
    khayag: String,
    khugatsaa: String,
    duusakhOgnoo: String,
    khungulukhKhugatsaa: String,
    sariinTurees: String,
    gerchilgeeniiZurag: String,
    unemlekhniiZurag: String,
    zuvshuurliinZurag: String,
    languuniiDugaar: String,
    talbainNegjUne: String,
    talbainNiitUne: String,
    talbainKhemjee: String,
    davkhar: String,
    baritsaaAvakhDun: String,
    baritsaaBairshuulakhKhugatsaa: String,
    baritsaaAvakhKhugatsaa: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("geree", gereeSchema);
