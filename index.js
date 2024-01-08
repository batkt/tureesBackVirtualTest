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
const parkingRoute = require("./routes/parkingRoute");
const eventRoute = require("./routes/eventRoute");
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
  .catch((err) => console.log(err));*/

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
app.use(parkingRoute);
app.use(eventRoute);
zuragPack(app);

app.use(aldaaBarigch);

cron.schedule(
  "*/5 * * * * ",
  function () {
    // console.log("xuulga tatlaa", new Date());
    cgw.bankniiKhuulgaTatajKhadgalya(null, null, null);
  },
  {
    scheduled: true,
    timezone: "Asia/Ulaanbaatar",
  }
);

cron.schedule(
  "59 23 * * *",
  function () {
    console.log("ebarimt ilgeelee", new Date());
    ebarimtRoute.ebarimtIlgeeye("6115f350b35689cdbf1b9da3");
  },
  {
    scheduled: true,
    timezone: "Asia/Ulaanbaatar",
  }
);

cron.schedule(
  "*/3 * * * * * ",
  function () {
    // console.log("xuulga tatlaa", new Date());
    cgw.bankniiKhuulgaTatyaOirkhon();
  },
  {
    scheduled: true,
    timezone: "Asia/Ulaanbaatar",
  }
);

cron.schedule(
  "0 7 * * * ",
  function () {
    ajiltanController.orlogiinMsgIlgeeye();
  },
  {
    scheduled: true,
    timezone: "Asia/Ulaanbaatar",
  }
);

cron.schedule(
  "1,6,11,16,21,26,31,36,41,46,51,56 * * * * ",
  function () {
    tulbur.tulultTaniya();
    zogsool.tulburZooyo();
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
  "12 * * * * ",
  function () {
    zogsool.mashinTaniya();
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

io.once("connection", (socket) => {
  console.log("connected");
  socket.on("disconnect", () => {
    console.log("disconnected");
  });
});
