const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const asuultSchema = new Schema(
  {
    baiguullagiinId: {
      type: String,
      required: true
    },
    asuult: String,
    khariultuud: [String],
    guilgeeKhiisenOgnoo: Date,
    guilgeeKhiisenAjiltniiNer: String,
    guilgeeKhiisenAjiltniiId: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("asuult", asuultSchema);
