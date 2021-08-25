const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
var avlagiinTurul = new Schema({
  daraagiinTulukhOgnoo: Date,
  daraagiinSanuulakhOgnoo: Date,
  daraagiinKhuleekhOgnoo: Date,
  guilgeenuud: [
    {
      ognoo: Date,
      tulukhDun: Number,
      tulsunDun: Number,
      khyamdral: Number,
      turul: String,
    },
  ],
});
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
    talbainiiDugaar: String,
    talbainNegjUne: Number,
    talbainNiitUne: Number,
    talbainKhemjee: Number,
    davkhar: Number,
    baritsaaAvakhDun: Number,
    baritsaaBairshuulakhKhugatsaa: Number,
    baritsaaAvakhKhugatsaa: Number,
    baiguullagiinId: String,
    baiguullagiinNer: String,
    gereeniiZagvariinId: String,
    tulukhUdur: [String],
    sanuulakhKhonog: Number,
    khuleekhKhonog: Number,
    avlaga: { type: avlagiinTurul, select: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("geree", gereeSchema);
