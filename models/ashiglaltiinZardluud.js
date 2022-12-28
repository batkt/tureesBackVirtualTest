const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const ashiglaltiinZardluudSchema = new Schema(
  {
    baiguullagiinId: String,
    barilgiinId: String,
    ner: String,
    turul: String,
    tariff: String,
  },
  {
    timestamps: true,
  }
);

//module.exports = mongoose.model("ashiglaltiinZardluud", ashiglaltiinZardluudSchema);

module.exports = function a(conn) {
  if (!conn || !conn.kholbolt)
    throw new Error("Холболтын мэдээлэл заавал бөглөх шаардлагатай!");
  conn = conn.kholbolt;
  return conn.model("ashiglaltiinZardluud", ashiglaltiinZardluudSchema);
};
