const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const eventSchema = new Schema(
  {
    turul: String,
    tuluv: {
      type: Number,
      default: 0,
    },
    khuniiToo: Number,
    utas: [String],
    niitDun: Number,
    baiguullagiinId: String,
    barilgiinId: String,
    tulburTulsunEsekh: Boolean,
    ebarimtAvsanEsekh: Boolean,
    ebarimtAvakhDun: Number,
    ebarimtRegister: String,
    tsutsalsanShaltgaan: String,
    ekhlekhOgnoo: Date,
    duusakhOgnoo: Date,
    khugatsaa: Number, //minutaar
    khool: [{ id: String, ner: String }],
    tulbur: [
      {
        turul: String,
        tailbar: String,
        dun: Number,
        object: Schema.Types.Mixed,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = function a(conn) {
  if (!conn || !conn.kholbolt)
    throw new Error("Холболтын мэдээлэл заавал бөглөх шаардлагатай!");
  conn = conn.kholbolt;
  return conn.model("event", eventSchema);
};
