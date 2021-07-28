const admin = require("firebase-admin");
const serviceAccount = require("../../config/smarttravel24-c8fad-firebase-adminsdk-erorc-d149407dfe.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://smarttravel24-c8fad-default-rtdb.firebaseio.com",
    storageBucket: "smarttravel24-c8fad.appspot.com",
  });
}

exports.getDriverInfo = (req, res) => {
  try {
    const driverId = req.fields.localId;

    const db = admin.database();
    const ref = db.ref(`Drivers/Profiles/${driverId}`);

    ref.on(
      "value",
      (snapshot) => {
        res.status(200).json(snapshot.val());
      },
      (errorObject) => {
        res.status(400).json({
          error: errorObject,
        });
      }
    );
  } catch (err) {
    res.status(400).json({
      error: err,
    });
  }
};
