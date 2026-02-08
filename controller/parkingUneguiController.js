const parkingUneguiService = require("../service/parkingUneguiService");

exports.searchCarUnegui = async (req, res, next) => {
  try {
    const response = await parkingUneguiService.searchCarUnegui({
      plate_number: req.params.plate_number,
      baiguullagiinId: req.query.baiguullagiinId,
    });

    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};
