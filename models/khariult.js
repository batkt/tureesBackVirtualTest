const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const khariultSchema = new Schema(
  {
    baiguullagiinId: {
      type: String,
      required: true
    },
    asuultiinId: String,
    asuultiinNer: String,
    asuultiinTurul: String,
    ognoo: {
      type: Date,
      default: new Date()
    },
    khariultuud: [
      {
        asuult: String,
        khariult: String
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("khariult", khariultSchema);
