const admin = require("firebase-admin");
const serviceAccount = require("../../config/smarttravel24-c8fad-firebase-adminsdk-erorc-d149407dfe.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://smarttravel24-c8fad-default-rtdb.firebaseio.com",
    storageBucket: "smarttravel24-c8fad.appspot.com",
  });
}

exports.approveDriver = async (req, res) => {
  try {
    const formData = req.fields;

    const driverId = formData.driverId;
    const verificationStatus = formData.verificationStatus;

    const db = admin.database();
    db.ref("Drivers").child("Profiles").child(driverId).update({
        verificationStatus : verificationStatus,
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