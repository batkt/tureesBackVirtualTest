const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.pluralize(null)
const setgegdelSchema = new Schema({
    ognoo: Date,
    ajiltniiId: String,
    ajiltniiNer: String,
    baiguullagiinId: String,
    barilgiinId: String,
    daalgavriinId: String,
    message: String
},
    { timestamps: true });

module.exports = mongoose.model('setgegdel', setgegdelSchema);