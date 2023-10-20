const admin = require("firebase-admin");

// Đường dẫn đến tệp tin .json chứa thông tin xác thực từ Firebase
const serviceAccount = require("../config/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Hàm gửi thông báo
function sendNotification(title, body, topic) {
  const message = {
    notification: {
      title: title,
      body: body,
    },
    topic: topic,
  };

  return admin.messaging().send(message);
}

function sendNotificationWithToken(title, body, notificationToken) {
  const message = {
    notification: {
      title: title,
      body: body,
    },
    token: notificationToken,
  };

  return admin.messaging().send(message);
}

module.exports = { sendNotification, sendNotificationWithToken };
/*

Phần ví dụ sử dụng

const { sendNotification } = require('./firebase-notification');

// Gọi hàm sendNotification
sendNotification('Thông báo từ Node.js', 'Đây là một thông báo sử dụng Firebase Cloud Messaging.', 'all')
  .then((response) => {
    console.log('Thông báo đã được gửi:', response);
  })
  .catch((error) => {
    console.log('Lỗi khi gửi thông báo:', error);
  });

*/