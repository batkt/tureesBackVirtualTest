const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const ajiltanSchema = new Schema(
  {
    id: String,
    ner: String,
    ovog: String,
    utas: String,
    mail: String,
    nuutsUg: {
      type: String,
      select: false,
    },
    register: String,
    tsonkhniiErkhuud: [String],
    barilguud: [String],
    zogsoolKhaalga: [String],
    tuukh: [
      {
        barilgiinId: String,
        ekhelsenOgnoo: Date,
        duussanOgnoo: Date,
      },
    ],
    khayag: String,
    ajildOrsonOgnoo: Date,
    baiguullagiinId: String,
    baiguullagiinNer: String,
    erkh: String,
    firebaseToken: String,
    albanTushaal: String,
    zurgiinId: String,
    nevtrekhNer: String,
    zogsoolNer: String,
    indexTalbar: {
      type: String,
      unique: true,
    },
    tokhirgoo: {
      gereeKharakhErkh: [String], //barilgiin id-nuud
      gereeZasakhErkh: [String],
      gereeSungakhErkh: [String],
      gereeSergeekhErkh: [String],
      gereeTsutslakhErkh: [String],
      umkhunSaraarKhungulultEsekh: [String],
      guilgeeUstgakhErkh: [String],
      guilgeeKhiikhEsekh: [String],
      aldangiinUldegdelZasakhEsekh: [String],
      khungulultUzuulekhEsekh: [String],
      m2UneTokhiruulakhEsekh: [String],
      zogsoolNegtgelDunKharakhEsekh: Boolean,
      togloomiinTuvNegtgelDunKharakhEsekh: Boolean,
      zogsooliinKhungulultEsekh: Boolean,
      mashniiDugaarZasakhEsekh: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

ajiltanSchema.index({
  $nevtrekhNer: "text",
  mail: 1,
});
ajiltanSchema.methods.tokenUusgeye = function (duusakhOgnoo, salbaruud = null) {
  const token = jwt.sign(
    {
      id: this._id,
      ner: this.ner,
      baiguullagiinId: this.baiguullagiinId,
      salbaruud,
      duusakhOgnoo: duusakhOgnoo,
    },
    process.env.APP_SECRET,
    {
      expiresIn:
        this.baiguullagiinId == "656f165ef28cde7f62bc3604" ||
        this.baiguullagiinId == "6698c657c26994f4e0f8de62" ||
        this.baiguullagiinId == "6731b43bc23730ac1908da2d" ||
        this.baiguullagiinId == "6115f350b35689cdbf1b9da3" ||
        this.baiguullagiinId == "670f3437b41a478195dd3d4b" ||
        this.baiguullagiinId == "66d90703344b0b96a65ef1a4" ||
        this.baiguullagiinId == "67dfebe55b92ee004ba43ad2" ||
        this.baiguullagiinId == "67b5a998b72a35321ebdbd87" ||
        this.baiguullagiinId == "6800b91480a007fe5ab34436" ||
        this.baiguullagiinId == "682ee56b9be2cfa362f99888" ||
        this.baiguullagiinId == "674044a9640d59bcf2ee6c5b" ||
        this.baiguullagiinId == "68abc22410228a7454bdf5e9" ||
        this.baiguullagiinId == "612f457d185280db676d0b51"
          ? "7d"
          : "12h",
    }
  );
  return token;
};

ajiltanSchema.methods.khugatsaaguiTokenUusgeye = function () {
  const token = jwt.sign(
    {
      id: this._id,
      ner: this.ner,
      baiguullagiinId: this.baiguullagiinId,
    },
    process.env.APP_SECRET,
    {}
  );
  return token;
};

ajiltanSchema.methods.zochinTokenUusgye = function (
  baiguullagiinId,
  gishuunEsekh
) {
  const token = jwt.sign(
    {
      id: "zochin",
      baiguullagiinId,
    },
    process.env.APP_SECRET,
    gishuunEsekh
      ? {
          expiresIn: "12h",
        }
      : {
          expiresIn: "1h",
        }
  );
  return token;
};
ajiltanSchema.pre("save", async function () {
  this.indexTalbar = this.register + this.nevtrekhNer;
  const salt = await bcrypt.genSalt(12);
  this.nuutsUg = await bcrypt.hash(this.nuutsUg, salt);
});

ajiltanSchema.pre("updateOne", async function () {
  this.indexTalbar = this._update.register + this._update.nevtrekhNer;
  const salt = await bcrypt.genSalt(12);
  if (this._update.nuutsUg)
    this._update.nuutsUg = await bcrypt.hash(this._update.nuutsUg, salt);
});

ajiltanSchema.methods.passwordShalgaya = async function (pass) {
  return await bcrypt.compare(pass, this.nuutsUg);
};

//const AjiltanModel = mongoose.model("ajiltan", ajiltanSchema);
/*AjiltanModel.estimatedDocumentCount().then((count) => {
  
  if (count == 0) {
    AjiltanModel.create(
      new AjiltanModel({
        ner: "Admin",
        nevtrekhNer: "Admin",
        utas: "Admin",
        mail: "Admin",
        erkh: "Admin",
        register: "Admin",
        albanTushaal: "Admin",
        baiguullagiinId: "62bbb00140b7dd4f39c99e64",
        nuutsUg: "123",
      })
    );
  }
});*/

module.exports = function a(conn) {
  if (!conn || !conn.kholbolt)
    throw new Error("Холболтын мэдээлэл заавал бөглөх шаардлагатай!");
  conn = conn.kholbolt;
  return conn.model("ajiltan", ajiltanSchema);
};
//module.exports = AjiltanModel;
