var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://hicarapp-f2967.firebaseio.com"
})

module.exports.admin = admin