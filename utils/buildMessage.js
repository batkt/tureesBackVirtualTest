const moment = require("moment");

exports.buildMessage = (uilchluulegch) => {
  const tuukh = uilchluulegch?.tuukh?.[0];
  const tsag = tuukh?.tsagiinTuukh?.[0];

  return {
    title: "Зогсоол",
    body: `
      <span>
        <div style="display:flex; justify-content:space-between">
          <p>Машин:</p>
          <p style="color:#999">${uilchluulegch.mashiniiDugaar}</p>
        </div>
        <div style="display:flex; justify-content:space-between">
          <p>Орсон:</p>
          <p style="color:#999">${moment(tsag?.orsonTsag).format("YYYY/MM/DD HH:mm:ss")}</p>
        </div>
        <div style="display:flex; justify-content:space-between">
          <p>Гарсан:</p>
          <p style="color:#999">${moment(tsag?.garsanTsag).format("YYYY/MM/DD HH:mm:ss")}</p>
        </div>
        <div style="display:flex; justify-content:space-between">
          <p>Хугацаа:</p>
          <p style="color:#999">${tuukh?.niitKhugatsaa} мин</p>
        </div>
        <div style="display:flex; justify-content:space-between">
          <p>Дүн:</p>
          <p style="font-weight:bold">${tuukh?.tulukhDun}</p>
        </div>
      </span>
    `,
  };
};