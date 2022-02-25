const asyncHandler = require("express-async-handler");
const GereeniiZaalt = require("../models/gereeniiZaalt");
const GereeniiZagvar = require("../models/gereeniiZagvar");
const Khariltsagch = require("../models/khariltsagch");;
const Baiguullaga = require("../models/baiguullaga");
const Geree = require("../models/geree");
const Talbai = require("../models/talbai");
const aldaa = require("../components/aldaa");
const xlsx = require("xlsx");
const moment = require("moment");
const excel = require("exceljs");
const mongoose = require("mongoose");

function usegTooruuKhurvuulekh(useg) {
  if (!!useg) return useg.charCodeAt() - 65;
  else return 0;
}
async function gereeBaigaaEskhiigShalgaya(gereenuud, aldaaniiMsg, baiguullagiinId) {
  var jagsaalt = []
  var shineAldaaniiMsg = ""
  gereenuud.forEach(a => {
    jagsaalt.push(a.gereeniiDugaar);
  });
  var gereeniiJagsaalt = await Geree.find({ "gereeniiDugaar": { $in: jagsaalt }, "baiguullagiinId": baiguullagiinId });
  if (gereeniiJagsaalt.length !== 0) {
    gereeniiDugaaruud = [];
    gereeniiJagsaalt.forEach(x => {
      gereeniiDugaaruud.push(x.gereeniiDugaar);
    })
    shineAldaaniiMsg = aldaaniiMsg + "Гэрээний дугаар давхардаж байна! : " + gereeniiDugaaruud + '<br/>';
  }
  if (shineAldaaniiMsg)
    aldaaniiMsg = shineAldaaniiMsg;
  return aldaaniiMsg;
}

async function khariltsagchBaigaaEskhiigShalgaya(gereenuud, aldaaniiMsg, baiguullagiinId, barilgiinId) {
  var jagsaalt = []
  var shineAldaaniiMsg = ""
  if (gereenuud)
    gereenuud.forEach(a => {
      jagsaalt.push(a.register);
    });
  var khariltsagchiinJagsaalt = await Khariltsagch.find({ "register": { $in: jagsaalt }, "baiguullagiinId": baiguullagiinId, "barilgiinId": barilgiinId });
  if (khariltsagchiinJagsaalt.length !== 0) {
    oldooguiJagsaalt = [];
    jagsaalt.forEach(x => {
      if (khariltsagchiinJagsaalt.find(a => a.register == x) == null)
        oldooguiJagsaalt.push(x);
    })
    if (oldooguiJagsaalt.length !== 0)
      shineAldaaniiMsg = aldaaniiMsg + "Дараах бүртгэлийн дугаартай харилцагчид олдсонгүй! : " + oldooguiJagsaalt + '<br/>';
  }
  else
    shineAldaaniiMsg = aldaaniiMsg + "Дараах бүртгэлийн дугаартай харилцагчид олдсонгүй! : " + jagsaalt + '<br/>';

  if (shineAldaaniiMsg)
    aldaaniiMsg = shineAldaaniiMsg;
  else {
    var tukhainKhariltsagch;
    if (gereenuud)
      gereenuud.forEach(x => {
        tukhainKhariltsagch = khariltsagchiinJagsaalt.find(a => a.register == x.register);;
        x.ovog = tukhainKhariltsagch.ovog;
        x.ner = tukhainKhariltsagch.ner;
        x.turul = tukhainKhariltsagch.turul;
        x.zakhirliinOvog = tukhainKhariltsagch.zakhirliinOvog;
        x.zakhirliinNer = tukhainKhariltsagch.zakhirliinNer;
        x.utas = tukhainKhariltsagch.utas;
      })
  }
  return aldaaniiMsg;
}

async function khariltsagchBaikhguigShalgaya(khariltsagchid, aldaaniiMsg, baiguullagiinId, barilgiinId) {
  var jagsaalt = []
  var shineAldaaniiMsg = ""
  if (khariltsagchid)
    khariltsagchid.forEach(a => {
      jagsaalt.push(a.register);
    });
  var khariltsagchiinJagsaalt = await Khariltsagch.find({ "register": { $in: jagsaalt }, "baiguullagiinId": baiguullagiinId, "barilgiinId": barilgiinId });
  if (khariltsagchiinJagsaalt.length > 0) {
    var davkhardsanRegisteruud = []
    khariltsagchiinJagsaalt.forEach(a => {
      davkhardsanRegisteruud.push(a.register);
    });
    shineAldaaniiMsg = aldaaniiMsg + "Дараах бүртгэлийн дугаартай харилцагчид бүртгэлтэй байна! : " + davkhardsanRegisteruud + '<br/>';
  }
  if (shineAldaaniiMsg)
    aldaaniiMsg = shineAldaaniiMsg;
  return aldaaniiMsg;
}

async function talbaiBaigaaEskhiigShalgaya(gereenuud, aldaaniiMsg, baiguullagiinId, barilgiinId) {
  var jagsaalt = []
  var shineAldaaniiMsg = ""
  gereenuud.forEach(a => {
    if (a.talbainDugaar.includes(",")) {
      jagsaalt = [...jagsaalt, ...a.talbainDugaar.split(",")];
    }
    else
      jagsaalt.push(a.talbainDugaar);
  });
  var talbainJagsaalt = await Talbai.find({ "kod": { $in: jagsaalt }, "baiguullagiinId": baiguullagiinId, "barilgiinId": barilgiinId });
  if (talbainJagsaalt.length !== 0) {
    oldooguiJagsaalt = [];
    jagsaalt.forEach(x => {
      if (talbainJagsaalt.find(a => a.kod == x) == null)
        oldooguiJagsaalt.push(x);
    })
    if (oldooguiJagsaalt.length !== 0)
      shineAldaaniiMsg = aldaaniiMsg + "Дараах дугаартай талбайнуудын мэдээлэл олдсонгүй! : " + oldooguiJagsaalt + '<br/>';
  }
  else
    shineAldaaniiMsg = aldaaniiMsg + "Дараах дугаартай талбайнуудын мэдээлэл олдсонгүй! : " + jagsaalt + '<br/>';

  if (shineAldaaniiMsg)
    aldaaniiMsg = shineAldaaniiMsg;
  else {
    gereenuud.forEach(x => {
      console.log("end", x.talbainDugaar);
      if (x.talbainDugaar.includes(",")) {
        var tukhainTalbainuud = talbainJagsaalt.filter(a => x.talbainDugaar.split(",").includes(a.kod));
        console.log("tukhainTalbainuud", tukhainTalbainuud);
        console.log("talbainJagsaalt", talbainJagsaalt);
        console.log("x", x);
        tukhainTalbainuud.forEach(mur => {
          x.davkhar = mur.davkhar;
          x.talbainNegjUne = mur.talbainNegjUne;
          x.talbainNiitUne = (x.talbainNiitUne != null ? x.talbainNiitUne : 0) + mur.talbainNiitUne;
          x.talbainKhemjee = (x.talbainKhemjee != null ? x.talbainKhemjee : 0) + mur.talbainKhemjee;
          x.sariinTurees = x.talbainNiitUne;
          x.baritsaaAvakhDun = (x.baritsaaAwakhKhugatsaa * mur.talbainNiitUne) + (x.baritsaaAvakhDun != null ? x.baritsaaAvakhDun : 0);
        })
      }
      else {
        console.log(talbainJagsaalt);
        var tukhainTalbai = talbainJagsaalt.find(a => a.kod == x.talbainDugaar);
        console.log("tukhainTalbai", tukhainTalbai);
        x.davkhar = tukhainTalbai.davkhar;
        x.talbainNegjUne = tukhainTalbai.talbainNegjUne;
        x.talbainNiitUne = tukhainTalbai.talbainNiitUne;
        x.talbainKhemjee = tukhainTalbai.talbainKhemjee;
        x.sariinTurees = tukhainTalbai.talbainNiitUne;
        x.baritsaaAvakhDun = x.baritsaaAwakhKhugatsaa * tukhainTalbai.talbainNiitUne;
      }
    })
  }
  return aldaaniiMsg;
}

exports.gereeniiZaaltTatya = asyncHandler(async (req, res, next) => {
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
      object.baiguullagiinId = req.body.baiguullagiinId;;
      object.barilgiinId = req.body.barilgiinId;
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
    var muriinDugaar = 1;
    for (let cell in worksheet) {
      var cellAsString = cell.toString();
      if (
        cellAsString[1] === "1" &&
        cellAsString.length == 2 &&
        !!worksheet[cellAsString].v
      ) {
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
      let object = new Talbai();
      object.davkhar = mur[usegTooruuKhurvuulekh(tolgoinObject.davkhar)];
      object.talbainKhemjee =
        mur[usegTooruuKhurvuulekh(tolgoinObject.talbainKhemjee)];
      object.kod = mur[usegTooruuKhurvuulekh(tolgoinObject.kod)];
      object.talbainNegjUne =
        mur[usegTooruuKhurvuulekh(tolgoinObject.talbainNegjUne)];
      object.talbainNiitUne =
        mur[usegTooruuKhurvuulekh(tolgoinObject.talbainNiitUne)];
      object.tailbar = mur[usegTooruuKhurvuulekh(tolgoinObject.tailbar)];
      object.baiguullagiinId = req.body.baiguullagiinId;;
      object.barilgiinId = req.body.barilgiinId;
      if (!object.davkhar || !object.talbainKhemjee || !object.kod || !object.talbainNegjUne || !object.talbainNiitUne) {
        aldaaniiMsg = aldaaniiMsg + muriinDugaar + " дугаар мөрөнд ";
        if (!object.davkhar)
          aldaaniiMsg = aldaaniiMsg + "Давхар "
        if (!object.talbainKhemjee)
          aldaaniiMsg = aldaaniiMsg + "Талбайн хэмжээ "
        if (!object.kod)
          aldaaniiMsg = aldaaniiMsg + "Код "
        if (!object.talbainNegjUne)
          aldaaniiMsg = aldaaniiMsg + "Талбайн нэгж үнэ "
        if (!object.talbainNiitUne)
          aldaaniiMsg = aldaaniiMsg + "Талбайн нийт үнэ "
        aldaaniiMsg = aldaaniiMsg + "талбар хоосон байна! <br/>"
      }
      else
        jagsaalt.push(object);
    });
    var aldaaniiMsg = "";
    if (aldaaniiMsg) throw new aldaa(aldaaniiMsg);
    Talbai.insertMany(jagsaalt, function (err) {
      if (err) {
        throw new aldaa(aldaaniiMsg + muriinDugaar + " дугаар мөрөнд алдаа гарлаа" + err);
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
    zagvar.barilgiinId = req.body.barilgiinId;
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


exports.gereeniiExcelAvya = asyncHandler(async (req, res, next) => {
  let workbook = new excel.Workbook();
  let worksheet = workbook.addWorksheet("Гэрээ");
  worksheet.columns = [
    {
      header: "Гэрээний дугаар",
      key: "Гэрээний дугаар",
      width: 30,
    },
    {
      header: "Регистр/Бүртгэлийн дугаар",
      key: "Регистр/Бүртгэлийн дугаар",
      width: 30,
    },
    {
      header: "Эхлэх огноо",
      key: "Эхлэх огноо",
      width: 20,
    },
    {
      header: "Хугацаа(Сараар)",
      key: "Хугацаа(Сараар)",
      width: 20,
    },
    {
      header: "Төлөлт хийх өдөр",
      key: "Төлөлт хийх өдөр",
      width: 20,
    },
    {
      header: "Талбайн код",
      key: "Талбайн код",
      width: 20,
    },
    {
      header: "Барьцаа авах хугацаа",
      key: "Барьцаа авах хугацаа",
      width: 20,
    },
    {
      header: "Барьцаа байршуулах хугацаа",
      key: "Барьцаа байршуулах хугацаа",
      width: 20,
    },
    {
      header: "Авлага",
      key: "Авлага",
      width: 20,
    },
    {
      header: "Хөнгөлөх эсэх",
      key: "Хөнгөлөх эсэх",
      width: 20,
    }
  ];
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=" + encodeURI("Гэрээ.xlsx")
  );
  workbook.xlsx.write(res).then(function () {
    res.end();
  });
});


exports.gereeniiExcelTatya = asyncHandler(async (req, res, next) => {
  try {
    const workbook = xlsx.read(req.file.buffer);
    var zagvariinId;
    if (req.body.zagvariinId)
      zagvariinId = req.body.zagvariinId;
    else
      throw new aldaa("Загвараа сонгоно уу!")

    var ognoo;
    if (req.body.ognoo)
      ognoo = req.body.ognoo;
    else
      throw new aldaa("Огноо сонгоно уу!")
    if (!req.body.barilgiinId)
      throw new aldaa("Барилгаа сонгоно уу!")
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jagsaalt = [];
    var tolgoinObject = {};
    var baritsaaAvakhSar = await Baiguullaga.findById({ _id: req.body.baiguullagiinId }).select({ "tokhirgoo.baritsaaAvakhSar": 1 });
    if (baritsaaAvakhSar && baritsaaAvakhSar.tokhirgoo && baritsaaAvakhSar.tokhirgoo.baritsaaAvakhSar)
      baritsaaAvakhSar = baritsaaAvakhSar.tokhirgoo.baritsaaAvakhSar
    else
      baritsaaAvakhSar = 0
    for (let cell in worksheet) {
      var cellAsString = cell.toString();
      if (
        cellAsString[1] === "1" &&
        cellAsString.length == 2 &&
        !!worksheet[cellAsString].v
      ) {
        try {
          if (worksheet[cellAsString].v.includes("Гэрээний дугаар"))
            tolgoinObject.gereeniiDugaar = cellAsString[0];
          else if (worksheet[cellAsString].v.includes("Регистр/Бүртгэлийн дугаар"))
            tolgoinObject.register = cellAsString[0];
          else if (worksheet[cellAsString].v.includes("Эхлэх огноо"))
            tolgoinObject.gereeniiOgnoo = cellAsString[0];
          else if (worksheet[cellAsString].v.includes("Хугацаа(Сараар)"))
            tolgoinObject.khugatsaa = cellAsString[0];
          else if (worksheet[cellAsString].v.includes("Төлөлт хийх өдөр"))
            tolgoinObject.tulukhUdur = cellAsString[0];
          else if (worksheet[cellAsString].v.includes("Талбайн код"))
            tolgoinObject.talbainDugaar = cellAsString[0];
          else if (worksheet[cellAsString].v.includes("Барьцаа авах хугацаа"))
            tolgoinObject.baritsaaAwakhKhugatsaa = cellAsString[0];
          else if (worksheet[cellAsString].v.includes("Барьцаа байршуулах хугацаа"))
            tolgoinObject.baritsaaBairshuulakhKhugatsaa = cellAsString[0];
          else if (worksheet[cellAsString].v.includes("Авлага"))
            tolgoinObject.avlaga = cellAsString[0];
          else if (worksheet[cellAsString].v.includes("Хөнгөлөх эсэх"))
            tolgoinObject.khungulukhEsekh = cellAsString[0];
        }
        catch (err) {
          throw new aldaa("Буруу файл байна! " + err);
        }
      }
    }
    var data = xlsx.utils.sheet_to_json(worksheet, {
      header: 1,
      range: 1,
    });
    var aldaaniiMsg = "";
    var muriinDugaar = 1;
    try {
      data.forEach((mur) => {
        muriinDugaar++;
        let object = new Geree();
        object.gereeniiDugaar = mur[usegTooruuKhurvuulekh(tolgoinObject.gereeniiDugaar)];
        object.register = mur[usegTooruuKhurvuulekh(tolgoinObject.register)];
        object.gereeniiOgnoo = new ExcelDateToJSDate(mur[usegTooruuKhurvuulekh(tolgoinObject.gereeniiOgnoo)]);
        object.khugatsaa = mur[usegTooruuKhurvuulekh(tolgoinObject.khugatsaa)];
        var ekhlekhOgnoo = new Date(object.gereeniiOgnoo);
        object.duusakhOgnoo = new Date(ekhlekhOgnoo.setMonth(ekhlekhOgnoo.getMonth() + object.khugatsaa));;
        object.tulukhUdur = mur[usegTooruuKhurvuulekh(tolgoinObject.tulukhUdur)];
        object.talbainDugaar = mur[usegTooruuKhurvuulekh(tolgoinObject.talbainDugaar)];
        object.baritsaaAwakhKhugatsaa = mur[usegTooruuKhurvuulekh(tolgoinObject.baritsaaAwakhKhugatsaa)];
        object.baritsaaBairshuulakhKhugatsaa = mur[usegTooruuKhurvuulekh(tolgoinObject.baritsaaBairshuulakhKhugatsaa)];
        object.uldegdel = mur[usegTooruuKhurvuulekh(tolgoinObject.avlaga)];
        object.daraagiinTulukhOgnoo = moment(ognoo).add(1, 'month').set('date', object.tulukhUdur);
        object.baritsaaAvakhKhugatsaa = baritsaaAvakhSar;
        object.avlaga = {
          guilgeenuud: [
            {
              ognoo,
              tulukhDun: object.uldegdel,
              undsenDun: object.uldegdel
            }]
        }
        object.gereeniiZagvariinId = zagvariinId;
        object.baiguullagiinId = req.body.baiguullagiinId;
        object.barilgiinId = req.body.barilgiinId;
        if (!object.register || !object.gereeniiOgnoo || !object.khugatsaa || !object.talbainDugaar) {
          aldaaniiMsg = aldaaniiMsg + muriinDugaar + " дугаар мөрөнд ";
          if (!object.register)
            aldaaniiMsg = aldaaniiMsg + "Регистр "
          if (!object.gereeniiOgnoo)
            aldaaniiMsg = aldaaniiMsg + "Гэрээний огноо "
          if (!object.khugatsaa)
            aldaaniiMsg = aldaaniiMsg + "Хугацаа "
          if (!object.talbainDugaar)
            aldaaniiMsg = aldaaniiMsg + "Талбайн код "
          aldaaniiMsg = aldaaniiMsg + "талбар хоосон байна! <br/>"
        }
        else
          jagsaalt.push(object);
      });
    }
    catch (err) {
      throw new aldaa(aldaaniiMsg + muriinDugaar + " дугаар мөрөнд алдаа гарлаа" + err);
    }
    aldaaniiMsg = await gereeBaigaaEskhiigShalgaya(jagsaalt, aldaaniiMsg, req.body.baiguullagiinId);
    aldaaniiMsg = await khariltsagchBaigaaEskhiigShalgaya(jagsaalt, aldaaniiMsg, req.body.baiguullagiinId, req.body.barilgiinId);
    aldaaniiMsg = await talbaiBaigaaEskhiigShalgaya(jagsaalt, aldaaniiMsg, req.body.baiguullagiinId, req.body.barilgiinId);
    if (aldaaniiMsg) throw new aldaa(aldaaniiMsg);
    jagsaalt.forEach(x => {
      var data = []
      new Array(x.khugatsaa || 0).fill('').map((mur, index) => {
        x.tulukhUdur.forEach((udur) => {
          if (moment(ognoo).add(index + 1, 'month').set('date', udur) <= moment(x.duusakhOgnoo))
            data.push({
              ognoo: moment(ognoo).add(index + 1, 'month').set('date', udur),
              khyamdral: 0,
              undsenDun: x.talbainNiitUne,
              tulukhDun: x.talbainNiitUne
            })
        })
      })
      x.avlaga.guilgeenuud = [...x.avlaga.guilgeenuud, ...data];
      if (baritsaaAvakhSar > 0) {
        x.avlaga.guilgeenuud = [...x.avlaga.guilgeenuud, {
          turul: "baritsaa",
          ognoo: x.gereeniiOgnoo,
          khyamdral: 0,
          undsenDun: x.talbainNiitUne * baritsaaAvakhSar,
          tulukhDun: x.talbainNiitUne * baritsaaAvakhSar
        }];
      }
    })
    console.log("jagsaalt", jagsaalt)
    Geree.insertMany(jagsaalt, function (err) {
      if (err) {
        next(err);
      }
      res.status(200).send("Amjilttai");
    });
  } catch (error) {
    next(error);
  }
});

function ExcelDateToJSDate(date) {
  return new Date(Math.round((date - 25569) * 86400 * 1000));
}

exports.mashiniiExcelAvya = asyncHandler(async (req, res, next) => {
  let workbook = new excel.Workbook();
  let worksheet = workbook.addWorksheet("Машины мэдээлэл");
  console.log("here");
  worksheet.columns = [
    {
      header: "Машины дугаар",
      key: "Машины дугаар",
      headerRow: true,
      width: 30,
      style: {
        font: { bgColor: { argb: 'a0d6a0' } }
      }
    },
    {
      header: "Эзэмшигчийн нэр",
      key: "Эзэмшигчийн нэр",
      headerRow: true,
      width: 30,
    },
    {
      header: "Эзэмшигчийн утас",
      key: "Эзэмшигчийн утас",
      headerRow: true,
      width: 20,
    },
    {
      header: "Төрөл",
      key: "Төрөл",
      headerRow: true,
      width: 20,
    }
  ];
  console.log("worksheet", worksheet);
  for (let i = 1; i < 100; i++) {
    worksheet.getCell(`D${i}`).dataValidation = {
      type: 'list',
      allowBlank: false,
      formulae: ['"Гэрээт,Түрээслэгч,Дотоод"']
    }
  }
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=" + encodeURI("Машины мэдээлэл.xlsx")
  );
  workbook.xlsx.write(res).then(function () {
    res.end();
  });
});


exports.khariltsagchTatya = asyncHandler(async (req, res, next) => {
  try {
    const workbook = xlsx.read(req.file.buffer);
    if (workbook.SheetNames[0] !== "Иргэн" || workbook.SheetNames[1] !== "ААН")
      throw new aldaa("Та загварын дагуу бөглөөгүй байна!");
    const irgenSheet = workbook.Sheets[workbook.SheetNames[0]];
    const aanSheet = workbook.Sheets[workbook.SheetNames[1]];
    const jagsaalt = [];
    var tolgoinObject = {};
    var muriinDugaar = 1;
    if (!irgenSheet["A1"].v.includes("Код") || !irgenSheet["C1"].v.includes("Нэр") ||
      !irgenSheet["B1"].v.includes("Овог") || !irgenSheet["D1"].v.includes("Регистр") ||
      !irgenSheet["E1"].v.includes("Утас") || !irgenSheet["F1"].v.includes("Мэйл") || !irgenSheet["G1"].v.includes("Хаяг")) {
      throw new aldaa("Та загварын дагуу бөглөөгүй байна!");
    }
    if (!aanSheet["A1"].v.includes("Код") || !aanSheet["C1"].v.includes("Улсын бүртгэлийн дугаар") ||
      !aanSheet["B1"].v.includes("Нэр") || !aanSheet["D1"].v.includes("Захирлын овог") ||
      !aanSheet["E1"].v.includes("Захирлын нэр") || !aanSheet["F1"].v.includes("Мэйл") ||
      !aanSheet["G1"].v.includes("Утас") || !aanSheet["H1"].v.includes("Хаяг")) {
      throw new aldaa("Та загварын дагуу бөглөөгүй байна!");
    }
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
    var aldaaniiMsg = "";
    data.forEach((mur) => {
      muriinDugaar++;
      let object = new Khariltsagch();
      object.id = mur[usegTooruuKhurvuulekh(tolgoinObject.id)];
      object.ner = mur[usegTooruuKhurvuulekh(tolgoinObject.ner)];
      object.ovog = mur[usegTooruuKhurvuulekh(tolgoinObject.ovog)];
      object.register = mur[usegTooruuKhurvuulekh(tolgoinObject.register)];
      object.utas = [mur[usegTooruuKhurvuulekh(tolgoinObject.utas)]];
      object.mail = mur[usegTooruuKhurvuulekh(tolgoinObject.mail)];
      object.khayag = mur[usegTooruuKhurvuulekh(tolgoinObject.khayag)];
      object.turul = "Иргэн";
      object.baiguullagiinId = req.body.baiguullagiinId;
      object.barilgiinId = req.body.barilgiinId;
      if (!object.id || !object.ner || !object.register || !object.utas) {
        aldaaniiMsg = aldaaniiMsg + "Иргэн sheet-ны " + muriinDugaar + " дугаар мөрөнд ";
        if (!object.id)
          aldaaniiMsg = aldaaniiMsg + "'Код', "
        if (!object.ner)
          aldaaniiMsg = aldaaniiMsg + "'Нэр', "
        if (!object.register)
          aldaaniiMsg = aldaaniiMsg + "'Регистр', "
        if (!object.utas || !object.utas[0])
          aldaaniiMsg = aldaaniiMsg + "'Утас', "
        aldaaniiMsg = aldaaniiMsg.slice(0, -2)
        aldaaniiMsg = aldaaniiMsg + " "
        aldaaniiMsg = aldaaniiMsg + "талбар хоосон байна! <br/>"
      }
      else
        jagsaalt.push(object);
    });

    muriinDugaar = 1;
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
    data.forEach((mur) => {
      muriinDugaar++;
      let object = new Khariltsagch();
      object.id = mur[usegTooruuKhurvuulekh(tolgoinObject.id)];
      object.ner = mur[usegTooruuKhurvuulekh(tolgoinObject.ner)];
      object.ovog = mur[usegTooruuKhurvuulekh(tolgoinObject.ovog)];
      object.register = mur[usegTooruuKhurvuulekh(tolgoinObject.register)];
      object.zakhirliinOvog = mur[usegTooruuKhurvuulekh(tolgoinObject.zakhirliinOvog)];
      object.zakhirliinNer = mur[usegTooruuKhurvuulekh(tolgoinObject.zakhirliinNer)];
      object.utas = [mur[usegTooruuKhurvuulekh(tolgoinObject.utas)]];
      object.mail = mur[usegTooruuKhurvuulekh(tolgoinObject.mail)];
      object.khayag = mur[usegTooruuKhurvuulekh(tolgoinObject.khayag)];
      object.turul = "ААН";
      object.baiguullagiinId = req.body.baiguullagiinId;
      object.barilgiinId = req.body.barilgiinId;
      if (!object.id || !object.ner || !object.register || !object.utas) {
        aldaaniiMsg = aldaaniiMsg + "ААН sheet-ны " + muriinDugaar + " дугаар мөрөнд ";
        if (!object.id)
          aldaaniiMsg = aldaaniiMsg + "'Код', "
        if (!object.ner)
          aldaaniiMsg = aldaaniiMsg + "'Нэр', "
        if (!object.register)
          aldaaniiMsg = aldaaniiMsg + "'Улсын бүртгэлийн дугаар', "
        if (!object.utas || !object.utas[0])
          aldaaniiMsg = aldaaniiMsg + "'Утас', "
        console.log("object", object);
        aldaaniiMsg = aldaaniiMsg.slice(0, -2)
        aldaaniiMsg = aldaaniiMsg + " "
        aldaaniiMsg = aldaaniiMsg + "талбар хоосон байна! <br/>"
      }
      else
        jagsaalt.push(object);
    });
    aldaaniiMsg = await khariltsagchBaikhguigShalgaya(jagsaalt, aldaaniiMsg, req.body.baiguullagiinId, req.body.barilgiinId);
    if (aldaaniiMsg) throw new aldaa(aldaaniiMsg);
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
