const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);

const chatMessageSchema = new Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ["user", "bot", "agent"],
      required: true,
    },
    text: { type: String, required: true },
    agentDisplayName: { type: String },
    agentUsername: { type: String },
  },
  { timestamps: true }
);

module.exports = function (conn) {
  if (!conn || !conn.kholbolt)
    throw new Error("Холболтын мэдээлэл заавал бөглөх шаардлагатай!");
  conn = conn.kholbolt;
  return conn.model("chatMessage", chatMessageSchema);
};
