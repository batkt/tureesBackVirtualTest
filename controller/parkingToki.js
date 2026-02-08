const asyncHandler = require("express-async-handler");
const moment = require("moment");
const {
  Uilchluulegch,
  zogsooliinDunAvya,
} = require("parking-v2");
const { getParkingFind } = require("../middlewares/parkingMiddle");

exports.searchCarToki = asyncHandler(async (req, res, next) => {
    try {
        const { db } = require("zevbackv2");
        var kholboltuud = db.kholboltuud;
        var bodsonDun = 0;
        var data;
        var dataList = [];
        var message = "Amjilttai";
        var success = true;
        var oldsonMashin;
        var freeze = req.query.freeze;
        var tukhainKholbolt;
        var localEsekh = !!req.query.baiguullagiinId;
        if (localEsekh) {
            kholboltuud = kholboltuud.filter(
            (a) => a.baiguullagiinId == req.query.baiguullagiinId,
            );
        }
        
        if (kholboltuud) {
            for (const kholbolt of kholboltuud) {
            if(!kholbolt.baiguullagiinId) continue;
            var query = localEsekh
                ? { baiguullagiinId: req.query.baiguullagiinId }
                : {
                    tokiNer: { $exists: true },
                };
            if (req.query.barilgiinId) query["barilgiinId"] = req.query.barilgiinId;
            var zogsooluud = await getParkingFind(
                kholbolt,
                kholbolt.baiguullagiinId,
                query,
            );
            for (const zogsool of zogsooluud) {
                if (!!zogsool) {
                var matchMashin = {
                    mashiniiDugaar: req.params.plate_number,
                    "tuukh.0.zogsooliinId": zogsool._id,
                    "tuukh.0.tuluv": 0,
                    zurchil: { $exists: false },
                };
                if (req.query.barilgiinId)
                    matchMashin["barilgiinId"] = req.query.barilgiinId;
                oldsonMashin = await Uilchluulegch(kholbolt, true)
                    .findOne(matchMashin)
                    .sort({ createdAt: -1 });
                if (!!oldsonMashin) {
                    oldsonMashin.freezeOgnoo =
                    oldsonMashin.tuukh[0].tsagiinTuukh[0].garsanTsag;
                    await Uilchluulegch(kholbolt).updateOne(
                    { _id: oldsonMashin._id },
                    {
                        freezeOgnoo: oldsonMashin.tuukh[0].tsagiinTuukh[0].garsanTsag
                        ? oldsonMashin.tuukh[0].tsagiinTuukh[0].garsanTsag
                        : new Date(),
                    },
                    );
                }
                if (!!oldsonMashin && !!oldsonMashin.mashiniiDugaar) {
                    if (
                    zogsool?.togtmolTulburEsekh &&
                    zogsool?.togtmolTulburiinDun > 0 &&
                    oldsonMashin?.turul == "Дурын"
                    )
                    bodsonDun = zogsool.togtmolTulburiinDun;
                    else {
                    bodsonDun = await zogsooliinDunAvya(
                        zogsool,
                        oldsonMashin,
                        kholbolt,
                    );
                    }
                }
                }
                if (bodsonDun > 0 && oldsonMashin) {
                data = {
                    baiguullagiinId: zogsool.baiguullagiinId,
                    plate_number: req.params.plate_number,
                    enter_date: moment(
                    oldsonMashin.tuukh[0].tsagiinTuukh[0].orsonTsag,
                    ).format("YYYY/MM/DD HH:mm:ss"),
                    pay_amount: bodsonDun,
                    parking_id: zogsool._id,
                    parking_name: zogsool.ner,
                    parkingUndsenUne: zogsool.undsenUne,
                    session_id: oldsonMashin._id,
                    garsanCameraIP: oldsonMashin.tuukh[0].garsanKhaalga,
                    garsanTsag: oldsonMashin.tuukh[0].tsagiinTuukh[0].garsanTsag
                    ? moment(
                        oldsonMashin.tuukh[0].tsagiinTuukh[0].garsanTsag,
                        ).format("YYYY/MM/DD HH:mm:ss")
                    : null,
                };
                tukhainKholbolt = kholbolt;
                dataList.push(data);
                }
            }
            //if (data && data.plate_number) break;
            }
        }
        if (dataList?.length > 0)
            data = dataList?.reduce((a, b) => {
            return new Date(a.enter_date) > new Date(b.enter_date) ? a : b;
            });
        else {
            message = "Машины мэдээлэл олдсонгүй!";
            success = false;
        }
        var butsaakhKhariu = {
            success,
            message,
            data,
        };
        res.send(butsaakhKhariu);
    } catch (err) {
        next(err);
    }
});