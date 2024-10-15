const { admin } = require("../middlewares/firebase-config");

async function sonorduulgaIlgeeye(token, medeelel, callback, next) {
  const payload = {
    token,
    webpush : {
      "priority":"high",
      "TTL":86400,
      notification: {
        title: "Таньд мэдэгдэл ирлээ!",
        body: "Hello world",
        icon: "default",
        sound: "default",
        badge: "1",
        ...medeelel,
      },
    },
    android:{
      "priority":"high",
      "TTL": 86400,
      notification: {
        title: "Таньд мэдэгдэл ирлээ!",
        body: "Hello world",
        icon: "default",
        sound: "default",
        badge: "1",
        ...medeelel,
      },
    },
  }
  const options = {
    priority: "high",
    timeToLive: 60 * 60 * 24,
  };
  if (token)
    admin
      .messaging()
      .send(payload)
      .then((response) => {
        if (callback) callback(response);
        console.log("Notification sent successfully", JSON.stringify(response));
      })
      .catch((error) => {
        next(error);
      });
  else if (callback) callback({ successCount: 1 });
}

async function khariltsagchidSonorduulgaIlgeeye(
  token,
  medeelel,
  callback,
  next
) {
  const payload = {
    notification: {
      title: "Таньд мэдэгдэл ирлээ!",
      body: "Hello world",
      icon: "default",
      sound: "default",
      badge: "1",
      ...medeelel,
    },
  };
  const options = {
    priority: "high",
    timeToLive: 60 * 60 * 24,
  };
  admin
    .messaging()
    .sendToDevice(token, payload, options)
    .then((response) => {
      callback(response);
      console.log("Notification sent successfully", response);
    })
    .catch((error) => {
      next(error);
    });
}

module.exports = {
  sonorduulgaIlgeeye,
};
