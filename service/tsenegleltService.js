// services/tsenegleltService.js
const { Mashin } = require("parking-v2");

async function tsenegleltKhiikh({
  baiguullagiinId,
  barilgiinId,
  mashiniiId,
  tseneglekhDun,
  tukhainBaaziinKholbolt,
}) {
  if (!mashiniiId) {
    throw new Error("Дахин оролдоно уу");
  }

  if (!tseneglekhDun || tseneglekhDun === 0) {
    throw new Error("Цэнэглэлтийн дүн хоосон болон 0 байж болохгүй");
  }

  const tukhainMashin = await Mashin(tukhainBaaziinKholbolt).findOne({
    _id: mashiniiId,
    baiguullagiinId,
    barilgiinId,
  });

  if (!tukhainMashin) {
    throw new Error("Машин олдсонгүй. Та дахин оролдоно уу");
  }

  const umnukhUldegdel = tukhainMashin.tsenegleltUldegdel || 0;
  const shineUldegdel = umnukhUldegdel + tseneglekhDun;

  tukhainMashin.tsenegleltUldegdel = shineUldegdel;

  const tuukhData = {
    ognoo: new Date(),
    turul: "orlogo",
    dun: tseneglekhDun,
    uldegdel: shineUldegdel,
  };

  if (Array.isArray(tukhainMashin.tsenegleltTuukh)) {
    tukhainMashin.tsenegleltTuukh.push(tuukhData);
  } else {
    tukhainMashin.tsenegleltTuukh = [tuukhData];
  }

  await tukhainMashin.save();

  return true;
}

module.exports = {
  tsenegleltKhiikh,
};
