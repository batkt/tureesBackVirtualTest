const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const ipTuukhSchema = new Schema(
  {
    ip: String,
    bairshilUls: String,
    bairshilKhot: String,
    ognoo: Date,
    medeelel: Schema.Types.Mixed,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ipTuukh", ipTuukhSchema);
