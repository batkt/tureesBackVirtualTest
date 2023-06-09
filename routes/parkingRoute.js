const express = require("express");
const router = express.Router();
const { tokenShalgakh, khuudaslalt, crud, UstsanBarimt } = require("zevbackv2");
const {
  Parking,
  Uilchluulegch,
  zogsoolUusgey,
    sdkData,
} = require("parking-v1");

/*crud(router, "parking", Parking, UstsanBarimt, async (req, res, next) => {
    console.log('parking --- ', req.body);
});*/
crud(router, "parking", Parking, UstsanBarimt);
crud(router, "zogsoolUilchluulegch", Uilchluulegch, UstsanBarimt);
/*
crud(router, "zogsoolUilchluulegch", async (req, res, next) => {
    console.log('zogsoolUilchluulegch --- ', req);
});
*/

/*router.post("/khaalganiiErkh", tokenShalgakh, async (req, res, next) => {
    console.log('req.query---req', req.body.query);
    try {
        const body = req.body.query;
        let bulk = [];
        if(body.khaalga?.length > 0){
            for await (const id of body.khaalga) {
                bulk.push({
                        updateOne: {
                            filter: { "khaalga._id": id },
                            update: {
                                "khaalga.ajiltnuud.id": body.ajiltan,
                            },
                        },
                    })
            }
        }
        if (bulk!==[])
            Parking(req.body.tukhainBaaziinKholbolt)
                .bulkWrite(bulk)
                .then((bulkWriteOpResult) => {
                    console.log("BULK update OK", bulkWriteOpResult);
                })
                .catch((err) => {
                    console.log("BULK update error", err);
                });

    } catch (error) {
        next(error);
    }
});*/

router.get("/zogsoolJagsaalt", tokenShalgakh, async (req, res, next) => {
  // console.log('req.query---', req.query);
  try {
    const body = req.query;
    if (!!body?.query) body.query = JSON.parse(body.query);
    if (!!body?.order) body.order = JSON.parse(body.order);
    if (!!body?.khuudasniiDugaar)
      body.khuudasniiDugaar = Number(body.khuudasniiDugaar);
    if (!!body?.khuudasniiKhemjee)
      body.khuudasniiKhemjee = Number(body.khuudasniiKhemjee);
    if (!!body?.search) body.search = String(body.search);

    khuudaslalt(Parking(req.body.tukhainBaaziinKholbolt), body)
        .then((result) => {
          res.send(result);
        })
        .catch((err) => {
          next(err);
        });
  } catch (error) {
    next(error);
  }
});

router.post("/zogsoolUstgay", tokenShalgakh, async (req, res, next) => {
  // console.log('req.query1---', req.query);
  try {
    Parking(req.body.tukhainBaaziinKholbolt)
        .findOne({
          _id: req.body.id,
        })
        .then(async (result) => {
          var barimt = new UstsanBarimt(req.body.tukhainBaaziinKholbolt)();
          barimt.class = "Zogsool";
          barimt.object = result;
          if (req.body.nevtersenAjiltniiToken) {
            barimt.ajiltniiNer = req.body.nevtersenAjiltniiToken.ner;
            barimt.ajiltniiId = req.body.nevtersenAjiltniiToken.id;
          }
          barimt.baiguullagiinId = req.body.baiguullagiinId;
          barimt.isNew = true;
          barimt.save();
          Parking(req.body.tukhainBaaziinKholbolt)
              .deleteOne({
                _id: req.body.id,
              })
              .then((result1) => {
                res.send("Amjilttai");
              })
              .catch((err) => {
                next(err);
              });
        })
        .catch((err1) => {
          next(err1);
        });
  } catch (error) {
    next(error);
  }
});

router.post("/zogsoolUilchiluulegchidiinDun", tokenShalgakh, async (req, res, next) => {
    try {
        const khariu = await zogsoolUusgey(req.body);
        res.send(khariu);
    } catch (err) {
        next(err);
    }
});

router.post("/zogsoolSdkService", tokenShalgakh, async (req, res, next) => {
    console.log('zogsoolSdkService---', req.query);
    try {
        const khariu = await sdkData(req.body);
        res.send(khariu);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
