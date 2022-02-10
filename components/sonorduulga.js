const Sonorduulga = require("../models/sonorduulga");
const {
    admin
} = require("../middlewares/firebase-config");

async function ilgeeye(io, medegdel) {
    let sonorduulga = new Sonorduulga();
    sonorduulga.baiguullagiinId = medegdel.baiguullagiinId;
    sonorduulga.barilgiinId = medegdel.barilgiinId;
    sonorduulga.turul = medegdel.turul;
    sonorduulga.ognoo = new Date();
    sonorduulga.object = medegdel;
    sonorduulga.save()
        .then((result) => {
            io.emit("baiguullaga" + medegdel.baiguullagiinId, medegdel);
        })
        .catch((err) => {
            console.log(err);
        });
}

async function sonorduulgauzsenbolgoyo(id) {
    const shuult = {
        "object.id": id
    }
    Sonorduulga.updateOne(shuult, { $set: { kharsanEsekh: true } }).then((res) => console.log(res));
}
module.exports = {
    ilgeeye,
    sonorduulgauzsenbolgoyo
}