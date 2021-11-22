const admin = require("firebase-admin");
const serviceAccount = require("../../config/smarttravel24-c8fad-firebase-adminsdk-erorc-d149407dfe.json");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { Expo } = require("expo-server-sdk");

const EMAIL = "services.smarttravel24@gmail.com";
const REFRESH_TOKEN =
  "1//04cUNMVM5QyS7CgYIARAAGAQSNwF-L9IrEtEsuITpephJ4UljIr29orDylAXAXYuaneRNNXaczG7UhwhHNhSbd6B5dUCKlixKxZw";
const CLIENT_SECRET = "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";
const CLIENT_ID =
  "934526704033-kp5skiepcqfd4gr0ke1u6474r2qcvvmj.apps.googleusercontent.com";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://smarttravel24-c8fad-default-rtdb.firebaseio.com",
    storageBucket: "smarttravel24-c8fad.appspot.com",
  });
}

exports.sendBookingRequest = async (req, res) => {
  try {
    const formData = req.fields;

    const bookingId = "BID" + new Date().getTime();
    const userId = formData.userId;

    const db = admin.database();
    db.ref("Bookings").child("Bookings").child(bookingId).set({
      bookingId: bookingId,
      userId: userId,
      source: formData.source,
      destination: formData.destination,
      fromDate: formData.fromDate,
      toDate: formData.toDate,
      carType: formData.carType,
      tripType: formData.tripType,
      passengerName: formData.passengerName,
      passengerMobileNo: formData.passengerMobileNo,
      passengerEmailId: formData.passengerEmailId,
      noOfPassenger: formData.noOfPassenger,
      passengerIdType: formData.passengerIdType,
      passengerIdNo: formData.passengerIdNo,
      passengergender: formData.passengergender,
      houseNo: formData.houseNo,
      street: formData.street,
      locality: formData.locality,
      landmark: formData.landmark,
      pickupTime: formData.pickupTime,
      tripDescription: formData.tripDescription,
      bookingStatus: formData.bookingStatus,
    });

    db.ref("Users").child("Bookings").child(userId).child(bookingId).set({
      bookingId: bookingId,
      userId: userId,
      source: formData.source,
      destination: formData.destination,
      fromDate: formData.fromDate,
      toDate: formData.toDate,
      carType: formData.carType,
      tripType: formData.tripType,
    });

    sendEmailNotification(formData.passengerEmailId);
    adminNotification(bookingId);

    res.status(200).json({
      message: "OK",
    });
  } catch (err) {
    res.status(400).json({
      error: err,
    });
  }
};

const sendEmailNotification = (userEmailId) => {
  const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );
  oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

  async function sendMail() {
    try {
      const accessToken = await oAuth2Client.getAccessToken();

      const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: EMAIL,
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          refreshToken: REFRESH_TOKEN,
          accessToken: accessToken,
        },
      });

      const mailOptions = {
        from: EMAIL,
        to: userEmailId,
        subject: "Update: Booking Request Received",
        text: `We have received your booking request. We are promised to take just 30 minutes to provide you quotation. On or before 30 minutes you are gonna receive a notification from our end.
        
        Thank you for booking in SmartTravel24.com
        Stay Safe and Healthy.`,
      };

      const result = await transport.sendMail(mailOptions);
      return result;
    } catch (error) {
      return error;
    }
  }

  sendMail()
    .then((result) => console.log("Email sent...", result))
    .catch((error) => {
      console.log(error);
    });
};

const adminNotification = async (bookingId) => {
  const db = admin.database();
  db.ref("Admin")
    .child("PushTokens")
    .on(
      "value",
      (snapshot) => {
        sendAdminNotification(snapshot.val(), bookingId);
      },
      (error) => {
        console.log(error);
      }
    );
};

const sendAdminNotification = async (allTokens, booking_id) => {
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