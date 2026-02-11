const axios = require("axios");

async function ebarimtDuudya(ugugdul, shine = false) {
  if (!shine) {
    throw new Error("ИБаримт dll холболт хийгдээгүй байна!");
  }

  let url;

  if (
    ugugdul.baiguullagiinId == "612f457d185280db676d0b51" ||
    ugugdul.baiguullagiinId == "695c57511a8a4aebc1d65b02"
  ) {
    url = process.env.EBARIMTSHINE_TEST + "rest/receipt";
  } else {
    url = process.env.EBARIMTSHINE_IP + "rest/receipt";
  }

  const { data } = await axios.post(url, ugugdul, {
    timeout: 15000,
  });

  return data;
}

module.exports = { ebarimtDuudya };
