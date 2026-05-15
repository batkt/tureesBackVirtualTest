const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);

const chatConfigSchema = new Schema(
  {
    welcomeMessage: { type: String, default: "" },
    startButtonLabel: { type: String, default: "" },
    fallbackBotReply: { type: String, default: "" },
    restartLabel: { type: String, default: "" },
    rootChoices: { type: Schema.Types.Mixed, default: [] },
  },
  { timestamps: true }
);

module.exports = function (conn) {
  if (!conn || !conn.kholbolt)
    throw new Error("Холболтын мэдээлэл заавал бөглөх шаардлагатай!");
  conn = conn.kholbolt;
  return conn.model("chatConfig", chatConfigSchema);
};
