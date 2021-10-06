const admin = require("firebase-admin");
const serviceAccount = require("../../config/smarttravel24-c8fad-firebase-adminsdk-erorc-d149407dfe.json");

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

    const db = admin.database();
    db.ref("Bookings").child(bookingId).set({
      bookingId: bookingId,
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
      tripDescription: formData.tripDescription
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
