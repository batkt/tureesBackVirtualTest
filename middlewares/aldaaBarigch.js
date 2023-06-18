const http = require("http");

function aldaagIlgeeye(aldaa, req) {
  const data = new TextEncoder().encode(
    JSON.stringify({
      system: "Turees",
      aldaa: aldaa,
      aldaaniiMsg: aldaa.message,
      ognoo: new Date(),
      baiguullagiinId: req.body.baiguullagiinId,
      burtgesenAjiltaniiId: req.body.nevtersenAjiltniiToken.id,
      burtgesenAjiltaniiNer: req.body.nevtersenAjiltniiToken.ner,
    })
  );
  const options = {
    hostname: "127.0.0.1",
    port: 8282,
    path: "/aldaa",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };
  const request = http.request(options, (response) => {
    response.on("data", (d) => {
      if (response.statusCode == 200) {
        console.log(d);
        console.log("aldaag shidlee!");
      }
    });
  });
  request.on("error", (error) => {
    console.log("aldaag shidsengui!");
  });

  request.write(data);
  request.end();
}
const aldaaBarigch = (err, req, res, next) => {
  console.log("end irsen", req.body);
  if (req.body && req.body.nevtersenAjiltniiToken) aldaagIlgeeye(err, req);
  if (err.message.includes("indexTalbar_1 dup key"))
    err.message = "Нэвтрэх нэр давхардаж байна!";
  else if (err.message.includes("connect ECONNREFUSED 103.143.40.43:8282")) {
    err.message = " Лицензийн хэсэгтэй холбогдоход алдаа гарлаа!";
  }
  res.status(err.kod || 500).json({
    success: false,
    aldaa: err.message,
  });
};

module.exports = aldaaBarigch;
