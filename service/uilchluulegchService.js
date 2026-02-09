const { Uilchluulegch, Parking, uilchluulegchGaraasBurtgey, uilchluulegchTseverliy, uilchluulegchdiinToo, zogsoolTusBurUilchluulegchdiinToo } = require("parking-v2");
const { khuudaslalt, UstsanBarimt } = require("zevbackv2");
const { delParkingFind } = require("../middlewares/parkingMiddle");

const extractDate = (dateFilter, preferStart = true) => {
  if (!dateFilter) return null;

  if (preferStart && dateFilter.$gte) return new Date(dateFilter.$gte);
  if (!preferStart && dateFilter.$lte) return new Date(dateFilter.$lte);
  if (dateFilter.$gte) return new Date(dateFilter.$gte);
  if (dateFilter.$lte) return new Date(dateFilter.$lte);
  if (dateFilter.$eq) return new Date(dateFilter.$eq);
  if (typeof dateFilter === "string" || dateFilter instanceof Date) return new Date(dateFilter);

  return null;
};

exports.getJagsaalt = async (body, baaziinKholbolt) => {
  // Query, order, pagination parsing
  if (body?.query) body.query = JSON.parse(body.query || "{}");
  if (body?.order) body.order = JSON.parse(body.order || "{}");
  if (body?.khuudasniiDugaar) body.khuudasniiDugaar = Number(body.khuudasniiDugaar);
  if (body?.khuudasniiKhemjee) body.khuudasniiKhemjee = Number(body.khuudasniiKhemjee);
  if (body?.search) body.search = String(body.search);

  // Date filtering
  let startDate = null, endDate = null, dateFilter = null;

  if (body.query) {
    dateFilter = body.query.createdAt || body.query["tuukh.tulbur.ognoo"];
    if (!dateFilter && body.query.$and) {
      for (const condition of body.query.$and) {
        if (condition.createdAt) { dateFilter = condition.createdAt; break; }
        if (condition["tuukh.tulbur.ognoo"]) { dateFilter = condition["tuukh.tulbur.ognoo"]; break; }
      }
    }
  }

  if (dateFilter) {
    startDate = extractDate(dateFilter, true);
    endDate = extractDate(dateFilter, false);
  }
  if (startDate && !endDate) endDate = startDate;
  if (!startDate && endDate) startDate = endDate;

  // Determine collections to query
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const collectionsToQuery = [];
  const addedCollections = new Set();

  if (startDate && !isNaN(startDate.getTime())) {
    const start = new Date(startDate);
    const end = endDate && !isNaN(endDate.getTime()) ? new Date(endDate) : new Date(startDate);

    const current = new Date(start.getFullYear(), start.getMonth(), 1);
    const endMonthDate = new Date(end.getFullYear(), end.getMonth(), 1);

    while (current <= endMonthDate) {
      const year = current.getFullYear();
      const month = current.getMonth() + 1;
      const isCurrentMonth = year === currentYear && month === currentMonth;

      const archiveName = `Uilchluulegch${year}${String(month).padStart(2, "0")}`;

      if (!addedCollections.has(archiveName)) {
        collectionsToQuery.push({ name: archiveName, year, month, isCurrent: isCurrentMonth });
        addedCollections.add(archiveName);
      }

      if (isCurrentMonth && !addedCollections.has("Uilchluulegch")) {
        collectionsToQuery.push({ name: null, year, month, isCurrent: true });
        addedCollections.add("Uilchluulegch");
      }

      current.setMonth(current.getMonth() + 1);
    }
  }

  if (collectionsToQuery.length === 0) collectionsToQuery.push({ name: null, isCurrent: true });

  const queryPromises = collectionsToQuery.map(async (collection) => {
    const model = collection.name
      ? Uilchluulegch(baaziinKholbolt, false, collection.name)
      : Uilchluulegch(baaziinKholbolt);

    const queryBody = { ...body, khuudasniiDugaar: 1, khuudasniiKhemjee: 999999 };

    try {
      const result = await khuudaslalt(model, queryBody);
      return result.jagsaalt || [];
    } catch (err) {
      console.error(`Error querying ${collection.name || "Uilchluulegch"}:`, err.message);
      return [];
    }
  });

  const allResults = (await Promise.all(queryPromises)).flat();

  // Sort if needed
  if (body.order && Object.keys(body.order).length > 0) {
    const sortField = Object.keys(body.order)[0];
    const sortOrder = body.order[sortField];

    allResults.sort((a, b) => {
      const getNestedValue = (obj, path) => path.split(".").reduce((curr, prop) => curr?.[prop], obj);
      const aVal = getNestedValue(a, sortField);
      const bVal = getNestedValue(b, sortField);
      if (aVal < bVal) return sortOrder === 1 ? -1 : 1;
      if (aVal > bVal) return sortOrder === 1 ? 1 : -1;
      return 0;
    });
  }

  // Pagination
  const originalPage = body.khuudasniiDugaar || 1;
  const originalLimit = body.khuudasniiKhemjee || 500;
  const startIndex = (originalPage - 1) * originalLimit;
  const endIndex = startIndex + originalLimit;

  return {
    khuudasniiDugaar: originalPage,
    khuudasniiKhemjee: originalLimit,
    jagsaalt: allResults.slice(startIndex, endIndex),
    niitMur: allResults.length,
    niitKhuudas: Math.ceil(allResults.length / originalLimit),
  };
};
exports.zogsoolJagsaalt = async (body, baaziinKholbolt) => {
  if (body?.query) body.query = JSON.parse(body.query);
  if (body?.order) body.order = JSON.parse(body.order);
  if (body?.khuudasniiDugaar)
    body.khuudasniiDugaar = Number(body.khuudasniiDugaar);
  if (body?.khuudasniiKhemjee)
    body.khuudasniiKhemjee = Number(body.khuudasniiKhemjee);
  if (body?.search) body.search = String(body.search);
  console.log("Zogsool Jagsaalt query:", body.query);
  await delParkingFind(body?.query?.baiguullagiinId);
  const model = Parking(baaziinKholbolt);
  return await khuudaslalt(model, body);
};

exports.zogsoolUstgah = async (body, baaziinKholbolt) => {
  const parkingModel = Parking(baaziinKholbolt);
  const oldData = await parkingModel.findOne({ _id: body.id });
  if (!oldData) {
    throw new Error("Зогсоол олдсонгүй");
  }
  const barimt = new (UstsanBarimt(baaziinKholbolt))();
  barimt.class = "Zogsool";
  barimt.object = oldData;
  if (body.nevtersenAjiltniiToken) {
    barimt.ajiltniiNer = body.nevtersenAjiltniiToken.ner;
    barimt.ajiltniiId = body.nevtersenAjiltniiToken.id;
  }
  barimt.baiguullagiinId = body.baiguullagiinId;
  barimt.isNew = true;
  await barimt.save();
  await parkingModel.deleteOne({ _id: body.id });
  return { message: "Amjilttai" };
};
exports.orlogoGaraasBurtgeh = async (utguud) => {
  if (!utguud.mashiniiDugaar) throw new Error("Машиний дугаар оруулна уу");
  if (!utguud.tulukhDun) throw new Error("Төлөх дүн оруулна уу");
  if (!utguud.orsonCamera) throw new Error("Орох камер бүртгэгдээгүй байна");
  if (!utguud.garsanCamera) throw new Error("Гарах камер бүртгэгдээгүй байна");

  // Шинэ орлого үүсгэх
  const result = await uilchluulegchGaraasBurtgey({ body: utguud });
  return result;
};
exports.tulburTulye = async (body) => {
  if (!Array.isArray(body.tulbur) || body.tulbur.length === 0) {
    throw new Error("Төлбөрийн мэдээлэл хоосон байна");
  }

  const guilgeenuud = body.tulbur;
  let tulburArray = [];
  let ebarimtAvakhDun = 0;

  guilgeenuud.forEach((guilgee) => {
    const ignoreTypes = [
      "khariult",
      "khungulult",
      "Соёолж Ц/Д",
      "Хөнгөлөлт/ 24 цаг",
      "Хөнгөлөлт/ 2 цаг",
      "Fitness",
    ];

    const isIgnored =
      ignoreTypes.includes(guilgee.turul) ||
      guilgee.turul?.includes("Божон") ||
      guilgee.turul?.includes("ugaalga");

    if (!isIgnored) ebarimtAvakhDun += guilgee.dun;

    tulburArray.push({
      ognoo: guilgee.ognoo,
      turul: guilgee.turul,
      dun: guilgee.dun,
    });
  });

  const uurchlukhTuluv = body.urdchilsan ? 0 : 1;

  await Uilchluulegch(body.tukhainBaaziinKholbolt).updateOne(
    {
      _id: body.id,
      tuukh: { $elemMatch: { zogsooliinId: guilgeenuud[0].zogsooliinId } },
    },
    {
      $set: {
        ebarimtAvakhDun: ebarimtAvakhDun,
        "tuukh.$.burtgesenAjiltaniiId": guilgeenuud[0].burtgesenAjiltaniiId,
        "tuukh.$.burtgesenAjiltaniiNer": guilgeenuud[0].burtgesenAjiltaniiNer,
        "tuukh.$.tulbur": tulburArray,
        "tuukh.$.tuluv": uurchlukhTuluv,
      },
    }
  );

  return "Amjilttai";
};
exports.tseverliy = async (body) => {
  const result = await uilchluulegchTseverliy(body);
  return result;
}
exports.ustgah = async (ids, conn) => {
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    throw new Error("ID заавал шаардлагатай");
  }
  const UilchluulegchModel = Uilchluulegch(conn);
  const oldData = await UilchluulegchModel.find({ _id: { $in: ids } });
  for (const doc of oldData) {
    const barimt = new (UstsanBarimt(conn))();
    barimt.class = "Uilchluulegch";
    barimt.object = doc;
    barimt.isNew = true;
    await barimt.save();
  }
  await UilchluulegchModel.deleteMany({ _id: { $in: ids } });
  
  return "Amjilttai";
};
exports.tooAvya = async (body) => {
  const result = await uilchluulegchdiinToo(body);
  return result;
}
exports.tusBuriinTooAvya = async (body) => {
  const result = await zogsoolTusBurUilchluulegchdiinToo(body);
  return result;
}