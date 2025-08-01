const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const aldangiinZassanTuukhSchema = new Schema(
  {
    baiguullagiinId: String,
    barilgiinId: String,
    turul: String,
    gereeniiId: String,
    gereeniiDugaar: String,
    tailbar: String,
    aldangiDun: Number,
    ajiltniiId: String,
    ajiltniiNer: String,
    ognoo: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = function a(conn) {
  if (!conn || !conn.kholbolt)
    throw new Error("Холболтын мэдээлэл заавал бөглөх шаардлагатай!");
  conn = conn.kholbolt;
  return conn.model("aldangiinZassanTuukh", aldangiinZassanTuukhSchema);
};
