const aldaaBarigch = (err, req, res, next) => {
    console.log(err);
    res.status(err.kod || 500).json({
        success: false,
        aldaa: err.message
    })
};

module.exports = aldaaBarigch;