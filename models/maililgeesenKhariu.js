const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const maililgeesenKhariuSchema = new Schema(
  {
    baiguullagiinId: String,
    barilgiinId: String,
    success: Boolean,
    message: String,
    mailKhayag: String,
    gereeniiDugaar: String,
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
  return conn.model("maililgeesenKhariu", maililgeesenKhariuSchema);
};
