const admin = require("firebase-admin");
const serviceAccount = require("../../config/smarttravel24-c8fad-firebase-adminsdk-erorc-d149407dfe.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://smarttravel24-c8fad-default-rtdb.firebaseio.com",
    storageBucket: "smarttravel24-c8fad.appspot.com",
  });
}

exports.addCarType = async (req, res) => {
  try {
    const formData = req.fields;

    const carType = formData.carType;

    const carTypeId = "C"+(new Date().getTime());

    const db = admin.database();
    let myStatus;
    db.ref("Admin").child("CarTypes").child(carTypeId).set({
        carTypeId : carTypeId,
        carType : carType,
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