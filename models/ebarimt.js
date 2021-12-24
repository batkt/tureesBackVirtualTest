const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const ebarimtSchema = new Schema({
  "baiguullagiinId": String,
  "barilgiinId": String,
  "gereeniiDugaar": String,
  "guilgeeniiId": String,
  "tulultiinId": String,
  "ustgasanOgnoo": Date,
  "amount": String,
  "vat": String,
  "cashAmount": String,
  "nonCashAmount": String,
  "cityTax": String,
  "districtCode": String,
  "posNo": String,
  "customerNo": String,
  "billType": String,
  "billIdSuffix": String,
  "returnBillId": String,
  "billId": String,
  "date": String,
  "dateOgnoo": Date,
  "talbainDugaar": String,
  "gereeniiDugaar": String,
  "utas": String,
  "stocks": [
    {
      "code": String,
      "name": String,
      "measureUnit": String,
      "qty": String,
      "unitPrice": String,
      "totalAmount": String,
      "cityTax": String,
      "vat": String,
      "barCode": String
    }
  ],
  "bankTransactions": [
    {
      "rrn": String,
      "bankId": String,
      "terminalId": String,
      "approvalCode": String,
      "amount": String
    }
  ]
}, {
  timestamps: true
});
ebarimtSchema.pre("save", async function () {
  this.dateOgnoo = new Date(this.date);
});

ebarimtSchema.pre("updateOne", async function () {
  this._update.dateOgnoo = new Date(this._update.date);
});
module.exports = mongoose.model("ebarimt", ebarimtSchema);