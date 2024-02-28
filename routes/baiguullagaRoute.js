const express = require("express");
const router = express.Router();
const Baiguullaga = require("../models/baiguullaga");
const Ajiltan = require("../models/ajiltan");
//const { crudWithFile, crud } = require("../components/crud");
//const { tokenShalgakh } = require("../middlewares/tokenShalgakh");
//const UstsanBarimt = require("../models/ustsanBarimt");
const { tokenShalgakh, crud, UstsanBarimt } = require("zevbackv2");
const axios = require("axios");
const request = require("request");
const NevtreltiinTuukh = require("../models/nevtreltiinTuukh");

crud(router, "baiguullaga", Baiguullaga, UstsanBarimt);
router.post("/baiguullagaBurtgekh", async (req, res, next) => {
  try {
    const { db } = require("zevbackv2");
    const baiguullaga = new Baiguullaga(db.erunkhiiKholbolt)(req.body);
    console.log("baiguullagaBurtgekh", req.body);
    baiguullaga.isNew = !baiguullaga.zasakhEsekh;
    baiguullaga
      .save()
      .then((result) => {
        db.kholboltNemye(baiguullaga._id, req.body.baaziinNer);
        if (req.body.ajiltan) {
          let ajiltan = new Ajiltan(db.erunkhiiKholbolt)(req.body.ajiltan);
          ajiltan.erkh = "Admin";
          ajiltan.baiguullagiinId = result._id;
          ajiltan.baiguullagiinNer = result.ner;
          ajiltan
            .save()
            .then((result1) => {
              res.send("Amjilttai");
            })
            .catch((err) => {
              res.send(err);
            });
        } else res.send("Amjilttai");
      })
      .catch((err) => {
        next(err);
      });
  } catch (error) {
    next(error);
  }
});

router.post("/salbarBurtgey", async (req, res, next) => {
  try {
    const { db } = require("zevbackv2");
    var baiguullaga = await Baiguullaga(db.erunkhiiKholbolt)({
      register: req.body.tolgoiCompany,
    });
    console.log("baiguullagaBurtgekh", req.body);
    baiguullaga.isNew = false;
    baiguullaga.barilguud = baiguullaga.barilguud.push({
      licenseRegister: req.body.register,
      ner: req.body.ner,
      khayag: String,
    });
    baiguullaga
      .save()
      .then((result) => {
        res.send("Amjilttai");
      })
      .catch((err) => {
        next(err);
      });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/khyanakhSambariinUgugdulAvya",
  tokenShalgakh,
  (req, res, next) => {
    res.send({});
  }
);

router.post("/baiguullagaAvya", (req, res, next) => {
  const { db } = require("zevbackv2");
  Baiguullaga(db.erunkhiiKholbolt)
    .findOne({
      register: req.body.register,
    })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/moduliinMedeelelAvya", tokenShalgakh, async (req, res, next) => {
  try {
    var axiosKhariu = await axios.post(
      "http://103.143.40.43:8282/moduliinMedeelelAvya",
      {
        register: req.body.register,
      }
    );
    if (axiosKhariu && axiosKhariu.data) res.send(axiosKhariu.data);
    else res.send("Мэдээлэл олдсонгүй!");
  } catch (err) {
    next(err);
  }
});
router.post(
  "/baiguullagaTokhirgooZasya",
  tokenShalgakh,
  async (req, res, next) => {
    try {
      const { db } = require("zevbackv2");
      if (!!req.body) {
        var update = {};
        for (var field in req.body.tokhirgoo) {
          if (field != "baiguullagiinId")
            update["tokhirgoo." + field] = req.body.tokhirgoo[field];
        }
        console.log("update", update);
        await Baiguullaga(db.erunkhiiKholbolt).findOneAndUpdate(
          { _id: req.body.baiguullagiinId },
          update
        );
        res.send("Amjilttai");
      } else next(new aldaa("Засах боломжгүй байна"));
    } catch (error) {
      next(error);
    }
  }
);
router.post("/nevtreltiinTuukhAvya", tokenShalgakh, async (req, res, next) => {
  try {
    const { db } = require("zevbackv2");
    var khariu = await NevtreltiinTuukh(db.erunkhiiKholbolt).aggregate([
      {
        $group: { _id: "$baiguullagiinId", nevtersenOgnoo: { $max: "$ognoo" } },
      },
    ]);
    if (!!khariu && khariu.length > 0) {
      var baiguullaguud = await Baiguullaga(db.erunkhiiKholbolt).find({
        "barilguud.0": { $exists: true },
      });
      for await (const element of khariu) {
        var baiguullaga = baiguullaguud.find(
          (x) => x._id.toString() == element._id
        );
        if (!!baiguullaga) element.register = baiguullaga.register;
      }
      khariu = khariu.filter((x) => !!x.register);
    }
    res.send(khariu);
  } catch (error) {
    next(error);
  }
});

router.get("/tatvaraasBaiguullagaAvya/:regno", (req, res, next) => {
  var url = encodeURI(
    "http://info.ebarimt.mn/rest/merchant/info?regno=" + req.params.regno
  );
  request(url, { json: true }, (err, res1, body) => {
    if (err) next(err);
    else res.send(body);
  });
});

module.exports = router;
