const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const licenseSchema = new Schema(
  {
    baiguullagiinId: {
      type : String,
      unique : true,
      index: true,
      required : true
    },
    duusakhOgnoo: 
    {
      type : Date,
      required : true
    }
  },
  { _id : false },
  { timestamps: true }
);

module.exports = mongoose.model("license", licenseSchema);
