const {
    admin
} = require("../middlewares/firebase-config");

async function sonorduulgaIlgeeye(req, res,next) {
    const {token,medeelel} = req.body
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
            console.log("Notification sent successfully", response)
        })
        .catch(error => {
            console.log(error);
        });
}

module.exports = {
    sonorduulgaIlgeeye
}