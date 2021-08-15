const aldaaBarigch = (err, req, res, next) => {
  if (err.message.includes("indexTalbar_1 dup key"))
    err.message = "Нэвтрэх нэр давхардаж байна!";
  console.log(err);
  res.status(err.kod || 500).json({
    success: false,
    aldaa: err.message,
  });
};

module.exports = aldaaBarigch;
