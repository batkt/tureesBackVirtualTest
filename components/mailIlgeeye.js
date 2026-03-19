const nodemailer = require("nodemailer");

async function mailIlgeeye(mailKhayag, ilgeekhMail, zurag) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // use SSL
    auth: {
      user: "zevtabs@gmail.com",
      pass: "iqvdwtpnvyrgrzma",
    },
  });

  var mail = {
    from: "zevtabs@gmail.com",
    to: mailKhayag,
    subject: "HiCar",
    html: ilgeekhMail,
    attachments: zurag
      ? [
          {
            filename: "send.png",
            path: zurag,
            cid: "zurag",
          },
        ]
      : null,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mail, function (error, info) {
      if (error) {
        console.error("Error sending mail:", error);
        resolve(error);
      } else {
        resolve(info);
      }
    });
  });
}

const transporterCache = {};

async function duriinMailIlgeeye(
  user,
  pass,
  host,
  port,
  mailKhayag,
  subject,
  ilgeekhMail,
  gereeniiDugaar
) {
  var tls = {};
  if (host.includes("office365"))
    tls = {
      ciphers: "SSLv3",
    };
  else
    tls = {
      rejectUnauthorized: false,
      minVersion: "TLSv1"
    };

  const cacheKey = `${user}:${host}:${port}`;
  if (!transporterCache[cacheKey]) {
    transporterCache[cacheKey] = nodemailer.createTransport({
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      host: host ? host : "smtp.zevtabs.mn",
      port: port ? port : 587,
      secureConnection: false,
      tls,
      auth: {
        user: user,
        pass: pass,
      },
    });
  }

  let transporter = transporterCache[cacheKey];

  var mail = {
    from: user,
    to: mailKhayag,
    subject: subject,
    html: ilgeekhMail,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mail, function (error, info) {
      if (error) {
        console.error("Error sending mail (duriin):", error);
        resolve(error);
      } else {
        resolve(info);
      }
    });
  });
}

module.exports = {
  mailIlgeeye,
  duriinMailIlgeeye,
};
