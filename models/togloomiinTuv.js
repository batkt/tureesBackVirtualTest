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
    asragchiinTurul: [String],
    khungulsunShaltgaan: String,
    khungulsunDun: String,
    khungulsunEsekh: Boolean,
    tuluv: {
      type: Number,
      default: 0,
    },
    sungalt: [
      {
        khugatsaa: Number, //minutaar
        tariff: Number, //tsagiin
        niitDun: Number, //minutaar
        ekhlekhTsag: Date,
        duusakhTsag: Date,
      },
    ],
    sungasanMinut: {
      type: Number,
      default: 0,
    },
    khugatsaa: Number, //minutaar
    tariff: Number, //tsagiin
    niitDun: Number,
    dutuuDun: Number, //Dutuu bga dun
    ebarimtAvakhDun: Number,
    ebarimtRegister: String,
    tsutsalsanShaltgaan: String,
    khuukhdiinToo: {
      type: Number,
      default: 1,
    },
    turul: String,
    niitTulbur: [
      {
        turul: String,
        tailbar: String,
        dun: Number,
        object: Schema.Types.Mixed,
      },
    ],
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
    burtgesenAjiltaniiId: String,
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
