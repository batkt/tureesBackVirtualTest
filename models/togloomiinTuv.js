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
    turul: Date,
    khugatsaa: Number, //minutaar
    tariff: Number, //tsagiin
    niitDun: Number, //minutaar
    baiguullagiinId: String,
    barilgiinId: String,
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
