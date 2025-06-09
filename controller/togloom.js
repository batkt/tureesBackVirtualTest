const asyncHandler = require("express-async-handler");
const Baiguullaga = require("../models/baiguullaga");
const TogloomiinTuv = require("../models/togloomiinTuv");

exports.togloomiinTuvDavkhardsan = asyncHandler(async () => {
  try 
  {
    const { db } = require("zevbackv2");
    var baiguullaguud = await Baiguullaga(db.erunkhiiKholbolt).find({"tokhirgoo.togloomiinTuvDavkhardsanShalgakh": { $exists: true, } });
    var result = [];
    if(baiguullaguud?.length > 0)
    {
      for await (const baiguullaga of baiguullaguud) {
        var kholboltuud = db.kholboltuud;
        var kholbolt = kholboltuud.find((a) => a.baiguullagiinId == baiguullaga._id.toString());
        for await (const barilga of baiguullaga.barilguud) {
          var match = {
            baiguullagiinId: baiguullaga._id.toString(),
            barilgiinId: barilga._id.toString(),
            niitDun: { $gt: 0 },
            tuluv: {
              $ne: -1,
            },
          }
          var query = [
            {
              $match: match,
            },
            {
              $unwind: "$niitTulbur"
            },
            {
              $match: { 
                "niitTulbur.turul": { $nin: ["khariult"] },
              }
            },
            {
              $group: {
                _id: { 
                  id: "$_id", 
                  niitDun: "$niitDun",
                },
                tulbur: {
                  $sum: "$niitTulbur.dun",
                },
              },
            }
          ]
          const togloomuud = await TogloomiinTuv(kholbolt).aggregate(query);
          for await (const togloom of togloomuud) {
            if(togloom.tulbur > togloom._id?.niitDun)
            {
              var data = await TogloomiinTuv(kholbolt).findById(togloom._id?.id);
              data.niitTulbur?.shift();
              data.tulbur?.shift();
              TogloomiinTuv(kholbolt)
                .findByIdAndUpdate({ _id: togloom._id?.id }, [
                  {
                    $set: {
                      niitTulbur: data.niitTulbur,
                      tulbur: data.tulbur,
                    },
                  },
                ])
              .catch((err) => {
                throw err;
              });
              result.push(togloom);
            }
          }
        }
      }
    }
    console.log("-------------> =---------------->" + JSON.stringify(result));
  }
  catch (err) {
    console.log("------------- error ---------------->" + err);
	  throw err;
  }
});
  