const {
    admin
} = require("../middlewares/firebase-config");

async function sonorduulgaIlgeeye(token, medeelel, callback, next) {
    const payload = {
        notification: {
            title: "Таньд мэдэгдэл ирлээ!",
            body: "Hello world",
            icon: "default",
            sound: 'default',
            badge: '1',
            ...medeelel
        }
    };
    const options = {
        priority: "high",
        timeToLive: 60 * 60 * 24
    };
    admin.messaging().sendToDevice(token, payload, options)
        .then(response => {
            callback(response)
            console.log("Notification sent successfully", response)
        })
        .catch(error => {
            next(error);
        });
}

async function khariltsagchidSonorduulgaIlgeeye(token, medeelel, callback, next) {
    const payload = {
        notification: {
            title: "Таньд мэдэгдэл ирлээ!",
            body: "Hello world",
            icon: "default",
            sound: 'default',
            badge: '1',
            ...medeelel
        }
    };
    const options = {
        priority: "high",
        timeToLive: 60 * 60 * 24
    };
    admin.messaging().sendToDevice(token, payload, options)
        .then(response => {
            callback(response)
            console.log("Notification sent successfully", response)
        })
        .catch(error => {
            next(error);
        });
}

module.exports = {
    sonorduulgaIlgeeye
}