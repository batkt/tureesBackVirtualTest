const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const ajiltanSchema = new Schema({
  id: String,
  ner: String,
  ovog: String,
  utas: String,
  mail: String,
  nuutsUg: {
    type: String,
    select: false
  },
  register: String,
  khayag: String,
  ajildOrsonOgnoo: Date,
  baiguullagiinId: String,
  baiguullagiinNer: String,
  erkh: String,
  firebaseToken: String,
  albanTushaal: String,
  zurgiinNer: String
}, {
  timestamps: true
});

ajiltanSchema.index({
  '$**': 'text',
  nuutsUg: -1
});
ajiltanSchema.methods.tokenUusgeye = function (duusakhOgnoo) {

  const token = jwt.sign({
    id: this._id,
    ner: this.ner,
    baiguullagiinId: this.baiguullagiinId,
    duusakhOgnoo: duusakhOgnoo
  }, "tokenUusgexTest0123", {
    expiresIn: '12h'
  });
  return token;
};
ajiltanSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(12);
  this.nuutsUg = await bcrypt.hash(this.nuutsUg, salt);
})

ajiltanSchema.methods.passwordShalgaya = async function (pass) {
  return await bcrypt.compare(pass, this.nuutsUg)
}

module.exports = mongoose.model("ajiltan", ajiltanSchema);