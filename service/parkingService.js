const {
    Parking,
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

module.exports = { getCameraIPsByBarilgiinId };
