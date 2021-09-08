const asyncHandler = require("express-async-handler");
const Ajiltan = require("../models/ajiltan");
const Baiguullaga = require("../models/baiguullaga");
const aldaa = require("../components/aldaa");
const jwt = require("jsonwebtoken");
const http = require("http");

function duusakhOgnooAvya(ugugdul) {
  const data = new TextEncoder().encode(JSON.stringify(ugugdul));
  const options = {
    hostname: "127.0.0.1",
    port: 8282,
    path: "/baiguullagiinDuusakhKhugatsaaAvya",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  const request = http.request(options, (response) => {
    response.on("data", (d) => {
      if (response.statusCode == 200) return d;
    });
  });

  request.
  on("error", (error) => {
    throw new aldaa(error);
  });

  request.write(data);
  request.end();
}

exports.ajiltanNevtrey = asyncHandler(async (req, res, next) => {
  const ajiltan = await Ajiltan.findOne()
    .select("+nuutsUg")
    .where("nevtrekhNer")
    .equals(req.body.nevtrekhNer)
    .catch((err) => {
      next(err);
    });
  if (!ajiltan) throw new aldaa("Хэрэглэгчийн нэр эсвэл нууц үг буруу байна!");
  var ok = await ajiltan.passwordShalgaya(req.body.nuutsUg);
  if (!ok) throw new aldaa("Хэрэглэгчийн нэр эсвэл нууц үг буруу байна!");
  var baiguullaga = await Baiguullaga.findById(ajiltan.baiguullagiinId);
  let duusakhOgnoo = await duusakhOgnooAvya({"register" : baiguullaga.register});
  const jwt = ajiltan.tokenUusgeye(duusakhOgnoo);
  res.status(200).json({
    duusakhOgnoo: duusakhOgnoo,
    success: true,
    token: jwt,
    result: ajiltan,
  });
});

exports.tokenoorAjiltanAvya = asyncHandler(async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      throw new Error("Энэ үйлдлийг хийх эрх байхгүй байна!", 401);
    }
    const token = req.headers.authorization.split(" ")[1];
    const tokenObject = jwt.verify(token, "tokenUusgexTest0123", 401);
    console.log(tokenObject);
    if (tokenObject.id == "zochin")
      throw new Error("Энэ үйлдлийг хийх эрх байхгүй байна!", 401);
    console.log("tokenObject", tokenObject);
    Ajiltan.findById(tokenObject.id)
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
