const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const togloomiinTuvSchema = new Schema(
  {
    dugaar: String,
    ovog: String,
    ner: String,
    khuis: Number,
    nas: Number,
    utas: [String],
    ognoo: Date,
    ekhlekhTsag: Date,
    duusakhTsag: Date,
    garsanTsag: Date,
    asragchiinTurul: String,
    khungulsunShaltgaan: String,
    khungulsunEsekh: Boolean,
    tuluv: {
      type: Number,
      default: 0,
    },
    khugatsaa: Number, //minutaar
    tariff: Number, //tsagiin
    niitDun: Number, //minutaar
    tsutsalsanShaltgaan: String,
    turul: String,
    tulbur: [
      {
        turul: String,
        tailbar: String,
        dun: Number,
        object: Schema.Types.Mixed,
      },
    ],
    baiguullagiinId: String,
    barilgiinId: String,
    tulburTulsunEsekh: Boolean,
    ebarimtAvsanEsekh: Boolean,
  },
  {
    timestamps: true,
  }
);

module.exports = function a(conn) {
  if (!conn || !conn.kholbolt)
    throw new Error("Холболтын мэдээлэл заавал бөглөх шаардлагатай!");
  conn = conn.kholbolt;
  return conn.model("togloomiinTuv", togloomiinTuvSchema);
};
