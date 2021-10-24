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

exports.sendQuotation = async (req, res) => {
  try {
    const formData = req.fields;

    console.log(formData);

    const bookingId = formData.bookingId;
    const driverId = formData.driverId;

    const db = admin.database();
    db.ref("Bookings").child("Quotations").child(bookingId).child(driverId).set({
      bookingId: bookingId,
      userId: formData.userId,
      driverId: driverId,
      driverName: formData.driverName,
      driverMobileNo: formData.driverMobileNo,
      carName: formData.carName,
      carNo: formData.carNo,
      fare: formData.fare,
      message: formData.message,
    });

    db.ref("Bookings").child("Bookings").child(bookingId).update({
      bookingStatus: "Active"
    });

    sendEmailNotification(formData.passengerEmailId,formData.fare);

    res.status(200).json({
      message: "OK",
    });
  } catch (err) {
    res.status(400).json({
      error: err,
    });
  }
};

const sendEmailNotification = (userEmailId, fare) => {
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
        subject: 'Quotation ( Smart Travel 24)',
        text: `You have received a new Quotation on your booking on ( Smarttravel24.com ). Fare Rs. ${fare}`,
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