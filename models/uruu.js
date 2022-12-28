const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const uruuSchema = new Schema(
  {
    gishuud: [
      {
        id: String,
        kharsanEsekh: Boolean,
      },
    ],
    baiguullagiinId: String,
    suuliinMsg: String,
  },
  { timestamps: true }
);

module.exports = function a(conn) {
  if (!conn || !conn.kholbolt)
    throw new Error("Холболтын мэдээлэл заавал бөглөх шаардлагатай!");
  conn = conn.kholbolt;
  return conn.model("uruu", uruuSchema);
};
//module.exports = mongoose.model("uruu", uruuSchema);
