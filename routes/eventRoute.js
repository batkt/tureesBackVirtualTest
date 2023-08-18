const express = require("express");
const router = express.Router();
const Event = require("../models/event");
const { crud, UstsanBarimt, tokenShalgakh } = require("zevbackv2");
const moment = require("moment");

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
module.exports = router;
