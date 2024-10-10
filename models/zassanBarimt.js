const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const zassanBarimtSchema = new Schema(
  {
    baiguullagiinId: String,
    barilgiinId: String,
    classType: String,
    className: String,
    classId: String,
    classDugaar: String,
    classOgnoo: Date,
    ajiltniiId: String,
    ajiltniiNer: String,
    uurchlult: [
      {
        talbar: String,
        talbarNer: String,
        umnukhUtga: String,
        shineUtga: String,
        utganiiTurul: String,
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
  return conn.model("zassanBarimt", zassanBarimtSchema);
};
