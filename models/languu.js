const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

mongoose.pluralize(null);

const languuSchema = new Schema(
  {
    id: String,
    davkhar: String,
    talbainKhemjee: Number,
    kod: String,
    tailbar: String,
    baiguullagiinId: String,
    baiguullagiinNer: String,
    talbainNegjUne: Number,
    talbainNiitUne: Number,
    khurunguud: [
      {
        id: String,
        ner: String,
        too: Number,
        une: Number,
        niit: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("languu", languuSchema);
