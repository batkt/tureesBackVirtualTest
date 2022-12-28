const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);

const dedSchema = new Schema({
  desDugaar: String,
  ner: String,
});

dedSchema.add({ dedKhesguud: [dedSchema] });

const zardalSchema = new Schema(
  {
    desDugaar: String,
    ner: String,
    baiguullagiinId: String,
    barilgiinId: String,
    dedKhesguud: [dedSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = function a(conn) {
  if (!conn || !conn.kholbolt)
    throw new Error("Холболтын мэдээлэл заавал бөглөх шаардлагатай!");
  conn = conn.kholbolt;
  return conn.model("zardal", zardalSchema);
};
//module.exports = mongoose.model("zardal", zardalSchema);
