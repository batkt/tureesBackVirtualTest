const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const khungulultiinTuukhSchema = new Schema(
  {
    baiguullagiinId: String,
    barilgiinId: String,
    ognoonuud: [Date],
    shaltgaan: String,
    turul: String,
    zardliinId: String,
    khungulukhTurul: String,
    khungulukhKhuvi: Number,
    tulukhDun: Number,
    khungulsunDun: Number,
    khungulultiinDun: Number,
    khonogTootsokhEsekh: Boolean,
    khungulultKhonog: Number,
    khungulultKhuvi: Number,
    khamaataiGereenuud: [Schema.Types.Mixed],
    guilgeeKhiisenOgnoo: Date,
    guilgeeKhiisenAjiltniiNer: String,
    guilgeeKhiisenAjiltniiId: String,
  },
  { timestamps: true }
);

module.exports = function a(conn) {
  if (!conn || !conn.kholbolt)
    throw new Error("Холболтын мэдээлэл заавал бөглөх шаардлагатай!");
  conn = conn.kholbolt;
  return conn.model("khungulultiinTuukh", khungulultiinTuukhSchema);
};
//module.exports = mongoose.model("khungulultiinTuukh", khungulultiinTuukhSchema);
