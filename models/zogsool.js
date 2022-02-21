const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const zogsoolSchema = new Schema(
  {
    car_number: String,
    check_in_time: Date,
    check_out_time: Date,
    khugatsaa: Number
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("zogsool", zogsoolSchema);
