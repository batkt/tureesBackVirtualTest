const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.pluralize(null)
const khariltsagchSchema = new Schema({
    id: String,
    ner: String,
    ovog: String,
    utas: String,
    mail: String,
    register: String,
    firebaseToken: String,
    turul: String,
    khungulukhKhuvi: Number,
    nuutsUg: {
        type: String,
        default: "123"
    },
    zurgiinNer: String,
    baiguullaguud: [String]
}, {
    timestamps: true
});

module.exports = mongoose.model('khariltsagch', khariltsagchSchema);