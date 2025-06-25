const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const togloomiinTulburSchema = new Schema(
  {
    ognoo: Date,
    turul: String,
    khariu: Schema.Types.Mixed,
    tolgoomiinId: String,
    tailbar: String,
    msg: String,
    dun: Number,
    baiguullagiinId: String,
    barilgiinId: String,
    ebarimtAvakhDun: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = function a(conn) {
  if (!conn || !conn.kholbolt)
    throw new Error("Холболтын мэдээлэл заавал бөглөх шаардлагатай!");
  conn = conn.kholbolt;
  return conn.model("togloomiinTulbur", togloomiinTulburSchema);
};
