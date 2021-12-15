const admin = require("firebase-admin");
const serviceAccount = require("../../config/smarttravel24-c8fad-firebase-adminsdk-erorc-d149407dfe.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://smarttravel24-c8fad-default-rtdb.firebaseio.com",
    storageBucket: "smarttravel24-c8fad.appspot.com",
  });
}

exports.getPastBookings = async (req, res) => {
  try {
    const formData = req.fields;

    const carType = formData.carType;
    const driverId = formData.driverId;

    console.log(formData);

    const db = admin.database();
    const ref = db
      .ref("Bookings")
      .child("Bookings")
      .on(
        "value",
        (snapshot) => {
          console.log(snapshot.val());
          const data = snapshot.val();

          const list = [];

          try {
            for (const key in data) {
              const item = data[key][driverId];
              if (
                item.driverId === driverId &&
                item.bookingStatus === "Completed"
              ) {
                list.push(item);
              }
            }
          } catch (error) {
            console.log(error);
          }

          res.status(200).json({
            list: list,
          });
        },
        (errorObj) => {
          console.log(errorObj);
        }
      );
  } catch (err) {
    res.status(400).json({
      error: err,
    });
  }
};