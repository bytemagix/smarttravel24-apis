const admin = require("firebase-admin");
const serviceAccount = require("../../config/smarttravel24-c8fad-firebase-adminsdk-erorc-d149407dfe.json");

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
    const driverId = "AD"+(new Date().getTime());

    const db = admin.database();
    db.ref("Bookings").child("Quotations").child(bookingId).child(driverId).set({
      bookingId: bookingId,
      userId: formData.userId,
      driverId: driverId,
      driverName: formData.driverName,
      driverMobileNo: formData.driverMobileNo,
      fare: formData.fare,
    });

    res.status(200).json({
      message: "OK",
    });
  } catch (err) {
    res.status(400).json({
      error: err,
    });
  }
};