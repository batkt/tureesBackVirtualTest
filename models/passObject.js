const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const passObjectSchema = new Schema(
  {
    baiguullagiinId: String,
    barilgiinId: String,
    zakhialgiinDugaar: String,
    tulsunEsekh: Boolean,
    ognoo: Date,
    amount: Number,
    order_id: String,
    order_ttl: String,
    payment_request_id: String,
    pos_id: String,
    is_success: Boolean,
    operation: String,
    extra_data: Schema.Types.Mixed,
    customer_data: Schema.Types.Mixed,
  },
  {
    timestamps: true,
  }
);

module.exports = function a(conn) {
  if (!conn || !conn.kholbolt)
    throw new Error("Холболтын мэдээлэл заавал бөглөх шаардлагатай!");
  conn = conn.kholbolt;
  return conn.model("passObject", passObjectSchema);
};
//module.exports = mongoose.model("passObject", passObjectSchema);
