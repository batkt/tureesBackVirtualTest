const { admin } = require("../middlewares/firebase-config");

async function sonorduulgaIlgeeye(token, medeelel, callback, next) {
  const payload = {
    token,
    webpush : {
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
      "priority":"normal",
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
      })
      .catch((error) => {
        const errorCode = error.code || '';
        const errorMessage = error.message || '';
        const isInvalidToken = 
          errorCode === 'messaging/invalid-registration-token' ||
          errorCode === 'messaging/registration-token-not-registered' ||
          errorCode === 'messaging/invalid-argument' ||
          errorMessage.includes('Requested entity was not found') ||
          errorMessage.includes('token oldsongui') ||
          errorMessage.includes('not found');
        
        // Log detailed error information for debugging
        const logDetails = {
          timestamp: new Date().toISOString(),
          errorCode: errorCode,
          errorMessage: errorMessage,
          errorName: error.name || 'Unknown',
          isInvalidToken: isInvalidToken,
          tokenPreview: token ? (token.substring(0, 20) + '...') : 'No token',
          fullError: {
            code: error.code,
            message: error.message,
            stack: error.stack,
            ...(error.errorInfo && { errorInfo: error.errorInfo })
          }
        };
        
        if (isInvalidToken) {
          // Log invalid token errors with full details for debugging
          console.log('Firebase Invalid Token Error:', JSON.stringify(logDetails, null, 2));
          if (callback) callback({ successCount: 0, error: 'Invalid token', details: logDetails });
        } else {
          // For other errors, log with full details and pass to error handler
          console.error('Firebase Notification Error:', JSON.stringify(logDetails, null, 2));
          if (next) next(error);
          else if (callback) callback({ successCount: 0, error: error.message, details: logDetails });
        }
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
    token,
    // options: {
    //   priority: "high",
    //   timeToLive: 60 * 60 * 24,
    // },
    notification: {
      title: "Таньд мэдэгдэл ирлээ!",
      body: "Hello world",
      // icon: "default",
      // sound: "default",
      // badge: "1",
      ...medeelel,
    },
  };
  admin
    .messaging()
    .send(payload)
    .then((response) => {
      callback(response);
    })
    .catch((error) => {
      const errorCode = error.code || '';
      const errorMessage = error.message || '';
      const isInvalidToken = 
        errorCode === 'messaging/invalid-registration-token' ||
        errorCode === 'messaging/registration-token-not-registered' ||
        errorCode === 'messaging/invalid-argument' ||
        errorMessage.includes('Requested entity was not found') ||
        errorMessage.includes('token oldsongui') ||
        errorMessage.includes('not found');
      
      // Log detailed error information for debugging
      const logDetails = {
        timestamp: new Date().toISOString(),
        errorCode: errorCode,
        errorMessage: errorMessage,
        errorName: error.name || 'Unknown',
        isInvalidToken: isInvalidToken,
        tokenPreview: token ? (token.substring(0, 20) + '...') : 'No token',
        fullError: {
          code: error.code,
          message: error.message,
          stack: error.stack,
          ...(error.errorInfo && { errorInfo: error.errorInfo })
        }
      };
      
      if (isInvalidToken) {
        // Log invalid token errors with full details for debugging
        console.log('Firebase Invalid Token Error:', JSON.stringify(logDetails, null, 2));
        if (callback) callback({ successCount: 0, error: 'Invalid token', details: logDetails });
      } else {
        // For other errors, log with full details and pass to error handler
        console.error('Firebase Notification Error:', JSON.stringify(logDetails, null, 2));
        if (next) next(error);
        else if (callback) callback({ successCount: 0, error: error.message, details: logDetails });
      }
    });
}

module.exports = {
  sonorduulgaIlgeeye,
  khariltsagchidSonorduulgaIlgeeye
};
