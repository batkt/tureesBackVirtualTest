const mongoose = require("mongoose");
const { db } = require("zevbackv2");
const ChatConfig = require("../models/chatConfig");

const getChatConfig = async () => {
  const ConfigModel = ChatConfig(db.erunkhiiKholbolt);
  let config = await ConfigModel.findOne();
  if (!config) {
    config = await ConfigModel.create({});
  }
  return config;
};

const normalizeUserText = (text) => {
  if (!text) return "";
  return text.toLowerCase().replace(/[^a-z0-9а-яөү]/gi, "").trim();
};

const findAnswerByNormalizedLabel = (nodes, userNorm) => {
  if (!nodes || !Array.isArray(nodes)) return null;
  for (const n of nodes) {
    const labelNorm = normalizeUserText(n.label);
    if (labelNorm && labelNorm === userNorm) {
      const out = (n.answer || "").trim();
      if (out.length > 0) return out;
      const nested = findAnswerByNormalizedLabel(n.choices || [], userNorm);
      if (nested) return nested;
      return (n.label || "").trim() || null;
    }
    const nested = findAnswerByNormalizedLabel(n.choices || [], userNorm);
    if (nested) return nested;
  }
  return null;
};

const resolveAutomatedBotReply = async (userText) => {
  const config = await getChatConfig();
  const n = normalizeUserText(userText);
  if (!n) return null;

  if (config.startButtonLabel) {
    const startNorm = normalizeUserText(config.startButtonLabel);
    if (startNorm && startNorm === n && config.welcomeMessage) {
      const w = config.welcomeMessage.trim();
      if (w.length > 0) return w;
    }
  }

  const rootChoices = config.rootChoices || [];
  let fromTree = null;
  if (rootChoices.length > 0) {
    fromTree = findAnswerByNormalizedLabel(rootChoices, n);
  }
  if (fromTree) return fromTree;

  const fb = (config.fallbackBotReply || "").trim();
  if (fb) return fb;
  
  const w = (config.welcomeMessage || "").trim();
  if (w) return w;
  
  return null;
};

module.exports = {
  getChatConfig,
  resolveAutomatedBotReply
};
