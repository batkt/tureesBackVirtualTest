const asyncHandler = require("express-async-handler");
const searchCar = require("../service/searchCar");
exports.searchCarQR = asyncHandler(async (req, res) => {
  const { plate_number } = req.params;
  const query = req.query;
  const result = await searchCar.searchCar({
    plateNumber: plate_number,
    query,
  });
  res.send(result);
});