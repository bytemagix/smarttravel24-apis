const admin = require("firebase-admin");
const serviceAccount = require("../../config/smarttravel24-c8fad-firebase-adminsdk-erorc-d149407dfe.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://smarttravel24-c8fad-default-rtdb.firebaseio.com",
    storageBucket: "smarttravel24-c8fad.appspot.com",
  });
}

exports.getActiveBookings = async (req, res) => {
  try {
    const formData = req.fields;

    const carType = formData.carType;
    const driverId = formData.driverId;

    const db = admin.database();
    const ref = db
      .ref("Bookings")
      .child("TempBookings")
      .once(
        "value",
        (snapshot) => {
          console.log(snapshot.val());
          const data = snapshot.val();

          const list = [];
          for (const key in data) {
            const item = data[key][driverId];
            try {
              if (item.carType === carType && item.bookingStatus === "Active") {
                list.push(item);
              }
            } catch (error) {
              console.log("My Error", error);
            }
          }

          res.status(200).json({
            list: list,
          });
        },
        (errorObj) => {
          res.status(400).json({
            error: errorObj,
          });
          console.log(errorObj);
        }
      );
  } catch (err) {
    res.status(400).json({
      error: err,
    });
  }
};