const express = require("express");
const router = express.Router();
const { crud, UstsanBarimt, tokenShalgakh } = require("zevbackv2");
const Tasalbar = require("../models/tasalbar");
const TasalbariinGuilgee = require("../models/tasalbariinGuilgee");
const Baiguullaga = require("../models/baiguullaga");
const Ebarimt = require("../models/ebarimt");
const EbarimtShine = require("../models/ebarimtShine");
const aldaa = require("../components/aldaa");
const {
  ebarimtDuudya,
} = require("../routes/ebarimtRoute");
crud(router, "tasalbar", Tasalbar, UstsanBarimt);

const pdfPrint = require('pdf-to-printer');
const { jsPDF } = require("jspdf");
const fs = require("fs");
const path = require("path");
const process = require('node:process');


function nuatBodyo(bodokhDun) {
  var nuatguiDun = bodokhDun / 1.1;
  return (bodokhDun - nuatguiDun).toFixed(2).toString();
}

async function tasalbarEbarimtUusgye(
  tasalbariinGuilgee,
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
  var tulukhDun = tasalbariinGuilgee.tasalbarDun;

  ebarimt.tasalbariinGuilgeeniiId = tasalbariinGuilgee._id;
  ebarimt.baiguullagiinId = tasalbariinGuilgee.baiguullagiinId;
  ebarimt.barilgiinId = tasalbariinGuilgee.barilgiinId;
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
    name: "Тасалбарын үйлчилгээ",
    measureUnit: "шир",
    // qty: tasalbariinGuilgee.tasalbarShirkheg,
    qty: "1.00",
    // unitPrice: tasalbariinGuilgee.tasalbarTariff.toFixed(2).toString(),
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

async function tasalbarEbarimtShineUusgye(
  tasalbariinGuilgee,
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

  var tulukhDun = tasalbariinGuilgee.tasalbarDun;

  ebarimt.tasalbariinGuilgeeniiId = tasalbariinGuilgee._id;
  ebarimt.baiguullagiinId = tasalbariinGuilgee.baiguullagiinId;
  ebarimt.barilgiinId = tasalbariinGuilgee.barilgiinId;
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
          name: "Тасалбарын үйлчилгээ",
          barCodeType: "UNDEFINED",
          classificationCode: "6743000",
          //taxProductCode
          measureUnit: "шир",
          qty: "1.00",
          // qty: tasalbariinGuilgee.tasalbarShirkheg,
          unitPrice: tulukhDun.toFixed(2).toString(),
          // unitPrice: tasalbariinGuilgee.tasalbarTariff,
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
  console.log("eeeebarimt", JSON.stringify(ebarimt, null, 4));
  return ebarimt;
}

router
  .route("/tasalbariinTulburTulye")
  .post(tokenShalgakh, async (req, res, next) => {
    try {
      if(!!req.body.tulbur && req.body.tulbur?.length > 0)
      {
        const tulbur = req.body.tulbur[0];
        const tempData = {
          baiguullagiinId: tulbur.baiguullagiinId,
          barilgiinId: tulbur.barilgiinId,
          ognoo: tulbur.ognoo,
          burtgesenAjiltaniiId: tulbur.burtgesenAjiltaniiId,
          burtgesenAjiltaniiNer: tulbur.burtgesenAjiltaniiNer,
          barCodes: tulbur.barCodes,
          tasalbarTariff: tulbur.tasalbarTariff, 
          tasalbarDun: tulbur.tasalbarDun, 
          tasalbarShirkheg: tulbur.tasalbarShirkheg, 
        }
        var tempGuilgee = new TasalbariinGuilgee(req.body.tukhainBaaziinKholbolt)(tempData);
        await tempGuilgee.save();
        res.send(tempGuilgee._id);
      }
    } catch (err) {
      next(err);
    }
  });

router
  .route("/v1/tasalbarEbarimtAvya")
  .post(tokenShalgakh, async (req, res, next) => {
    try
    {
      var tukhainKholbolt = req.body.tukhainBaaziinKholbolt;
      var tukhainObject = await TasalbariinGuilgee(tukhainKholbolt).findById(req.body.id);
      if (tukhainObject.ebarimtAvsanEsekh)
        throw new aldaa("Ибаримт хэвлэж авсан байна!");
      const { db } = require("zevbackv2");
      var baiguullaga = await Baiguullaga(db.erunkhiiKholbolt).findById(tukhainObject.baiguullagiinId);
      var tuxainSalbar = baiguullaga?.barilguud?.find((e) => e._id.toString() == tukhainObject.barilgiinId)?.tokhirgoo;
      var nuatTulukhEsekh = baiguullaga.barilguud.find((x) => x._id.toString() == tukhainObject.barilgiinId)?.tokhirgoo?.nuatTulukhEsekh;
      console.log("tuxainSalbar", tuxainSalbar);
      if (nuatTulukhEsekh != false) nuatTulukhEsekh = true;
      if (!!tuxainSalbar?.eBarimtShine)
        ebarimt = await tasalbarEbarimtShineUusgye(
          tukhainObject,
          req.body.customerNo,
          req.body.customerTin,
          tuxainSalbar.merchantTin, //"37900846788",
          tuxainSalbar.districtCode, //,"0023"
          tukhainKholbolt,
          nuatTulukhEsekh
        );
      else
        var ebarimt = await tasalbarEbarimtUusgye(
          tukhainObject,
          req.body.customer_no,
          req.body.individual ? null : "3",
          tukhainKholbolt,
          nuatTulukhEsekh
        );
      butsaakhMethod = function (d, khariuObject) {
        try {
          if (d?.status != "SUCCESS" && !d.success) throw new Error(d.message);
          var ebarimt;
          if (!!tuxainSalbar.eBarimtShine)
            ebarimt = new EbarimtShine(tukhainKholbolt)(d);
          else ebarimt = new Ebarimt(tukhainKholbolt)(d);
          ebarimt.tasalbariinGuilgeeniiId = tukhainObject._id;
          ebarimt.baiguullagiinId = khariuObject.baiguullagiinId;
          ebarimt.barilgiinId = khariuObject.barilgiinId;
          ebarimt.save().catch((err) => {
            next(err);
          });
          var update = { ebarimtAvsanEsekh: true };
          if (ebarimt.customerNo)
            update = {
              ...update,
              ebarimtRegister: ebarimt.customerNo,
            };
          TasalbariinGuilgee(tukhainKholbolt)
            .findByIdAndUpdate(tukhainObject._id, update)
            .then((xariu) => {
              console.log("xariu", xariu);
            })
            .catch((err) => {
              console.log(err);
            });
          delete d.baiguullagiinId;
          delete d.barilgiinId;
          delete d.tasalbariinGuilgeeniiId;
          delete d._id;
          console.log("ebarimt duuslaa");
          var butsaakhKhariu = {
            success: true,
            message: "Amjilttai",
          };
          butsaakhKhariu.data = d;
          res.send(butsaakhKhariu);
        } catch (err) {
          next(err);
        }
      };
      ebarimtDuudya(ebarimt, butsaakhMethod, next, tuxainSalbar.eBarimtShine);
    } catch (error) {
      next(error);
    }
});  

router
  .route("/tasalbarKhevlekh")
  .post(tokenShalgakh, async (req, res, next) => {
    try
    {
      var temPath  = process.cwd() + "/file";
      console.log("path --->" + temPath);
      console.log("Checking for directory" + path.join(temPath, "tasalbarKhevlekh"));
      
      if(!fs.existsSync(path.join(temPath, "tasalbarKhevlekh")))
        fs.mkdirSync(path.join(temPath, "tasalbarKhevlekh"), true);
      
      const doc = new jsPDF();
      // doc.html(req.body.htmlData);
      doc.text("Hello world BATAA!", 10, 10);
      doc.save(temPath + "\\tasalbarKhevlekh\\khevlekh.pdf");

      console.log("---------5-------------->>>>"+temPath);

      fs.readFile(path.join(temPath + "/tasalbarKhevlekh", "khevlekh.pdf"), 'utf8', (err, data) => { 
        if (err) { 
          console.error('Error reading file:', err); 
          return; 
        } 
       
        const content = data; 
        console.log("fffff---" + content);
      }); 

      // const options = {
      //   printer: "ZKP8008",
      // };
      // // pdfPrint.getDefaultPrinter().then(console.log);
      // console.log("----------8------------->>>>"+temPath);
      // pdfPrint.print(temPath + "/tasalbarKhevlekh/khevlekh.pdf", options);
      // console.log("----------9------------->>>>"+temPath);
      res.send("test");
    } catch (error) {
      next(error);
    }
});  

module.exports = router;
