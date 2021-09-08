const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const khariltsagchSchema = new Schema(
  {
    id: String,
    ner: String,
    ovog: String,
    utas: String,
    mail: String,
    register: String,
    albanTushaal: String,
    zakhirliinOvog: String,
    zakhirliinNer: String,
    baiguullagiinId: String,
    firebaseToken: String,
    turul: String,
    tuluv: String,
    khayag: String,
    zurgiinId: String,
    nuutsUg: {
      type: String,
      default: "123",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("khariltsagch", khariltsagchSchema);
