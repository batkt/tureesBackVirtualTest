const asyncHandler = require("express-async-handler");
const Ajiltan = require("../models/ajiltan");
const Baiguullaga = require("../models/baiguullaga");
const BankniiGuilgee = require("../models/bankniiGuilgee");
const NevtreltiinTuukh = require("../models/nevtreltiinTuukh");
const MsgTuukh = require("../models/msgTuukh");
const IpTuukh = require("../models/ipTuukh");
const BackTuukh = require("../models/backTuukh");
const aldaa = require("../components/aldaa");
const jwt = require("jsonwebtoken");
const request = require("request");
const axios = require("axios");
const fs = require("fs");
const moment = require("moment");
const useragent = require("express-useragent");
const http = require("http");
const lodash = require("lodash");
const { formatNumber } = require("zevbackv2");

function duusakhOgnooAvya(ugugdul, onFinish, next) {
  request.get(
    "http://103.143.40.43:8282/baiguullagiinDuusakhKhugatsaaAvya",
    { json: true, body: ugugdul },
    (err, res1, body) => {
      if (err) next(err);
      else {
        onFinish(body);
      }
    }
  );
}

async function nevtreltiinTuukhKhadgalya(tuukh, tukhainBaaziinKholbolt) {
  var ipTuukh = await IpTuukh(tukhainBaaziinKholbolt).findOne({ ip: tuukh.ip });
  if (ipTuukh) {
    tuukh.bairshilUls = ipTuukh.bairshilUls;
    tuukh.bairshilKhot = ipTuukh.bairshilKhot;
  } else if (tuukh.ip) {
    try {
      var axiosKhariu = await axios.get(
        "https://api.ipgeolocation.io/ipgeo?apiKey=8ee349f1c7304c379fdb6b855d1e9df4&ip=" +
          tuukh.ip.toString()
      );
      ipTuukh = new IpTuukh(tukhainBaaziinKholbolt)();
      ipTuukh.ognoo = new Date();
      ipTuukh.medeelel = axiosKhariu.data;
      ipTuukh.bairshilUls = axiosKhariu.data.country_name;
      ipTuukh.bairshilKhot = axiosKhariu.data.city;
      ipTuukh.ip = tuukh.ip;
      tuukh.bairshilUls = ipTuukh.bairshilUls;
      tuukh.bairshilKhot = ipTuukh.bairshilKhot;
      await ipTuukh.save();
    } catch (err) {}
  }
  await tuukh.save();
}

exports.ajiltanNevtrey = asyncHandler(async (req, res, next) => {
  const { db } = require("zevbackv2");
  const ajiltan = await Ajiltan(db.erunkhiiKholbolt)
    .findOne()
    .select("+nuutsUg")
    .where("nevtrekhNer")
    .equals(req.body.nevtrekhNer)
    .catch((err) => {
      next(err);
    });
  if (!ajiltan) throw new aldaa("Хэрэглэгчийн нэр эсвэл нууц үг буруу байна!");
  var ok = await ajiltan.passwordShalgaya(req.body.nuutsUg);
  if (!ok) throw new aldaa("Хэрэглэгчийн нэр эсвэл нууц үг буруу байна!");
  var baiguullaga = await Baiguullaga(db.erunkhiiKholbolt).findById(
    ajiltan.baiguullagiinId
  );
  var butsaakhObject = {
    result: ajiltan,
    success: true,
  };
  duusakhOgnooAvya(
    { register: baiguullaga.register },
    async (khariu) => {
      try {
        console.log("nevtrekhXariu Irlee");
        if (khariu.success) {
          if (khariu.duusakhOgnoo && new Date(khariu.duusakhOgnoo) < new Date())
            throw new aldaa("Лицензийн хугацаа дууссан байна!");
          const jwt = await ajiltan.tokenUusgeye(khariu.duusakhOgnoo);
          butsaakhObject.duusakhOgnoo = khariu.duusakhOgnoo;
          butsaakhObject.token = jwt;
          var source = req.headers["user-agent"];
          var ua = useragent.parse(source);
          var tuukh = new NevtreltiinTuukh(db.erunkhiiKholbolt)();
          console.log("tuukh", tuukh);
          tuukh.ajiltniiId = ajiltan._id;
          tuukh.ajiltniiNer = ajiltan.ner;
          tuukh.ognoo = new Date();
          tuukh.uildliinSystem = ua.os;
          tuukh.ip = req.headers["x-real-ip"];
          if (tuukh.ip && tuukh.ip.substr(0, 7) == "::ffff:") {
            tuukh.ip = tuukh.ip.substr(7);
          }
          ua = Object.keys(ua).reduce(function (r, e) {
            if (ua[e]) r[e] = ua[e];
            return r;
          }, {});
          tuukh.browser = ua.browser;
          tuukh.useragent = ua;
          tuukh.baiguullagiinId = ajiltan.baiguullagiinId;
          await nevtreltiinTuukhKhadgalya(tuukh, db.erunkhiiKholbolt);
          res.status(200).json(butsaakhObject);
        } else throw new Error(khariu.msg);
      } catch (err) {
        next(err);
      }
    },
    next
  );
});

async function khuuBodyo(dun, khuu) {
  var khuugiinNiitDun =
    (await Math.round((dun * khuu + Number.EPSILON) * 100)) / 100;
  return (
    (await Math.round((khuugiinNiitDun / 365 + Number.EPSILON) * 100)) / 100
  );
}

exports.backAvya = asyncHandler(async (req, res, next) => {
  try {
    var tukhainBaaziinKholbolt = req.body.tukhainBaaziinKholbolt;
    const { exec } = require("child_process");
    try {
      fs.unlinkSync("dump.tar");
      console.log("removed");
    } catch (err) {
      console.error(err);
    }
    const { db } = require("zevbackv2");
    var backupDB = exec(
      "mongodump --host=" +
        "localhost" +
        " --port=" +
        "27017" +
        " --db=" +
        tukhainBaaziinKholbolt.baaziinNer +
        " --archive=dump.tar" +
        "  --gzip",
      (err, stdout, stderr) => {
        console.log("err -->", err);
        console.log("stdout -->", stdout);
        console.log("stderr -->", stderr);
        if (err) {
          console.error(`exec error: ${err}`);
          res.send(err);
        }
        if (stdout) {
          console.error(`exec stdout: ${stdout}`);
          if (stdout.includes("error"))
            res.send(new Error("Back авах боломжгүй байна!"));
          else {
            if (!fs.existsSync("file/tmp/dump.tar"))
              res.send(new Error("Back авах боломжгүй байна!"));
            var path = require("path");
            res.sendFile(path.resolve("file/tmp/dump.tar"), function (err) {
              if (err) {
                console.log("err", err);
                next(err);
              } else {
                next();
              }
            });
          }
        }
        if (stderr) {
          console.error(`exec stderr: ${stderr}`);
          if (stderr.includes("error"))
            res.send(new Error("Back авах боломжгүй байна!"));
          else {
            if (!fs.existsSync("dump.tar"))
              res.send(new Error("Back авах боломжгүй байна!"));
            var path = require("path");
            var stats = fs.statSync("dump.tar");
            var fileSizeInBytes = stats.size;
            var fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
            var source = req.headers["user-agent"];
            var ua = useragent.parse(source);
            var tuukh = new BackTuukh(db.erunkhiiKholbolt)();
            tuukh.ajiltniiId = req.body.nevtersenAjiltniiToken.id;
            tuukh.ajiltniiNer = req.body.nevtersenAjiltniiToken.ner;
            tuukh.ognoo = new Date();
            tuukh.ip = req.ip;
            if (tuukh.ip.substr(0, 7) == "::ffff:") {
              tuukh.ip = tuukh.ip.substr(7);
            }
            ua = Object.keys(ua).reduce(function (r, e) {
              if (ua[e]) r[e] = ua[e];
              return r;
            }, {});
            tuukh.useragent = ua;
            tuukh.khemjee = fileSizeInMegabytes;
            tuukh.baiguullagiinId = req.body.baiguullagiinId;
            tuukh.save();
            res.sendFile(path.resolve("dump.tar"), function (err) {
              if (err) {
                console.log("err", err);
                next(err);
              } else {
                next();
              }
            });
          }
        }
      }
    );
  } catch (error) {
    next(error);
  }
});

exports.tokenoorAjiltanAvya = asyncHandler(async (req, res, next) => {
  try {
    const { db } = require("zevbackv2");
    if (!req.headers.authorization) {
      throw new Error("Энэ үйлдлийг хийх эрх байхгүй байна!", 401);
    }
    const token = req.headers.authorization.split(" ")[1];
    const tokenObject = jwt.verify(token, process.env.APP_SECRET, 401);
    console.log(tokenObject);
    if (tokenObject.id == "zochin")
      throw new Error("Энэ үйлдлийг хийх эрх байхгүй байна!", 401);
    console.log("tokenObject", tokenObject);
    Ajiltan(db.erunkhiiKholbolt)
      .findById(tokenObject.id)
      .then((urDun) => {
        var urdunJson = urDun.toJSON();
        urdunJson.duusakhOgnoo = tokenObject.duusakhOgnoo;
        res.send(urdunJson);
      })
      .catch((err) => {
        console.log("aldaa");
        next(err);
      });
  } catch (error) {
    next(error);
  }
});

exports.erkhiinMedeelelAvya = asyncHandler(async (req, res, next) => {
  try {
    const { db } = require("zevbackv2");
    var baiguullaga = await Baiguullaga(db.erunkhiiKholbolt).findById(
      req.body.baiguullagiinId
    );
    console.log("baiguullaga", baiguullaga);
    if (!baiguullaga) throw new Error("Байгууллагын мэдээлэл олдсонгүй!");
    request.post(
      "http://103.143.40.43:8282/erkhiinMedeelelAvya",
      { json: true, body: { register: baiguullaga.register } },
      (err, res1, body) => {
        if (err) next(err);
        else {
          res.send(body);
        }
      }
    );
  } catch (error) {
    next(error);
  }
});

function msgIlgeeye(
  jagsaalt,
  key,
  dugaar,
  khariu,
  index,
  tukhainBaaziinKholbolt,
  baiguullagiinId
) {
  try {
    url =
      process.env.MSG_SERVER +
      "/send" +
      "?key=" +
      key +
      "&from=" +
      dugaar +
      "&to=" +
      jagsaalt[index].to.toString() +
      "&text=" +
      jagsaalt[index].text.toString();
    url =
      process.env.MSG_SERVER +
      "/send" +
      "?key=" +
      key +
      "&from=" +
      dugaar +
      "&to=" +
      jagsaalt[index].to.toString() +
      "&text=" +
      jagsaalt[index].text.toString();
    url = encodeURI(url);
    request(url, { json: true }, (err1, res1, body) => {
      if (err1) {
        console.log("url", url);
        next(err1);
      } else {
        var msg = new MsgTuukh(tukhainBaaziinKholbolt)();
        msg.baiguullagiinId = baiguullagiinId;
        msg.dugaar = jagsaalt[index].to;
        msg.gereeniiId = jagsaalt[index].gereeniiId;
        msg.msg = jagsaalt[index].text;
        msg.save();
        if (jagsaalt.length > index + 1) {
          console.log("url", url);
          console.log("body", body);
          khariu.push(body[0]);
          msgIlgeeye(
            jagsaalt,
            key,
            dugaar,
            khariu,
            index + 1,
            tukhainBaaziinKholbolt,
            baiguullagiinId
          );
        } else {
          console.log("url", url);
          khariu.push(body[0]);
        }
      }
    });
  } catch (err) {
    next(err);
  }
}
exports.orlogiinMsgIlgeeye = asyncHandler(async () => {
  try {
    const { db } = require("zevbackv2");
    var baiguullaga = await Baiguullaga(db.erunkhiiKholbolt).findOne({
      register: "6481523",
    });
    var ekhlekhOgnoo = new Date(Date.now() - 86400000);
    var duusakhOgnoo = new Date(Date.now() - 86400000);
    ekhlekhOgnoo.setHours(0, 0, 0, 0);
    duusakhOgnoo.setHours(23, 59, 59, 999);
    var kholboltuud = db.kholboltuud;
    var kholbolt = kholboltuud.find(
      (a) => a.baiguullagiinId == baiguullaga._id
    );
    let query = [
      {
        $match: {
          $or: [
            {
              $and: [
                {
                  TxDt: {
                    $gte: ekhlekhOgnoo,
                    $lte: duusakhOgnoo,
                  },
                },
                {
                  Amt: {
                    $gt: 0,
                  },
                },
              ],
            },
            {
              $and: [
                {
                  tranDate: {
                    $gte: ekhlekhOgnoo,
                    $lte: duusakhOgnoo,
                  },
                },
                {
                  amount: {
                    $gt: 0,
                  },
                },
              ],
            },
          ],
        },
      },
      {
        $project: {
          barilgiinId: "$barilgiinId",
          dun: { $ifNull: ["$Amt", "$amount"] },
        },
      },
      {
        $group: {
          _id: "$barilgiinId",
          dun: {
            $sum: "$dun",
          },
        },
      },
    ];
    var result = await BankniiGuilgee(kholbolt).aggregate(query);
    if (result && result.length > 0) {
      var msgIlgeekhKey;
      var msgIlgeekhDugaar;
      try {
        msgIlgeekhKey = baiguullaga.tokhirgoo.msgIlgeekhKey;
        msgIlgeekhDugaar = baiguullaga.tokhirgoo.msgIlgeekhDugaar;
      } catch (error) {
        console.log("msg tokhirgoo bxgui");
      }
      var niitDun = lodash.sumBy(result, function (object) {
        return object.dun;
      });
      var text =
        "Rently systemd " +
        moment(ekhlekhOgnoo).format("MM/DD") +
        " udur " +
        (await formatNumber(niitDun)) +
        "₮ orlogo burtgegdej ";

      for await (const a of result) {
        var barilgiinNer = "";
        try {
          barilgiinNer = baiguullaga.barilguud.find((x) => x._id == a._id).ner;
        } catch (aldaa) {}
        if (barilgiinNer == "Их наяд плаза") barilgiinNer = "Ikhnayd plaza";
        else if (barilgiinNer == "Цэцэг Төв") barilgiinNer = "Tsetseg tuv";
        else if (barilgiinNer == "Шинэ тэрэг плаза")
          barilgiinNer = "Shine tereg plaza";
        else if (barilgiinNer == "Их наяд Tower")
          barilgiinNer = "Ikhnayd zuun undur";
        text =
          text + barilgiinNer + " - " + (await formatNumber(a.dun)) + "₮, ";
      }
      text = text.slice(0, -2);
      text = text + " tus tus orlogo orson baina.";
      console.log("text", text);
      msgIlgeeye(
        [
          {
            to: "95230516",
            text,
          },
        ],
        msgIlgeekhKey,
        msgIlgeekhDugaar,
        [],
        0,
        kholbolt,
        baiguullaga._id
      );
    }
  } catch (error) {
    next(error);
  }
});
