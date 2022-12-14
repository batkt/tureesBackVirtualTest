const express = require("express");
const app = express();
const mongoose = require("mongoose");
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
const daalgavarRoute = require("./routes/daalgavarRoute");
const zogsool = require("./controller/zogsool");
const cgw = require("./controller/cgw");
const tulbur = require("./controller/tulbur");

const aldaaBarigch = require("./middlewares/aldaaBarigch");
const dbUrl = process.env.BAAZ;
mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((result) => server.listen(8081))
  .catch((err) => console.log(err));

process.env.TZ = "Asia/Ulaanbaatar";
app.set("socketio", io);
app.use(cors());
app.use(
  express.json({
    limit: "50mb",
    extended: true,
  })
);

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
zuragPack(app);

app.use(aldaaBarigch);

cron.schedule(
  "*/5 * * * * ",
  function () {
    console.log("xuulga tatlaa", new Date());
    cgw.bankniiKhuulgaTatajKhadgalya(null, null, null);
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

io.on("connection", (socket) => {
  console.log("connected");
  socket.on("disconnect", () => {
    console.log("disconnected");
  });
});
