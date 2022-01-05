const express = require("express");
const app = express();
const mongoose = require("mongoose");
const http = require("http");
const cors = require("cors");
const server = http.Server(app);
const io = require("socket.io")(server);
const cron = require("node-cron");
const dotenv = require("dotenv");

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
const ebarimtRoute = require("./routes/ebarimtRoute");
const medegdelRoute = require("./routes/medegdelRoute");
const mailRoute = require("./routes/mailRoute");
const cgw = require("./controller/cgw");
const tulbur = require("./controller/tulbur");
const medegdel = require("./controller/medegdel");
const aldaaBarigch = require("./middlewares/aldaaBarigch");

const dbUrl =
  "mongodb://localhost:27017/turees?readPreference=primary&ssl=false";
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
  })
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
app.use(aldaaBarigch);

cron.schedule(
  "*/5 * * * * ",
  function () {
    console.log("xuulga tatlaa", new Date());
    cgw.bankniiKhuulgaTatajKhadgalya(
      {
        body: {
          baiguullagiinId: "6115f350b35689cdbf1b9da3",
          barilgiinId: "619e267fdd4835aa2c168b28",
          dansniiDugaar: "5129057717",
          ekhlekhOgnoo: "20210101",
          duusakhOgnoo: "20211231",
          khuudasniiKhemjee: 100,
          khuudasniiDugaar: 0,
        },
      },
      null,
      null
    );
    cgw.bankniiKhuulgaTatajKhadgalya(
      {
        body: {
          baiguullagiinId: "6115f350b35689cdbf1b9da3",
          barilgiinId: "619e267fdd4835aa2c168b28",
          dansniiDugaar: "5129062239",
          ekhlekhOgnoo: "20210101",
          duusakhOgnoo: "20211231",
          khuudasniiKhemjee: 100,
          khuudasniiDugaar: 0,
        },
      },
      null,
      null
    );
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
  },
  {
    scheduled: true,
    timezone: "Asia/Ulaanbaatar",
  }
);

cron.schedule(
  "16 12 * * * ",
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
  // socket.on('joinRoom', ({ ajiltan }) => {
  //   console.log("ug n irchixlee", ajiltan);
  //   medegdel.uruunuudOlyo(ajiltan, (uruunuud) => {
  //     console.log("uruunuud", uruunuud)
  //     if (uruunuud) {
  //       socket.join(uruunuud[0]._id);
  //       // Broadcast when a user connects
  //       socket.broadcast
  //         .to(uruunuud[0]._id)
  //         .emit(
  //           'message', 'has joined the chat'
  //         );
  //     }
  //   })
  // });
  socket.on("disconnect", () => {
    console.log("disconnected");
  });
});
