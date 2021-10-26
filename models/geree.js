const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
var avlagiinTurul = new Schema({
  guilgeenuud: [
    {
      ognoo: Date,
      undsenDun: Number,
      tulukhDun: Number,
      tulsunDun: Number,
      khyamdral: Number,
      turul: String,
      guilgeeniiId: String,
      dansniiDugaar: String,
      tulsunDans: String,
      guilgeeKhiisenOgnoo: Date,
      guilgeeKhiisenAjiltniiNer: String,
      guilgeeKhiisenAjiltniiId: String,
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
    talbainDugaar: String,
    talbainNegjUne: Number,
    talbainNiitUne: Number,
    talbainKhemjee: Number,
    davkhar: String,
    baritsaaAvakhDun: Number,
    baritsaaBairshuulakhKhugatsaa: Number,
    baritsaaAvakhKhugatsaa: Number,
    baiguullagiinId: String,
    baiguullagiinNer: String,
    gereeniiZagvariinId: String,
    tulukhUdur: [String],
    tuluv: Number,
    sanuulakhKhonog: Number,
    khuleekhKhonog: Number,
    khungulukhEsekh: Boolean,
    daraagiinTulukhOgnoo: Date,
    daraagiinSanuulakhOgnoo: Date,
    daraagiinKhuleekhOgnoo: Date,
    uldegdel: Number,
    avlaga: { type: avlagiinTurul, select: false },
    gereeniiTuukhuud: {
      type: [Schema.Types.Mixed],
      select: false
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("geree", gereeSchema);
