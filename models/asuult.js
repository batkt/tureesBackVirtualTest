const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const asuultSchema = new Schema(
  {
    baiguullagiinId: {
      type: String,
      required: true,
    },
    barilgiinId: {
      type: String,
      required: true,
    },
    ner: String,
    turul: String,
    asuultuud: [
      {
        asuult: String,
        turul: String,
        khariultuud: [String],
      },
    ],
    guilgeeKhiisenOgnoo: Date,
    guilgeeKhiisenAjiltniiNer: String,
    guilgeeKhiisenAjiltniiId: String,
  },
  { timestamps: true }
);

//module.exports = mongoose.model("asuult", asuultSchema);
module.exports = function a(conn) {
  if (!conn || !conn.kholbolt)
    throw new Error("Холболтын мэдээлэл заавал бөглөх шаардлагатай!");
  conn = conn.kholbolt;
  return conn.model("asuult", asuultSchema);
};
