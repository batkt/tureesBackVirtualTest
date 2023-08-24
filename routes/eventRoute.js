const express = require("express");
const router = express.Router();
const Event = require("../models/event");
const { crud, UstsanBarimt, tokenShalgakh } = require("zevbackv2");
const moment = require("moment");
const EventTariff = require("../models/eventTariff");

crud(router, "event", Event, UstsanBarimt);

router.post("/eventKhadgalya", tokenShalgakh, async (req, res, next) => {
  try {
    var eventObject = new Event(req.body.tukhainBaaziinKholbolt)(req.body);
    var davkhtssanEvent = await Event(req.body.tukhainBaaziinKholbolt).findOne({
      $or: [
        {
          ekhlekhOgnoo: {
            $gte: eventObject.ekhlekhOgnoo,
            $lte: eventObject.duusakhOgnoo,
          },
        },
        {
          duusakhOgnoo: {
            $gte: eventObject.ekhlekhOgnoo,
            $lte: eventObject.duusakhOgnoo,
          },
        },
      ],
      tuluv: { $ne: -1 },
      baiguullagiinId: req.body.baiguullagiinId,
    });
    if (!!davkhtssanEvent) {
      throw new Error(
        `Уучлаарай ${moment(davkhtssanEvent.ekhlekhOgnoo).format(
          "YYYY-MM-DD өдөр HH цаг mm"
        )} минутаас ${moment(davkhtssanEvent.duusakhOgnoo).format(
          "HH цаг mm"
        )} минутын хооронд захиалга бүртгэгдсэн байна.`
      );
    }
    await eventObject.save().catch((err) => {
      next(err);
    });
    res.status(200).send("Amjilttai");
  } catch (error) {
    next(error);
  }
});

router.post("/eventDunBoduulay", tokenShalgakh, async (req, res, next) => {
  try {
    var bodogdokhTariff = await EventTariff(
      req.body.tukhainBaaziinKholbolt
    ).findById(req.body.tariffId);
    var tariffuud = req.body.tariffuud;
    var nemeltTulbur = req.body.nemeltTulbur;
    var dun = 0;
    var tulbur = [...nemeltTulbur];
    tariffuud.forEach((element) => {
      var oldson = bodogdokhTariff.tariffuud.find(
        (a) => a.turul === element.ner
      );
      var bodsonDun = (element.too || 0) * (oldson.tariff || 0);
      tulbur.push({
        dun: bodsonDun,
        ner: element.ner,
        too: element.too,
        turul: "undsenTulbur",
      });
    });

    dun = tulbur.reduce((a, b) => a + b.dun, 0);
    res.send({ niitDun: dun, bodogsonDunDelegrengui: tulbur });
  } catch (error) {
    next(error);
  }
});

router.post("/eventTariffKhadgalya", tokenShalgakh, async (req, res, next) => {
  try {
    var davkhtssanTariff = await EventTariff(
      req.body.tukhainBaaziinKholbolt
    ).findOne({ ner: req.body.ner });
    console.log(davkhtssanTariff);
    if (!davkhtssanTariff) {
      var eventTariff = await EventTariff(req.body.tukhainBaaziinKholbolt)(
        req.body
      );
      await eventTariff.save();
      res.status(200).send("Amjilttai");
    } else throw new Error("Нэр давхцаж байна!");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
