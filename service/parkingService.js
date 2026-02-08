const {
    Parking,
    Mashin,
    BlockMashin,
} = require("parking-v2");

async function getCameraIPsByBarilgiinId(req, barilgiinId) {
    if (!barilgiinId) throw new Error("BarilgiinId baihgui bn");
    const result = await Parking(req.body.tukhainBaaziinKholbolt).find({ barilgiinId });
    const yavuulakhIp = [];
    result.forEach((zogsool) => {
        zogsool.khaalga.forEach((khaalga) => {
        khaalga.camera.forEach((cameraIp) => {
            yavuulakhIp.push(cameraIp.cameraIP);
        });
        });
    });
    return yavuulakhIp;
}
async function mashiniiTooAvakh({
  baiguullagiinId,
  barilgiinId,
  tukhainBaaziinKholbolt,
}) {
  const mashinQuery = [
    {
      $match: {
        baiguullagiinId,
        barilgiinId,
      },
    },
    {
      $group: {
        _id: "$turul",
        too: { $sum: 1 },
      },
    },
  ];

  const mashinResult = await Mashin(
    tukhainBaaziinKholbolt,
  ).aggregate(mashinQuery);

  const blockQuery = [
    {
      $match: {
        baiguullagiinId,
        barilgiinId,
      },
    },
    {
      $group: {
        _id: "Block",
        too: { $sum: 1 },
      },
    },
  ];

  const blockResult = await BlockMashin(
    tukhainBaaziinKholbolt,
  ).aggregate(blockQuery);

  return [...mashinResult, ...blockResult];
}
module.exports = { getCameraIPsByBarilgiinId, mashiniiTooAvakh };
