const admin = require("firebase-admin");
const serviceAccount = require("../../config/smarttravel24-c8fad-firebase-adminsdk-erorc-d149407dfe.json");

const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const EMAIL = "services.smarttravel24@gmail.com";
const REFRESH_TOKEN =
  "1//04cUNMVM5QyS7CgYIARAAGAQSNwF-L9IrEtEsuITpephJ4UljIr29orDylAXAXYuaneRNNXaczG7UhwhHNhSbd6B5dUCKlixKxZw";
const CLIENT_SECRET = "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";
const CLIENT_ID =
  "934526704033-kp5skiepcqfd4gr0ke1u6474r2qcvvmj.apps.googleusercontent.com";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";

// const accountSid = "AC70e6a6112693ed86ae88f43499900ccc";
// const authToken = "[Redacted]";
// const client = require("twilio")(accountSid, authToken);

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
    db.ref("Bookings")
      .child("Quotations")
      .child(bookingId)
      .child(driverId)
      .set({
        bookingId: bookingId,
        quotationId: driverId,
        userId: formData.userId,
        driverId: driverId,
        driverName: formData.driverName,
        driverMobileNo: formData.driverMobileNo,
        carName: formData.carName,
        carNo: formData.carNo,
        fare: formData.fare,
        message: formData.message,
        tripType: formData.tripType,
      });

    db.ref("Bookings").child("Bookings").child(bookingId).update({
      bookingStatus: "Active",
    });

    db.ref("Bookings")
      .child("TempBookings")
      .child(bookingId)
      .child(driverId)
      .update({
        bookingStatus: "Active",
      });

    sendEmailNotification(
      formData.passengerEmailId,
      formData.fare,
      formData.tripType
    );
    // sendWhatsappNotification();

    storeUserNotification(formData);

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

        We are happy to inform you that your journey quotation for booking request is an amount of ₹${effectiveFare} INR for traveling to your chosen destination.
        
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

const sendWhatsappNotification = async () => {
  client.messages
    .create({
      body: "You Have a received a new quotation",
      from: "whatsapp:+14155238886",
      to: "whatsapp:+919864143674",
    })
    .then((message) => console.log(message.sid))
    .done();
};

const storeUserNotification = (data) => {
  console.log(data);
  let effectiveFare;
  if (data.tripType === "One Way") {
    effectiveFare = +data.fare + 150;
  } else {
    effectiveFare = +data.fare + 300;
  }

  const db = admin.database();
  db.ref("Users")
    .child("Notifications")
    .child(data.userId)
    .child(data.bookingId)
    .child(data.driverId)
    .set({
      bookingId: data.bookingId,
      userId: data.userId,
      driverId: data.driverId,
      driverName: data.driverName,
      driverMobileNo: data.driverMobileNo,
      carName: data.carName,
      carNo: data.carNo,
      fare: effectiveFare,
      qRead: false,
      message: data.message,
      tripType: data.tripType,
    });
};
