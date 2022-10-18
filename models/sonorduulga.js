const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.pluralize(null)
const sonorduulgaSchema = new Schema({
    id: String,
    ognoo: Date,
    ajiltniiId: String,
    khariltsagchiinId: String,
    baiguullagiinId: String,
    khuleenAvagchiinId: String,
    barilgiinId: String,
    turul: String,
    title: String,
    message: String,
    kharsanEsekh: Boolean,
    object: Schema.Types.Mixed
},
    { timestamps: true });

module.exports = mongoose.model('sonorduulga', sonorduulgaSchema);