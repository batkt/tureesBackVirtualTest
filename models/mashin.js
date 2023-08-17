const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const mashinSchema = new Schema(
  {
    id: String,
    baiguullagiinId: String,
    barilgiinId: String,
    turul: String,
    dugaar: String,
    temdeglel: String,
    kharJagsaalt: Boolean,
    ezemshigchiinId: String,
    ezemshigchiinNer: String,
    ezemshigchiinRegister: String,
    ezemshigchiinUtas: String,
    ezemshigchiinTalbainDugaar: String,
    gereeniiDugaar: String,
    tuukh: mongoose.Schema.Types.Mixed,
    ekhlekhOgnoo: Date,
    duusakhOgnoo: Date,
    gereeniiId: String,
    khariltsagchiinNer: String,
  },
  {
    timestamps: true,
  }
);

module.exports = function a(conn) {
  if (!conn || !conn.kholbolt)
    throw new Error("Холболтын мэдээлэл заавал бөглөх шаардлагатай!");
  conn = conn.kholbolt;
  return conn.model("mashin", mashinSchema);
};
//module.exports = mongoose.model("mashin", mashinSchema);
