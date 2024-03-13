const FormData = require("form-data");
const axios = require("axios");
const fs = require("fs");

module.exports.backAvya = async function backAvya() {
  try {
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
        " --archive=dump.tar" +
        "  --gzip",
      (err, stdout, stderr) => {
        console.log("err -->", err);
        console.log("stdout -->", stdout);
        console.log("stderr -->", stderr);
        if (stderr) {
          console.error(`exec stderr: ${stderr}`);
          if (stderr.includes("error"))
            throw new Error("Back авах боломжгүй байна! exec aldaa");
          else {
            if (!fs.existsSync("dump.tar"))
              throw new Error("Back авах боломжгүй байна! exists aldaa");

            const form = new FormData();
            form.append("system", "turees");
            form.append("ognoo", new Date().toString());
            form.append("file", fs.createReadStream("dump.tar"));
            axios({
              method: "post",
              url: "http://103.143.40.90:4873", // Assuming 'url' is defined elsewhere
              data: form,
              headers: { ...form.getHeaders() },
            })
              .then((response) => {
                console.log("backup response", response);
                // Handle response
              })
              .catch((error) => {
                console.log("backup error", error);
                // Handle error
              });
          }
        }
      }
    );
  } catch (err) {
    console.log("back awxad aldaa ==>", err);
  }
};
