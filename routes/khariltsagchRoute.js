const express = require("express");
const multer = require("multer");
const router = express.Router();
const Khariltsagch = require("../models/khariltsagch");
const Geree = require("../models/geree");
//const { crud } = require("../components/crud");
//const { tokenShalgakh } = require("../middlewares/tokenShalgakh");
//const UstsanBarimt = require("../models/ustsanBarimt");
const { tokenShalgakh, crud, UstsanBarimt, khuudaslalt } = require("zevbackv2");
const storage = multer.memoryStorage();
const uploadFile = multer({ storage: storage });
const {
  dansniiUldegdelAvya,
  bankniiKhuulgaTatajKhadgalya,
  tdbUldegdelShalgay,
} = require("../controller/cgw");

const { qpayGargaya, qpayTulye } = require("../controller/qpay");

const {
  khariltsagchNevtrey,
  khariltsagchNuutsUgSolikh,
  sergeekhKodAvya,
  nuutsUgSergeeye,
  khariltsagchidTokenOnooyo,
  tokenoorKhariltsagchAvya,
} = require("../controller/khariltsagch");

const {
  khariltsagchiinTooAvya,
  khyanakhSambariinUgugdul,
} = require("../controller/toololt");

const {
  khariltsagchZagvarAvya,
  khariltsagchTatya,
} = require("../controller/excel");

crud(
  router,
  "khariltsagch",
  Khariltsagch,
  UstsanBarimt,
  async (req, res, next) => {
    try {
      const { db } = require("zevbackv2");
      if (!req.body.register && !req.body.customerTin)
        throw new Error(
          "Бүртгэлийн дугаар эсвэл Регистрийн дугаар бөглөнө үү!"
        );
      else {
        if (!!req.body.register) {
          var khariltsagch = await Khariltsagch(db.erunkhiiKholbolt).findOne({
            register: req.body.register,
            baiguullagiinId: req.body.baiguullagiinId,
            barilgiinId: req.body.barilgiinId,
          });
          if (khariltsagch)
            throw new Error(
              "Тухайн регистрийн дугаараар харилцагч бүртгэлтэй байна!"
            );
        }
        if (!!req.body.customerTin) {
          var khariltsagch = await Khariltsagch(db.erunkhiiKholbolt).findOne({
            customerTin: req.body.customerTin,
            baiguullagiinId: req.body.baiguullagiinId,
            barilgiinId: req.body.barilgiinId,
          });
          if (khariltsagch)
            throw new Error(
              "Тухайн бүртгэлийн дугаараар харилцагч бүртгэлтэй байна!"
            );
        }
      }
      next();
    } catch (error) {
      next(error);
    }
  }
);

router.route("/khariltsagchNevtrey").post(khariltsagchNevtrey);
router.route("/khariltsagchNuutsUgSolikh").post(khariltsagchNuutsUgSolikh);
router.route("/sergeekhKodAvya").post(sergeekhKodAvya);
router.route("/nuutsUgSergeeye").post(nuutsUgSergeeye);
router.route("/tokenoorKhariltsagchAvya").post(tokenoorKhariltsagchAvya);
router.route("/khariltsagchidTokenOnooyo").post(khariltsagchidTokenOnooyo);
router
  .route("/khariltsagchiinTooAvya/:barilgiinId")
  .get(tokenShalgakh, khariltsagchiinTooAvya);
router
  .route("/khyanakhSambariinUgugdul")
  .post(tokenShalgakh, khyanakhSambariinUgugdul);
router.route("/dansniiUldegdelAvya").post(tokenShalgakh, dansniiUldegdelAvya);
// router.route("/qpayGargaya").post(tokenShalgakh, qpayGargaya);
router.route("/qpayTulye/:baiguullagiinId/:barilgiinId/:dugaar").get(qpayTulye);
router
  .route("/bankniiKhuulgaTatajKhadgalya")
  .post(tokenShalgakh, bankniiKhuulgaTatajKhadgalya);
router.route("/tdbUldegdelShalgay").post(tokenShalgakh, tdbUldegdelShalgay);
router
  .route("/khariltsagchZagvarAvya")
  .get(tokenShalgakh, khariltsagchZagvarAvya);
router
  .route("/khariltsagchTatya")
  .post(uploadFile.single("file"), tokenShalgakh, khariltsagchTatya);
router
  .route("/khariltsagchUstgaya")
  .post(tokenShalgakh, async (req, res, next) => {
    try {
      const { db } = require("zevbackv2");
      Khariltsagch(db.erunkhiiKholbolt)
        .findOne({
          _id: req.body.id,
        })
        .then(async (result) => {
          var geree = await Geree(
            req.body.tukhainBaaziinKholbolt,
            true
          ).findOne({
            tuluv: 1,
            register: result.register,
            barilgiinId: result.barilgiinId,
            baiguullagiinId: result.baiguullagiinId,
          });
          if (geree)
            throw new Error(
              "Тухайн харилцагч дээр идэвхитэй гэрээ байгаа тул устгах боломжгүй!"
            );
          var barimt = new UstsanBarimt(req.body.tukhainBaaziinKholbolt)();
          barimt.class = "Khariltsagch";
          barimt.object = result;
          if (req.body.nevtersenAjiltniiToken) {
            barimt.ajiltniiNer = req.body.nevtersenAjiltniiToken.ner;
            barimt.ajiltniiId = req.body.nevtersenAjiltniiToken.id;
          }
          barimt.baiguullagiinId = req.body.baiguullagiinId;
          barimt.isNew = true;
          barimt.save();
          Khariltsagch(db.erunkhiiKholbolt)
            .deleteOne({
              _id: req.body.id,
            })
            .then((result1) => {
              res.send("Amjilttai");
            })
            .catch((err) => {
              next(err);
            });
        })
        .catch((err1) => {
          next(err1);
        });
    } catch (err2) {
      next(err2);
    }
  });

router.get(
  "/zogsoolBankniiGuilgeeJagsaalt",
  tokenShalgakh,
  async (req, res, next) => {
    try {
      const body = req.query;
      if (!!body?.query) body.query = JSON.parse(body.query);
      if (!!body?.order) body.order = JSON.parse(body.order);
      if (!!body?.khuudasniiDugaar)
        body.khuudasniiDugaar = Number(body.khuudasniiDugaar);
      if (!!body?.khuudasniiKhemjee)
        body.khuudasniiKhemjee = Number(body.khuudasniiKhemjee);
      if (!!body?.search) body.search = String(body.search);

      const dansniiDugaar = body.dansniiDugaar || body.query?.dansniiDugaar;
      const barilgiinId = body.barilgiinId || body.query?.barilgiinId;
      const baiguullagiinId =
        body.baiguullagiinId || body.query?.baiguullagiinId;

      if (!dansniiDugaar) {
        return res.status(400).send({
          success: false,
          aldaa: "dansniiDugaar required",
        });
      }

      // Check if dansniiDugaar exists in Parking's zogsooliinDans
      const parkingExists = await Parking(
        req.body.tukhainBaaziinKholbolt
      ).findOne({
        zogsooliinDans: dansniiDugaar,
        barilgiinId: barilgiinId,
        baiguullagiinId: baiguullagiinId,
      });

      console.log(
        `🔍 Parking check for dans ${dansniiDugaar}:`,
        parkingExists ? "Found" : "Not found"
      );

      // Only use archive if dansniiDugaar is found in Parking
      let collectionName = null;

      if (parkingExists) {
        const extractDate = (dateFilter, preferStart = true) => {
          if (!dateFilter) return null;

          if (preferStart && dateFilter.$gte) {
            return new Date(dateFilter.$gte);
          } else if (!preferStart && dateFilter.$lte) {
            return new Date(dateFilter.$lte);
          } else if (dateFilter.$gte) {
            return new Date(dateFilter.$gte);
          } else if (dateFilter.$lte) {
            return new Date(dateFilter.$lte);
          } else if (dateFilter.$eq) {
            return new Date(dateFilter.$eq);
          } else if (
            typeof dateFilter === "string" ||
            dateFilter instanceof Date
          ) {
            return new Date(dateFilter);
          }
          return null;
        };

        // Extract start and end dates
        let startDate = null;
        let endDate = null;

        if (body?.query) {
          // Check direct date fields
          if (body.query.TxDt) {
            startDate = extractDate(body.query.TxDt, true);
            endDate = extractDate(body.query.TxDt, false);
          } else if (body.query.tranDate) {
            startDate = extractDate(body.query.tranDate, true);
            endDate = extractDate(body.query.tranDate, false);
          }

          // Check in $and array
          if (!startDate && body.query.$and && Array.isArray(body.query.$and)) {
            for (const condition of body.query.$and) {
              // Look for $or with date conditions
              if (condition.$or && Array.isArray(condition.$or)) {
                for (const orCondition of condition.$or) {
                  if (orCondition.TxDt) {
                    startDate = extractDate(orCondition.TxDt, true);
                    endDate = extractDate(orCondition.TxDt, false);
                    break;
                  }
                  if (orCondition.tranDate) {
                    startDate = extractDate(orCondition.tranDate, true);
                    endDate = extractDate(orCondition.tranDate, false);
                    break;
                  }
                }
              }
              // Direct date in $and
              if (!startDate && condition.TxDt) {
                startDate = extractDate(condition.TxDt, true);
                endDate = extractDate(condition.TxDt, false);
              }
              if (!startDate && condition.tranDate) {
                startDate = extractDate(condition.tranDate, true);
                endDate = extractDate(condition.tranDate, false);
              }
              if (startDate) break;
            }
          }
        }

        // If only one date found, use it as both start and end
        if (startDate && !endDate) endDate = startDate;
        if (!startDate && endDate) startDate = endDate;

        // Determine which collections to query
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;

        const collectionsToQuery = [];

        if (startDate && !isNaN(startDate.getTime())) {
          const start = new Date(startDate);
          const end =
            endDate && !isNaN(endDate.getTime())
              ? new Date(endDate)
              : new Date(startDate);

          // Generate list of months between start and end
          const current = new Date(start.getFullYear(), start.getMonth(), 1);
          const endMonth = new Date(end.getFullYear(), end.getMonth(), 1);

          while (current <= endMonth) {
            const year = current.getFullYear();
            const month = current.getMonth() + 1;

            if (year === currentYear && month === currentMonth) {
              // Current month - use main collection
              collectionsToQuery.push({
                name: null,
                year,
                month,
                isCurrent: true,
              });
            } else {
              // Archived month
              const archiveName = `BankniiGuilgee${year}${String(
                month
              ).padStart(2, "0")}`;
              collectionsToQuery.push({
                name: archiveName,
                year,
                month,
                isCurrent: false,
              });
            }

            current.setMonth(current.getMonth() + 1);
          }

          console.log(
            `📂 Querying ${collectionsToQuery.length} BankniiGuilgee collection(s):`,
            collectionsToQuery.map((c) => c.name || "main")
          );
        }

        // If no date range found, just use main collection
        if (collectionsToQuery.length === 0) {
          collectionsToQuery.push({
            name: null,
            isCurrent: true,
          });
        }

        // Query all collections and merge results
        if (collectionsToQuery.length === 1) {
          // Single collection - use normal flow
          const model = collectionsToQuery[0].name
            ? BankniiGuilgee(
                req.body.tukhainBaaziinKholbolt,
                false,
                collectionsToQuery[0].name
              )
            : BankniiGuilgee(req.body.tukhainBaaziinKholbolt, true);

          khuudaslalt(model, body)
            .then((result) => {
              res.send(result);
            })
            .catch((err) => {
              next(err);
            });
        } else {
          // Multiple collections - need to merge
          try {
            const allResults = [];
            let totalCount = 0;

            // Query each collection
            for (const collection of collectionsToQuery) {
              const model = collection.name
                ? BankniiGuilgee(
                    req.body.tukhainBaaziinKholbolt,
                    false,
                    collection.name
                  )
                : BankniiGuilgee(req.body.tukhainBaaziinKholbolt, true);

              // Create a copy of body without pagination for individual queries
              const queryBody = { ...body };
              delete queryBody.khuudasniiDugaar;
              delete queryBody.khuudasniiKhemjee;

              const result = await khuudaslalt(model, queryBody);

              if (result.jagsaalt && result.jagsaalt.length > 0) {
                allResults.push(...result.jagsaalt);
              }
              totalCount += result.niitMur || 0;
            }

            // Apply sorting if specified
            if (body.order) {
              const sortField = Object.keys(body.order)[0];
              const sortOrder = body.order[sortField];
              allResults.sort((a, b) => {
                const aVal = a[sortField];
                const bVal = b[sortField];
                if (aVal < bVal) return sortOrder === 1 ? -1 : 1;
                if (aVal > bVal) return sortOrder === 1 ? 1 : -1;
                return 0;
              });
            }

            // Apply pagination
            const page = body.khuudasniiDugaar || 1;
            const limit = body.khuudasniiKhemjee || 500;
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedResults = allResults.slice(startIndex, endIndex);

            res.send({
              khuudasniiDugaar: page,
              khuudasniiKhemjee: limit,
              jagsaalt: paginatedResults,
              niitMur: totalCount,
              niitKhuudas: Math.ceil(totalCount / limit),
            });
          } catch (err) {
            next(err);
          }
        }
      } else {
        // dansniiDugaar NOT found in Parking - use regular BankniiGuilgee only
        console.log(`📂 Using regular BankniiGuilgee (dans not in Parking)`);

        const model = BankniiGuilgee(req.body.tukhainBaaziinKholbolt, true);

        khuudaslalt(model, body)
          .then((result) => {
            res.send(result);
          })
          .catch((err) => {
            next(err);
          });
      }
    } catch (error) {
      next(error);
    }
  }
);

router
  .route("/khariltsagchDavkhraarAvya")
  .post(tokenShalgakh, async (req, res, next) => {
    try {
      const { db } = require("zevbackv2");
      var davkhar = req.body.davkhar;
      var matchQuery = {
        baiguullagiinId: req.body.baiguullagiinId,
        barilgiinId: req.body.barilgiinId,
      };
      if (req.body.query) matchQuery = req.body.query;

      if (req.body.idevkhiteiEsekh == 1) {
        matchQuery.idevkhiteiEsekh = true;
      } else if (req.body.idevkhiteiEsekh == 0) {
        matchQuery.idevkhiteiEsekh = false;
      }

      var query = [
        {
          $match: matchQuery,
        },
      ];
      var result = [];
      var jagsaalt = await Khariltsagch(db.erunkhiiKholbolt).aggregate(query);

      if (jagsaalt?.length > 0) {
        var matchGeree = {
          baiguullagiinId: req.body.baiguullagiinId,
          barilgiinId: req.body.barilgiinId,
          gereeniiDugaar: { $exists: true },
          tuluv: { $nin: [-1] },
        };

        if (davkhar?.length > 0) {
          matchGeree["davkhar"] = { $in: davkhar };
        }

        query = [
          {
            $match: matchGeree,
          },
        ];

        var gereeResult = await Geree(
          req.body.tukhainBaaziinKholbolt,
          true
        ).aggregate(query);

        const parseTalbainDugaar = (talbainDugaar) => {
          if (!talbainDugaar || typeof talbainDugaar !== "string") {
            return [];
          }
          const trimmed = talbainDugaar.trim();
          if (!trimmed) {
            return [];
          }
          return trimmed
            .split(",")
            .map((t) => t.trim())
            .filter((t) => t.length > 0);
        };

        if (davkhar?.length > 0) {
          const tempKhariltsagch = [];
          for (const geree of gereeResult) {
            const filtered = tempKhariltsagch?.filter(
              (a) =>
                (!!a.register && geree.register === a.register) ||
                (!!a.register && geree.customerTin === a.register) ||
                (!!a.customerTin && geree.register === a.customerTin)
            );

            const talbainDugaarList = parseTalbainDugaar(geree.talbainDugaar);

            if (filtered?.length > 0) {
              const data = filtered[0];
              data.talbainDugaar = data.talbainDugaar || [];
              if (talbainDugaarList.length > 0) {
                data.talbainDugaar.push(...talbainDugaarList);
              }
              data.davkhar = data.davkhar || [];
              if (geree.davkhar) {
                data.davkhar.push(geree.davkhar);
              }
              data.gereenuud = data.gereenuud || [];
              data.gereenuud.push(geree);
            } else {
              const filteredData = jagsaalt?.filter(
                (a) =>
                  (!!a.register && geree.register === a.register) ||
                  (!!a.register && geree.customerTin === a.register) ||
                  (!!a.customerTin && geree.register === a.customerTin)
              );

              if (filteredData?.length > 0) {
                const data = { ...filteredData[0] };
                data.talbainDugaar = talbainDugaarList;
                data.davkhar = data.davkhar || [];
                if (geree.davkhar) {
                  data.davkhar.push(geree.davkhar);
                }
                data.gereenuud = data.gereenuud || [];
                data.gereenuud.push(geree);
                tempKhariltsagch.push(data);
              }
            }
          }
          result = tempKhariltsagch;
        } else {
          for await (const khariltsagch of jagsaalt) {
            var filteredGeree = gereeResult?.filter(
              (geree) =>
                (!!khariltsagch.register &&
                  geree.register === khariltsagch.register) ||
                (!!khariltsagch.register &&
                  geree.customerTin === khariltsagch.register) ||
                (!!khariltsagch.customerTin &&
                  geree.register === khariltsagch.customerTin)
            );

            for (const geree of filteredGeree) {
              // ЗАСВАР: Helper function ашиглах
              const talbainDugaarList = parseTalbainDugaar(geree.talbainDugaar);

              khariltsagch.talbainDugaar = khariltsagch.talbainDugaar || [];
              if (talbainDugaarList.length > 0) {
                khariltsagch.talbainDugaar.push(...talbainDugaarList);
              }
              khariltsagch.davkhar = khariltsagch.davkhar || [];
              if (geree.davkhar) {
                khariltsagch.davkhar.push(geree.davkhar);
              }
              khariltsagch.gereenuud = khariltsagch.gereenuud || [];
              khariltsagch.gereenuud.push(geree);
            }
          }
          result = jagsaalt;
        }
      }

      res.send(result);
    } catch (error) {
      next(error);
    }
  });

router
  .route("/khariltsagchInsert")
  .post(tokenShalgakh, async (req, res, next) => {
    try {
      const { db } = require("zevbackv2");
      var jagsaalt = [];
      var matchQuery = { baiguullagiinId: req.body.baiguullagiinId };
      if (!!req.body.barilgiinId)
        matchQuery["barilgiinId"] = req.body.barilgiinId;
      var resultTukhain = await Khariltsagch(db.erunkhiiKholbolt).find(
        matchQuery
      );
      if (resultTukhain?.length > 0) {
        for await (const data of resultTukhain) {
          matchQuery = {
            baiguullagiinId: req.body.baiguullagiinId,
            register: data?.register,
          };
          if (!!req.body.barilgiinId)
            matchQuery["barilgiinId"] = req.body.barilgiinId;
          var result = await Khariltsagch(req.body.tukhainBaaziinKholbolt).find(
            matchQuery
          );
          if (result?.length === 0) jagsaalt.push(data);
        }
      }
      Khariltsagch(req.body.tukhainBaaziinKholbolt).insertMany(
        jagsaalt,
        function (err) {
          if (err) {
            next(err);
          }
          res.status(200).send("Amjilttai");
        }
      );
    } catch (error) {
      next(error);
    }
  });

module.exports = router;
