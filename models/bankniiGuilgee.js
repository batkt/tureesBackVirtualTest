const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const bankniiGuilgeeSchema = new Schema(
  {
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
    //golomt shine
    requestId: String,
    recNum: String,
    tranId: String,
    tranDateG: String,
    drOrCr: String,
    tranAmount: Number,
    tranDesc: String,
    tranPostedDate: String,
    tranCrnCode: String,
    exchRate: Number,
    accName: String,
    accNum: String,
    //trans
    jrno: String,
    jritemNo: String,
    contCurRate: String,
    username: String,
    userId: String,
    userBrchCode: String,
    txnCode: String,
    txnNo: String,
    balTypeCode: String,
    income: Number,
    outcome: Number,
    curCode: String,
    curRate: Number,
    contAcntName: String,
    contAcntCode: String,
    contBankAcntCode: String,
    contBankAcntName: String,
    txnDesc: Number,
    txnDate: String,

    ebarimtAvsanEsekh: Boolean,
    kholbosonGereeniiId: [String],
    kholbosonDun: Number,
    zardliinBulgiinId: String,
    zardliinBulgiinNer: String,
    kholbosonTalbainId: [String],
    magadlaltaiGereenuud: {
      type: [String],
      default: undefined,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = function a(conn) {
  if (!conn || !conn.kholbolt)
    throw new Error("Холболтын мэдээлэл заавал бөглөх шаардлагатай!");
  conn = conn.kholbolt;
  return conn.model("bankniiGuilgee", bankniiGuilgeeSchema);
};
//module.exports = mongoose.model("bankniiGuilgee", bankniiGuilgeeSchema);
