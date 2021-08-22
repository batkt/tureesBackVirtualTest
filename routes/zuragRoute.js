const express = require("express");
const sharp = require("sharp");
const multer = require("multer");
const mimetype = require("mime");
const storage = multer.memoryStorage();
const fs = require("fs");

const filter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png"
  )
    cb(null, true);
  else cb(null, false);
};
const upload = multer({
  storage: storage,
  fileFilter: filter,
});

const router = express.Router();

router.post(
  "/zuragKhadgalya",
  upload.single("file"),
  async (req, res, next) => {
    var turul = req.body.turul;
    var id = require("uuid").v1().toString();
    console.log("id", id);
    if (req.file)
      try {
        fs.access("./zurag/", (err) => {
          if (err) {
            fs.mkdirSync("./zurag/");
          }
        });
        fs.access("./zurag/" + turul + "/", (err) => {
          if (err) {
            fs.mkdirSync("./zurag/" + turul + "/");
          }
        });
        fs.access(
          "./zurag/" + turul + "/" + req.body.baiguullagiinId + "/",
          (err) => {
            if (err) {
              fs.mkdirSync(
                "./zurag/" + turul + "/" + req.body.baiguullagiinId + "/"
              );
            }
          }
        );
        sharp(req.file.buffer)
          .resize({
            fit: "contain",
          })
          .toFile(
            "./zurag/" + turul + "/" + req.body.baiguullagiinId + "/" + id
          )
          .then(() => {
            res.status(200).json({ id: id });
          });
      } catch (err) {
        next(err);
      }
  }
);

router.get("/zuragAvya", (req, res, next) => {
  res.download(
    "./zurag/" +
      req.body.turul +
      "/" +
      req.body.baiguullagiinId +
      "/" +
      req.body.id,
    req.body.id,
    (err) => {
      if (err) next(err);
    }
  );
});

module.exports = router;
