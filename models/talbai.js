const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const Schema = mongoose.Schema

mongoose.pluralize(null)

const talbaiSchema = new Schema(
  {
    id: String,
    davkhar: String,
    talbainKhemjee: Number,
    kod: String,
    tailbar: String,
    baiguullagiinId: String,
    baiguullagiinNer: String,
    barilgiinId: String,
    talbainNegjUne: Number,
    talbainNiitUne: Number,
    zurgiinId: String,
    ashiglaltiinZardal: Number,
    niitAshiglaltiinZardal: Number,
    idevkhiteiEsekh: {
      type: Boolean,
      default: false
    },
    tureesiinTulbur: Number,
    khurunguud: [
      {
        id: String,
        ner: String,
        too: Number,
        une: Number,
        niit: Number,
        zurgiinId: String,
      },
    ],
    bairshil:[[]]
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("talbai", talbaiSchema)
