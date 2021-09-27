const asyncHandler = require("express-async-handler");
const GereeniiZaalt = require("../models/gereeniiZaalt");
const GereeniiZagvar = require("../models/gereeniiZagvar");
const Khariltsagch = require("../models/khariltsagch");
const talbai = require("../models/talbai");
const aldaa = require("../components/aldaa");
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
      if (
        cellAsString[1] === "1" &&
        cellAsString.length == 2 &&
        !!worksheet[cellAsString].v
      ) {
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

exports.talbaiTatya = asyncHandler(async (req, res, next) => {
  try {
    const workbook = xlsx.read(req.file.buffer);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jagsaalt = [];
    var tolgoinObject = {};
    for (let cell in worksheet) {
      var cellAsString = cell.toString();
      if (
        cellAsString[1] === "1" &&
        cellAsString.length == 2 &&
        !!worksheet[cellAsString].v
      ) {
        console.log("cellAsString", cellAsString);
        console.log(worksheet[cellAsString]);
        if (worksheet[cellAsString].v.includes("Давхар"))
          tolgoinObject.davkhar = cellAsString[0];
        else if (worksheet[cellAsString].v.includes("Талбайн хэмжээ"))
          tolgoinObject.talbainKhemjee = cellAsString[0];
        else if (worksheet[cellAsString].v.includes("Код"))
          tolgoinObject.kod = cellAsString[0];
        else if (worksheet[cellAsString].v.includes("Талбайн нэгж үнэ"))
          tolgoinObject.talbainNegjUne = cellAsString[0];
        else if (worksheet[cellAsString].v.includes("Талбайн нийт үнэ"))
          tolgoinObject.talbainNiitUne = cellAsString[0];
        else if (worksheet[cellAsString].v.includes("Тайлбар"))
          tolgoinObject.tailbar = cellAsString[0];
      }
    }
    var data = xlsx.utils.sheet_to_json(worksheet, {
      header: 1,
      range: 1,
    });
    data.forEach((mur) => {
      let object = new talbai();
      object.davkhar = mur[usegTooruuKhurvuulekh(tolgoinObject.davkhar)];
      object.talbainKhemjee =
        mur[usegTooruuKhurvuulekh(tolgoinObject.talbainKhemjee)];
      object.kod = mur[usegTooruuKhurvuulekh(tolgoinObject.kod)];
      object.talbainNegjUne =
        mur[usegTooruuKhurvuulekh(tolgoinObject.talbainNegjUne)];
      object.talbainNiitUne =
        mur[usegTooruuKhurvuulekh(tolgoinObject.talbainNiitUne)];
      object.tailbar = mur[usegTooruuKhurvuulekh(tolgoinObject.tailbar)];
      object.baiguullagiinId = req.body.baiguullagiinId;
      jagsaalt.push(object);
    });
    var aldaaniiMsg = "";
    if (aldaaniiMsg) throw new aldaa(aldaaniiMsg);
    talbai.insertMany(jagsaalt, function (err) {
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
      if (!object.kharagdakhDugaar) object.kharagdakhDugaar = "";
      jagsaalt.push(object);
    });
    zagvar.dedKhesguud = jagsaalt;
    zagvar.baiguullagiinId = req.body.baiguullagiinId;
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
exports.talbainZagvarAvya = asyncHandler(async (req, res, next) => {
  let workbook = new excel.Workbook();
  let worksheet = workbook.addWorksheet("Гэрээ");
  worksheet.columns = [
    {
      header: "Давхар",
      key: "Давхар",
      width: 20,
    },
    {
      header: "Код",
      key: "Код",
      width: 30,
    },
    {
      header: "Талбайн хэмжээ",
      key: "Талбайн хэмжээ",
      width: 30,
    },
    {
      header: "Талбайн нэгж үнэ",
      key: "Талбайн нэгж үнэ",
      width: 20,
    },
    {
      header: "Талбайн нийт үнэ",
      key: "Талбайн нийт үнэ",
      width: 20,
    },
    {
      header: "Тайлбар",
      key: "Тайлбар",
      width: 20,
    },
  ];
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );

  return workbook.xlsx.write(res).then(function () {
    res.status(200).end();
  });
});

exports.khariltsagchZagvarAvya = asyncHandler(async (req, res, next) => {
  let workbook = new excel.Workbook();
  let worksheet = workbook.addWorksheet("Иргэн");
  worksheet.columns = [
    {
      header: "Код",
      key: "Код",
      width: 30,
    },
    {
      header: "Овог",
      key: "Овог",
      width: 30,
    },
    {
      header: "Нэр",
      key: "Нэр",
      width: 20,
    },
    {
      header: "Регистр",
      key: "Регистр",
      width: 20,
    },
    {
      header: "Утас",
      key: "Утас",
      width: 20,
    },
    {
      header: "Мэйл",
      key: "Мэйл",
      width: 20,
    },
    {
      header: "Хаяг",
      key: "Хаяг",
      width: 20,
    },
  ];
  let worksheet1 = workbook.addWorksheet("ААН");
  worksheet1.columns = [
    {
      header: "Код",
      key: "Код",
      width: 30,
    },
    {
      header: "Нэр",
      key: "Нэр",
      width: 20,
    },
    {
      header: "Улсын бүртгэлийн дугаар",
      key: "Улсын бүртгэлийн дугаар",
      width: 20,
    },
    {
      header: "Захирлын овог",
      key: "Захирлын овог",
      width: 20,
    },
    {
      header: "Захирлын нэр",
      key: "Захирлын нэр",
      width: 20,
    },
    {
      header: "Мэйл",
      key: "Мэйл",
      width: 20,
    },
    {
      header: "Утас",
      key: "Утас",
      width: 20,
    },
    {
      header: "Хаяг",
      key: "Хаяг",
      width: 20,
    },
  ];
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=" + encodeURI("Харилцагч.xlsx")
  );
  workbook.xlsx.write(res).then(function () {
    res.end();
  });
});


exports.khariltsagchTatya = asyncHandler(async (req, res, next) => {
  try {
    const workbook = xlsx.read(req.file.buffer);
    if (workbook.SheetNames[0] !== "Иргэн" || workbook.SheetNames[1] !== "ААН")
      throw new aldaa("Буруу файл байна!");
    const irgenSheet = workbook.Sheets[workbook.SheetNames[0]];
    const jagsaalt = [];
    var tolgoinObject = {};
    for (let cell in irgenSheet) {
      var cellAsString = cell.toString();
      if (
        cellAsString[1] === "1" &&
        cellAsString.length == 2 &&
        !!irgenSheet[cellAsString].v
      ) {
        if (irgenSheet[cellAsString].v.includes("Код"))
          tolgoinObject.id = cellAsString[0];
        else if (irgenSheet[cellAsString].v.includes("Нэр"))
          tolgoinObject.ner = cellAsString[0];
        else if (irgenSheet[cellAsString].v.includes("Овог"))
          tolgoinObject.ovog = cellAsString[0];
        else if (irgenSheet[cellAsString].v.includes("Регистр"))
          tolgoinObject.register = cellAsString[0];
        else if (irgenSheet[cellAsString].v.includes("Утас"))
          tolgoinObject.utas = cellAsString[0];
        else if (irgenSheet[cellAsString].v.includes("Мэйл"))
          tolgoinObject.mail = cellAsString[0];
        else if (irgenSheet[cellAsString].v.includes("Хаяг"))
          tolgoinObject.khayag = cellAsString[0];
      }
    }
    var data = xlsx.utils.sheet_to_json(irgenSheet, {
      header: 1,
      range: 1,
    });
    data.forEach((mur) => {
      let object = new Khariltsagch();
      object.id = mur[usegTooruuKhurvuulekh(tolgoinObject.id)];
      object.ner = mur[usegTooruuKhurvuulekh(tolgoinObject.ner)];
      object.ovog = mur[usegTooruuKhurvuulekh(tolgoinObject.ovog)];
      object.register = mur[usegTooruuKhurvuulekh(tolgoinObject.register)];
      object.utas = mur[usegTooruuKhurvuulekh(tolgoinObject.utas)];
      object.mail = mur[usegTooruuKhurvuulekh(tolgoinObject.mail)];
      object.khayag = mur[usegTooruuKhurvuulekh(tolgoinObject.khayag)];
      object.baiguullagiinId = req.body.baiguullagiinId;
      jagsaalt.push(object);
    });

    const aanSheet = workbook.Sheets[workbook.SheetNames[1]];
    tolgoinObject = {};
    for (let cell in aanSheet) {
      var cellAsString = cell.toString();
      if (
        cellAsString[1] === "1" &&
        cellAsString.length == 2 &&
        !!aanSheet[cellAsString].v
      ) {
        if (aanSheet[cellAsString].v.includes("Код"))
          tolgoinObject.id = cellAsString[0];
        else if (aanSheet[cellAsString].v.includes("Нэр"))
          tolgoinObject.ner = cellAsString[0];
        else if (aanSheet[cellAsString].v.includes("Улсын бүртгэлийн дугаар"))
          tolgoinObject.register = cellAsString[0];
        else if (aanSheet[cellAsString].v.includes("Захирлын овог"))
          tolgoinObject.zakhirliinOvog = cellAsString[0];
        else if (aanSheet[cellAsString].v.includes("Захирлын нэр"))
          tolgoinObject.zakhirliinNer = cellAsString[0];
        else if (aanSheet[cellAsString].v.includes("Утас"))
          tolgoinObject.utas = cellAsString[0];
        else if (aanSheet[cellAsString].v.includes("Мэйл"))
          tolgoinObject.mail = cellAsString[0];
        else if (aanSheet[cellAsString].v.includes("Хаяг"))
          tolgoinObject.khayag = cellAsString[0];
      }
    }
    data = xlsx.utils.sheet_to_json(aanSheet, {
      header: 1,
      range: 1,
    });
    console.log("tolgoinObject", tolgoinObject);
    data.forEach((mur) => {
      let object = new Khariltsagch();
      object.id = mur[usegTooruuKhurvuulekh(tolgoinObject.id)];
      object.ner = mur[usegTooruuKhurvuulekh(tolgoinObject.ner)];
      object.ovog = mur[usegTooruuKhurvuulekh(tolgoinObject.ovog)];
      object.register = mur[usegTooruuKhurvuulekh(tolgoinObject.register)];
      object.zakhirliinOvog = mur[usegTooruuKhurvuulekh(tolgoinObject.zakhirliinOvog)];
      object.zakhirliinNer = mur[usegTooruuKhurvuulekh(tolgoinObject.zakhirliinNer)];
      object.utas = mur[usegTooruuKhurvuulekh(tolgoinObject.utas)];
      object.mail = mur[usegTooruuKhurvuulekh(tolgoinObject.mail)];
      object.khayag = mur[usegTooruuKhurvuulekh(tolgoinObject.khayag)];
      object.baiguullagiinId = req.body.baiguullagiinId;
      jagsaalt.push(object);
    });
    Khariltsagch.insertMany(jagsaalt, function (err) {
      if (err) {
        next(err);
      }
      res.status(200).send("Amjilttai");
    });
  } catch (error) {
    next(error);
  }
});
