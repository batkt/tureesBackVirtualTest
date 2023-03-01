const express = require("express");
const Ebarimt = require("../models/ebarimt");
const BankniiGuilgee = require("../models/bankniiGuilgee");
const Baiguullaga = require("../models/baiguullaga");
const Geree = require("../models/geree");
const router = express.Router();
const aldaa = require("../components/aldaa");
//const khuudaslalt = require("../components/khuudaslalt");
//const { tokenShalgakh } = require("../middlewares/tokenShalgakh");
const { tokenShalgakh, khuudaslalt } = require("zevbackv2");
const request = require("request");

function nuatBodyo(bodokhDun) {
  var nuatguiDun = bodokhDun / 1.1;
  return (bodokhDun - nuatguiDun).toFixed(2).toString();
  var nuatguiDun = bodokhDun / 1.1;
  return (bodokhDun - nuatguiDun).toFixed(2).toString();
}

async function guilgeeneesEbarimtUusgye(guilgee, geree, register, turul) {
  var dun = guilgee.amount ? guilgee.amount : guilgee.Amt;
  var ebarimt = {};
  if (register) {
    if (turul) ebarimt.billType = turul;
    ebarimt.customerNo = register;
  }
  var today = new Date();
  var guilgeeniiSar = new Date(guilgee.createdAt).getMonth();
  //ene xesegt getMonth 0-11 gsn too butsaadag uchir shuud xiilee
  console.log("date", today.getDate());
  console.log("guilgeeniiSar", guilgeeniiSar);
  console.log("aaaa", today.getMonth());
  if (
    today.getDate() < 8 &&
    (guilgeeniiSar < today.getMonth() ||
      (guilgeeniiSar == 11 && today.getMonth() == 0))
  ) {
    ebarimt.reportMonth =
      today.getFullYear().toString() +
      "-" +
      ("0" + today.getMonth()).slice(-2).toString();
    console.log("orj irlee", ebarimt.reportMonth);
  }
  ebarimt.guilgeeniiId = guilgee._id;
  ebarimt.baiguullagiinId = guilgee.baiguullagiinId;
  ebarimt.barilgiinId = guilgee.barilgiinId;
  ebarimt.gereeniiDugaar = geree.gereeniiDugaar;
  ebarimt.talbainDugaar = geree.talbainDugaar;
  ebarimt.utas = geree.utas;
  ebarimt.amount = dun.toFixed(2).toString();
  ebarimt.vat = nuatBodyo(dun);
  ebarimt.cashAmount = dun.toFixed(2).toString();
  ebarimt.nonCashAmount = "0.00";
  ebarimt.cityTax = "0.00";
  ebarimt.districtCode = "12";
  ebarimt.posNo = "0001";
  var stocks = [];
  var stock = {
    code: "721",
    name: "Үл хөдлөх хөрөнгийг түрээслэх, худалдаалах үйлчилгээ",
    measureUnit: "шир",
    qty: "1.00",
    unitPrice: dun.toFixed(2).toString(),
    totalAmount: dun.toFixed(2).toString(),
    cityTax: "0.00",
    vat: nuatBodyo(dun),
    barCode: "721",
  };
  stocks.push(stock);
  ebarimt.stocks = stocks;
  return ebarimt;
}

async function ebarimtDuudya(ugugdul, onFinish, next) {
  try {
    const data = new TextEncoder().encode(JSON.stringify(ugugdul));
    var url = process.env.EBARIMT_IP + "/put";
    if (ugugdul.barilgiinId)
      url = url + "?lib=" + ugugdul.barilgiinId.toString();
    request.post(
      url,
      { json: true, body: { data: ugugdul } },
      (err, res1, body) => {
        if (err) next(err);
        else {
          console.log("ebarimt body", body);
          onFinish(body);
        }
      }
    );
  } catch (aldaa) {
    next(aldaa);
  }
}

async function ebarimtMedeelelAvya(ugugdul, onFinish, next) {
  var url = process.env.EBARIMT_IP + "/getInformation";
  if (ugugdul) url = url + "?lib=" + ugugdul.toString();
  console.log("url", url);
  request(url, { json: true }, (err, res1, body) => {
    if (err) next(err);
    else {
      onFinish(body);
    }
  });
}
router.post("/ebarimtMedeelelAvya", tokenShalgakh, async (req, res, next) => {
  try {
    ebarimtMedeelelAvya(
      req.body.barilgiinId,
      (d) => {
        console.log("duuslaa", d);
        res.send(d);
      },
      next
    );
  } catch (error) {
    next(error);
  }
});

async function ebarimtButsaaya(ugugdul, onFinish, next) {
  const data = new TextEncoder().encode(JSON.stringify(ugugdul));
  var url = process.env.EBARIMT_IP + "/returnBill";
  if (ugugdul.barilgiinId) url = url + "?lib=" + ugugdul.barilgiinId.toString();
  request.post(
    url,
    { json: true, body: { data: ugugdul } },
    (err, res1, body) => {
      if (err) next(err);
      else {
        onFinish(body);
      }
    }
  );
}

router.post("/ebarimtShivye", tokenShalgakh, async (req, res, next) => {
  try {
    const { db } = require("zevbackv2");
    var guilgee = await BankniiGuilgee(
      req.body.tukhainBaaziinKholbolt
    ).findById(req.body.id);
    var baiguullaga = await Baiguullaga(db.erunkhiiKholbolt).findById(
      req.body.baiguullagiinId
    );
    if (guilgee.ebarimtAvsanEsekh)
      throw new aldaa("Ибаримт хэвлэж авсан байна!");
    var geree = await Geree(req.body.tukhainBaaziinKholbolt).findById(
      guilgee.kholbosonGereeniiId[0]
    );
    if (!geree)
      throw new aldaa("Холбогдсон гэрээ байхгүй тул ибаримт хэвлэх боломжгүй");
    if (
      baiguullaga &&
      baiguullaga.tokhirgoo &&
      baiguullaga.tokhirgoo.eBarimtAutomataarShivikh
    ) {
      req.body.register = geree.register;
      req.body.turul = "3";
    }
    var ebarimt = await guilgeeneesEbarimtUusgye(
      guilgee,
      geree,
      req.body.register,
      req.body.turul
    );
    console.log("ebarimt", ebarimt);
    ebarimtDuudya(
      ebarimt,
      (d) => {
        try {
          if (!d.success) throw new Error(d.message);
          var ebarimt = new Ebarimt(req.body.tukhainBaaziinKholbolt)(d);
          ebarimt.save().catch((err) => {
            next(err);
          });
          BankniiGuilgee(req.body.tukhainBaaziinKholbolt)
            .findByIdAndUpdate(
              { _id: req.body.id },
              { ebarimtAvsanEsekh: true }
            )
            .then((xariu) => {
              console.log(xariu);
            })
            .catch((err) => {
              console.log(err);
            });
          console.log("ebarimt duuslaa");
          res.send(d);
        } catch (err) {
          next(err);
        }
      },
      next
    );
  } catch (error) {
    next(error);
  }
});

router.post("/ebarimtZasya", tokenShalgakh, async (req, res, next) => {
  try {
    var umnukhBarimt = new Ebarimt(req.body.tukhainBaaziinKholbolt)(req.body);
    var shineBarimt = new Ebarimt(req.body.tukhainBaaziinKholbolt)(req.body);
    shineBarimt._id = null;
    shineBarimt.returnBillId = shineBarimt.billId.toString();
    shineBarimt.vat = nuatBodyo(shineBarimt.amount);
    shineBarimt.stocks.forEach((mur) => {
      mur.vat = nuatBodyo(mur.totalAmount);
    });
    console.log("ebarimt", shineBarimt);
    ebarimtDuudya(
      shineBarimt,
      (d) => {
        umnukhBarimt.ustgasanOgnoo = new Date();
        umnukhBarimt.isNew = false;
        d = new Ebarimt(d);
        d.isNew = true;
        umnukhBarimt.save().catch((err) => {
          next(err);
        });
        d.save().catch((err) => {
          next(err);
        });
        console.log("duuslaa", d);
        res.send(d);
      },
      next
    );
  } catch (error) {
    next(error);
  }
});

router.post("/ebarimtButsaaya", tokenShalgakh, async (req, res, next) => {
  try {
    var butsaakhBarimt = new Ebarimt(req.body.tukhainBaaziinKholbolt)(req.body);
    butsaakhBarimt.returnBillId = butsaakhBarimt.billId;
    ebarimtButsaaya(
      butsaakhBarimt,
      async (d) => {
        butsaakhBarimt.ustgasanOgnoo = new Date();
        butsaakhBarimt.isNew = false;
        await butsaakhBarimt.save().catch((err) => {
          next(err);
          console.log("aldaa", err);
        });
        if (butsaakhBarimt.guilgeeniiId)
          await BankniiGuilgee(req.body.tukhainBaaziinKholbolt)
            .findByIdAndUpdate(
              { _id: butsaakhBarimt.guilgeeniiId },
              { ebarimtAvsanEsekh: false }
            )
            .catch((err) => {
              next(err);
              console.log("aldaa", err);
            });
        console.log("duuslaa", d);
        res.json(d);
      },
      next
    );
  } catch (error) {
    next(error);
  }
});

router.post("/ebarimtIlgeeye", tokenShalgakh, async (req, res, next) => {
  try {
    var url = process.env.EBARIMT_IP + "/sendData";
    if (req.body.barilgiinId)
      url = url + "?lib=" + req.body.barilgiinId.toString();
    console.log("url", url);
    request.get(url, { json: true }, (err, res1, body) => {
      if (err) {
        console.log(err);
        next(err);
      } else {
        res.send(body);
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get("/ebarimtJagsaaltAvya", tokenShalgakh, async (req, res, next) => {
  try {
    const body = req.query;
    if (!!body?.query) body.query = JSON.parse(body.query);
    if (!!body?.order) body.order = JSON.parse(body.order);
    if (!!body?.khuudasniiDugaar)
      body.khuudasniiDugaar = Number(body.khuudasniiDugaar);
    if (!!body?.khuudasniiKhemjee)
      body.khuudasniiKhemjee = Number(body.khuudasniiKhemjee);
    if (!!body?.search) body.search = String(body.search);
    body.query && (body.query["baiguullagiinId"] = req.body.baiguullagiinId);

    khuudaslalt(Ebarimt(req.body.tukhainBaaziinKholbolt), body)
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
router.post("/ebarimtToololtAvya", tokenShalgakh, async (req, res, next) => {
  try {
    var query = [
      {
        $match: {
          baiguullagiinId: req.body.baiguullagiinId,
          barilgiinId: req.body.barilgiinId,
          dateOgnoo: {
            $gte: new Date(req.body.ekhlekhOgnoo),
            $lte: new Date(req.body.duusakhOgnoo),
          },
        },
      },
      {
        $facet: {
          butsaasan: [
            {
              $match: {
                ustgasanOgnoo: {
                  $exists: true,
                },
              },
            },
            {
              $group: {
                _id: "butsaasan",
                too: {
                  $sum: 1,
                },
                dun: {
                  $sum: {
                    $toDecimal: "$amount",
                  },
                },
              },
            },
          ],
          ilgeesen: [
            {
              $match: {
                ustgasanOgnoo: {
                  $exists: false,
                },
              },
            },
            {
              $group: {
                _id: "ilgeesen",
                too: {
                  $sum: 1,
                },
                dun: {
                  $sum: {
                    $toDecimal: "$amount",
                  },
                },
              },
            },
          ],
        },
      },
    ];
    var result = await Ebarimt(req.body.tukhainBaaziinKholbolt)
      .aggregate(query)
      .catch((err) => {
        next(err);
      });

    query = [
      {
        $match: {
          baiguullagiinId: req.body.baiguullagiinId,
          barilgiinId: req.body.barilgiinId,
          $or: [
            {
              amount: {
                $gt: 0,
              },
              tranDate: {
                $gte: new Date(req.body.ekhlekhOgnoo),
                $lte: new Date(req.body.duusakhOgnoo),
              },
            },
            {
              Amt: {
                $gt: 0,
              },
              TxDt: {
                $gte: new Date(req.body.ekhlekhOgnoo),
                $lte: new Date(req.body.duusakhOgnoo),
              },
            },
          ],
          ebarimtAvsanEsekh: {
            $ne: true,
          },
          kholbosonGereeniiId: {
            $exists: true,
          },
        },
      },
      {
        $group: {
          _id: "ebarimt",
          dun: {
            $sum: "$amount",
          },
          dunTdb: {
            $sum: "$Amt",
          },
          too: {
            $sum: 1,
          },
        },
      },
    ];
    var result1 = await BankniiGuilgee(req.body.tukhainBaaziinKholbolt)
      .aggregate(query)
      .catch((err) => {
        next(err);
      });

    khariu = {
      ilgeesenDun: 0,
      ilgeesenToo: 0,
      butsaasanDun: 0,
      butsaasanToo: 0,
      avakhDun: 0,
      avakhToo: 0,
    };
    if (result[0]) {
      if (result[0].butsaasan[0]) {
        khariu.butsaasanDun = parseFloat(result[0].butsaasan[0].dun);
        khariu.butsaasanToo = result[0].butsaasan[0].too;
      }
      if (result[0].ilgeesen[0]) {
        khariu.ilgeesenDun = parseFloat(result[0].ilgeesen[0].dun);
        khariu.ilgeesenToo = result[0].ilgeesen[0].too;
      }
    }
    khariu = {
      ilgeesenDun: 0,
      ilgeesenToo: 0,
      butsaasanDun: 0,
      butsaasanToo: 0,
      avakhDun: 0,
      avakhToo: 0,
    };
    if (result[0]) {
      if (result[0].butsaasan[0]) {
        khariu.butsaasanDun = parseFloat(result[0].butsaasan[0].dun);
        khariu.butsaasanToo = result[0].butsaasan[0].too;
      }
      if (result[0].ilgeesen[0]) {
        khariu.ilgeesenDun = parseFloat(result[0].ilgeesen[0].dun);
        khariu.ilgeesenToo = result[0].ilgeesen[0].too;
      }
    }

    if (result1[0]) {
      khariu.avakhDun = result1[0].dun + result1[0].dunTdb;
      khariu.avakhToo = result1[0].too;
    }
    res.send(khariu);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
