const fs = require("fs");
const mongoose = require("mongoose");
const Baraa = require("../models/baraa");

async function khadgalya(List, next) {
    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        var turObject;
        var data;
        var khadgalakhData;
        try {
            for (item in List) {
                turObject = List[item];
                if (Array.isArray(turObject.data))
                    for (element in turObject.data) {
                        data = turObject.data[element];
                        console.log("data", data);
                        if (Array.isArray(data))
                            for (a in data) {
                                khadgalakhData = data[a];
                                console.log("a", khadgalakhData);
                                if ((typeof khadgalakhData) != "string" && (typeof khadgalakhData) != "number")
                                    await turObject.turul.updateOne({ _id: khadgalakhData._id }, khadgalakhData, { upsert: true });
                            }
                        else
                            if ((typeof data) != "string" && (typeof data) != "number")
                                await turObject.turul.updateOne({ _id: data._id }, data, { upsert: true });
                    }
                else
                    if ((typeof turObject.data) != "string" && (typeof turObject.data) != "number")
                        await turObject.turul.updateOne({ _id: turObject._id }, turObject.data, { upsert: true });
            }
            await session.commitTransaction();
            session.endSession();
        }
        catch (err1) {
            console.log("err1", err1);
            await session.abortTransaction();
            next(err1);
        }
    } catch (error) {
        next(error);
    }
}

module.exports = { khadgalya }