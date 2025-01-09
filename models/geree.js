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
      tulukhAldangi: Number,
      tulsunDun: Number,
      tulsunAldangi: Number,
      khyamdral: Number,
      uldegdel: Number,
      negj: Number,
      khemjikhNegj: String,
      tariff: Number,
      tailbar: String,
      nemeltTailbar: String,
      turul: String,
      nekhemjlekhDeerKharagdakh: Boolean,
      ekhniiUldegdelEsekh: Boolean,
      zardliinTurul: String,
      khyamdraliinId: String,
      guilgeeniiId: String,
      dansniiDugaar: String,
      tulsunDans: String,
      guilgeeKhiisenOgnoo: Date,
      guilgeeKhiisenAjiltniiNer: String,
      guilgeeKhiisenAjiltniiId: String,
      zaaltTog: Number,
      zaaltUs: Number,
      suuliinZaalt: Number,
      umnukhZaalt: Number,
      bokhirUsDun: Number,
      tseverUsDun: Number,
      usKhalaasanDun: Number,
      suuriKhuraamj: Number,
      tsakhilgaanUrjver: Number, //tsakhilgaanii coefficent
      tsakhilgaanKBTST: Number,
      guidliinKoep: Number,
      bichiltKhonog: Number,
      tsekhDun: Number,
      chadalDun: Number,
    },
  ],
  baritsaa: [
    {
      ognoo: Date,
      orlogo: Number,
      zarlaga: Number,
      tailbar: String,
      guilgeeniiId: String,
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
    customerTin: String,
    albanTushaal: String,
    zakhirliinOvog: String,
    zakhirliinNer: String,
    utas: [String],
    mail: String,
    khayag: String,
    khugatsaa: Number,
    duusakhOgnoo: Date,
    tsutsalsanOgnoo: Date,
    khungulukhKhugatsaa: Number,
    sariinTurees: Number,
    gerchilgeeniiZurag: String,
    unemlekhniiZurag: String,
    zuvshuurliinZurag: String,
    zoriulalt: String,
    tusgaiZoriulalt: String,
    khariltsagchiinNershil: String,
    talbaiNemeltNukhtsul: String,
    talbainDugaar: String,
    talbainIdnuud: [String],
    talbainNegjUne: Number,
    talbainNiitUne: Number,
    talbainKhemjee: Number,
    talbainKhemjeeMetrKube: Number,
    davkhar: String,
    baritsaaAvakhDun: Number,
    baritsaaniiUldegdel: {
      type: Number,
      default: 0,
    },
    baritsaaBairshuulakhKhugatsaa: Number,
    baritsaaAvakhKhugatsaa: Number,
    baiguullagiinId: String,
    baiguullagiinNer: String,
    aktiinZagvariinId: String,
    barilgiinId: String,
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
    aldangiinUldegdel: Number,
    avlaga: { type: avlagiinTurul, select: false },
    dans: String,
    turGereeEsekh: Boolean,
    zardluud: [
      {
        ner: String,
        turul: String,
        tariff: Number,
        tariffUsgeer: String,
        tulukhDun: Number, // Менежментийн зардал
        dun: Number, //dung n zuwxun munguur tootsoj awax togtmol ued buglunu
        suuriKhuraamj: String,
        nuatNemekhEsekh: Boolean,
      },
    ],
    segmentuud: [
      {
        ner: String,
        utga: String,
      },
    ],
    gereeniiTuukhuud: {
      type: [Schema.Types.Mixed],
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = function a(conn) {
  if (!conn || !conn.kholbolt)
    throw new Error("Холболтын мэдээлэл заавал бөглөх шаардлагатай!");
  conn = conn.kholbolt;
  return conn.model("geree", gereeSchema);
};
// mongoose.model("geree", gereeSchema);
