const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const mailiinZagvarSchema = new Schema(
  {
    id: String,
    baiguullagiinId: String,
    barilgiinId: String,
    ner: String,
    turul: String,
    zurag: String,
    mail: String,
  },
  {
    timestamps: true,
  }
);

module.exports = function a(conn) {
  if (!conn || !conn.kholbolt)
    throw new Error("Холболтын мэдээлэл заавал бөглөх шаардлагатай!");
  conn = conn.kholbolt;
  return conn.model("mailiinZagvar", mailiinZagvarSchema);
};
//module.exports = mongoose.model("mailiinZagvar", mailiinZagvarSchema);
