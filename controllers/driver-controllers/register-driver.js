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

exports.postRegisterDriver = async (req, res) => {
  try {
    const formData = req.fields;

    const driverId = formData.driverId;

    const db = admin.database();
    db.ref("Drivers").child("Profiles").child(driverId).set({
      driverId: formData.driverId,
      driverName: formData.driverName,
      driverMobileNo: formData.driverMobileNo,
      driverEmailId: formData.driverEmailId,
      driverDOB: formData.driverDOB,
      driverIdType: formData.driverIdType,

      carNo: formData.carNo,
      carType: formData.carType,
      carName: formData.carName,
      carModel: formData.carModel,
      fuelType: formData.fuelType,
      noPlateType: formData.noPlateType,
      insuranceExpiryDate: formData.insuranceExpiryDate,

      dlFrontUrl: formData.dlFrontUrl,
      dlBackUrl: formData.dlBackUrl,
      idFrontUrl: formData.idFrontUrl,
      idBackUrl: formData.idBackUrl,
      rcUrl: formData.rcUrl,
      insuranceUrl: formData.insuranceUrl,
      pollutionUrl: formData.pollutionUrl,

      city: formData.city,
      district: formData.district,
      state: formData.state,
      latitude: formData.latitude,
      longitude: formData.longitude,

      driverStatus: formData.driverStatus,
      verificationStatus: formData.verificationStatus,
    });

    adminNotification(driverId);

    res.status(200).json({
      isDriverAdded: true,
      message: "OK",
    });
  } catch (err) {
    res.status(400).json({
      isDriverAdded: false,
      error: err,
    });
  }
};

const adminNotification = async (driverId) => {
  const db = admin.database();
  db.ref("Admin")
    .child("PushTokens")
    .once(
      "value",
      (snapshot) => {
        sendAdminNotification(snapshot.val(),driverId);
      },
      (error) => {
        console.log(error);
      }
    );
};

const sendAdminNotification = async (allTokens, driver_id) => {
  let pushTokens = [];
  for (const key in allTokens) {
    const token = allTokens[key].pushToken;
    pushTokens.push(token);
  }

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
      body: "New Driver Registered",
      data: { driverId: driver_id },
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