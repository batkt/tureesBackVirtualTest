const { tokenShalgakh } = require("../middlewares/tokenShalgakh");
const fs = require("fs");
const khuudaslalt = require("./khuudaslalt");
const multer = require("multer");
const sharp = require("sharp");
const storage = multer.memoryStorage();

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

async function fileUpload(path, baiguullagiinId, req, data, next) {
  try {
    await fs.access(`${path}`, (err) => {
      if (err) {
        fs.mkdirSync(`${path}`);
      }
    });
    await fs.access(`${path}/${baiguullagiinId}`, (err) => {
      if (err) {
        fs.mkdirSync(`${path}/${baiguullagiinId}`);
      }
    });
    await sharp(req.file.buffer)
      .resize({
        fit: "contain",
      })
      .toFile(`${path}/${baiguullagiinId}/${req.body.ner}`)
      .then(() => {
        data.zurgiinNer = req.body.ner;
      });
  } catch (error) {
    next(error);
  }
}

function crud(router, modelName, Model) {
  router.post(`/${modelName}`, tokenShalgakh, async (req, res, next) => {
    try {
      const data = new Model(req.body);
      data
        .save()
        .then((result) => {
          res.send("Amjilttai");
        })
        .catch((err) => {
          next(err);
        });
    } catch (error) {
      next(error);
    }
  });
  router.put(`/${modelName}/:id`, tokenShalgakh, async (req, res, next) => {
    try {
      const data = new Model(req.body);
      Model.findByIdAndUpdate(
        {
          _id: req.params.id,
        },
        data
      )
        .then((result) => {
          res.send("Amjilttai");
        })
        .catch((err) => {
          next(err);
        });
    } catch (error) {
      next(error);
    }
  });

  router.get(`/${modelName}`, tokenShalgakh, async (req, res, next) => {
    try {
      const body = req.query;
      if (!!body?.query) body.query = JSON.parse(body.query);
      khuudaslalt(Model, body)
        .then((result) => {
          res.send(result);
        })
        .catch((err) => {
          next(err);
        });
    } catch (error) {
      next(error);
    }
  });
  router.get(`/${modelName}/:id`, tokenShalgakh, async (req, res, next) => {
    try {
      Model.findOne({
        _id: req.params.id,
      })
        .then((result) => {
          res.send(result);
        })
        .catch((err) => {
          next(err);
        });
    } catch (error) {
      next(error);
    }
  });
  router.delete(`/${modelName}/:id`, tokenShalgakh, async (req, res, next) => {
    try {
      Model.deleteOne({
        _id: req.params.id,
      })
        .then((result) => {
          res.send("Amjilttai");
        })
        .catch((err) => {
          next(err);
        });
    } catch (error) {
      next(error);
    }
  });
}

function crudWithFile(
  router,
  modelName,
  Model,
  fileProp = {
    fileName: "",
    fileZam: "",
  }
) {
  router.post(
    `/${modelName}`,
    tokenShalgakh,
    upload.single(fileProp.fileName),
    async (req, res, next) => {
      try {
        const data = new Model(req.body);
        if (req.file)
          await fileUpload(
            fileProp.fileZam,
            data.baiguullagiinId,
            req,
            data,
            next
          );
        data
          .save()
          .then((result) => {
            res.send("Amjilttai");
          })
          .catch((err) => {
            next(err);
          });
      } catch (error) {
        next(error);
      }
    }
  );
  router.put(
    `/${modelName}/:id`,
    tokenShalgakh,
    upload.single(fileProp.fileName),
    async (req, res, next) => {
      try {
        const data = new Model(req.body);
        if (req.file)
          await fileUpload(
            fileProp.fileZam,
            data.baiguullagiinId,
            req,
            data,
            next
          );
        Model.findByIdAndUpdate(
          {
            _id: req.params.id,
          },
          data
        )
          .then((result) => {
            res.send("Amjilttai");
          })
          .catch((err) => {
            next(err);
          });
      } catch (error) {
        next(error);
      }
    }
  );
  router.get(`/${modelName}`, tokenShalgakh, async (req, res, next) => {
    try {
      const body = req.query;
      if (!!body?.query) body.query = JSON.parse(body.query);
      khuudaslalt(Model, body)
        .then((result) => {
          res.send(result);
        })
        .catch((err) => {
          next(err);
        });
    } catch (error) {
      next(error);
    }
  });
  router.get(`/${modelName}/:id`, tokenShalgakh, async (req, res, next) => {
    try {
      Model.findOne({
        _id: req.params.id,
      })
        .then((result) => {
          res.send(result);
        })
        .catch((err) => {
          next(err);
        });
    } catch (error) {
      next(error);
    }
  });
  router.delete(`/${modelName}/:id`, tokenShalgakh, async (req, res, next) => {
    try {
      Model.deleteOne({
        _id: req.params.id,
      })
        .then((result) => {
          res.send(result);
        })
        .catch((err) => {
          next(err);
        });
    } catch (error) {
      next(error);
    }
  });
}
module.exports = {
  crud,
  crudWithFile,
};
