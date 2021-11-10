const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.pluralize(null)
const baiguullagaSchema = new Schema({
    id: String,
    ner: String,
    khayag: String,
    mail: String,
    register: String,
    utas: String,
    zurgiinNer: String,
    barilguud: [
        {
            bairshil: {
                type: {
                    type: String,
                    enum: ['Point']
                },
                coordinates: {
                    type: [Number]
                }
            },
            ner: String,
            khayag: String,
            register: String,
            davkharuud: [
                {
                    davkhar: String,
                    tariff: Number
                }
            ]
        }
    ],
    davkhar: Number,
    talbai: Number,
}, {
    timestamps: true
});

module.exports = mongoose.model('baiguullaga', baiguullagaSchema);