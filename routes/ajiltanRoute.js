const express = require("express");
const router = express.Router();
const Ajiltan = require("../models/ajiltan");

const {
  crudWithFile
} = require('../components/crud');
const {
  tokenShalgakh
} = require("../middlewares/tokenShalgakh");

const {
  ajiltanNevtrey,
  tokenoorAjiltanAvya
} = require('../controller/ajiltan')

crudWithFile(router, 'ajiltan', Ajiltan, {
  fileZam: './zurag/ajiltan',
  fileName: 'zurag'
})

router.route("/ajiltanNevtrey").post(ajiltanNevtrey);

router.route("/tokenoorAjiltanAvya").post(tokenoorAjiltanAvya)

router.get("/ajiltniiZuragAvya/:baiguullaga/:ner", (req, res, next) => {
  const fileName = req.params.ner;
  const directoryPath = "zurag/ajiltan/" + req.params.baiguullaga + "/";
  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      next(err);
    }
  });
});

router.post('/ajiltandTokenOnooyo', tokenShalgakh, (req, res, next) => {
  try {
    let filter = {
      "_id": req.body.id
    }
    let update = {
      "firebaseToken": req.body.token
    }
    Ajiltan.findOneAndUpdate(filter, update)
      .then((result) => {
        res.send("Amjilttai")
      })
      .catch((err) => {
        next(err);
      });
  } catch (error) {
    next(error);
  }
});

module.exports = router;