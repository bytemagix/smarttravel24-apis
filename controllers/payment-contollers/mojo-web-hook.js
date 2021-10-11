const admin = require("firebase-admin");
const serviceAccount = require("../../config/smarttravel24-c8fad-firebase-adminsdk-erorc-d149407dfe.json");

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
    const ref = db.ref("Payments/Transactions");
    ref.child(formData.purpose).set(formData);

    if (formData.status === "Credit") {
      confirmBooking(formData.purpose);
      /*const tempRef = db.ref("Users").child("TempOrders").child(formData.purpose);
      tempRef.on(
        "value",
        (snapshot) => {
          const data = snapshot.val();
          confirmBooking(formData.purpose);
        },
        (error) => {
          console.log(error);
        }
      );*/
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

const confirmBooking = (booking_id) => {

  const bookingRef = db.ref("Bookings").child("Bookings").child(booking_id);
  bookingRef.set({
    bookingStatus: "Confirmed"
  })

  // Remove TemOrders
  const removeTempRef = db.ref("Users").child("TempOrders").child(booking_id);
  removeTempRef.remove();
}