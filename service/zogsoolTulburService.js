// service/uilchluulegchService.js
const axios = require("axios");
const { Uilchluulegch, } = require("parking-v2");
const Baiguullaga = require("../models/baiguullaga");
const { QuickQpayObject } = require("quickqpaypackv2");
const { zogsoolNiitDungeerEbarimtShivye } = require("../routes/ebarimtRoute");
const { db } = require("zevbackv2");

exports.tulburOrjIrlee = async (body, next) => {
  const {
    baiguullagiinId,
    barilgiinId,
    zogsooliinId,
    nemeltUtga,
    tulsunDun: tulsunDunInput,
  } = body;

  let tulsunDun = Number(tulsunDunInput || 0);
  let shineDun = 0;

  const kholbolt = db.kholboltuud.find(
    (a) => a.baiguullagiinId === baiguullagiinId
  );

  // Quick Qpay логик
  if (nemeltUtga?.toLowerCase().includes("qrgadaa")) {
    const guilgeenuud = await QuickQpayObject(kholbolt).find({
      tulsunEsekh: false,
      zogsooliinId,
      "qpay.description": { $regex: "QRGadaa", $options: "i" },
      ognoo: { $gte: new Date(Date.now() - 29 * 60000) },
    });
    if(guilgeenuud?.length > 0) {
        for (const guilgee of guilgeenuud) {
        if (!guilgee.zogsoolUilchluulegch?.uId) continue;

        const oldsonMashin = await Uilchluulegch(kholbolt, true).findOne({
            _id: guilgee.zogsoolUilchluulegch.uId,
            "tuukh.0.tulbur": { $size: 0 },
        });

        if (!oldsonMashin) continue;

        if (
            nemeltUtga?.includes(oldsonMashin.mashiniiDugaar) &&
            guilgee.qpay?.description?.includes(oldsonMashin.mashiniiDugaar)
        ) {
            try {
            await axios.get(encodeURI(guilgee.qpay?.callback_url));
            } catch (err) {
            }
        }
        }
        return; // QRGadaa-д зориулсан хэсэг дууслаа
    }
  }
  if (baiguullagiinId === "663da696aa6bedd9ae0567f0") tulsunDun += 50;
  shineDun = Math.round((tulsunDun + tulsunDun / 99 + Number.EPSILON) * 100) / 100;
  const shuukhKhugatsaa = new Date(Date.now() - 5 * 60 * 1000);
  const query = {
    $or: [
      { niitDun: tulsunDun },
      { niitDun: shineDun > 0 ? shineDun : tulsunDun },
    ],
    tokiId: { $exists: false },
    "tuukh.0.tsagiinTuukh.0.garsanTsag": { $gt: shuukhKhugatsaa },
    "tuukh.0.tuluv": 0,
  };

  // Хаалга тохиргоо
  const doorMap = {
    "6115f350b35689cdbf1b9da3": {
      "хаалт 1": "192.168.1.202",
      "хаалт 2": "192.168.1.204",
      "хаалт 3": "192.168.1.231",
      "хаалт 4": "192.168.1.229",
    },
    "674042c8640d59bcf2e95a9a": {
      office2: "192.168.1.102",
      office1: "192.168.1.102",
    },
    "6731b43bc23730ac1908da2d": {
      "хаалт 1": "192.168.2.21",
      "хаалт 2": "192.168.2.24",
      "хаалт 3": "192.168.2.25",
      "хаалт 4": "192.168.2.26",
    },
    "67dfebe55b92ee004ba43ad2": { "хаалт 1": "192.168.1.122", "хаалт 2": "192.168.1.121" },
    "6800b91480a007fe5ab34436": { "хаалт 1": "192.168.1.103", "хаалт 2": "192.168.1.104" },
    "63c0f31efe522048bf02086d": { "гарах-1": "192.168.2.236", "гарах-2": "192.168.2.237" },
  };

  if (doorMap[baiguullagiinId] && nemeltUtga) {
    const lowerNemelt = nemeltUtga.toLowerCase();
    for (const key in doorMap[baiguullagiinId]) {
      if (lowerNemelt.includes(key)) {
        query["tuukh.0.garsanKhaalga"] = doorMap[baiguullagiinId][key];
        break;
      }
    }
  }

  // Машины дугаар шалгах
  const regex = /\b\d{4}[А-ЯӨҮ]{2,3}\b/gu;
  const result = nemeltUtga?.match(regex);
  if (result) query["mashiniiDugaar"] = result[0];

  const oldsonData = await Uilchluulegch(kholbolt, true).findOne(query);

  if (oldsonData) {
    await Uilchluulegch(kholbolt).findByIdAndUpdate(
      oldsonData._id,
      {
        $set: {
          "tuukh.$[t].burtgesenAjiltaniiNer": "system",
          "tuukh.$[t].tulbur": [
            {
              ognoo: new Date(),
              turul: nemeltUtga?.toLowerCase().includes("qpay") ? "bankQR" : "khariltsakh",
              dun: tulsunDun,
            },
          ],
          "tuukh.$[t].tuluv": 1,
        },
      },
      {
        arrayFilters: [{ "t.zogsooliinId": zogsooliinId }],
      }
    );

    // Socket.io мэдэгдэл
    const io = body.app?.get("socketio");
    if (io) {
      io.emit("zogsoolGarahTulsun", {
        baiguullagiinId,
        khaalgaTurul: "garsan",
        cameraIP: oldsonData.tuukh[0].garsanKhaalga,
        mashiniiDugaar: oldsonData.mashiniiDugaar,
      });
    }

    // eBarimt илгээх
    const baiguullaga = await Baiguullaga(db.erunkhiiKholbolt).findById(kholbolt.baiguullagiinId);
    const tuxainSalbar = baiguullaga?.barilguud?.find((e) => e._id.toString() === barilgiinId)?.tokhirgoo;

    if (tuxainSalbar?.eBarimtMessageIlgeekhEsekh && nemeltUtga) {
      const filterDugaar = nemeltUtga?.split(/,| /)?.filter((a) => isNumeric(a) && a.length === 8);
      if (filterDugaar?.length > 0) {
        await zogsoolNiitDungeerEbarimtShivye(
          kholbolt,
          tulsunDun,
          barilgiinId,
          next,
          [oldsonData],
          filterDugaar[0]
        );
      }
    }
  }

  return "Амжилттай";
};

function isNumeric(str) {
  if (typeof str != "string") return false;
  return !isNaN(str) && !isNaN(parseFloat(str));
}
