const admin = require("firebase-admin");
const serviceAccount = require("../../config/smarttravel24-c8fad-firebase-adminsdk-erorc-d149407dfe.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://smarttravel24-c8fad-default-rtdb.firebaseio.com",
    storageBucket: "smarttravel24-c8fad.appspot.com",
  });
}

exports.getConfirmedBookings = async (req, res) => {
  try {
    const formData = req.fields;

    const driverId = formData.driverId;

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
          for(const key in data){
            const item = data[key];
            if(item.driverId === driverId && item.bookingStatus === "Confirmed"){
                list.push(item);
            }
          }

          res.status(200).json({
            list : list
          });
        },
        (errorObj) => {
          console.log(errorObj);
        }
      );
  } catch (err) {
    res.status(400).json({
      isStatusChanged: false,
      error: err,
    });
  }
};