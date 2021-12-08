const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const khungulultiinTuukhSchema = new Schema(
  {
    baiguullagiinId: String,
    barilgiinId: String,
    ognoonuud: [Date],
    shaltgaan: String,
    turul: String,
    khungulukhKhuvi: Number,
    tulukhDun: Number,
    khungulsunDun: Number,
    khungulultiinDun: Number,
    khamaataiGereenuud: [String],
    guilgeeKhiisenOgnoo: Date,
    guilgeeKhiisenAjiltniiNer: String,
    guilgeeKhiisenAjiltniiId: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("khungulultiinTuukh", khungulultiinTuukhSchema);
