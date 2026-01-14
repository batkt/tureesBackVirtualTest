const http = require("http");
const Baiguullaga = require("../models/baiguullaga");

async function aldaagIlgeeye(aldaa, req) {
  const { db } = require("zevbackv2");
  var baiguullaga = await Baiguullaga(db.erunkhiiKholbolt).findById(
    req.body.baiguullagiinId
  );

  const data = new TextEncoder().encode(
    JSON.stringify({
      system: "Turees",
      aldaa: aldaa.stack || aldaa.toString(), // ← Store full error for debugging
      aldaaniiMsg: aldaa.message || String(aldaa), // ← Already correct!
      aldaaniiKod: aldaa.code || aldaa.errno, // ← Add error code
      ognoo: new Date(),
      baiguullagiinNer: baiguullaga?.ner,
      baiguullagiinId: req.body.baiguullagiinId,
      burtgesenAjiltaniiId: req.body.nevtersenAjiltniiToken.id,
      burtgesenAjiltaniiNer: req.body.nevtersenAjiltniiToken.ner,
    })
  );

  const options = {
    hostname: "103.143.40.123",
    port: 8282,
    path: "/aldaa",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const request = http.request(options, (response) => {
    response.on("data", (d) => {});
  });

  request.on("error", (error) => {
    console.error("Failed to send error to logging service:", error);
  });

  request.write(data);
  request.end();
}

const aldaaBarigch = (err, req, res, next) => {
  try {
    // Add MORE logging to identify the source
    console.log("=== ALDAA BARIGCH ===");
    console.log("URL:", req.url); // ← Which endpoint?
    console.log("Method:", req.method); // ← GET/POST/PUT?
    console.log("Error type:", typeof err);
    console.log("Error message:", err.message);
    console.log("Error stack:", err.stack); // ← Where did the error originate?
    console.log("Error is Error object?", err instanceof Error);

    if (res.headersSent) {
      return next(err);
    }

    // Send error to logging service
    if (req.body && req.body.nevtersenAjiltniiToken) {
      aldaagIlgeeye(err, req).catch((logErr) => {
        console.error("Error in aldaagIlgeeye:", logErr);
      });
    }

    // Customize error messages
    let errorMessage = err.message;

    if (errorMessage && errorMessage.includes("indexTalbar_1 dup key")) {
      errorMessage = "Нэвтрэх нэр давхардаж байна!";
    } else if (
      errorMessage &&
      errorMessage.includes("connect ECONNREFUSED 103.143.40.123:8282")
    ) {
      errorMessage = "Лицензийн хэсэгтэй холбогдоход алдаа гарлаа!";
    }

    const response = {
      success: false,
      aldaa: errorMessage || "Алдаа гарлаа",
    };

    console.log("Sending response:", response);
    console.log("aldaa type:", typeof response.aldaa);

    res.status(err.kod || 500).json(response);
  } catch (error) {
    console.error("=== ERROR IN ALDAA BARIGCH ===");
    console.error("Caught error:", error);

    if (res.headersSent) {
      return next(error);
    }

    try {
      res.status(500).json({
        success: false,
        aldaa: error.message || "Алдаа гарлаа",
      });
    } catch (sendError) {
      console.error("=== FAILED TO SEND ERROR RESPONSE ===");
      console.error(sendError);
      if (!!next) next(error);
    }
  }
};

module.exports = aldaaBarigch;
