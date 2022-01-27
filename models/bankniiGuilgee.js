const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const bankniiGuilgeeSchema = new Schema({
  id: String,
  baiguullagiinId: String,
  barilgiinId: String,
  dansniiDugaar: String,
  //tdb
  NtryRef: String,
  TxDt: Date,
  TxPostDate: Date,
  TxTime: String,
  TxRt: String,
  CtAcct: String,
  CtActnName: String,
  TxAddInf: String,
  CtAcntOrg: String,
  CtBankNo: String,
  Amt: Number,
  //khaan
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
  relatedAccount: String,
  ebarimtAvsanEsekh: Boolean,
  kholbosonGereeniiId: [String],
  kholbosonDun: Number,
  kholbosonTalbainId: [String],
  magadlaltaiGereenuud: {
    type: [String],
    default: undefined
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("bankniiGuilgee", bankniiGuilgeeSchema);