const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const surveySchema = new Schema(
  {
    id: String,
    baiguullagiinId: String,
    barilgiinId: String,
    chiglel: String,
    uilAjillagaa: String,
    ner: String,
    ajiltniiToo: String,
    webKhuudas: String,
    davkhar: [String],
    talbainKhemjee: String,
    utas: String,
    mail: String,
    nemeltMedeelel: String,
  },
  {
    timestamps: true,
  }
);

module.exports = function a(conn) {
  if (!conn || !conn.kholbolt)
    throw new Error("Холболтын мэдээлэл заавал бөглөх шаардлагатай!");
  conn = conn.kholbolt;
  return conn.model("survey", surveySchema);
};
//module.exports = mongoose.model("survey", surveySchema);
