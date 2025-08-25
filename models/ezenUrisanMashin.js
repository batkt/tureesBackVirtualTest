const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const ezenUrisanMashinSchema = new Schema(
  {
    baiguullagiinId: String,
    barilgiinId: String,
    ezenId: String,
    ezenNer: String,
    ezenUtas: [String],
    ezenRegister: String,
    urisanMashiniiDugaar: String,
  },
  {
    timestamps: true,
  }
);

module.exports = function a(conn) {
  if (!conn || !conn.kholbolt)
    throw new Error("Холболтын мэдээлэл заавал бөглөх шаардлагатай!");
  conn = conn.kholbolt;
  return conn.model("ezenUrisanMashin", ezenUrisanMashinSchema);
};
