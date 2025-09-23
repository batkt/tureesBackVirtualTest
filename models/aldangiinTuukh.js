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
    uldegdel: Number,
    aldangiBodsonOgnoo: Date,
    aldangi: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = function a(conn) {
  if (!conn || !conn.kholbolt)
    throw new Error("Холболтын мэдээлэл заавал бөглөх шаардлагатай!");
  conn = conn.kholbolt;
  return conn.model("aldangiinTuukhSchema", aldangiinTuukhSchema);
};
