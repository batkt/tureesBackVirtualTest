const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const qpayObjectSchema = new Schema(
  {
    zakhialgiinDugaar: String,
    gereeniiId: String,
    baiguullagiinId: String,
    barilgiinId: String,
    tulsunEsekh: Boolean,
    ognoo: Date,
    qpay: Schema.Types.Mixed,
    payment_id: String,
  },
  {
    timestamps: true,
  }
);

module.exports = function a(conn) {
  if (!conn || !conn.kholbolt)
    throw new Error("Холболтын мэдээлэл заавал бөглөх шаардлагатай!");
  conn = conn.kholbolt;
  return conn.model("qpayObject", qpayObjectSchema);
};
//module.exports = mongoose.model("qpayObject", qpayObjectSchema);
