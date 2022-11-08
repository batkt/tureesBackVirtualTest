const express = require("express");
const router = express.Router();
const Ajiltan = require("../models/ajiltan");
//const UstsanBarimt = require("../models/ustsanBarimt");
const { tokenShalgakh, crudWithFile, UstsanBarimt } = require("zevback");
const fs = require('fs');
const {
  ajiltanNevtrey,
  tokenoorAjiltanAvya
} = require('../controller/ajiltan');
const aldaa = require("../components/aldaa");

crudWithFile(router, 'ajiltan', Ajiltan, {
  fileZam: './zurag/ajiltan',
  fileName: 'zurag'
}, UstsanBarimt, async (req, res, next) => {
  try {
    if (req.params.id) {
      var ObjectId = require('mongodb').ObjectId;
      var ajiltan = await Ajiltan.findOne({ nevtrekhNer: req.body.nevtrekhNer, _id: { $ne: ObjectId(req.params.id) } });
      if (ajiltan)
        throw new Error("Нэвтрэх нэр давхардаж байна!");
    }
    else {
      if (req.body.nevtrekhNer) {
        var ajiltan = await Ajiltan.findOne({ nevtrekhNer: req.body.nevtrekhNer });
        if (ajiltan)
          throw new Error("Нэвтрэх нэр давхардаж байна!");
      }
    }
    next();
  } catch (error) {
    next(error);
  }
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

router.get("/ustsanBarimt", tokenShalgakh, async (req, res, next) => {
  try {
    const body = req.query;
    const {
      query = {},
      order,
      khuudasniiDugaar = 1,
      khuudasniiKhemjee = 10,
      search,
      collation = {},
      select = {},
    } = body;
    if (!!body?.query) body.query = JSON.parse(body.query);
    if (req.body.baiguullagiinId) {
      if (!body.query)
        body.query = {}
      body.query["baiguullagiinId"] = req.body.baiguullagiinId
    }
    if (!!body?.order) body.order = JSON.parse(body.order);
    if (!!body?.select) body.select = JSON.parse(body.select);
    if (!!body?.collation) body.collation = JSON.parse(body.collation);
    if (!!body?.khuudasniiDugaar) body.khuudasniiDugaar = Number(body.khuudasniiDugaar);
    if (!!body?.khuudasniiKhemjee) body.khuudasniiKhemjee = Number(body.khuudasniiKhemjee);
    console.log("body", body)
    let jagsaalt = await UstsanBarimt
      .find(body.query)
      .sort(body.order)
      .collation(body.collation ? body.collation : {})
      .skip((body.khuudasniiDugaar - 1) * body.khuudasniiKhemjee)
      .limit(body.khuudasniiKhemjee);
    console.log("jagsaalt", jagsaalt)
    let niitMur = await UstsanBarimt.countDocuments(body.query);
    let niitKhuudas =
      niitMur % khuudasniiKhemjee == 0
        ? Math.floor(niitMur / khuudasniiKhemjee)
        : Math.floor(niitMur / khuudasniiKhemjee) + 1;
    if (jagsaalt != null) jagsaalt.forEach((mur) => (mur.key = mur._id));
    res.send({
      khuudasniiDugaar,
      khuudasniiKhemjee,
      jagsaalt,
      niitMur,
      niitKhuudas,
    })
  } catch (error) {
    next(error);
  }

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

router.post('/ajiltniiTokhirgooZasya', tokenShalgakh, async (req, res, next) => {
  try {
    if (!!req.body) {
      const { turul, ajiltnuud } = req.body
      for await (const ajiltan of ajiltnuud) {
        await Ajiltan.findOneAndUpdate({ _id: ajiltan._id }, { $set: { [turul]: ajiltan.utga } })
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

router.post('/ajiltandErkhUgyu/:id', tokenShalgakh, async (req, res, next) => {
  try {
    if (!!req.body) {
      await Ajiltan.findOneAndUpdate({ _id: req.params.id }, { $set: req.body })
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

router.post('/erkhteiEsekh', tokenShalgakh, async (req, res, next) => {
  try {
    if (!!req.body.zam) {
      const khariu = await Ajiltan.countDocuments({ _id: req.body.nevtersenAjiltniiToken?.id, $or: [{ tsonkhniiErkhuud: req.body.zam }, { erkh: 'Admin' }] })
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

router.post('/backAvya', async (req, res, next) => {
  try {
    const { spawn } = require('child_process')

    try {
      fs.unlinkSync("file/tmp/dump.tar")
      console.log("removed")
      //file removed
    } catch (err) {
      console.error(err)
    }
    let backupProcess = spawn('mongodump', [
      '--host', 'localhost',
      '--port', '27017',
      '--db', 'turees',
      '--archive', './file/tmp/dump.tar',
      '--gzip'
    ], { shell: true });

    backupProcess.on('exit', (code, signal) => {
      if (code)
        console.log('Backup process exited with code ', code);
      else if (signal)
        console.error('Backup process was killed with singal ', signal);
      else {
        var options = {
          root: "file/tmp"
        };
        res.sendFile("dump.tar", options, function (err) {
          if (err) {
            next(err);
          } else {
            next();
          }
        });
      }
    });

    /*var backupDB = exec('mongodump --host=' + "localhost" + ' --port=' + "27017" + ' --db=' + "itgel" + ' --archive=' + "file/tmp" + '/' + "dump.tar" + '.gz  --gzip',
      (err, stdout, stderr) => {
        if (err) {
          console.error(`exec error: ${err}`);
          res.send(err);
        }
        if (stdout) {
          console.error(`exec stdout: ${stdout}`);
          res.send(stdout);
        }
        if (stderr) {
          console.error(`exec stderr: ${stderr}`);
          res.send(stderr);
        }
      })*/

    /*        console.log(`Number of files ${stdout}`););
        backupDB.stdout.on('data', function (data) {
          console.log('stdout: ' + data);// process output will be displayed here
          res.send(data);
        });
        backupDB.stderr.on('err', function (data) {
          console.error('err: ' + data);// process output will be displayed here
          res.send(data);
        })*/
    /*var backup = require('mongodb-backup');
    backup({
      uri: 'mongodb://localhost:27017/itgel', // mongodb://<dbuser>:<dbpassword>@<dbdomain>.mongolab.com:<dbport>/<dbdatabase>
      root: "file/tmp/",
      tar: 'dump.tar.gz',
      stream: res,
      /*callback: async () => {
        var options = {
          root: "file/tmp"
        };
        res.sendFile("dump.tar", options, function (err) {
          if (err) {
            next(err);
          } else {
            next();
          }
        });
    }
    });*/
  } catch (error) {
    next(error);
  }
})


module.exports = router;