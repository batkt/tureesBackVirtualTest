const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);

const chatConversationSchema = new Schema(
  {
    guestId: { type: String, required: true, index: true },
    displayName: { type: String },
    humanMode: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
  },
  { timestamps: true }
);

module.exports = function (conn) {
  if (!conn || !conn.kholbolt)
    throw new Error("Холболтын мэдээлэл заавал бөглөх шаардлагатай!");
  conn = conn.kholbolt;
  return conn.model("chatConversation", chatConversationSchema);
};
