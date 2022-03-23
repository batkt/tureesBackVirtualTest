const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const zogsoolSchema = new Schema(
  {
    id: {
      type: String,
      unique: true
    },
    car_number: String,
    check_in_time: Date,
    check_out_time: Date,
    khugatsaa: Number,
    turul: String,
    tulbur: Number,
    mashin: Schema.Types.Mixed
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("zogsool", zogsoolSchema);
