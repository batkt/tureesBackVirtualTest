const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

mongoose.pluralize(null);

const aktiinZagvarSchema = new Schema(
  {
    id: String,
    ner: String,
    baiguullagiinId: String,
    baiguullagiinNer: String,
    barilgiinId: String,
    tolgoi: String,
    baruunTolgoi: String,
    zuunTolgoi: String,
    baruunKhul: String,
    zuunKhul: String,
    khul: String,
    dedKhesguud: Array,
  },
  {
    timestamps: true,
  }
);

module.exports = function a(conn) {
  if (!conn || !conn.kholbolt)
    throw new Error("Холболтын мэдээлэл заавал бөглөх шаардлагатай!");
  conn = conn.kholbolt;
  return conn.model("aktiinZagvar", aktiinZagvarSchema);
};
//module.exports = mongoose.model("aktiinZagvar", aktiinZagvarSchema);
