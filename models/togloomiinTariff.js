const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const togloomiinTariffSchema = new Schema(
  {
    udur: [String],
    tariffuud: [
      {
        minut: Number, //minut xurtel dun
        tariff: Number,
      },
    ],
    baiguullagiinId: String,
    barilgiinId: String,
  },
  {
    timestamps: true,
  }
);

module.exports = function a(conn) {
  if (!conn || !conn.kholbolt)
    throw new Error("Холболтын мэдээлэл заавал бөглөх шаардлагатай!");
  conn = conn.kholbolt;
  return conn.model("togloomiinTariff", togloomiinTariffSchema);
};
