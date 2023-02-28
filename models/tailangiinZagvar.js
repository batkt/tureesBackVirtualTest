const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const tailangiinZagvarSchema = new Schema(
  {
    ner: String,
    turul: String,
    object: Schema.Types.Mixed,
    baiguullagiinId: String,
  },
  {
    timestamps: true,
  }
);

module.exports = function a(conn) {
  if (!conn || !conn.kholbolt)
    throw new Error("Холболтын мэдээлэл заавал бөглөх шаардлагатай!");
  conn = conn.kholbolt;
  return conn.model("tailangiinZagvar", tailangiinZagvarSchema);
};
