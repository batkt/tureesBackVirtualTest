const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const ekhniiUldegdelExcelSchema = new Schema(
  {
    baiguullagiinId: String,
    barilgiinId: String,
    ognoo: Date,
    zardliinId: String,
    zardliinNer: String,
    gereeniiId: String,
    register: String,
    gereeniiDugaar: String,
    talbainDugaar: String,
    tariff: Number,
    ekhniiUldegdel: Number,
    tureesEkhniiUldegdelEsekh: Boolean,
  },
  {
    timestamps: true,
  }
);

module.exports = function a(conn) {
  if (!conn || !conn.kholbolt)
    throw new Error("Холболтын мэдээлэл заавал бөглөх шаардлагатай!");
  conn = conn.kholbolt;
  return conn.model("ekhniiUldegdelExcel", ekhniiUldegdelExcelSchema);
};
