const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const bankniiGuilgeeSchema = new Schema({
  id: String,
  baiguullagiinId: String,
  dansniiDugaar: String,
  record: String,
  tranDate: Date,
  postDate: Date,
  time: String,
  branch: String,
  teller: String,
  journal: Number,
  code: String,
  amount: Number,
  balance: Number,
  debit: Number,
  correction: Number,
  description: String,
  relatedAccount: String
}, {
  timestamps: true
});

module.exports = mongoose.model("bankniiGuilgee", bankniiGuilgeeSchema);