const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const aldangiinTuukhSchema = new Schema(
  {
    baiguullagiinId: String,
    barilgiinId: String,
    turul: String,
    gereeniiId: String,
    gereeniiDugaar: String,
    ognoo: Date,
    uldegdel: Number,
    aldangiChuluulukhOgnoo: Date,
    aldangiBodsonOgnoo: Date,
    aldangiinKhuvi: Number,
    aldangiChuluulukhKhonog: Number,
    aldangi: Number,
    niitAldangi: Number,
    umnukhAldangi: Number,
    tulukhUdur: Number,
    aldangiSar: String,
  },
  {
    timestamps: true,
  }
);

module.exports = function a(conn) {
  if (!conn || !conn.kholbolt)
    throw new Error("Холболтын мэдээлэл заавал бөглөх шаардлагатай!");
  conn = conn.kholbolt;
  return conn.model("aldangiinTuukh", aldangiinTuukhSchema);
};
