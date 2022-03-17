const admin = require("firebase-admin");
const serviceAccount = require("../../config/smarttravel24-c8fad-firebase-adminsdk-erorc-d149407dfe.json");
const { Expo } = require("expo-server-sdk");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://smarttravel24-c8fad-default-rtdb.firebaseio.com",
    storageBucket: "smarttravel24-c8fad.appspot.com",
  });
}

exports.getSelectedDrivers = async (req, res) => {
  const formData = req.fields;
  const bookingId = formData.bookingId;

  try {
    const db = admin.database();
    const ref = db.ref(`Bookings/TempBookings/${bookingId}`);

    ref.once(
      "value",
      (snapshot) => {
        const data = snapshot.val();
        console.log(data);
        let selectedData = [];
        for (const key in data) {
          const item = data[key];
          selectedData.push(item);
        }
        res.status(200).json(selectedData);
      },
      (errorObject) => {
        res.status(400).json({
          error: errorObject,
        });
      }
    );
  } catch (error) {}
};
