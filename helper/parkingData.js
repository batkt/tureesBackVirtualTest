const moment = require("moment");

function buildResponseData(zogsool, mashin, plateNumber, bodsonDun) {
  const tuukh = mashin.tuukh?.[0];
  const tsag = tuukh?.tsagiinTuukh?.[0];

  return {
    baiguullagiinId: zogsool.baiguullagiinId,
    plate_number: plateNumber,
    enter_date: tsag?.orsonTsag
      ? moment(tsag.orsonTsag).format("YYYY/MM/DD HH:mm:ss")
      : null,
    pay_amount: bodsonDun,
    parking_id: zogsool._id,
    parking_name: zogsool.ner,
    parkingUndsenUne: zogsool.undsenUne,
    session_id: mashin._id,
    garsanCameraIP: tuukh?.garsanKhaalga,
    garsanTsag: tsag?.garsanTsag
      ? moment(tsag.garsanTsag).format("YYYY/MM/DD HH:mm:ss")
      : null,
  };
}

module.exports = { buildResponseData };
