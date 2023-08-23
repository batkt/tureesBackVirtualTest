const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const eventButeegdkhuunSchema = new Schema(
  {
    ner: String,
    une: Number,
    turul: String,
    tailbar: String,
  },
  {
    timestamps: true,
  }
);

module.exports = function a(conn) {
  if (!conn || !conn.kholbolt)
    throw new Error("Холболтын мэдээлэл заавал бөглөх шаардлагатай!");
  conn = conn.kholbolt;
  return conn.model("eventButeegdkhuun", eventButeegdkhuunSchema);
};
