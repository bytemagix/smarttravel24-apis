const admin = require("firebase-admin");
const serviceAccount = require("../../config/smarttravel24-c8fad-firebase-adminsdk-erorc-d149407dfe.json");
const { Expo } = require("expo-server-sdk");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://smarttravel24-c8fad-default-rtdb.firebaseio.com",
    storageBucket: "smarttravel24-c8fad.appspot.com",
  });
}

exports.selectDriver = async (req, res) => {
  try {
    const formData = req.fields;

    const driverId = formData.driverId;
    const bookingId = formData.bookingId;
    console.log(formData);

    const db = admin.database();
    db.ref("Bookings")
      .child("TempBookings")
      .child(bookingId)
      .child(driverId)
      .set({
        driverId: driverId,
        bookingId: bookingId,
        driverName: formData.driverName,
        passengerName: formData.passengerName,
        carType: formData.carType,
        carName: formData.carName,
        city: formData.city,
        bookingStatus: formData.bookingStatus,
      });

    driverNotification(bookingId, driverId);

    res.status(200).json({
      message: "OK",
    });
  } catch (err) {
    res.status(400).json({
      error: err,
    });
  }
};

const driverNotification = async (bookingId, driver_id) => {
  const db = admin.database();
  db.ref("Drivers")
    .child("PushTokens")
    .child(driver_id)
    .once(
      "value",
      (snapshot) => {
        sendDriverNotification(snapshot.val().pushToken, bookingId);
      },
      (error) => {
        console.log(error);
      }
    );
};

const sendDriverNotification = async (token, booking_id) => {
  console.log(token);
  let pushTokens = [];
  pushTokens.push(token);

  console.log(pushTokens);

  let expo = new Expo();
  let messages = [];

  for (let pushToken of pushTokens) {
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
      continue;
    }

    messages.push({
      to: pushToken,
      sound: "default",
      body: "New Booking Request",
      data: { bookingId: booking_id },
    });
  }

  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];
  (async () => {
    for (let chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        console.log(ticketChunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error(error);
      }
    }
  })();

  let receiptIds = [];
  for (let ticket of tickets) {
    if (ticket.id) {
      receiptIds.push(ticket.id);
    }
  }

  let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
  (async () => {
    for (let chunk of receiptIdChunks) {
      try {
        let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
        console.log(receipts);

        for (let receiptId in receipts) {
          let { status, message, details } = receipts[receiptId];
          if (status === "ok") {
            continue;
          } else if (status === "error") {
            console.error(
              `There was an error sending a notification: ${message}`
            );
            if (details && details.error) {
              console.error(`The error code is ${details.error}`);
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  })();
};
