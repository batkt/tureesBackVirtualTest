const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const tasalbariinGuilgeeSchema = new Schema(
  {
    baiguullagiinId: String,
    barilgiinId: String,
    ognoo: Date,
    burtgesenAjiltaniiId: String,
    burtgesenAjiltaniiNer: String,
    barCodes: [String],
    tasalbarTariff: Number, 
    tasalbarDun: Number, 
    tasalbarShirkheg: Number, 
    qpayDugaar: Number,
    ebarimtAvsanEsekh: Boolean,
    ebarimtRegister: String,
  },
  {
    timestamps: true,
  }
);

module.exports = function a(conn) {
  if (!conn || !conn.kholbolt)
    throw new Error("Холболтын мэдээлэл заавал бөглөх шаардлагатай!");
  conn = conn.kholbolt;
  return conn.model("tasalbariinGuilgee", tasalbariinGuilgeeSchema);
};
