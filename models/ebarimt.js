const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const ebarimtSchema = new Schema({
  "baiguullagiinId": String,
  "gereeniiDugaar": String,
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
  "utas":String,
  "talbainDugaar":String,
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
module.exports = mongoose.model("ebarimt", ebarimtSchema);