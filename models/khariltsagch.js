const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const khariltsagchSchema = new Schema(
  {
    id: String,
    ner: String,
    ovog: String,
    utas: [String],
    mail: String,
    register: String,
    albanTushaal: String,
    zakhirliinOvog: String,
    zakhirliinNer: String,
    baiguullagiinId: String,
    barilgiinId: String,
    firebaseToken: String,
    sergeekhKod: String,
    turul: String,
    tuluv: String,
    khayag: String,
    zurgiinId: String,
    idevkhiteiEsekh: Boolean,
    nuutsUg: {
      type: String,
      default: "123",
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

khariltsagchSchema.methods.tokenUusgeye = function () {
  const token = jwt.sign(
    {
      id: this._id,
      ner: this.ner,
      baiguullagiinId: this.baiguullagiinId
    },
    process.env.APP_SECRET,
    {
      expiresIn: "12h",
    }
  );
  return token;
};

khariltsagchSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(12);
  this.nuutsUg = await bcrypt.hash(this.nuutsUg, salt);
});

khariltsagchSchema.pre("updateOne", async function () {
  const salt = await bcrypt.genSalt(12);
  console.log("update xiigdej baina ==>", this._update);
  if (this._update.nuutsUg && this._update.nuutsUg !== "123")
    this._update.nuutsUg = await bcrypt.hash(this._update.nuutsUg, salt);
});

khariltsagchSchema.methods.passwordShalgaya = async function (pass) {
  return await bcrypt.compare(pass, this.nuutsUg);
};

module.exports = mongoose.model("khariltsagch", khariltsagchSchema);
