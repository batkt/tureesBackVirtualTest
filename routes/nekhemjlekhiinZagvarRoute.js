const express = require("express");
const router = express.Router();
const nekhemjlekhiinZagvar = require("../models/nekhemjlekhiinZagvar");
const { crud, UstsanBarimt, tokenShalgakh } = require("zevbackv2");
const fs = require("fs");
const ExcelJS = require("exceljs");
const { toWords } = require("mon_num");
const XLSX = require("xlsx");

crud(router, "nekhemjlekhiinZagvar", nekhemjlekhiinZagvar, UstsanBarimt);

const multer = require("multer");
const aldaa = require("../components/aldaa");
const storage = multer.memoryStorage();
const uploadFile = multer({ storage: storage });
router
  .route("/excelZagvarOruulya")
  .post(uploadFile.single("file"), tokenShalgakh, async (req, res, next) => {
    try {
      const turul = req.body.turul;
      const baiguullagiinId = req.body.baiguullagiinId;
      if (!req.file) {
        throw new aldaa("Excel файл дахин оруулна уу.");
      }
      const excelFile = req.file;
      const savePath = `./excel/${turul}/${baiguullagiinId}/`;
      if (!fs.existsSync(savePath)) {
        fs.mkdirSync(savePath, { recursive: true });
      }
      const garaasNershil = req.body.excelNer;
      const excelFileName = `${turul}${baiguullagiinId}_${garaasNershil}.xlsx1`;
      fs.writeFile(`${savePath}${excelFileName}`, excelFile.buffer, (err) => {
        if (err) {
          throw new aldaa(err);
        }
        res.send("Amjilttai");
      });
    } catch (err) {
      next(err);
    }
  });

router.route("/excelZagvarUstgaya").post(tokenShalgakh, (req, res, next) => {
  try {
    const turul = req.body.turul;
    const baiguullagiinId = req.body.baiguullagiinId;
    const excelNer = req.body.excelNer;

    const filePath = `./excel/${turul}/${baiguullagiinId}/${turul}${baiguullagiinId}_${excelNer}.xlsx1`;

    fs.unlink(filePath, (err) => {
      if (err) {
        next(err);
      } else {
        res.send("Amjilttai");
      }
    });
  } catch (err) {
    next(err);
  }
});

function textSolyo(text, body) {
  var butsaakh = "";

  Object.keys(body).forEach(function (key) {
    if (text === `<${key}>`) {
      if (
        key === "eneSardTulukhUsgeer" ||
        key === "niitUldegdelUsgeer" ||
        key === "talbainNiitUneUsgeer" ||
        key === "mungunDunUsgeer"
      ) {
        const shineKey = key.replace("Usgeer", "");
        butsaakh = numberToWords(
          Math.abs(body[shineKey]),
          { fixed: 2, suffix: "n" },
          "төгрөг",
          "мөнгө"
        );
      } else {
        butsaakh = body[key];
      }
    }
  });
  return butsaakh;
}

function numberToWords(number, option, bukhel, butarhai) {
  const { fixed, suffix } = option;
  let resValue = "";
  const value = number?.toFixed(fixed)?.toString();
  if (value?.includes(".")) {
    resValue = toWords(Number(value.split(".")[0]), { suffix });
    if (!!bukhel) resValue += ` ${bukhel}`;
    if (Number(value.split(".")[1]) > 0) {
      resValue += ` ${toWords(Number(value.split(".")[1]), { suffix })}`;
      if (!!butarhai) resValue += ` ${butarhai}`;
    }
  }
  return resValue;
}

const undsenTalbaruud = [
  { ner: "Овог", talbar: "<ovog>" },
  { ner: "Нэр", talbar: "<ner>" },
  { ner: "Гэрээний огноо", talbar: "<gereeniiOgnoo>" },
  { ner: "Төрөл", talbar: "<turul>" },
  { ner: "Регистр", talbar: "<register>" },
  { ner: "Албан тушаал", talbar: "<albanTushaal>" },
  { ner: "Захиралын овог", talbar: "<zakhirliinOvog>" },
  { ner: "Захиралын нэр", talbar: "<zakhirliinNer>" },
  { ner: "Утас", talbar: "<utas>" },
  { ner: "Хаяг", talbar: "<khayag>" },
  { ner: "Гэрээний дугаар", talbar: "<gereeniiDugaar>" },
  { ner: "Гарын үсэг", talbar: "<gariinUseg>" },
  { ner: "Тамга", talbar: "<tamga>" },
];

const khugatsaaniiTalbaruud = [
  { ner: "Хугацаа", talbar: "<khugatsaa>" },
  { ner: "Эхлэх он", talbar: "<ekhlekhOn>" },
  { ner: "Эхлэх сар", talbar: "<ekhelkhSar>" },
  { ner: "Эхлэх өдөр", talbar: "<ekhlekhUdur>" },
  { ner: "Дуусах он", talbar: "<duusakhOn>" },
  { ner: "Дуусах сар", talbar: "duusakhSar" },
  { ner: "Дуусах өдөр", talbar: "<duusakhUdur>" },
];

const talbainiiTalbaruud = [
  { ner: "Талбайн дугаар", talbar: "<talbainDugaar>" },
  { ner: "Талбайн нэгж үнэ", talbar: "<talbainNegjUne>" },
  { ner: "Талбайн нэгж үнэ үсгээр", talbar: "<talbainNegjUneUsgeer>" },
  { ner: "Талбайн нийт үнэ", talbar: "<talbainNiitUne>" },
  { ner: "Талбайн нийт үнэ/Нөатгүй/", talbar: "<talbainNiitUneNuatgui>" },
  { ner: "Талбайн нийт үнэ/Нөат/", talbar: "<talbainNiitUneNuat>" },
  { ner: "Талбайн нийт үнэ үсгээр", talbar: "<talbainNiitUneUsgeer>" },
  { ner: "Талбайн хэмжээ", talbar: "<talbainKhemjee>" },
  { ner: "Түрээсийн талбайн давхар", talbar: "<davkhar>" },
  { ner: "Зардлын дүн", talbar: "<zardliinDun>" },
  { ner: "Зориулалт", talbar: "<zoriulalt>" },
];

const baritsaaniiTalbaruud = [
  { ner: "Барьцаа авах дүн", talbar: "<baritsaaAvakhDun>" },
  {
    ner: "Барьцаа байршуулах хугацаа",
    talbar: "baritsaaBairshuulakhKhugatsaa",
  },
];

const tulburiinTalbaruud = [
  { ner: "Хөнгөлөх хугацаа", talbar: "<khungulukhKhugatsaa>" },
  { ner: "Сарын түрээс", talbar: "<sariinTurees>" },
  { ner: "Мөнгөн дүн үсгээр", talbar: "<mungunDunUsgeer>" },
  { ner: "Энэ сард төлөх дүн", talbar: "<eneSardTulukhDun>" },
  { ner: "Нийт үлдэгдэл", talbar: "<niitUldegdel>" },
  { ner: "Нийт үлдэгдэл/Нөатгүй/", talbar: "<niitUldegdelNuatgui>" },
  { ner: "Нийт үлдэгдэл/Нөат/", talbar: "<niitUldegdelNuat>" },
  { ner: "Алдангын үлдэгдэл", talbar: "<aldangiinUldegdel>" },
];

const nekhemjlekhiinTalbaruud = [
  { ner: "Нэхэмжлэхийн сар", talbar: "<sar>" },
  { ner: "Данс", talbar: "<dans>" },
  { ner: "Дансны нэр", talbar: "<dansniiNer>" },
  { ner: "Банк", talbar: "<bank>" },
  { ner: "Хэвлэсэн огноо", talbar: "<khevlesenOgnoo>" },
  { ner: "Нэхэмжлэхийн дугаар", talbar: "<nekhemjlekhiinDugaar>" },
  { ner: "Өмнөх хуримтлагдсан өр төлбөр", talbar: "<umnukhSariinUrTulbur>" },
  { ner: "Энэ сард төлөх үсгээр", talbar: "<eneSardTulukhUsgeer>" },
  { ner: "Нийт үлдэгдэл үсгээр", talbar: "<niitUldegdelUsgeer>" },
];

const nekhemjlekhiinNemelt = [
  { ner: "Дугаар", talbar: "<№>" },
  { ner: "Тайлбар", talbar: "<nemeltNekhemjlekh.tailbar>" },
  { ner: "Төлөх дүн", talbar: "<nemeltNekhemjlekh.tulukhDun>" },
  { ner: "Огноо", talbar: "<nemeltNekhemjlekh.ognoo>" },
  { ner: "Бусад авлагын мөр", talbar: "<nemeltNekhemjlekh>" },
];

router
  .route("/excelZagvarKharya")
  .post(tokenShalgakh, async (req, res, next) => {
    const baiguullagiinId = req.body.baiguullagiinId;
    const turul = "nekhemjlel";
    const fileNer = req.body.excelNer;
    const zam = `./excel/${turul}/${baiguullagiinId}/${turul}${baiguullagiinId}_${fileNer}.xlsx`;
    try {
      const workbook = XLSX.readFile(zam);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const htmlContent = XLSX.utils.sheet_to_html(sheet);
      res.status(200).send(htmlContent);
    } catch (err) {
      next(err);
    }
  });

router
  .route("/excelZagvarTatya")
  .post(tokenShalgakh, async (req, res, next) => {
    const baiguullagiinId = req.body.baiguullagiinId;
    const tulugch = Array.isArray
      ? req.body.nekhemjlekhiinJagsaalt[0]
      : req.body.nekhemjlekhiinJagsaalt;
    const turul = "nekhemjlel";
    const garaasNershil = req.body.excelNer;
    const savePath = `./excel/${turul}/${baiguullagiinId}/${turul}${baiguullagiinId}_${garaasNershil}.xlsx`;
    const workbook = new ExcelJS.Workbook();
    try {
      await workbook.xlsx.readFile(savePath);
      const worksheet = workbook.getWorksheet("Sheet1");
      const solikhTextArray = undsenTalbaruud.concat(
        khugatsaaniiTalbaruud,
        talbainiiTalbaruud,
        baritsaaniiTalbaruud,
        tulburiinTalbaruud,
        nekhemjlekhiinTalbaruud,
        nekhemjlekhiinNemelt
      );
      await worksheet.eachRow((row, rowNumber) => {
        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          solikhTextArray.forEach(async (solikhText) => {
            const shineText = await textSolyo(solikhText.talbar, tulugch);
            if (
              typeof cell.value === "string" &&
              cell.value.includes(solikhText)
            ) {
              cell.value = cell.value.replace(solikhText, shineText);
            }
          });
        });
      });

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.attachment("Нэхэмжлэл.xlsx");
      return workbook.xlsx.write(res).then(function () {
        res.status(200).end();
      });
    } catch (error) {
      next(error);
    }
  });

module.exports = router;
