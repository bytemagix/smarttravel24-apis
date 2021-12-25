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

exports.mojoWebHook = (req, res) => {
  try {
    const formData = req.fields;
    const db = admin.database();
    console.log(formData);
    const ref = db.ref("Payments").child("Transactions");
    ref.child(formData.purpose).set(formData);

    if (formData.status === "Credit") {
      const tempRef = db.ref("Users").child("TempOrders").child(formData.purpose);
      tempRef.once(
        "value",
        (snapshot) => {
          const data = snapshot.val();
          confirmBooking(formData.purpose,data);
        },
        (error) => {
          console.log(error);
        }
      );
    }

    res.status(200).json({
      message: "OK",
    });
  } catch (error) {
    res.status(400).json({
      error: error,
    });
  }
};

const confirmBooking = (booking_id,data) => {
  const db = admin.database();

  db.ref("Bookings").child("Bookings").child(booking_id).update({
    bookingStatus: "Confirmed",
    carName: data.carName,
    carNo: data.carNo,
    driverId: data.driverId,
    driverName: data.driverName,
    driverMobileNo: data.driverMobileNo,
  });

  driverNotification(booking_id,data.driverId);

  // Remove TemOrders
  const removeTempRef = db.ref("Users").child("TempOrders").child(booking_id);
  removeTempRef.remove();

  const removeTempBookings = db.ref("Bookings").child("TempBookings").child(booking_id);
  removeTempBookings.remove();

  // Remove Quotaions
  const removeQuotationsRef = db.ref("Bookings").child("Quotations").child(booking_id);
  removeQuotationsRef.remove();

  //Remove Notifications
  const removeNotificationsRef = db.ref("Users").child("Notifications").child(data.userId).child(booking_id);
  removeNotificationsRef.remove();
};

const driverNotification = async (bookingId,driver_id) => {
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
