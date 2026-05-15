const express = require("express");
const router = express.Router();
const ChatConversation = require("../models/chatConversation");
const ChatMessage = require("../models/chatMessage");
const ChatConfig = require("../models/chatConfig");
const { db, tokenShalgakh } = require("zevbackv2");
const { getChatConfig, resolveAutomatedBotReply } = require("../service/chatService");

const emitNewMessage = (req, conversationId, message) => {
  const io = req.app.get("socketio");
  if (io) {
    io.to(`conv:${conversationId}`).emit("message:new", {
      conversationId: conversationId.toString(),
      message
    });
  }
};


router.post("/v1/chat/conversations", async (req, res, next) => {
  try {
    const { guestId, displayName } = req.body;
    if (!guestId) return res.status(400).json({ aldaa: "guestId is required" });

    const ConvModel = ChatConversation(db.erunkhiiKholbolt);
    const MsgModel = ChatMessage(db.erunkhiiKholbolt);
    
    let conv = await ConvModel.findOne({ guestId });
    if (!conv) {
      conv = await ConvModel.create({ guestId, displayName });
      const config = await getChatConfig();
      const welcome = config.welcomeMessage?.trim();
      if (welcome) {
        await MsgModel.create({
          conversationId: conv._id,
          role: "bot",
          text: welcome
        });
      }
    } else if (displayName && displayName !== conv.displayName) {
      conv.displayName = displayName;
      await conv.save();
    }
    
    res.status(201).json({ data: { ...conv.toObject(), id: conv._id.toString() } });
  } catch (err) {
    next(err);
  }
});

router.get("/v1/chat/conversations/:id/messages", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { guestId } = req.query;
    if (!guestId) return res.status(400).json({ aldaa: "guestId required" });

    const ConvModel = ChatConversation(db.erunkhiiKholbolt);
    const MsgModel = ChatMessage(db.erunkhiiKholbolt);

    const conv = await ConvModel.findById(id).lean();
    if (!conv || conv.guestId !== guestId) {
      return res.status(404).json({ aldaa: "Conversation not found" });
    }

    const messages = await MsgModel.find({ conversationId: id }).sort({ createdAt: 1 }).lean();
    
    const data = messages.map(m => ({ ...m, id: m._id.toString() }));
    res.json({ data });
  } catch (err) {
    next(err);
  }
});

router.post("/v1/chat/conversations/:id/messages", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text, guestId } = req.body;
    if (!text?.trim() || !guestId) return res.status(400).json({ aldaa: "text and guestId required" });

    const ConvModel = ChatConversation(db.erunkhiiKholbolt);
    const MsgModel = ChatMessage(db.erunkhiiKholbolt);

    const conv = await ConvModel.findById(id);
    if (!conv || conv.guestId !== guestId) {
      return res.status(403).json({ aldaa: "Invalid guest" });
    }

    const userMsg = await MsgModel.create({
      conversationId: id,
      role: "user",
      text: text.trim()
    });

    const userMsgData = { ...userMsg.toObject(), id: userMsg._id.toString() };
    emitNewMessage(req, id, userMsgData);

    let botMsgData = null;
    const botText = await resolveAutomatedBotReply(text);
    
    if (botText && !conv.humanMode) {
      const botMsg = await MsgModel.create({
        conversationId: id,
        role: "bot",
        text: botText
      });
      botMsgData = { ...botMsg.toObject(), id: botMsg._id.toString() };
      emitNewMessage(req, id, botMsgData);
    }

    res.status(201).json({ data: { userMsg: userMsgData, botMsg: botMsgData, humanMode: conv.humanMode } });
  } catch (err) {
    next(err);
  }
});


router.get("/v1/admin/chat/conversations", tokenShalgakh, async (req, res, next) => {
  try {
    const ConvModel = ChatConversation(db.erunkhiiKholbolt);
    const convs = await ConvModel.find().sort({ updatedAt: -1 }).lean();
    res.json({ data: convs.map(c => ({ ...c, id: c._id.toString() })) });
  } catch (err) {
    next(err);
  }
});

router.get("/v1/admin/chat/conversations/:id/messages", tokenShalgakh, async (req, res, next) => {
  try {
    const { id } = req.params;
    const MsgModel = ChatMessage(db.erunkhiiKholbolt);
    const messages = await MsgModel.find({ conversationId: id }).sort({ createdAt: 1 }).lean();
    res.json({ data: messages.map(m => ({ ...m, id: m._id.toString() })) });
  } catch (err) {
    next(err);
  }
});

router.post("/v1/admin/chat/conversations/:id/messages", tokenShalgakh, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    if (!text?.trim()) return res.status(400).json({ aldaa: "text required" });

    const ConvModel = ChatConversation(db.erunkhiiKholbolt);
    const MsgModel = ChatMessage(db.erunkhiiKholbolt);

    const conv = await ConvModel.findById(id);
    if (!conv) return res.status(404).json({ aldaa: "Not found" });

    const tokenData = req.body.nevtersenAjiltniiToken || {};
    const adminName = req.body.nevtersenAjiltan?.ner || tokenData.nevtrekhNer || "Admin";

    const msg = await MsgModel.create({
      conversationId: id,
      role: "agent",
      text: text.trim(),
      agentDisplayName: adminName
    });

    const msgData = { ...msg.toObject(), id: msg._id.toString() };
    emitNewMessage(req, id, msgData);

    res.status(201).json({ data: msgData });
  } catch (err) {
    next(err);
  }
});

router.patch("/v1/admin/chat/conversations/:id", tokenShalgakh, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { humanMode } = req.body;
    const ConvModel = ChatConversation(db.erunkhiiKholbolt);
    const conv = await ConvModel.findByIdAndUpdate(
      id,
      { $set: { humanMode: !!humanMode } },
      { new: true }
    ).lean();
    
    if (!conv) return res.status(404).json({ aldaa: "Not found" });
    
    res.json({ data: { ...conv, id: conv._id.toString() } });
  } catch (err) {
    next(err);
  }
});

router.get("/v1/admin/chat/chatbot-config", tokenShalgakh, async (req, res, next) => {
  try {
    const config = await getChatConfig();
    res.json({ data: config });
  } catch (err) {
    next(err);
  }
});

router.put("/v1/admin/chat/chatbot-config", tokenShalgakh, async (req, res, next) => {
  try {
    const ChatConfigModel = ChatConfig(db.erunkhiiKholbolt);
    let config = await ChatConfigModel.findOne();
    if (!config) {
      config = new ChatConfigModel(req.body);
    } else {
      Object.assign(config, req.body);
    }
    await config.save();
    res.json({ data: config });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
