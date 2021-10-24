const admin = require("firebase-admin");
const serviceAccount = require("../../config/smarttravel24-c8fad-firebase-adminsdk-erorc-d149407dfe.json");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const EMAIL= "services.smarttravel24@gmail.com";
const REFRESH_TOKEN= "1//04cUNMVM5QyS7CgYIARAAGAQSNwF-L9IrEtEsuITpephJ4UljIr29orDylAXAXYuaneRNNXaczG7UhwhHNhSbd6B5dUCKlixKxZw";
const CLIENT_SECRET= "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";
const CLIENT_ID= "934526704033-kp5skiepcqfd4gr0ke1u6474r2qcvvmj.apps.googleusercontent.com";
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';

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
    })

    sendEmailNotification(formData.passengerEmailId);

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
  console.log("Notification Called");
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
        service: 'gmail',
        auth: {
          type: 'OAuth2',
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
        subject: 'Cab Booking ( SmartTravel 24)',
        text: `Thank You for booking SmartTravel 24. We have received your booking request. You will receive quotation within 30 minutes`,
      };
  
      const result = await transport.sendMail(mailOptions);
      return result;
    } catch (error) {
      return error;
    }
  }
  
  sendMail()
    .then((result) => console.log('Email sent...jooo', result))
    .catch((error) => {console.log(error)});
}