const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const baiguullagaSchema = new Schema(
  {
    id: String,
    ner: String,
    khayag: String,
    mail: [String],
    register: String,
    utas: String,
    zurgiinNer: String,
    barilguud: [
      {
        bairshil: {
          type: {
            type: String,
            enum: ["Point"],
          },
          coordinates: {
            type: [Number],
          },
        },
        ner: String,
        khayag: String,
        register: String,
        davkharuud: [
          {
            davkhar: String,
            tariff: Number,
          },
        ],
      },
    ],
    davkhar: Number,
    talbai: Number,
    tokhirgoo: {
      /**Жилийн эцэсээр гэрээ хаах бол 12 гэж байна ИХ Наяд дээр бүх гэрээ жилийн эцэст хаагддаг учир ийл тохиргоо авлаа */
      gereeDuusgakhSar: Number,

      /**Хөнгөлөлт ажилтан харгалзахгүй өгөх боломж олгоно */
      bukhAjiltanKhungulultOruulakhEsekh: Boolean,

      /**Тухайн байгууллагын хөнгөлж болох дээд хувь байна */
      deedKhungulultiinKhuvi: Number,

      /**Гэрээний хугацаа дуусах үед автоматаар сунгах эсэх */
      gereeAvtomataarSungakhEsekh: Boolean,

      /**Гэрээ засах эрх бүх ажилтанд олгох эсэх */
      bukhAjiltanGereendZasvarOruulakhEsekh: Boolean,
      /**Системд И Баримт ашиглах эсэх */
      eBarimtAshiglakhEsekh: Boolean,
      msgIlgeekhKey: String,
      msgIlgeekhDugaar: String,
      qpayUsername: String,
      qpayPassword: String,
      qpayInvoiceCode: String,
    },
    SUKH: {
      tseverUsKhaluun: Number,
      tseverUsKhuiten: Number,
      bokhirUs: Number,
      khaluunUsKhalaasanDulaan: Number,
      usniiSuuriKhuraamj: Number,
      khalaalt: Number,
      dulaaniiSuuriKhuraamj: Number,
    },
    erkhuud: [
      {
        zam: String,
        ner: String,
        tailbar: String,
        tokhirgoo: [
          {
            utga: String,
            ner: String,
            tailbar: String,
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("baiguullaga", baiguullagaSchema);
