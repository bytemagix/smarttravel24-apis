const admin = require("firebase-admin");
const serviceAccount = require("../../config/smarttravel24-c8fad-firebase-adminsdk-erorc-d149407dfe.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://smarttravel24-c8fad-default-rtdb.firebaseio.com",
    storageBucket: "smarttravel24-c8fad.appspot.com",
  });
}

exports.deleteAccount = async (req, res) => {
  try {
    const formData = req.fields;

    const driverId = formData.driverId;

    const db = admin.database();
    const dbResponse = await db
      .ref("Drivers")
      .child("Profiles")
      .child(driverId)
      .remove();

    res.status(200).json({
      isDeleted: true,
      message: "OK",
    });
  } catch (err) {
    res.status(400).json({
      isDeleted: false,
      error: err,
    });
  }
};
