const express = require("express");
const PassObject = require("../models/passObject");
const { tokenShalgakh, Dugaarlalt } = require("zevbackv2");
const axios = require("axios");
const router = express.Router();

router.post("/passGargaya", tokenShalgakh, async (req, res, next) => {
  try {
    const crypto = require("crypto");
    const querystring = require("querystring");
    function prepareUnsignedMessage(
      httpMethod,
      uri,
      clientId,
      requestTime,
      body
    ) {
      return `${httpMethod} ${uri}\n${clientId}.${requestTime}.${body}`;
    }

    function sign(privateKey, unsignedMessage) {
      // SHA256 Hash үүсгэх
      const signer = crypto.createSign("RSA-SHA256");
      // Message-г SHA256 hash функцээр хувиргана
      signer.update(unsignedMessage);
      // Hash утгыг privateKey-р sign хийгээд base64 encrypt хийнэ
      const signature = signer.sign(privateKey, "base64");
      // Тусгай тэмдэгтүүдийг URL encode хийх ("ssRA==" => "ssRA%3D%3D")
      return encodeURIComponent(signature);
    }

    function verify(publicKey, decryptedMessage, signature) {
      const verifier = crypto.createVerify("RSA-SHA256");
      verifier.update(decryptedMessage);
      return verifier.verify(
        publicKey,
        decodeURIComponent(signature),
        "base64"
      );
    }

    function encryptKey(publicKey, symmetricKey) {
      const encryptedKey = crypto.publicEncrypt(
        {
          key: publicKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        },
        symmetricKey
      );
      return encodeURIComponent(encryptedKey.toString("base64"));
    }

    function decryptKey(privateKey, encryptedKey) {
      const decryptedKey = crypto.privateDecrypt(
        {
          key: privateKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        },
        Buffer.from(decodeURIComponent(encryptedKey), "base64")
      );
      return decryptedKey;
    }

    function encryptMessage(symmetricKey, rawMessage) {
      const BLOCK_SIZE = 32;
      if (!Buffer.isBuffer(symmetricKey) || symmetricKey.length !== 16) {
        throw new Error("symmetricKey must be a 16-byte Buffer.");
      }

      if (typeof rawMessage !== "string") {
        throw new Error("rawMessage must be a string.");
      }
      const cipher = crypto.createCipheriv("aes-128-ecb", symmetricKey, null);
      cipher.setAutoPadding(false); // Disable auto padding
      let paddedMessage = Buffer.from(rawMessage, "utf8");
      const paddingLength = BLOCK_SIZE - (paddedMessage.length % BLOCK_SIZE);
      paddedMessage = Buffer.concat([
        paddedMessage,
        Buffer.alloc(paddingLength, paddingLength),
      ]);
      let encryptedMessage = cipher.update(paddedMessage, undefined, "base64");
      encryptedMessage += cipher.final("base64");
      const encodedMessage = querystring.escape(encryptedMessage);
      return encodedMessage;
    }

    function decryptMessage(symmetricKey, encryptedMessage) {
      if (!Buffer.isBuffer(symmetricKey) || symmetricKey.length !== 16) {
        throw new Error("symmetricKey must be a 16-byte Buffer.");
      }
      if (typeof encryptedMessage !== "string") {
        throw new Error("encryptedMessage must be a string.");
      }
      const decodedMessage = querystring.unescape(encryptedMessage);
      const decipher = crypto.createDecipheriv(
        "aes-128-ecb",
        symmetricKey,
        null
      );
      decipher.setAutoPadding(false);
      let decryptedMessage = decipher.update(decodedMessage, "base64");
      decryptedMessage = Buffer.concat([decryptedMessage, decipher.final()]);
      const paddingLength = decryptedMessage[decryptedMessage.length - 1];
      const unpaddedMessage = decryptedMessage
        .slice(0, -paddingLength)
        .toString("utf8");
      return unpaddedMessage;
    }

    const privateKeyStr =
      "-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEA2byXgUww4YscOJdY69vWR3CvPoZXZ2TvSrmtxC5WftRZWsDU\n4JfHtqXNEAu6UzGdrgxJKET07jMws+GmST2AnFBAUndg+vXj7V0WYViBhcgHBL1i\nN2D+j5Z/jUrifMgoIJTM6dK2I7N9AhRjrXLsSWPzi1q0Pm0BIzYEw4Xu7a4DWVax\nGcmIL6KpUz/fnzmJk3BlTM/F53WTb9nh68Po5mu3Bx5EI0Dgey3Da6vnF6y1dO7Q\n8DWlTB46j93OeKabrxGtDb3usGewyim2cKFKFNL2hFPg0ABRYVw6yiRrFq5+CIiB\nF7e7LcY0ftFnQ4WtyRqLJ5V2k+GB2+zyp0UuFQIDAQABAoIBAAfFyzTC5wXOJPpC\nMNrulJYlSCQ3wHwA5ufoe/MCYnURmIT8WD0SPf9fqNPXT1Xz8fiKGLx2xbWRHz50\noi6AIwyxcrJe75fV2kaZaZidA7amXtXE+vIWJNA0Y6ZEE5S3wnLzTONV8cmReTdv\nSeWhshymlEWXvdJyqrU6ku315IMYf8oXEQexAd832/jJIMJKENQGrPcPEWwJpwp0\nGOi7mNbE7Lia1RweHkiy1/OBApfhauzrFXGKKdP7F6M6LD1XRc/6rYdnDPSwwuII\nLCfZXCLbjQ/q6NZsgHYRa7rJWOvM1uLhzNpiZ7VnjtH5YdklyXbYnFkkCYb0bIn9\nSTd1PXsCgYEA5U5onoyaLLFWymKhCnSeZSkuMnixaOZFrkEwrjCiYi5v/G73dylV\n3uxA2Lmk2WivxyLXPq4k+hH2xbddGq3h3pAbbHh6mQJA35Kha+fn1koQ5OfcM8hV\n1ggboOco5SUTYYiDMa/obtlLQzeayCNYWpDHBvyM4r/PNa3Yc8TNuVsCgYEA8xVl\nVSnEqTcXDW4Cu5/tzM9r8ffzoohfppRbQHFgth1IN9QAUHS5AnQoNXMOwd0qCQnQ\n19bDGdcUE0IeYzLwmffJ7yl4ed+kieT3EENK4T9+gfCCUSGQA3c/a2m7KJaJJSzW\nV1GRdnq/9xL+1Y+4nGktJDq/oJPKIeWM5Tmg4U8CgYAzmf15EHLxc8bwLFnJHI04\nfpfiy75AuPEdUZY+3LruFT0mNWKC8k5cqBW/r6clNaW4zmJZvJ6dl8VMoQLWqiKW\nDx/cvQ/5tsQai8i/m6RUWL6MhJDNJlwKmjB9eQd+6WT/IdVELS3FJCkHq0+tkiaj\n2sivDc42iKt8jO6Uvsj82QKBgQCg3DLPlbFfrWYi6/8A/IeYNlcfq87datOpX5m3\nXo/6VAxbbX67v1JDLm0BWd+VKO9NReKfQq6fZfYR/HoxeR9BNHm8O7xPIlE3M37P\nk0h1INht0qPaXpR3xq0APtqstFmTcUVySTcyqW5paXecCdzIHM3ToND4yXRE1CxV\n8Lnm/wKBgF3xR7YxlvYab9LKDUYAF/6iKDURmX4qXNFKY6v/DcV1vmlwUSoz43Zl\nuQMXOksYMgF+zyHHoylEY4fEx+HMWNLrmQRbr+KDtMn9clK7psNIG0LGoWbaQf/Q\nC8f+kyPqc/XxeK4rIy2gP79IB65X7L8RgXVHBJI++LjifDqQu/hV\n-----END RSA PRIVATE KEY-----";
    const publicKeyStr =
      "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2byXgUww4YscOJdY69vW\nR3CvPoZXZ2TvSrmtxC5WftRZWsDU4JfHtqXNEAu6UzGdrgxJKET07jMws+GmST2A\nnFBAUndg+vXj7V0WYViBhcgHBL1iN2D+j5Z/jUrifMgoIJTM6dK2I7N9AhRjrXLs\nSWPzi1q0Pm0BIzYEw4Xu7a4DWVaxGcmIL6KpUz/fnzmJk3BlTM/F53WTb9nh68Po\n5mu3Bx5EI0Dgey3Da6vnF6y1dO7Q8DWlTB46j93OeKabrxGtDb3usGewyim2cKFK\nFNL2hFPg0ABRYVw6yiRrFq5+CIiBF7e7LcY0ftFnQ4WtyRqLJ5V2k+GB2+zyp0Uu\nFQIDAQAB\n-----END PUBLIC KEY-----";

    const httpMethod = "POST";
    const contentType = "application/json; charset=UTF-8";
    const httpUri = "openapi/v1/create_order"; // Only the path of the API, e.g., 'openapi/v1/sale'
    const clientId = "1FE605805D174392A721AB518"; // Provided by the pass system
    const requestTime = new Date().toISOString(); // Request time in ISO format
    var dun = req.body.dun;
    var callback_url =
      process.env.UNDSEN_SERVER +
      "/passcallback/" +
      req.body.baiguullagiinId +
      "/" +
      req.body?.zakhialgiinDugaar;
    const requestBody = {
      pos_id: "dtb_70210003",
      payment_request_id: requestTime,
      amount: (dun * 100).toString(),
      callback_url,
      //db_ref_no: "asfas",
    };
    const bodyJson = JSON.stringify(requestBody);

    const unsignedMessage = prepareUnsignedMessage(
      httpMethod,
      httpUri,
      clientId,
      requestTime,
      bodyJson
    );

    const signature = sign(privateKeyStr, unsignedMessage);
    const symmetricKey = crypto.randomBytes(16);
    const encryptedMessage = encryptMessage(symmetricKey, bodyJson);
    const encSymmetricKey = encryptKey(publicKeyStr, symmetricKey);
    

    const headers = {
      "Content-Type": contentType,
      "Client-Id": clientId,
      "Request-Time": requestTime,
      Signature: signature,
      "Symmetric-Key": encSymmetricKey,
    };

    const body = {
      data: encryptedMessage,
    };

    // SEND REQUEST

    var khariu = await axios
      .post("https://ecomstg.pass.mn/openapi/v1/create_order", body, {
        headers: headers,
      })
      .catch((err) => {
        
      });
    var khariuData = JSON.parse(khariu.data);

    const decSymmetricKey = decryptKey(
      privateKeyStr,
      khariu.headers["symmetric-key"]
    );
    const decryptedMessage = decryptMessage(decSymmetricKey, khariuData.data);
    var butsaakhKhariu = JSON.parse(decryptedMessage);
    // const formattedMessage = prepareUnsignedMessage(
    //   httpMethod,
    //   httpUri,
    //   clientId,
    //   headers["Request-Time"],
    //   decryptedMessage
    // );
    var passObject = new PassObject(req.body.tukhainBaaziinKholbolt)();
    passObject.zakhialgiinDugaar = req.body.zakhialgiinDugaar;
    passObject.amount = dun;
    passObject.baiguullagiinId = req.body.baiguullagiinId;
    passObject.barilgiinId = req.body.barilgiinId;
    passObject.order_id = butsaakhKhariu?.ret?.order_id;
    passObject.order_ttl = butsaakhKhariu?.ret?.order_ttl;
    passObject.ognoo = new Date();
    passObject.tulsunEsekh = false;
    passObject.save();
    res.send({ qr_image: butsaakhKhariu?.ret?.order_id });
  } catch (err) {
    next(err);
  }
});

router.post(
  "/passcallback/:baiguullagiinId/:zakhialgiinDugaar",
  async (req, res, next) => {
    try {
      const { db } = require("zevbackv2");
      const b = req.params.baiguullagiinId;
      var kholbolt = db.kholboltuud.find((a) => a.baiguullagiinId == b);
      const passObject = await PassObject(kholbolt).findOne({
        zakhialgiinDugaar: req.params.zakhialgiinDugaar,
        tulsunEsekh: false,
      });
      passObject.payment_request_id = req.body.payment_request_id;
      passObject.pos_id = req.body.pos_id;
      passObject.is_success = req.body.is_success;
      passObject.operation = req.body.operation;
      passObject.extra_data = req.body.extra_data;
      passObject.customer_data = req.body.customer_data;
      passObject.tulsunEsekh = true;
      passObject.isNew = false;
      await passObject.save();
      req.app
        .get("socketio")
        .emit(
          `pass/${req.params.baiguullagiinId}/${req.params.zakhialgiinDugaar}`
        );
      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  }
);
module.exports = router;
