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
    const ref = db.ref("Payments").child("Transactions");
    ref.child(formData.purpose).set(formData);

    if (formData.status === "Credit") {
      const tempRef = db.ref("Users").child("TempOrders").child(formData.purpose);
      tempRef.on(
        "value",
        (snapshot) => {
          const data = snapshot.val();
          confirmBooking(formData.purpose,data);
        },
        (error) => {
          console.log(error);
        }
      );
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

const confirmBooking = (booking_id,driver_data) => {
  const db = admin.database();

  db.ref("Bookings").child("Bookings").child(booking_id).update({
    bookingStatus: "Confirmed",
    driverName: driver_data.driverName,
    driverMobileNo: driver_data.driverMobileNo
  });

  // Remove TemOrders
  const removeTempRef = db.ref("Users").child("TempOrders").child(booking_id);
  removeTempRef.remove();
};
