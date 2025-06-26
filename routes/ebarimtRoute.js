const express = require("express");
const Ebarimt = require("../models/ebarimt");
const EbarimtShine = require("../models/ebarimtShine");
const BankniiGuilgee = require("../models/bankniiGuilgee");
const Baiguullaga = require("../models/baiguullaga");
const TogloomiinTuv = require("../models/togloomiinTuv");
const Geree = require("../models/geree");
const TatvariinAlba = require("../models/tatvariinAlba");
const router = express.Router();
const moment = require("moment");
const aldaa = require("../components/aldaa");
//const khuudaslalt = require("../components/khuudaslalt");
//const { tokenShalgakh } = require("../middlewares/tokenShalgakh");
const {
  tokenShalgakh,
  khuudaslalt,
  crud,
  UstsanBarimt,
  db,
} = require("zevbackv2");
const request = require("request");
const { Uilchluulegch } = require("parking-v1");
const { msgIlgeeye } = require("../controller/khariltsagch");
const lodash = require("lodash");
const MsgTuukh = require("../models/msgTuukh");

function formatNumber(num, fixed = 2) {
  if (num === undefined || num === null || num === "")
    return formatNumber("0.00", fixed);
  var fixedNum = parseFloat(num).toFixed(fixed).toString();
  var numSplit = fixedNum.split(".");
  if (numSplit === null || numSplit.length === 0) {
    return formatNumber("0.00", fixed);
  }
  var firstFormatNum = numSplit[0]
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  if (lodash.isNaN(firstFormatNum)) firstFormatNum = "0";
  if (fixed === 0) return firstFormatNum;
  return firstFormatNum + "." + numSplit[1];
}

function nuatBodyo(bodokhDun) {
  var nuatguiDun = bodokhDun / 1.1;
  return (bodokhDun - nuatguiDun).toFixed(2).toString();
}
crud(router, "ebarimtShine", EbarimtShine, UstsanBarimt);

async function guilgeeneesEbarimtUusgye(
  guilgee,
  geree,
  register,
  turul,
  tukhainBaaziinKholbolt,
  nuatTulukhEsekh = true
) {
  var dun = guilgee.amount ? guilgee.amount : (guilgee.Amt || guilgee.tranAmount);
  var ognoo = guilgee.TxPostDate ? guilgee.TxPostDate : guilgee.postDate;
  var ebarimt = new Ebarimt(tukhainBaaziinKholbolt)();
  if (register) {
    if (turul) ebarimt.billType = turul;
    ebarimt.customerNo = register;
  }
  var today = new Date();
  var guilgeeniiSar = new Date(ognoo).getMonth();
  //ene xesegt getMonth 0-11 gsn too butsaadag uchir shuud xiilee
  if (
    today.getDate() < 8 &&
    (guilgeeniiSar < today.getMonth() ||
      (guilgeeniiSar == 11 && today.getMonth() == 0))
  ) {
    ebarimt.reportMonth =
      today.getFullYear().toString() +
      "-" +
      ("0" + today.getMonth()).slice(-2).toString();
  }
  ebarimt.guilgeeniiId = guilgee._id;
  ebarimt.baiguullagiinId = guilgee.baiguullagiinId;
  ebarimt.barilgiinId = guilgee.barilgiinId;
  ebarimt.gereeniiDugaar = geree.gereeniiDugaar;
  ebarimt.talbainDugaar = geree.talbainDugaar;
  ebarimt.utas = geree.utas;
  ebarimt.amount = dun.toFixed(2).toString();
  ebarimt.vat = !!nuatTulukhEsekh ? nuatBodyo(dun) : "0.00";
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
    vat: !!nuatTulukhEsekh ? nuatBodyo(dun) : "0.00",
    barCode: "721",
  };
  stocks.push(stock);
  ebarimt.stocks = stocks;
  return ebarimt;
}
async function guilgeeneesEbarimtShineUusgye(
  guilgee,
  geree,
  customerNo,
  customerTin,
  merchantTin,
  districtCode,
  tukhainBaaziinKholbolt,
  nuatTulukhEsekh = true
) {
  var dun = guilgee.amount ? guilgee.amount : (guilgee.Amt || guilgee.tranAmount);
  var ognoo = guilgee.TxPostDate ? guilgee.TxPostDate : guilgee.postDate;
  var ebarimt = new EbarimtShine(tukhainBaaziinKholbolt)();
  if (!!customerTin) {
    ebarimt.type = "B2B_RECEIPT";
    ebarimt.customerTin = customerTin;
  } else {
    ebarimt.type = "B2C_RECEIPT";
  }
  var today = new Date();
  var guilgeeniiSar = new Date(ognoo).getMonth();
  if (
    today.getDate() < 8 &&
    (guilgeeniiSar < today.getMonth() ||
      (guilgeeniiSar == 11 && today.getMonth() == 0))
  ) {
    ebarimt.reportMonth =
      ognoo.getFullYear().toString() +
      "-" +
      ("0" + (ognoo.getMonth() + 1)).slice(-2).toString() +
      "-" +
      (ognoo.getDate() < 10 ? "0" : "") +
      ognoo.getDate();
  }
  ebarimt.guilgeeniiId = guilgee._id;
  ebarimt.baiguullagiinId = guilgee.baiguullagiinId;
  ebarimt.barilgiinId = guilgee.barilgiinId;
  ebarimt.gereeniiDugaar = geree.gereeniiDugaar;
  ebarimt.talbainDugaar = geree.talbainDugaar;
  ebarimt.utas = geree.utas;

  ebarimt.totalAmount = dun.toFixed(2);
  ebarimt.totalVAT = !!nuatTulukhEsekh ? nuatBodyo(dun) : 0;
  ebarimt.totalCityTax = "0.00";
  ebarimt.branchNo = "001";
  ebarimt.districtCode = districtCode;
  ebarimt.posNo = "0001";
  ebarimt.merchantTin = merchantTin;
  ebarimt.customerNo = customerNo;
  ebarimt.createdAt = ognoo;
  ebarimt.receipts = [
    {
      totalAmount: dun.toFixed(2),
      totalVAT: !!nuatTulukhEsekh ? nuatBodyo(dun) : 0,
      totalCityTax: "0.00",
      taxType: "VAT_ABLE",
      merchantTin: merchantTin,
      items: [
        {
          name: "Үл хөдлөх хөрөнгийг түрээслэх, худалдаалах үйлчилгээ",
          //barCode: "7211200",
          barCodeType: "UNDEFINED",
          classificationCode: "7211200",
          //taxProductCode
          measureUnit: "шир",
          qty: "1.00",
          unitPrice: dun.toFixed(2),
          totalVat: !!nuatTulukhEsekh ? nuatBodyo(dun) : 0,
          totalCityTax: "0.00",
          totalAmount: dun.toFixed(2),
        },
      ],
    },
  ];

  ebarimt.payments = [
    {
      code: "PAYMENT_CARD",
      paidAmount: dun.toFixed(2),
      status: "PAID",
    },
  ];
  return ebarimt;
}

async function togloomoosEbarimtUusgye(
  guilgee,
  register,
  turul,
  tukhainBaaziinKholbolt,
  nuatTulukhEsekh = true
) {
  var ebarimt = new Ebarimt(tukhainBaaziinKholbolt)();
  if (register) {
    if (turul) ebarimt.billType = turul;
    ebarimt.customerNo = register;
  }
  var unuudur = new Date().getDay();
  var amraltiinUdur = unuudur == 0 || unuudur == 6;
  ebarimt.togloomiinId = guilgee._id;
  ebarimt.baiguullagiinId = guilgee.baiguullagiinId;
  ebarimt.barilgiinId = guilgee.barilgiinId;
  ebarimt.utas = guilgee.utas[0];
  ebarimt.amount = guilgee.ebarimtAvakhDun.toFixed(2).toString();
  ebarimt.vat = !!nuatTulukhEsekh ? nuatBodyo(guilgee.ebarimtAvakhDun) : "0.00";
  ebarimt.cashAmount = guilgee.ebarimtAvakhDun.toFixed(2).toString();
  ebarimt.nonCashAmount = "0.00";
  ebarimt.cityTax = "0.00";
  ebarimt.districtCode = "23";
  ebarimt.posNo = "0001";
  var stocks = [];
  var stock = {
    code: amraltiinUdur ? "201" : "100",
    name: amraltiinUdur ? "Амралтын өдөр 1 цаг" : "Ажлын өдөр 1 цаг",
    measureUnit: "шир",
    qty: "1.00",
    unitPrice: guilgee.ebarimtAvakhDun.toFixed(2).toString(),
    totalAmount: guilgee.ebarimtAvakhDun.toFixed(2).toString(),
    cityTax: "0.00",
    vat: !!nuatTulukhEsekh ? nuatBodyo(guilgee.ebarimtAvakhDun) : "0.00",
    barCode: amraltiinUdur ? "201" : "100",
  };
  stocks.push(stock);
  ebarimt.stocks = stocks;
  return ebarimt;
}
async function togloomoosEbarimtShineUusgye(
  guilgee,
  customerNo,
  customerTin,
  merchantTin,
  districtCode,
  tukhainBaaziinKholbolt,
  nuatTulukhEsekh = true
) {
  var ebarimt = new EbarimtShine(tukhainBaaziinKholbolt)();
  if (!!customerTin) {
    ebarimt.type = "B2B_RECEIPT";
    ebarimt.customerTin = customerTin;
  } else {
    ebarimt.type = "B2C_RECEIPT";
  }
  var unuudur = new Date().getDay();
  var amraltiinUdur = unuudur == 0 || unuudur == 6;
  ebarimt.togloomiinId = guilgee._id;
  ebarimt.togloomNer = guilgee.ner;
  ebarimt.togloomUtas = guilgee.utas;
  ebarimt.baiguullagiinId = guilgee.baiguullagiinId;
  ebarimt.barilgiinId = guilgee.barilgiinId;
  ebarimt.utas = guilgee.utas[0];
  ebarimt.totalAmount = guilgee.ebarimtAvakhDun.toFixed(2);
  ebarimt.totalVAT = !!nuatTulukhEsekh ? nuatBodyo(guilgee.ebarimtAvakhDun) : 0;
  ebarimt.totalCityTax = "0.00";
  ebarimt.branchNo = "001";
  ebarimt.districtCode = districtCode;
  ebarimt.posNo = "0001";
  ebarimt.merchantTin = merchantTin;
  ebarimt.customerNo = customerNo;

  ebarimt.receipts = [
    {
      totalAmount: guilgee.ebarimtAvakhDun.toFixed(2),
      totalVAT: !!nuatTulukhEsekh ? nuatBodyo(guilgee.ebarimtAvakhDun) : 0,
      totalCityTax: "0.00",
      taxType: "VAT_ABLE",
      merchantTin: merchantTin,
      items: [
        {
          name: amraltiinUdur ? "Амралтын өдөр 1 цаг" : "Ажлын өдөр 1 цаг",
          //barCode: amraltiinUdur ? "201" : "100",
          barCodeType: "UNDEFINED",
          classificationCode: "5312909",
          //taxProductCode
          measureUnit: "шир",
          qty: "1.00",
          unitPrice: guilgee.ebarimtAvakhDun.toFixed(2).toString(),
          totalVat: !!nuatTulukhEsekh ? nuatBodyo(guilgee.ebarimtAvakhDun) : 0,
          totalCityTax: "0.00",
          totalAmount: guilgee.ebarimtAvakhDun.toFixed(2).toString(),
        },
      ],
    },
  ];

  ebarimt.payments = [
    {
      code: "CASH",
      paidAmount: guilgee.ebarimtAvakhDun.toFixed(2),
      status: "PAID",
    },
  ];
  return ebarimt;
}

async function zogsooloosEbarimtUusgye(
  guilgee,
  register,
  turul,
  tukhainBaaziinKholbolt,
  nuatTulukhEsekh = true
) {
  var ebarimt = new Ebarimt(tukhainBaaziinKholbolt)();
  if (register) {
    if (turul) ebarimt.billType = turul;
    ebarimt.customerNo = register;
  }
  var tulukhDun = guilgee.niitDun;

  ebarimt.zogsooliinId = guilgee._id;
  ebarimt.baiguullagiinId = guilgee.baiguullagiinId;
  ebarimt.barilgiinId = guilgee.barilgiinId;
  ebarimt.mashiniiDugaar = guilgee.mashiniiDugaar;
  ebarimt.amount = tulukhDun.toFixed(2).toString();
  if (!!nuatTulukhEsekh) ebarimt.vat = nuatBodyo(tulukhDun);
  else ebarimt.vat = "0.00";
  ebarimt.cashAmount = tulukhDun.toFixed(2).toString();
  ebarimt.nonCashAmount = "0.00";
  ebarimt.cityTax = "0.00";
  ebarimt.districtCode = "23";
  ebarimt.posNo = "0001";
  var stocks = [];
  var stock = {
    code: "6743000",
    name: "Авто зогсоолын үйлчилгээ",
    measureUnit: "шир",
    qty: "1.00",
    unitPrice: tulukhDun.toFixed(2).toString(),
    totalAmount: tulukhDun.toFixed(2).toString(),
    cityTax: "0.00",
    vat: !!nuatTulukhEsekh ? nuatBodyo(tulukhDun) : "0.00",
    barCode: "6743000",
  };
  stocks.push(stock);
  ebarimt.stocks = stocks;
  return ebarimt;
}
async function zogsooloosEbarimtShineUusgye(
  guilgee,
  customerNo,
  customerTin,
  merchantTin,
  districtCode,
  tukhainBaaziinKholbolt,
  nuatTulukhEsekh = true
) {
  var ebarimt = new EbarimtShine(tukhainBaaziinKholbolt)();
  if (!!customerTin) {
    ebarimt.type = "B2B_RECEIPT";
    ebarimt.customerTin = customerTin;
  } else {
    ebarimt.type = "B2C_RECEIPT";
  }

  var tulukhDun = guilgee.niitDun;
  ebarimt.zogsooliinId = guilgee._id;
  ebarimt.baiguullagiinId = guilgee.baiguullagiinId;
  ebarimt.barilgiinId = guilgee.barilgiinId;
  ebarimt.mashiniiDugaar = guilgee.mashiniiDugaar;
  ebarimt.amount = tulukhDun.toFixed(2);

  ebarimt.branchNo = "001";
  ebarimt.totalAmount = tulukhDun.toFixed(2);
  ebarimt.totalVAT = !!nuatTulukhEsekh ? nuatBodyo(tulukhDun) : "0.00";
  ebarimt.totalCityTax = "0.00";
  ebarimt.districtCode = districtCode;
  ebarimt.posNo = "0001";
  ebarimt.merchantTin = merchantTin;
  ebarimt.customerNo = customerNo;

  ebarimt.receipts = [
    {
      totalAmount: tulukhDun.toFixed(2),
      totalVAT: !!nuatTulukhEsekh ? nuatBodyo(tulukhDun) : "0.00",
      totalCityTax: "0.00",
      taxType: "VAT_ABLE",
      merchantTin: merchantTin,
      items: [
        {
          //barCode: "6743000",
          name: "Авто зогсоолын үйлчилгээ",
          barCodeType: "UNDEFINED",
          classificationCode: "6743000",
          //taxProductCode
          measureUnit: "шир",
          qty: "1.00",
          unitPrice: tulukhDun.toFixed(2),
          totalVat: !!nuatTulukhEsekh ? nuatBodyo(tulukhDun) : "0.00",
          totalCityTax: "0.00",
          totalAmount: tulukhDun.toFixed(2),
        },
      ],
    },
  ];
  ebarimt.payments = [
    {
      code: "CASH",
      paidAmount: tulukhDun.toFixed(2),
      status: "PAID",
    },
  ];
  //ebarimt.receipts = receipts;
  return ebarimt;
}
async function ebarimtDuudya(ugugdul, onFinish, next, shine = false) {
  try {
    if (!!shine) {
      var url;
      if (ugugdul.baiguullagiinId == "612f457d185280db676d0b51")
        var url = process.env.EBARIMTSHINE_TEST + "rest/receipt";
      else var url = process.env.EBARIMTSHINE_IP + "rest/receipt";
      request.post(url, { json: true, body: ugugdul }, (err, res1, body) => {
        if (err) {
          if(!!next)
            next(err);
        } else {
          onFinish(body, ugugdul);
        }
      });
    } else if(!!next)
      next(new Error("ИБаримт dll холболт хийгдээгүй байна!"));
  } catch (aldaa) {
    if(!!next)
      next(new Error("ИБаримт dll холболт хийгдээгүй байна!"));
  }
}

async function ebarimtMedeelelAvya(ugugdul, onFinish, next, ebarimtShine = false) {
  if (!!ebarimtShine) {
    var url = "";
    if (ugugdul.baiguullagiinId == "612f457d185280db676d0b51")
      url = process.env.EBARIMTSHINE_TEST + "rest/info";
    else url = process.env.EBARIMTSHINE_IP + "rest/info";
    if (ugugdul) url = url + "?lib=" + ugugdul.toString();
    request(url, { json: true }, (err, res1, body) => {
      if (err) next(err);
      else {
        onFinish(body);
      }
    });
  }
}

router.post("/ebarimtMedeelelAvya", tokenShalgakh, async (req, res, next) => {
  try 
  {
    var baiguullaga = await Baiguullaga(db.erunkhiiKholbolt).findById(req.body.baiguullagiinId);
    var tuxainSalbar = baiguullaga?.barilguud?.find((e) => e._id.toString() == req.body.barilgiinId)?.tokhirgoo;
    ebarimtMedeelelAvya(
      req.body.barilgiinId,
      (d) => {
        res.send(d);
      },
      next,
      tuxainSalbar?.eBarimtShine,
    );
  } catch (error) {
    next(error);
  }
});

async function ebarimtButsaaya(ugugdul, onFinish, next, ebarimtShine = false) {
  if (!!ebarimtShine) {
    var url;
    if (ugugdul.baiguullagiinId == "612f457d185280db676d0b51")
      var url = process.env.EBARIMTSHINE_TEST + "rest/receipt";
    else var url = process.env.EBARIMTSHINE_IP + "rest/receipt";
    request.delete(
      url,
      { json: true, body: { id: ugugdul.id, date: ugugdul.date } },
      (err, res1, body) => {
        if (err) {
          next(err);
        } else {
          onFinish(body);
        }
      }
    );
  } else if(!!next)
      next(new Error("ИБаримт dll холболт хийгдээгүй байна!"));
}
async function zogsoolNiitDungeerEbarimtShivye(
  kholbolt,
  shivekhDun,
  barilgiinId,
  next,
  shiveeguiTuukhuud,
  dugaar,
) {
  var guilgee = {
    niitDun: shivekhDun,
    _id: "zogsoolSystem",
    baiguullagiinId: kholbolt.baiguullagiinId,
    barilgiinId,
  };
  guilgee["mashiniiDugaar"] = !!dugaar ? shiveeguiTuukhuud[0]?.mashiniiDugaar : "0000ЮЮЮ";
  var baiguullaga = await Baiguullaga(db.erunkhiiKholbolt).findById(
    kholbolt.baiguullagiinId
  );
  var tuxainSalbar = baiguullaga?.barilguud?.find(
    (e) => e._id.toString() == guilgee.barilgiinId
  )?.tokhirgoo;
  var nuatTulukhEsekh = false;
  nuatTulukhEsekh = tuxainSalbar.nuatTulukhEsekh;
  if (nuatTulukhEsekh != false) nuatTulukhEsekh = true;
  tuxainSalbar = baiguullaga?.barilguud?.find(
    (e) => e._id.toString() == guilgee.barilgiinId
  )?.tokhirgoo;
  var ebarimt;
  if (!!tuxainSalbar?.eBarimtShine)
    ebarimt = await zogsooloosEbarimtShineUusgye(
      guilgee,
      null,
      null,
      tuxainSalbar.merchantTin, //"37900846788",
      tuxainSalbar.districtCode, //,"0023"
      kholbolt,
      nuatTulukhEsekh
    );
  else
    ebarimt = await zogsooloosEbarimtUusgye(
      guilgee,
      null,
      null,
      kholbolt,
      nuatTulukhEsekh
    );
  var butsaakhMethod = function (d, khariuObject) {
    try {
      if (d?.status != "SUCCESS" && !d.success) throw new Error(d.message);
      var ebarimt;
      if (!!tuxainSalbar.eBarimtShine) ebarimt = new EbarimtShine(kholbolt)(d);
      else ebarimt = new Ebarimt(kholbolt)(d);
      ebarimt.zogsooliinId = khariuObject._id;
      ebarimt.baiguullagiinId = khariuObject.baiguullagiinId;
      ebarimt.barilgiinId = khariuObject.barilgiinId;
      ebarimt.mashiniiDugaar = khariuObject.mashiniiDugaar;
      ebarimt.save().catch((err) => {
        if(next) next(err);
      });
      if(!!shiveeguiTuukhuud && shiveeguiTuukhuud?.length > 0)
      {
        for (const object of shiveeguiTuukhuud) {
          var update = { ebarimtAvsanEsekh: true };
          if (ebarimt.customerNo)
            update = {
              ...update,
              ebarimtRegister: ebarimt.customerNo,
            };
          Uilchluulegch(kholbolt)
            .findByIdAndUpdate(object._id, update)
            .then((xariu) => {
            })
            .catch((err) => {
            });
        }
      }
      if(!!dugaar)
      {
        var msgnuud = [];
        var text =
          "Tanii zogsooliin barimt " + (d?.lottery || "") +
          " , " + (formatNumber(shivekhDun)) + 
          " ";
        msgnuud.push({ to: dugaar, text });
        if (msgnuud.length > 0) {
          var msgIlgeekhKey = "aa8e588459fdd9b7ac0b809fc29cfae3";
          var msgIlgeekhDugaar = "72002002";
          var msg = new MsgTuukh(kholbolt)();
          msg.baiguullagiinId = ebarimt?.baiguullagiinId;
          msg.barilgiinId = ebarimt?.barilgiinId;
          msg.mashiniiDugaar = ebarimt?.mashiniiDugaar;
          msg.dugaar = dugaar;
          msg.msg = text;
          msg.save();
          msgIlgeeye(
            msgnuud,
            msgIlgeekhKey,
            msgIlgeekhDugaar,
            [],
            0,
            kholbolt,
            ebarimt?.baiguullagiinId
          );
        }
      }
    } catch (err) {
      if(next) next(err);
    }
  };
  ebarimtDuudya(ebarimt, butsaakhMethod, next, !!tuxainSalbar.eBarimtShine);
}

async function ebarimtShivye(req, res, next) {
  try {
    var ebarimtiinTurul = req.body.ebarimtiinTurul;
    var baiguullaga = await Baiguullaga(db.erunkhiiKholbolt).findById(
      req.body.baiguullagiinId
    );
    var butsaakhMethod;
    var ebarimt;
    var tuxainSalbar;
    if (ebarimtiinTurul == "togloom") {
      var guilgee = await TogloomiinTuv(
        req.body.tukhainBaaziinKholbolt
      ).findById(req.body.id);
      if (guilgee.ebarimtAvsanEsekh)
        throw new aldaa("Ибаримт хэвлэж авсан байна!");
      tuxainSalbar = baiguullaga?.barilguud?.find(
        (e) => e._id.toString() == guilgee.barilgiinId
      )?.tokhirgoo;
      var nuatTulukhEsekh = false;
      nuatTulukhEsekh = tuxainSalbar.nuatTulukhEsekh;
      if (nuatTulukhEsekh != false) nuatTulukhEsekh = true;
      if (!!tuxainSalbar.eBarimtShine)
        ebarimt = await togloomoosEbarimtShineUusgye(
          guilgee,
          req.body.customerNo,
          req.body.customerTin,
          tuxainSalbar.merchantTin,
          tuxainSalbar.districtCode,
          req.body.tukhainBaaziinKholbolt,
          nuatTulukhEsekh
        );
      else if(!!next)
        next(new Error("ИБаримт dll холболт хийгдээгүй байна!"));
      butsaakhMethod = function (d, khariuObject) {
        try {
          if (d?.status != "SUCCESS" && !d.success) throw new Error(d.message);
          var ebarimt;
          if (!!tuxainSalbar.eBarimtShine)
            ebarimt = new EbarimtShine(req.body.tukhainBaaziinKholbolt)(d);
          else ebarimt = new Ebarimt(req.body.tukhainBaaziinKholbolt)(d);
          ebarimt.barilgiinId = khariuObject.barilgiinId;
          ebarimt.baiguullagiinId = khariuObject.baiguullagiinId;
          ebarimt.togloomiinId = khariuObject.togloomiinId;
          ebarimt.togloomNer = khariuObject.togloomNer;
          ebarimt.togloomUtas = khariuObject.togloomUtas;
          ebarimt.save().catch((err) => {
            next(err);
          });
          var ebarimtAmount = ebarimt.totalAmount + (khariuObject?.ebarimtAvsanDun || 0);
          var update = { ebarimtAvsanEsekh: true, ebarimtAvakhDun: 0, ebarimtAvsanDun: ebarimtAmount };
          if (ebarimt.customerNo) update.ebarimtRegister = ebarimt.customerNo;
          TogloomiinTuv(req.body.tukhainBaaziinKholbolt)
            .findByIdAndUpdate({ _id: req.body.id }, update)
            .then((xariu) => {
            })
            .catch((err) => {
              next(err);
            });
          res.send(d);
        } catch (err) {
          next(err);
        }
      };
    } else if (ebarimtiinTurul == "zogsool") {
      var guilgee = await Uilchluulegch(req.body.tukhainBaaziinKholbolt)
        .findById(req.body.id)
        .lean();
      if (guilgee.tuukh?.length > 0 && guilgee.tuukh[0].ebarimtAvsanEsekh)
        throw new aldaa("Ибаримт хэвлэж авсан байна!");
      tuxainSalbar = baiguullaga?.barilguud?.find(
        (e) => e._id.toString() == guilgee.barilgiinId
      )?.tokhirgoo;
      var nuatTulukhEsekh = baiguullaga.barilguud.find(
        (x) => x._id.toString() == guilgee.barilgiinId
      )?.tokhirgoo?.nuatTulukhEsekh;
      if (nuatTulukhEsekh != false) nuatTulukhEsekh = true;
      if (!!tuxainSalbar?.eBarimtShine)
        ebarimt = await zogsooloosEbarimtShineUusgye(
          guilgee,
          req.body.customerNo,
          req.body.customerTin,
          tuxainSalbar.merchantTin, //"37900846788",
          tuxainSalbar.districtCode, //,"0023"
          req.body.tukhainBaaziinKholbolt,
          nuatTulukhEsekh
        );
      else if(!!next)
        next(new Error("ИБаримт dll холболт хийгдээгүй байна!"));
      butsaakhMethod = function (d, khariuObject) {
        try {
          if (d?.status != "SUCCESS" && !d.success) throw new Error(d.message);
          var ebarimt;
          if (!!tuxainSalbar.eBarimtShine)
            ebarimt = new EbarimtShine(req.body.tukhainBaaziinKholbolt)(d);
          else ebarimt = new Ebarimt(req.body.tukhainBaaziinKholbolt)(d);
          ebarimt.zogsooliinId = req.body.id;
          ebarimt.baiguullagiinId = khariuObject.baiguullagiinId;
          ebarimt.barilgiinId = khariuObject.barilgiinId;
          ebarimt.mashiniiDugaar = khariuObject.mashiniiDugaar;
          ebarimt.save().catch((err) => {
            next(err);
          });
          var update = { ebarimtAvsanEsekh: true, ebarimtAvsanDun: (ebarimt.cashAmount || ebarimt.totalAmount) };
          if (ebarimt.customerNo)
            update = {
              ...update,
              "tuukh.0.ebarimtRegister": ebarimt.customerNo,
            };
          else if (ebarimt.customerTin)
            update = {
              ...update,
              "tuukh.0.ebarimtRegister": ebarimt.customerTin,
            };
          Uilchluulegch(req.body.tukhainBaaziinKholbolt)
            .findByIdAndUpdate(req.body.id, update)
            .then((xariu) => {
            })
            .catch((err) => {
              next(err);
            });
          res.send(d);
        } catch (err) {
          next(err);
        }
      };
    } else {
      var guilgee = await BankniiGuilgee(
        req.body.tukhainBaaziinKholbolt
      ).findById(req.body.id);
      if (guilgee.ebarimtAvsanEsekh)
        throw new aldaa("Ибаримт хэвлэж авсан байна!");
      var geree = await Geree(req.body.tukhainBaaziinKholbolt).findById(
        guilgee.kholbosonGereeniiId[0]
      );
      if (!geree)
        throw new aldaa(
          "Холбогдсон гэрээ байхгүй тул ибаримт хэвлэх боломжгүй"
        );
      if (
        baiguullaga &&
        baiguullaga.tokhirgoo &&
        baiguullaga.tokhirgoo.eBarimtAutomataarShivikh
      ) {
        req.body.register = geree.register;
        req.body.turul = "3";
      }
      tuxainSalbar = baiguullaga?.barilguud?.find(
        (e) => e._id.toString() == guilgee.barilgiinId
      )?.tokhirgoo;
      butsaakhMethod = function (d, khariuObject) {
        try {
          if (d?.status != "SUCCESS" && !d.success) throw new Error(d.message);
          if (!!tuxainSalbar.eBarimtShine)
            ebarimt = new EbarimtShine(req.body.tukhainBaaziinKholbolt)(d);
          else ebarimt = new Ebarimt(req.body.tukhainBaaziinKholbolt)(d);
          ebarimt.guilgeeniiId = khariuObject.guilgeeniiId;
          ebarimt.baiguullagiinId = khariuObject.baiguullagiinId;
          ebarimt.barilgiinId = khariuObject.barilgiinId;
          ebarimt.gereeniiDugaar = khariuObject.gereeniiDugaar;
          ebarimt.talbainDugaar = khariuObject.talbainDugaar;
          ebarimt.utas = khariuObject.utas;
          ebarimt.save().catch((err) => {
            next(err);
          });
          BankniiGuilgee(req.body.tukhainBaaziinKholbolt)
            .findByIdAndUpdate(
              { _id: req.body.id },
              { ebarimtAvsanEsekh: true }
            )
            .then((xariu) => {
            })
            .catch((err) => {
              next(err);    
            });
          res.send(d);
        } catch (err) {
          next(err);
        }
      };

      var nuatTulukhEsekh = false;
      nuatTulukhEsekh = tuxainSalbar.nuatTulukhEsekh;
      if (nuatTulukhEsekh != false) nuatTulukhEsekh = true;
      if (!!tuxainSalbar.eBarimtShine)
        ebarimt = await guilgeeneesEbarimtShineUusgye(
          guilgee,
          geree,
          req.body.customerNo,
          req.body.customerTin,
          tuxainSalbar.merchantTin, //"37900846788",
          tuxainSalbar.districtCode, //,"0023"
          req.body.tukhainBaaziinKholbolt,
          nuatTulukhEsekh
        );
      else if(!!next)
        next(new Error("ИБаримт dll холболт хийгдээгүй байна!"));
    }
    ebarimtDuudya(ebarimt, butsaakhMethod, next, !!tuxainSalbar.eBarimtShine);
  } catch (error) {
    next(error);
  }
}

router.post("/ebarimtShivye", tokenShalgakh, ebarimtShivye);

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
    var butsaakhBarimt;
    var ebarimtShine = false;
    var baiguullaga = await Baiguullaga(db.erunkhiiKholbolt).findById(
      req.body.baiguullagiinId
    );
    var tuxainSalbar = baiguullaga?.barilguud?.find(
      (e) => e._id.toString() == req.body?.barilgiinId
    )?.tokhirgoo;
    if (!!tuxainSalbar.eBarimtShine) ebarimtShine = true;
    if (!!ebarimtShine)
      butsaakhBarimt = await EbarimtShine(
        req.body.tukhainBaaziinKholbolt
      ).findById(req.body._id);
    else {
      butsaakhBarimt = new Ebarimt(req.body.tukhainBaaziinKholbolt)(req.body);
      butsaakhBarimt.returnBillId = butsaakhBarimt.billId;
    }
    ebarimtButsaaya(
      butsaakhBarimt,
      async (d) => {
        butsaakhBarimt.ustgasanOgnoo = new Date();
        butsaakhBarimt.isNew = false;
        await butsaakhBarimt.save().catch((err) => {
          next(err);
        });
        if (butsaakhBarimt.guilgeeniiId)
          await BankniiGuilgee(req.body.tukhainBaaziinKholbolt)
            .findByIdAndUpdate(
              { _id: butsaakhBarimt.guilgeeniiId },
              { ebarimtAvsanEsekh: false }
            )
            .catch((err) => {
              next(err);
            });
        else if (butsaakhBarimt.togloomiinId) {
          await TogloomiinTuv(req.body.tukhainBaaziinKholbolt)
            .findByIdAndUpdate(
              { _id: butsaakhBarimt.togloomiinId },
              {
                ebarimtAvsanEsekh: false,
                ebarimtAvakhDun: butsaakhBarimt.amount || butsaakhBarimt.totalAmount,
              }
            )
            .catch((err) => {
              next(err);
            });
        } else if (butsaakhBarimt.zogsooliinId) {
          await Uilchluulegch(req.body.tukhainBaaziinKholbolt)
            .findByIdAndUpdate(
              { _id: butsaakhBarimt.zogsooliinId },
              { "tuukh.0.ebarimtAvsanEsekh": false }
            )
            .catch((err) => {
              next(err);
            });
        }
        res.send("Amjilttai");
      },
      next,
      ebarimtShine
    );
  } catch (error) {
    next(error);
  }
});

router.post("/ebarimtIlgeeye", tokenShalgakh, async (req, res, next) => {
  try {
    var shine = false;
    if (req.body.barilgiinId) {
      var baiguullaga = await Baiguullaga(db.erunkhiiKholbolt).findById(
        req.body.baiguullagiinId
      );
      var tuxainSalbar = baiguullaga?.barilguud?.find(
        (e) => e._id.toString() == req.body?.barilgiinId
      )?.tokhirgoo;
      if (!!tuxainSalbar.eBarimtShine) shine = true;
    }
    if (!!shine) {
      var url;
      if (req.body.baiguullagiinId == "612f457d185280db676d0b51")
        url = process.env.EBARIMTSHINE_TEST + "rest/sendData";
      else url = process.env.EBARIMTSHINE_IP + "rest/sendData";
      request.get(url, { json: true }, (err, res1, body) => {
        if (err) {
          next(err);
        } else {
          res.send(body);
        }
      });
    }
    else
      next(new Error("ИБаримт dll холболт хийгдээгүй байна!"));
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
    var shine = false;
    if (body?.query?.barilgiinId) {
      var baiguullaga = await Baiguullaga(db.erunkhiiKholbolt).findById(
        req.body.baiguullagiinId
      );
      var tuxainSalbar = baiguullaga?.barilguud?.find(
        (e) => e._id.toString() == body?.query?.barilgiinId
      )?.tokhirgoo;
      if (!!tuxainSalbar.eBarimtShine) shine = true;
    }
    khuudaslalt(
      shine
        ? EbarimtShine(req.body.tukhainBaaziinKholbolt)
        : Ebarimt(req.body.tukhainBaaziinKholbolt),
      body
    )
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
    var ebarimtShine = false;
    var baiguullaga = await Baiguullaga(db.erunkhiiKholbolt).findById(
      req.body.baiguullagiinId
    );
    var tuxainSalbar = baiguullaga?.barilguud?.find(
      (e) => e._id.toString() == req.body?.barilgiinId
    )?.tokhirgoo;
    if (!!tuxainSalbar && !!tuxainSalbar?.eBarimtShine) ebarimtShine = true;
    var match = {
      baiguullagiinId: req.body.baiguullagiinId,
      barilgiinId: req.body.barilgiinId,
    };
    if (!!ebarimtShine) {
      match.createdAt = {
        $gte: new Date(req.body.ekhlekhOgnoo),
        $lte: new Date(req.body.duusakhOgnoo),
      };
    } else {
      match.dateOgnoo = {
        $gte: new Date(req.body.ekhlekhOgnoo),
        $lte: new Date(req.body.duusakhOgnoo),
      };
    }
    if (req.body.barimtTurul === "mashiniiDugaar")
      match.mashiniiDugaar = { $exists: true };
    else if (req.body.barimtTurul === "gereeniiDugaar")
      match.gereeniiDugaar = { $exists: true };
    else if (req.body.barimtTurul === "togloomiinId")
      match.togloomiinId = { $exists: true };

    var query = [
      {
        $match: match,
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
                    $toDecimal: { $ifNull: ["$amount", "$totalAmount"] },
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
                    $toDecimal: { $ifNull: ["$amount", "$totalAmount"] },
                  },
                },
              },
            },
          ],
        },
      },
    ];
    var result;

    if (!!ebarimtShine)
      result = await EbarimtShine(req.body.tukhainBaaziinKholbolt)
        .aggregate(query)
        .catch((err) => {
          next(err);
        });
    else
      result = await Ebarimt(req.body.tukhainBaaziinKholbolt)
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

router.get("/tatvariinAlba", tokenShalgakh, async (req, res, next) => {
  try {
    const body = req.query;
    if (!!body?.query) body.query = JSON.parse(body.query);
    if (!!body?.order) body.order = JSON.parse(body.order);
    if (!!body?.khuudasniiDugaar)
      body.khuudasniiDugaar = Number(body.khuudasniiDugaar);
    if (!!body?.khuudasniiKhemjee)
      body.khuudasniiKhemjee = Number(body.khuudasniiKhemjee);
    if (!!body?.search) body.search = String(body.search);
    khuudaslalt(TatvariinAlba(db.erunkhiiKholbolt), body)
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

router.post(
  "/tatvariinAlbaOlnoorNemye",
  tokenShalgakh,
  async (req, res, next) => {
    try {
      const jagsaalt = req.body.jagsaalt;
      TatvariinAlba(db.erunkhiiKholbolt)
        .insertMany(jagsaalt)
        .then((x) => {
          res.send(x);
        })
        .catch((a) => {
          next(a);
        });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/davkhardsanEBarintUstakh",
  tokenShalgakh,
  async (req, res, next) => {
    try {
      var match = {
        baiguullagiinId: req.body.baiguullagiinId,
        barilgiinId: req.body.barilgiinId,
        mashiniiDugaar: { $exists: true },
        ustgasanOgnoo: { $exists: false },
        createdAt: { $gt: new Date(req.body.ognoo) }
      }
      if(!!req.body.mashiniiDugaar)
        match["mashiniiDugaar"] = req.body.mashiniiDugaar;
      // var query = [
      //   {
      //     $match: match,
      //   },
        // {
        //   $group: {
        //     _id: "$zogsooliinId",
        //     too: {
        //       $sum: 1,
        //     }
        //   }
        // },
        // {
        //   $match: { "too": { $gt: 1 } }
        // }
      // ];
      var ebarimtuud = await EbarimtShine(req.body.tukhainBaaziinKholbolt).find(match);
      if(ebarimtuud?.length > 0)
      {
        for await (const butsaakhBarimt of ebarimtuud)
        {
          // var ebarimt = await EbarimtShine(req.body.tukhainBaaziinKholbolt).find({_id: barimt?._id});
          // ebarimt?.shift();
          // for await (const butsaakhBarimt of ebarimt)
          // {
            ebarimtButsaaya(
              butsaakhBarimt,
              async (d) => {
                butsaakhBarimt.ustgasanOgnoo = new Date();
                butsaakhBarimt.isNew = false;
                await butsaakhBarimt.save().catch((err) => {
                  next(err);
                });
                // res.send("Amjilttai");
              },
              next,
              true
            );
          // }
        }
      }
      res.send(ebarimtuud);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
module.exports.ebarimtShivye = ebarimtShivye;
module.exports.ebarimtDuudya = ebarimtDuudya;
module.exports.zogsooloosEbarimtUusgye = zogsooloosEbarimtUusgye;
module.exports.zogsooloosEbarimtShineUusgye = zogsooloosEbarimtShineUusgye;
module.exports.zogsoolNiitDungeerEbarimtShivye =
  zogsoolNiitDungeerEbarimtShivye;
