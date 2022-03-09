const admin = require("firebase-admin");
const serviceAccount = require("../../config/smarttravel24-c8fad-firebase-adminsdk-erorc-d149407dfe.json");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const shortUrl = require("node-url-shortener");

const EMAIL = "services.smarttravel24@gmail.com";
const REFRESH_TOKEN =
  "1//04cUNMVM5QyS7CgYIARAAGAQSNwF-L9IrEtEsuITpephJ4UljIr29orDylAXAXYuaneRNNXaczG7UhwhHNhSbd6B5dUCKlixKxZw";
const CLIENT_SECRET = "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";
const CLIENT_ID =
  "934526704033-kp5skiepcqfd4gr0ke1u6474r2qcvvmj.apps.googleusercontent.com";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const fast2sms = require("fast-two-sms");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://smarttravel24-c8fad-default-rtdb.firebaseio.com",
    storageBucket: "smarttravel24-c8fad.appspot.com",
  });
}

exports.sendQuotationAdmin = async (req, res) => {
  try {
    const formData = req.fields;

    console.log(formData);

    const bookingId = formData.bookingId;
    const driverId = "AD" + new Date().getTime();

    const db = admin.database();
    db.ref("Bookings")
      .child("Quotations")
      .child(bookingId)
      .child(driverId)
      .set({
        bookingId: bookingId,
        userId: formData.userId,
        driverId: driverId,
        driverName: formData.driverName,
        driverMobileNo: formData.driverMobileNo,
        carName: formData.carName,
        carNo: formData.carNo,
        fare: formData.fare,
        tripType: formData.tripType,
      });

    db.ref("Bookings").child("Bookings").child(bookingId).update({
      bookingStatus: "Active",
    });

    sendEmailNotification(
      formData.passengerEmailId,
      formData.fare,
      formData.tripType
    );

    storeUserNotification(formData, driverId);
    sendSMS(
      formData.passengerMobileNo,
      formData.fare,
      formData.tripType,
      bookingId,
      driverId
    );

    res.status(200).json({
      message: "OK",
    });
  } catch (err) {
    res.status(400).json({
      error: err,
    });
  }
};

const sendEmailNotification = (userEmailId, fare, tripType) => {
  console.log("Notification Called");
  let effectiveFare;
  if (tripType === "One Way") {
    effectiveFare = +fare + 150;
  } else {
    effectiveFare = +fare + 300;
  }

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
        subject: "Update: Quotation for your Booking Request",
        text: `Dear Customer, 
        We are happy to inform you that your journey quotation for booking request is an amount of ₹ ${effectiveFare} INR for traveling to your chosen destination.
        If you are happy with this deal you may proceed for a hassle free and comfortable journey with our fully sanitised cabs. 
        If you are not satisfied with this deal you just relax and chill we are promised send you more quotations so that, you can choose and sort your journey with cheapest price. `,
      };

      const result = await transport.sendMail(mailOptions);
      return result;
    } catch (error) {
      return error;
    }
  }

  sendMail()
    .then((result) => console.log("Email sent...jooo", result))
    .catch((error) => {
      console.log(error);
    });
};

const storeUserNotification = (data, quotationId) => {
  console.log("Store User Notification Called");
  console.log(data, quotationId);

  let effectiveFare;
  if (data.tripType === "One Way") {
    effectiveFare = +data.fare + 150;
  } else {
    effectiveFare = +data.fare + 300;
  }

  try {
    const database = admin.database();
    database
      .ref("Users")
      .child("Notifications")
      .child(data.userId)
      .child(data.bookingId)
      .child(quotationId)
      .set({
        bookingId: data.bookingId,
        quotationId: quotationId,
        userId: data.userId,
        driverName: data.driverName,
        driverMobileNo: data.driverMobileNo,
        carName: data.carName,
        carNo: data.carNo,
        fare: effectiveFare,
        qRead: false,
        tripType: data.tripType,
      });
  } catch (err) {
    console.log(err);
  }
};

const sendSMS = async (userMobileNo, fare, tripType, bookingId, driverId) => {
  let effectiveFare;
  if (tripType === "One Way") {
    effectiveFare = +fare + 150;
  } else {
    effectiveFare = +fare + 300;
  }

  let longUrl = `https://www.smarttravel24.com/users/my-bookings/checkout/${bookingId}/${driverId}`;
  let shorteneduUrl = "";

  await shortUrl.short(longUrl, function (err, url) {
    shorteneduUrl = url;
    console.log(url);
  });

  console.log(shorteneduUrl);

  let messages = `${longUrl}`;

  console.log("SMS Called");
  var options = {
    authorization:
      "AqaSx0rW7XpwP8l6Mf9ZCemQ5OKH1YokBbUDRNcyF4IGghntsJMlfEutpHUSgkIDnJoZhLKwa3jcyv2r",
    message: messages,
    numbers: [userMobileNo],
  };
  const SMS = await fast2sms.sendMessage(options);
  console.log(SMS);
};
