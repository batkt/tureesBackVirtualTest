const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const ashiglaltiinZardluudSchema = new Schema(
  {
    baiguullagiinId: String,
    barilgiinId: String,
    ner: String,
    turul: String,
    tariff: String
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ashiglaltiinZardluud", ashiglaltiinZardluudSchema);
