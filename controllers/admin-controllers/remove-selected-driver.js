const admin = require("firebase-admin");
const serviceAccount = require("../../config/smarttravel24-c8fad-firebase-adminsdk-erorc-d149407dfe.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://smarttravel24-c8fad-default-rtdb.firebaseio.com",
    storageBucket: "smarttravel24-c8fad.appspot.com",
  });
}

exports.removeDriver = async (req, res) => {
  try {
    const formData = req.fields;

    const driverId = formData.driverId;
    const bookingId = formData.bookingId;
    console.log(formData);

    const db = admin.database();
    db.ref("Bookings").child("TempBookings").child(bookingId).child(driverId).remove();

    res.status(200).json({
      message: "OK",
    });

  } catch (err) {
    res.status(400).json({
      error: err
    });
  }
};