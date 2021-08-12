const aldaaBarigch = (err, req, res, next) => {
    if (err.message.includes("register_1 dup key"))
        err.message = "Регистрийн дугаараар ажилтан бүртгэлтэй байна!";
    else if (err.message.includes("zakhialgiinDugaar_1 dup key"))
        err.message = "Захиалгийн дугаар давхардаж байна!";
    else if (err.message.includes("utas_1 dup key"))
        err.message = "Утасны дугаар давхардаж байна!";
    else if (err.message.includes("mail_1 dup key"))
        err.message = "Мэйл хаяг давхардаж байна!";
    else if (err.message.includes("davtagdashguiId_1 dup key")) {
        err.message = err.keyValue.davtagdashguiId.replace(req.body.baiguullagiinId, "") + " кодтой бараа бүртгэгдсэн байна!";
    }
    console.log(err);
    res.status(err.kod || 500).json({
        success: false,
        aldaa: err.message
    })
};

module.exports = aldaaBarigch;