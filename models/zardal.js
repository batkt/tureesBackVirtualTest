const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const zardalSchema = new Schema(
  {
    id: {
      type: String,
      unique: true
    },
    ner: String,
    baiguullagiinId: String,
    barilgiinId: String,
    dedKheseg: [Schema.Types.Mixed]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("zardal", zardalSchema);