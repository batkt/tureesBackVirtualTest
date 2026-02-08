const asyncHandler = require("express-async-handler");
const parkingToki = require("../service/parkingToki");
exports.searchCarToki = asyncHandler(async (req, res) => {
  const { plate_number } = req.params;
  const query = req.query;
  const result = await parkingToki.searchCarToki({
    plateNumber: plate_number,
    query,
  });
  res.send(result);
});