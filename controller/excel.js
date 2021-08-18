const asyncHandler = require("express-async-handler");
const GereeniiZaalt = require("../models/gereeniiZaalt");
const GereeniiZagvar = require("../models/gereeniiZagvar");
const Languu = require("../models/languu");
const xlsx = require("xlsx");
const excel = require("exceljs");
const mongoose = require("mongoose");

function usegTooruuKhurvuulekh(useg) {
  if (!!useg) return useg.charCodeAt() - 65;
  else return 0;
}

exports.gereeniiZaaltTatya = asyncHandler(async (req, res, next) => {
  try {
    console.log("req.body", req.body);
    const workbook = xlsx.read(req.file.buffer);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jagsaalt = [];
    var tolgoinObject = {};
    for (let cell in worksheet) {
      var cellAsString = cell.toString();
      if (cellAsString[1] === "1" && !!worksheet[cellAsString].v) {
        if (worksheet[cellAsString].v.includes("Харагдах дугаар"))
          tolgoinObject.kharagdakhDugaar = cellAsString[0];
        else if (worksheet[cellAsString].v.includes("Заалт"))
          tolgoinObject.zaalt = cellAsString[0];
        else if (worksheet[cellAsString].v.includes("Хамаарах хэсэг"))
          tolgoinObject.khamaarakh = cellAsString[0];
      }
    }
    var data = xlsx.utils.sheet_to_json(worksheet, {
      header: 1,
      range: 1,
    });
    data.forEach((mur) => {
      let object = new GereeniiZaalt();
      object.kharagdakhDugaar =
        mur[usegTooruuKhurvuulekh(tolgoinObject.kharagdakhDugaar)];
      object.zaalt = mur[usegTooruuKhurvuulekh(tolgoinObject.zaalt)];
      object.khamaarakh = mur[usegTooruuKhurvuulekh(tolgoinObject.khamaarakh)];
      object.baiguullagiinId = req.body.baiguullagiinId;
      jagsaalt.push(object);
    });
    var aldaaniiMsg = "";
    if (aldaaniiMsg) throw new aldaa(aldaaniiMsg);
    GereeniiZaalt.insertMany(jagsaalt, function (err) {
      if (err) {
        next(err);
      }
      res.status(200).send("Amjilttai");
    });
  } catch (error) {
    next(error);
  }
});

exports.languuTatya = asyncHandler(async (req, res, next) => {
  try {
    const workbook = xlsx.read(req.file.buffer);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jagsaalt = [];
    var tolgoinObject = {};
    for (let cell in worksheet) {
      var cellAsString = cell.toString();
      if (cellAsString[1] === "1" && !!worksheet[cellAsString].v) {
        if (worksheet[cellAsString].v.includes("Давхар"))
          tolgoinObject.davkhar = cellAsString[0];
        else if (worksheet[cellAsString].v.includes("Талбайн хэмжээ"))
          tolgoinObject.talbainKhemjee = cellAsString[0];
        else if (worksheet[cellAsString].v.includes("Код"))
          tolgoinObject.kod = cellAsString[0];
        else if (worksheet[cellAsString].v.includes("Тайлбар"))
          tolgoinObject.tailbar = cellAsString[0];
      }
    }
    var data = xlsx.utils.sheet_to_json(worksheet, {
      header: 1,
      range: 1,
    });
    data.forEach((mur) => {
      let object = new Languu();
      object.davkhar = mur[usegTooruuKhurvuulekh(tolgoinObject.davkhar)];
      object.talbainKhemjee =
        mur[usegTooruuKhurvuulekh(tolgoinObject.talbainKhemjee)];
      object.kod = mur[usegTooruuKhurvuulekh(tolgoinObject.kod)];
      object.tailbar = mur[usegTooruuKhurvuulekh(tolgoinObject.tailbar)];
      //object.baiguullagiinId = req.body.baiguullagiinId;
      jagsaalt.push(object);
    });
    var aldaaniiMsg = "";
    if (aldaaniiMsg) throw new aldaa(aldaaniiMsg);
    Languu.insertMany(jagsaalt, function (err) {
      if (err) {
        next(err);
      }
      res.status(200).send("Amjilttai");
    });
  } catch (error) {
    next(error);
  }
});

exports.gereeniiZagvarTatya = asyncHandler(async (req, res, next) => {
  try {
    const workbook = xlsx.read(req.file.buffer);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jagsaalt = [];
    var tolgoinObject = {};
    var data = xlsx.utils.sheet_to_json(worksheet, {
      header: 1,
      range: 1,
    });
    var zagvariinNer = worksheet["B1"].v;
    const zagvar = new GereeniiZagvar();
    zagvar.ner = zagvariinNer;
    data.forEach((mur) => {
      let object = new GereeniiZaalt();
      object.kharagdakhDugaar = mur[0];
      object.zaalt = mur[1];
      object.khamaarakhKheseg = mur[2];
      object.baiguullagiinId = req.body.baiguullagiinId;
      if (!object.kharagdakhDugaar) object.kharagdakhDugaar = "";
      jagsaalt.push(object);
    });
    zagvar.dedKhesguud = jagsaalt;
    var aldaaniiMsg = "";
    if (aldaaniiMsg) throw new aldaa(aldaaniiMsg);
    zagvar
      .save()
      .then((result) => {
        res.status(200).send("Amjilttai");
      })
      .catch((err) => {
        next(err);
      });
  } catch (error) {
    next(error);
  }
});
exports.gereeniiZagvarAvya = asyncHandler(async (req, res, next) => {
  let workbook = new excel.Workbook();
  let worksheet = workbook.addWorksheet("Гэрээ");
  worksheet.columns = [
    {
      header: "Загварын нэр",
      width: 20,
    },
    {
      header: "",
      key: "",
      width: 30,
    },
    {
      header: "Хамаарагдах алхам",
      key: "Хамаарагдах алхам",
      width: 20,
    },
  ];
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "attachment; filename=" + "Гэрээний загвар"
  );

  return workbook.xlsx.write(res).then(function () {
    res.status(200).end();
  });
});
