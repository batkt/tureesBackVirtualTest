const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const avlagaTulsunTuukhSchema = new Schema(
  {
    baiguullagiinId: String,
    barilgiinId: String,
    tulsunOgnoo: Date,
    bankniiGuilgeeniiId: String,
    bankniiGuilgeeniiDun: Number,
    gereeniiId: String,
    gereeniiDugaar: String,
    talbainId: String,
    talbainDugaar: String,
    register: String,
    tulsunDun: Number,
    burtgesenAjiltaniiId: String,
    burtgesenAjiltaniiNer: String,
    avlaguud: [
      {
        tulukhDun: Number,
        tulsunDun: Number,
        ognoo: Date,
        turul: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

//module.exports = mongoose.model("ashiglaltiinExcel", ashiglaltiinExcelSchema);

module.exports = function a(conn) {
  if (!conn || !conn.kholbolt)
    throw new Error("Холболтын мэдээлэл заавал бөглөх шаардлагатай!");
  conn = conn.kholbolt;
  return conn.model("avlagaTulsunTuukh", avlagaTulsunTuukhSchema);
};
