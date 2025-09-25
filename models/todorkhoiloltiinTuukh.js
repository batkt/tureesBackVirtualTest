const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const todorkhoiloltiinTuukhSchema = new Schema(
  {
    baiguullagiinNer: String,
    baiguullagiinId: String,
    barilgiinId: String,
    ovog: String,
    ner: String,
    register: String,
    utas: [String],
    gereeniiDugaar: [String],
    mailiinZagvariinId: String,
    mailKhayagTo: String,
    maililgeesenAjiltniiNer: String,
    maililgeesenAjiltniiId: String,
    ilgeekhBody: Schema.Types.Mixed,
  },
  {
    timestamps: true,
  }
);

module.exports = function a(conn) {
  if (!conn || !conn.kholbolt)
    throw new Error("Холболтын мэдээлэл заавал бөглөх шаардлагатай!");
  conn = conn.kholbolt;
  return conn.model("todorkhoiloltiinTuukh", todorkhoiloltiinTuukhSchema);
};