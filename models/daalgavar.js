const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const daalgavarSchema = new Schema(
  {
    id: String,
    dugaar: String,
    tailbar: String,
    zurguud: [String],
    file: [String],
    ognoo: Date,
    khuleejAvsanOgnoo: Date,
    zartsuulsanKhugatsaa: Number, //Tsagaar
    shiidsenOgnoo: Date,
    duusakhOgnoo: Date,
    tuluv: Number,
    ajiltniiId: String,
    ajiltniiNer: String,
    baiguullagiinId: String,
    barilgiinId: String,
    salbariinId: String,
  },
  {
    timestamps: true,
  }
);

module.exports = function a(conn) {
  if (!conn || !conn.kholbolt)
    throw new Error("Холболтын мэдээлэл заавал бөглөх шаардлагатай!");
  conn = conn.kholbolt;
  return conn.model("daalgavar", daalgavarSchema);
};

//module.exports = mongoose.model("daalgavar", daalgavarSchema);
