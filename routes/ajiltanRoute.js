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
} = require('../controller/ajiltan');
const aldaa = require("../components/aldaa");

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

router.post('/ajiltniiTokhirgooZasya',tokenShalgakh,async (req, res, next) => {
  try {
    if(!!req.body)
      {
        const {turul,ajiltnuud} = req.body
        for await (const ajiltan of ajiltnuud)
        {
          await Ajiltan.findOneAndUpdate({_id:ajiltan._id}, {$set:{[turul]:ajiltan.utga}})
          .catch((err) => {
            next(err);
          });
        }
        res.send("Amjilttai")
      }
    else
      next(new aldaa("Засах боломжгүй байна"))
  } catch (error) {
    next(error);
  }
});

router.post('/ajiltandErkhUgyu/:id',tokenShalgakh,async (req, res, next) => {
  try {
    if(!!req.body)
      {
        await Ajiltan.findOneAndUpdate({_id:req.params.id}, {$set:req.body})
          .catch((err) => {
            next(err);
          });
          res.send("Amjilttai")
      }
    else
      next(new aldaa("Засах боломжгүй байна"))
  } catch (error) {
    next(error);
  }
})

router.post('/erkhteiEsekh',tokenShalgakh,async (req, res, next) => {
  try {
    if(!!req.body.zam)
      {
        const khariu = await Ajiltan.countDocuments({_id:req.body.nevtersenAjiltniiToken?.id,$or:[{tsonkhniiErkhuud:{ $regex: `${req.body.zam}.*`,$options: "i" }},{erkh:'Admin'}]})
          .catch((err) => {
            next(err);
          });
        res.send(!!khariu)
      }
    else
      next(new aldaa("Засах боломжгүй байна"))
  } catch (error) {
    next(error);
  }
})



module.exports = router;