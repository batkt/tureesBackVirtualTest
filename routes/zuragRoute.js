const express = require("express");
const sharp = require("sharp");
const multer = require("multer");
const mimetype = require("mime");
const storage = multer.memoryStorage();
const fs = require("fs");
//const { tokenShalgakh } = require("../middlewares/tokenShalgakh");
const { tokenShalgakh } = require("zevbackv2");

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

const uploadFile = multer({
  storage: storage,
});

const router = express.Router();

router.post(
  "/zuragKhadgalya",
  upload.single("file"),
  tokenShalgakh,
  async (req, res, next) => {
    var turul = req.body.turul;
    var id = require("uuid").v1().toString();
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

router.post(
  "/fileKhadgalya",
  uploadFile.single("file"),
  tokenShalgakh,
  async (req, res, next) => {
    try {
      var turul = req.body.turul;
      var id = require("uuid").v1().toString();
      if (req.file) {
        fs.access("./file/", (err) => {
          if (err) {
            fs.mkdirSync("./file/");
          }
        });
        fs.access("./file/" + req.body.baiguullagiinId + "/", (err) => {
          if (err) {
            fs.mkdirSync("./file/" + req.body.baiguullagiinId + "/");
          }
        });
        fs.writeFile(
          "./file/" + req.body.baiguullagiinId + "/" + id,
          req.file.buffer,
          function (err, data) {
            if (err) {
              next(err);
            } else res.status(200).json({ id: id });
          }
        );
      } else throw new Error("Хадгалах file алга байна!");
    } catch (err) {
      next(err);
    }
  }
);
router.post(
  "/upload",
  upload.single("file"),
  tokenShalgakh,
  async (req, res, next) => {
    var turul = req.body.turul;
    var id = require("uuid").v1().toString();

    if (req.file) {
      try {
        fs.access("./tmp/", (err) => {
          if (err) fs.mkdirSync("./tmp/");
        });

        fs.access("./tmp/" + turul + "/", (err) => {
          if (err) fs.mkdirSync("./tmp/" + turul + "/");
        });

        fs.writeFile(
          "./tmp/" + turul + "/" + id,
          req.file.buffer,
          function (err) {
            if (err) {
              next(err);
            } else {
              res.status(200).json(id);
            }
          }
        );
      } catch (err) {
        next(err);
      }
    }
  }
);
router.get(
  "/zuragAvya/:turul/:baiguullagiinId/:zurgiinNer",
  (req, res, next) => {
    res.download(
      "./zurag/" +
        req.params.turul +
        "/" +
        req.params.baiguullagiinId +
        "/" +
        req.params.zurgiinNer,
      req.params.zurgiinNer,
      (err) => {
        if (err) next(err);
      }
    );
  }
);

router.get("/fileAvya/:baiguullagiinId/:id", (req, res, next) => {
  res.download(
    "./file/" + req.params.baiguullagiinId + "/" + req.params.id,
    req.params.id,
    (err) => {
      if (err) next(err);
    }
  );
});

module.exports = router;
