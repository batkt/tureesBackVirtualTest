async function gereeAshiglakhguiSaruud(req, zardalAvlaga) {
  {
    try {
      if (!!zardalAvlaga && zardalAvlaga.ognoonuud?.length > 0) {
        var gereenuud = await Geree(req.body.tukhainBaaziinKholbolt).find({
          baiguullagiinId: req.body.baiguullagiinId,
          barilgiinId: req.body.barilgiinId,
          tuluv: 1,
          "zardluud._id": zardalAvlaga._id.toString(),
        });
        if (gereenuud.length > 0) {
          for (const geree of gereenuud) {
            console.log(" ---------------> " + zardalAvlaga.ner);
            console.log(" ------- 0 --------> " + zardalAvlaga.ognoonuud[0]);
            console.log(" ------- 1 --------> " + zardalAvlaga.ognoonuud[1]);
            await Geree(req.body.tukhainBaaziinKholbolt).findOneAndUpdate(
              { _id: geree._id },
              {
                $pull: {
                  "avlaga.guilgeenuud": {
                    turul: "avlaga",
                    tailbar: zardalAvlaga.ner,
                    ognoo: {
                      $gte: zardalAvlaga.ognoonuud[0],
                      $lte: zardalAvlaga.ognoonuud[1],
                    },
                  },
                },
              },
            );
          }
        }
      }
      res.send("Amjilttai");
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = { gereeAshiglakhguiSaruud };
