const { db } = require("zevbackv2");
const { Parking, Uilchluulegch, zogsooliinDunAvya } = require("parking-v2");

async function kioskPay(req) {
  let tulbur = [];
  if (
    req.body.ajiltniiId == "66384a9061eeda747d01a320" ||
    req.body.ajiltniiId == "6966f429535c9cddf36c9761"
  ) {
    if (req.body.paid_amount == 0) {
      tulbur = [
        {
          ognoo: new Date(),
          turul: "Fitness",
          dun: 4000,
        },
      ];
    } else {
      tulbur = [
        {
          ognoo: new Date(),
          turul: "Fitness",
          dun: 4000,
        },
        {
          ognoo: new Date(),
          turul: req.body.turul,
          dun: req.body.paid_amount,
        },
      ];
    }
  } else if (req.body.ajiltniiId == "6746b7b1e3a4bd05bbac6880") {
    if (req.body.paid_amount == 0) {
      tulbur = [
        {
          ognoo: new Date(),
          turul: "Соёолж Ц/Д",
          dun: 4000,
        },
      ];
    } else {
      tulbur = [
        {
          ognoo: new Date(),
          turul: "Соёолж Ц/Д",
          dun: 4000,
        },
        {
          ognoo: new Date(),
          turul: req.body.turul,
          dun: req.body.paid_amount,
        },
      ];
    }
  } else if (req.body.ajiltniiId == "67d92062513ec21e26bdb604") {
    if (req.body.paid_amount == 0) {
      tulbur = [
        {
          ognoo: new Date(),
          turul: "Бассэйн",
          dun: 7000,
        },
      ];
    } else {
      tulbur = [
        {
          ognoo: new Date(),
          turul: "Бассэйн",
          dun: 7000,
        },
        {
          ognoo: new Date(),
          turul: req.body.turul,
          dun: req.body.paid_amount,
        },
      ];
    }
  } else if (
    req.body.ajiltniiId == "68357e846653c13643908698" &&
    !!req.body.khungulukhTsag &&
    !!req.body.zogsoolUndsenUne
  ) {
    if (req.body.paid_amount == 0) {
      tulbur = [
        {
          ognoo: new Date(),
          turul: "Божон/ " + req.body.khungulukhTsag + " цаг",
          dun: req.body.zogsoolUndsenUne * req.body.khungulukhTsag,
        },
      ];
    } else {
      tulbur = [
        {
          ognoo: new Date(),
          turul: "Божон/ " + req.body.khungulukhTsag + " цаг",
          dun: req.body.zogsoolUndsenUne * req.body.khungulukhTsag,
        },
        {
          ognoo: new Date(),
          turul: req.body.turul,
          dun: req.body.paid_amount,
        },
      ];
    }
  } else if (
    (req.body.ajiltniiId == "694e6d2d5b0e44bb0cca2945" ||
      req.body.ajiltniiId == "694e260f3f0da03b83ace92b") &&
    !!req.body.khungulukhTsag &&
    !!req.body.zogsoolUndsenUne
  ) {
    if (req.body.paid_amount == 0) {
      tulbur = [
        {
          ognoo: new Date(),
          turul: "ugaalga/ " + req.body.khungulukhTsag + " цаг",
          dun: req.body.zogsoolUndsenUne * req.body.khungulukhTsag,
        },
      ];
    } else {
      tulbur = [
        {
          ognoo: new Date(),
          turul: "ugaalga/ " + req.body.khungulukhTsag + " цаг",
          dun: req.body.zogsoolUndsenUne * req.body.khungulukhTsag,
        },
        {
          ognoo: new Date(),
          turul: req.body.turul,
          dun: req.body.paid_amount,
        },
      ];
    }
  } else if (req.body.barilgiinId === "673d88133987e97992f77c03") {
    if (req.body.paid_amount == 0) {
      tulbur = [
        {
          ognoo: new Date(),
          turul: "Хөнгөлөлт",
          dun: 3000,
        },
      ];
    } else {
      tulbur = [
        {
          ognoo: new Date(),
          turul: "Хөнгөлөлт",
          dun: 3000,
        },
        {
          ognoo: new Date(),
          turul: req.body.turul,
          dun: req.body.paid_amount,
        },
      ];
    }
  } else if (req.body.ajiltniiId === "68425acd7611dd8da7e7a7d2") {
    if (req.body.paid_amount == 0) {
      tulbur = [
        {
          ognoo: new Date(),
          turul: "Хөнгөлөлт",
          dun: req.body.khungulult,
        },
      ];
    } else {
      tulbur = [
        {
          ognoo: new Date(),
          turul: "Хөнгөлөлт",
          dun: req.body.khungulult,
        },
        {
          ognoo: new Date(),
          turul: req.body.turul,
          dun: req.body.paid_amount,
        },
      ];
    }
  } else
    tulbur = [
      {
        ognoo: new Date(),
        turul: req.body.turul,
        dun: req.body.paid_amount,
      },
    ];
  var oldsonMashin;
  var tukhainKholbolt;
  var tukhainObject;
  var tukhainZogsool;
  var bodsonDun = 0;
  const zogsool = req.body.zogsooliinId
    ? await Parking(req.body.tukhainBaaziinKholbolt).findOne({
        _id: req.body.zogsooliinId,
      })
    : await Parking(req.body.tukhainBaaziinKholbolt).findOne({
        baiguullagiinId: req.body.baiguullagiinId,
        barilgiinId: req.body.barilgiinId,
        "khaalga.ajiltnuud.id": req.body.ajiltniiId,
      });
  if (!!zogsool) {
    oldsonMashin = await Uilchluulegch(
      req.body.tukhainBaaziinKholbolt,
      true,
    ).findOne({
      _id: req.body.uilchluulegchiinId,
    });
    if (!!oldsonMashin && !!oldsonMashin.mashiniiDugaar) {
      tukhainKholbolt = req.body.tukhainBaaziinKholbolt;
      tukhainZogsool = zogsool;
      tukhainObject = oldsonMashin;
    }
  }
  if (
    !!tukhainObject?.tuukh?.[0].tsagiinTuukh?.[0].garsanTsag &&
    tukhainObject.niitDun > 0
  ) {
    bodsonDun = tukhainObject.niitDun;
  } else {
    if (!tukhainObject?.freezeOgnoo) {
      tukhainObject.freezeOgnoo = tukhainObject?.tuukh?.[0].tsagiinTuukh?.[0]
        .garsanTsag
        ? tukhainObject?.tuukh?.[0].tsagiinTuukh?.[0].garsanTsag
        : new Date();
      await Uilchluulegch(tukhainKholbolt).updateOne(
        { _id: tukhainObject._id },
        {
          freezeOgnoo: tukhainObject.freezeOgnoo,
        },
      );
    }
    bodsonDun = await zogsooliinDunAvya(
      tukhainZogsool,
      tukhainObject,
      tukhainKholbolt,
    );
  }
  if (!tukhainObject) {
    return { success: false, message: "Машины мэдээлэл олдсонгүй!" };
  }
  bodsonDun -= tukhainObject.tuukh[0].tulbur.reduce(
    (a, b) => a + (b.dun || 0),
    0,
  );
  if (tukhainObject && tukhainObject.tuukh && tukhainObject.tuukh.length > 0) {
    if (tukhainObject.tuukh && tukhainObject.tuukh.length > 0)
      if (
        tukhainObject.tuukh[0].tulbur &&
        tukhainObject.tuukh[0].tulbur.length > 0
      ) {
        if (
          req.body.ajiltniiId == "66384a9061eeda747d01a320" ||
          req.body.ajiltniiId == "6966f429535c9cddf36c9761"
        ) {
          if (tukhainObject.tuukh[0].tulbur.find((x) => x.turul == "Fitness"))
            throw new Error("Хөнгөлөлт оруулсан байна!");
        } else if (req.body.ajiltniiId == "6746b7b1e3a4bd05bbac6880") {
          if (
            tukhainObject.tuukh[0].tulbur.find((x) => x.turul == "Соёолж Ц/Д")
          )
            throw new Error("Хөнгөлөлт оруулсан байна!");
        } else if (req.body.ajiltniiId == "67d92062513ec21e26bdb604") {
          if (tukhainObject.tuukh[0].tulbur.find((x) => x.turul == "Бассэйн"))
            throw new Error("Хөнгөлөлт оруулсан байна!");
        } else if (req.body.ajiltniiId == "68357e846653c13643908698") {
          if (
            tukhainObject.tuukh[0].tulbur.find((x) =>
              x.turul?.includes("Божон"),
            )
          )
            throw new Error("Хөнгөлөлт оруулсан байна!");
        } else if (
          req.body.ajiltniiId == "694e260f3f0da03b83ace92b" ||
          req.body.ajiltniiId == "694e6d2d5b0e44bb0cca2945"
        ) {
          const existingUgaalga = tukhainObject.tuukh[0].tulbur.find((x) =>
            x.turul?.includes("ugaalga"),
          );
          if (existingUgaalga) {
            throw new Error("Угаалга хөнгөлөлт оруулсан байна!");
          }
        } else if (req.body.barilgiinId === "673d88133987e97992f77c03") {
          if (tukhainObject.tuukh[0].tulbur.find((x) => x.turul == "Хөнгөлөлт"))
            throw new Error("Хөнгөлөлт оруулсан байна!");
        } else if (req.body.ajiltniiId === "68425acd7611dd8da7e7a7d2") {
          if (
            tukhainObject.tuukh[0].tulbur.find((x) =>
              x.turul?.includes("Хөнгөлөлт"),
            )
          )
            throw new Error("Хөнгөлөлт оруулсан байна!");
        } else if (req.body.barilgiinId === "67e0ca757d7ac716ef9c3cc5") {
          if (
            tukhainObject.tuukh[0].tulbur.find(
              (x) => x.turul === req.body.turul,
            )
          )
            throw new Error("Хөнгөлөлт оруулсан байна!");
        }
        tukhainObject.tuukh[0].tulbur.push(...tulbur);
      } else tukhainObject.tuukh[0].tulbur = tulbur;
    var set = {
      "tuukh.$[t].tulbur": tukhainObject.tuukh[0].tulbur,
    };
    if (bodsonDun > 0) {
      if (bodsonDun == req.body.paid_amount) {
        if (!!tukhainObject.tuukh[0]?.tsagiinTuukh[0]?.garsanTsag) {
          set["tuukh.$[t].tuluv"] = 1;
          if (!!tukhainObject.tuukh[0]?.garsanKhaalga) {
            const io = req.app.get("socketio");
            io.emit("zogsoolGarahTulsun", {
              baiguullagiinId: tukhainObject.baiguullagiinId,
              khaalgaTurul: "garsan",
              mashiniiDugaar: tukhainObject.mashiniiDugaar,
              cameraIP: tukhainObject.tuukh[0]?.garsanKhaalga,
            });
          }
        } else {
          const io = req.app.get("socketio");
          io.emit("zogsoolRefresh", {
            baiguullagiinId: tukhainObject.baiguullagiinId,
            khaalgaTurul: "zogsoolRefresh",
            mashiniiDugaar: tukhainObject.mashiniiDugaar,
          });
        }
        set["garakhTsag"] = new Date(
          new Date().getTime() + (tukhainZogsool?.garakhTsag || 30) * 60000,
        );
        set["tuukh.$[t].burtgesenAjiltaniiId"] = req.body.ajiltniiId;
        set["tuukh.$[t].burtgesenAjiltaniiNer"] = req.body.ajiltniiNer;
      }
    }
    if (req.body.turul == "Пос үнэгүй") {
      set = {
        "tuukh.$[t].uneguiGarsan": req.body.uneguiGarsan,
        turul: req.body.turul,
      };
      if (!!tukhainObject.tuukh[0]?.tsagiinTuukh[0]?.garsanTsag) {
        set["tuukh.$[t].tuluv"] = -1;
      }
    }
    await Uilchluulegch(tukhainKholbolt).findByIdAndUpdate(
      tukhainObject._id,
      {
        $set: set,
      },
      {
        arrayFilters: [
          {
            "t.zogsooliinId": tukhainZogsool.gadnaZogsooliinId
              ? tukhainZogsool.gadnaZogsooliinId
              : tukhainZogsool._id,
          },
        ],
      },
    );
    if (req.body.turul == "Пос үнэгүй") {
      const io = req.app.get("socketio");
      io.emit("zogsoolGarahTulsun", {
        baiguullagiinId: tukhainObject.baiguullagiinId,
        khaalgaTurul: "garsan",
        mashiniiDugaar: tukhainObject.mashiniiDugaar,
        cameraIP: tukhainObject.tuukh[0]?.garsanKhaalga,
      });
    }
    return "Amjilttai";
  }
}

module.exports = { kioskPay };
