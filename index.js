const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const server = http.Server(app);
const io = require("socket.io")(server);
const cron = require("node-cron");
const dotenv = require("dotenv");
const { zuragPack } = require("zuragpack");

dotenv.config({ path: "./tokhirgoo/tokhirgoo.env" });

const baiguullagaRoute = require("./routes/baiguullagaRoute");
const ajiltanRoute = require("./routes/ajiltanRoute");
const licenseRoute = require("./routes/licenseRoute");
const tailanRoute = require("./routes/tailanRoute");
const zuragRoute = require("./routes/zuragRoute");
const gereeRoute = require("./routes/gereeRoute");
const gereeniiZagvarRoute = require("./routes/gereeniiZagvarRoute");
const talbaiRoute = require("./routes/talbaiRoute");
const khariltsagchRoute = require("./routes/khariltsagchRoute");
const bankniiGuilgeeRoute = require("./routes/bankniiGuilgeeRoute");
const nekhemjlekhiinZagvarRoute = require("./routes/nekhemjlekhiinZagvarRoute");
const ebarimtRoute = require("./routes/ebarimtRoute");
const medegdelRoute = require("./routes/medegdelRoute");
const mailRoute = require("./routes/mailRoute");
const dansRoute = require("./routes/dansRoute");
const zogsoolRoute = require("./routes/zogsoolRoute");
const zardalRoute = require("./routes/zardalRoute");
const surveyRoute = require("./routes/surveyRoute");
const togloomiinTuvRoute = require("./routes/togloomiinTuvRoute");
const daalgavarRoute = require("./routes/daalgavarRoute");
const zogsool = require("./controller/zogsool");
const cgw = require("./controller/cgw");
const tulbur = require("./controller/tulbur");
const ajiltanController = require("./controller/ajiltan");
const apiRoute = require("./routes/apiRoute");
const qpayRoute = require("./routes/qpayRoute");
const passRoute = require("./routes/passRoute");
const parkingRoute = require("./routes/parkingRoute");
const eventRoute = require("./routes/eventRoute");
const tasalbarRoute = require("./routes/tasalbarRoute");

const { db } = require("zevbackv2");

const aldaaBarigch = require("./middlewares/aldaaBarigch");
const {
  talbainKhariltsagchiinTuluvUurchilyu,
} = require("./controller/khariltsagch");
process.setMaxListeners(0);
process.env.UV_THREADPOOL_SIZE = 20;
//require("events").EventEmitter.prototype._maxListeners = 15;
//require("events").EventEmitter.defaultMaxListeners = 0;
server.listen(8081);

/*mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((result) => )
  .catch((err) => */

process.env.TZ = "Asia/Ulaanbaatar";
app.set("socketio", io);
app.use(cors());
app.use(
  express.json({
    limit: "50mb",
    extended: true,
  })
);

db.kholboltUusgey(app);

app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);

app.use(baiguullagaRoute);
app.use(ajiltanRoute);
app.use(licenseRoute);
app.use(tailanRoute);
app.use(gereeRoute);
app.use(gereeniiZagvarRoute);
app.use(talbaiRoute);
app.use(khariltsagchRoute);
app.use(bankniiGuilgeeRoute);
app.use(medegdelRoute);
app.use(zuragRoute);
app.use(ebarimtRoute);
app.use(mailRoute);
app.use(zogsoolRoute);
app.use(nekhemjlekhiinZagvarRoute);
app.use(dansRoute);
app.use(zardalRoute);
app.use(surveyRoute);
app.use(daalgavarRoute);
app.use(togloomiinTuvRoute);
app.use(apiRoute);
app.use(qpayRoute);
app.use(passRoute);
app.use(parkingRoute);
app.use(eventRoute);
app.use(tasalbarRoute);
zuragPack(app);

app.use(aldaaBarigch);

cron.schedule(
  "*/5 * * * * ",
  function () {
    cgw.bankniiKhuulgaTatajKhadgalya(null, null, null);
  },
  {
    scheduled: true,
    timezone: "Asia/Ulaanbaatar",
  }
);

// cron.schedule(
//   "59 23 * * *",
//   function () {
//     ebarimtRoute.ebarimtIlgeeye("6115f350b35689cdbf1b9da3");
//   },
//   {
//     scheduled: true,
//     timezone: "Asia/Ulaanbaatar",
//   }
// );

cron.schedule(
  "*/4 * * * * * ",
  function () {
    cgw.bankniiKhuulgaTatyaOirkhon();
  },
  {
    scheduled: true,
    timezone: "Asia/Ulaanbaatar",
  }
);

cron.schedule(
  "30 9 * * * ",
  function () {
    ajiltanController.orlogiinMsgIlgeeye("09:30");
  },
  {
    scheduled: true,
    timezone: "Asia/Ulaanbaatar",
  }
);

cron.schedule(
  "1 7 * * * ",
  function () {
    ajiltanController.orlogiinMsgIlgeeye("07:00");
  },
  {
    scheduled: true,
    timezone: "Asia/Ulaanbaatar",
  }
);
cron.schedule(
  "1 20 * * * ",
  function () {
    ajiltanController.orlogiinMsgIlgeeye("20:00");
  },
  {
    scheduled: true,
    timezone: "Asia/Ulaanbaatar",
  }
);
cron.schedule(
  "1 22 * * * ",
  function () {
    ajiltanController.orlogiinMsgIlgeeye("22:00");
  },
  {
    scheduled: true,
    timezone: "Asia/Ulaanbaatar",
  }
);

cron.schedule(
  "30 0 0 * * * ",
  async function () {
    tulbur.aldangiBodyo();
  },
  {
    scheduled: true,
    timezone: "Asia/Ulaanbaatar",
  }
);

cron.schedule(
  "02 10 * * * ",
  function () {
    zogsool.zogsoolMsgIlgeeye();
  },
  {
    scheduled: true,
    timezone: "Asia/Ulaanbaatar",
  }
);
// cron.schedule(
//   "50 59 23 * * * ",
//   function () {
//     zogsool.ebarimtDutuugShivye();
//   },
//   {
//     scheduled: true,
//     timezone: "Asia/Ulaanbaatar",
//   }
// );
cron.schedule(
  "30 13 * * * * ",
  function () {
    zogsool.zogsoolTseverlye();
  },
  {
    scheduled: true,
    timezone: "Asia/Ulaanbaatar",
  }
);
cron.schedule(
  "40 1 1 * * * ",
  function () {
    zogsool.zogsooloosUstgay();
  },
  {
    scheduled: true,
    timezone: "Asia/Ulaanbaatar",
  }
);

cron.schedule(
  "0 0 * * *",
  function () {
    zogsool.khungulultKhugatsaaShinechlya();
  },
  {
    scheduled: true,
    timezone: "Asia/Ulaanbaatar",
  }
);
/*
cron.schedule(
  "02 09 * * * ",
  function () {
    daalgavarRoute.tuluvluguuniiSanuulgaIlgeeye();
  },
  {
    scheduled: true,
    timezone: "Asia/Ulaanbaatar",
  }
);*/

cron.schedule(
  "02 00 * * * ",
  function () {
    tulbur.gereeAutomataarSungaya();
  },
  {
    scheduled: true,
    timezone: "Asia/Ulaanbaatar",
  }
);
cron.schedule(
  "32 2 * * *",
  function () {
    talbainKhariltsagchiinTuluvUurchilyu();
  },
  {
    scheduled: true,
    timezone: "Asia/Ulaanbaatar",
  }
);

cron.schedule(
  "*/5 * * * * * ",
  function () {
    cgw.dotorZogsoolDavhkardsanMashin(null, null, null);
  },
  {
    scheduled: true,
    timezone: "Asia/Ulaanbaatar",
  }
);

// cron.schedule(
//   "*/8 * * * * * ",
//   function () {
//     tulbur.tulultTaniya();
//   },
//   {
//     scheduled: true,
//     timezone: "Asia/Ulaanbaatar",
//   }
// );

// cron.schedule(
//   "*/6 * * * * * ",
//   function () {
//     cgw.togloomiinTuvDavkhardsanShalgakh(null, null, null);
//   },
//   {
//     scheduled: true,
//     timezone: "Asia/Ulaanbaatar",
//   }
// );

cron.schedule(
  "59 * * * * ",
  function () {
    gereeRoute.sarBuriinKhungulultBodoy();
  },
  {
    scheduled: true,
    timezone: "Asia/Ulaanbaatar",
  }
);

io.once("connection", (socket) => {
  socket.on("disconnect", () => {
  });
  socket.on("error", function (err) {
  });
});
