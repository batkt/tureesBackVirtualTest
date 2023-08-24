const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const eventTariffSchema = new Schema(
  {
    ner: String,
    tariffuud: [
      {
        turul: String,
        tariff: Number,
      },
    ],
    undsenTsag: Number,
    nemeltTariff: Number,
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
  return conn.model("eventTariff", eventTariffSchema);
};
