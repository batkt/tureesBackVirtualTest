const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const dansSchema = new Schema({
  dugaar: Number,
  dansniiNer:String,
  baiguullagiinId: String,
  barilgiinId: String,
  bank: String,
  valyut:String,
  corporateAshiglakhEsekh:Boolean,
  corporateNevtrekhNer:{
    select:false,
    type:String
  },
  corporateNuutsUg:{
    select:false,
    type:String
  },
  corporateGuilgeeniiNuutsUg:{
    select:false,
    type:String
  },
}, {
  timestamps: true
});

module.exports = mongoose.model("dans", dansSchema);