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
    //tdbshine
    bankcode: String,
    refno: String,
    fee: String,
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
    beforeBalance: Number,
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
    txnDesc: String,
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
    bank: String,
    indexTalbar: {
      type: String,
      unique: true,
    },
    burtgesenAjiltaniiId: String,
    burtgesenAjiltaniiNer: String,
  },
  {
    timestamps: true,
  }
);

bankniiGuilgeeSchema.pre("insertMany", function (next, docs) {
  for (let doc of docs) {
    console.log("doc.bankniiGuilgeeSchema.pre->", doc.record, doc.dansniiDugaar);
    var dugaar =
      doc.bank === "khanbank"
        ? doc.record
        : doc.bank === "golomt"
        ? doc.tranId
        : doc.bank === "bogd"
        ? doc.recNum
        : doc.bank === "tran"
        ? doc.jrno
        : doc.bank === "tdb" && !!doc.NtryRef
        ? doc.NtryRef
        : doc.refno;
    var mungunDun =
      doc.bank === "khanbank"
        ? doc.amount
        : doc.bank === "golomt"
        ? doc.tranAmount
        : doc.bank === "bogd"
        ? doc.amount
        : doc.bank === "tran"
        ? doc.income > 0
          ? doc.income
          : doc.outcome
        : doc.bank === "tdb"
        ? doc.Amt
        : 0;
    doc.indexTalbar =
      doc.barilgiinId +
      doc.bank +
      doc.dansniiDugaar +
      dugaar +
      (mungunDun ? mungunDun.toString() : "0");

    console.log("doc.bankniiGuilgeeSchema.pre->indexTalbar --->", doc.indexTalbar);
  }
  next();
});

module.exports = function a(conn, read = false, modelName = "bankniiGuilgee") {
  if (!conn || !conn.kholbolt)
    throw new Error("Холболтын мэдээлэл заавал бөглөх шаардлагатай!");
  conn = read && !!conn.kholboltRead ? conn.kholboltRead : conn.kholbolt;
  return conn.model(modelName, bankniiGuilgeeSchema);
};
//module.exports = mongoose.model("bankniiGuilgee", bankniiGuilgeeSchema);
