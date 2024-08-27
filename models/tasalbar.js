const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const tasalbarSchema = new Schema(
  {
    baiguullagiinId: String,
    barilgiinId: String,
    turul: String,
    khemjee: String,
    tasalbarTariff: Number, // tasalbariin tariff
  },
  {
    timestamps: true,
  }
);

module.exports = function a(conn) {
  if (!conn || !conn.kholbolt)
    throw new Error("Холболтын мэдээлэл заавал бөглөх шаардлагатай!");
  conn = conn.kholbolt;
  return conn.model("tasalbar", tasalbarSchema);
};
