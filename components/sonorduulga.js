const Sonorduulga = require("../models/sonorduulga");
const Ajiltan = require("../models/ajiltan");
const {
    admin
} = require("../middleware/firebase-config");

async function ajiltan(io, zakhialga) {
    let sonorduulga = new Sonorduulga();
    sonorduulga.ajiltniiId = zakhialga.ajiltniiId;
    sonorduulga.baiguullagiinId = zakhialga.baiguullagiinId;
    sonorduulga.ognoo = new Date();
    sonorduulga.turul = 'sonorduulga';
    sonorduulga.object = zakhialga;
    sonorduulga.save()
        .then((result) => {
            io.emit("ajiltan" + zakhialga.ajiltniiId, zakhialga);
        })
        .catch((err) => {
            console.log(err);
        });
    Ajiltan.findById(zakhialga.ajiltniiId).then((result) => {
        if (result.firebaseToken) {
            const payload = {
                notification: {
                    title: "Таньд ажил хувиарлагдлаа!",
                    body: zakhialga.mashiniiDugaar + " дугаартай машин",
                    icon: "default",
                    sound: 'default',
                    badge: '1',
                }
            };
            const options = {
                priority: "high",
                timeToLive: 60 * 60 * 24
            };
            admin.messaging().sendToDevice(result.firebaseToken, payload, options)
                .then(response => {
                    res.status(200).send("Notification sent successfully")
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }).catch((err) => {
        console.log(err);
    });
}

async function sonorduulgauzsenbolgoyo(io, zakhialga) {
    const shuult = {
        ajiltniiId: zakhialga.ajiltniiId,
        "object._id": zakhialga._id
    }
    Sonorduulga.findOneAndUpdate(shuult, {
            kharsanEsekh: true
        })
        .then((result) => {
            io.emit("ajiltan" + zakhialga.ajiltniiId);
        })
        .catch((err) => {
            console.log(err);
        });
}
module.exports = {
    ajiltan,
    sonorduulgauzsenbolgoyo
}