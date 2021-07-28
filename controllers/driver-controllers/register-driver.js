const admin = require("firebase-admin");
const serviceAccount = require("../../config/smarttravel24-c8fad-firebase-adminsdk-erorc-d149407dfe.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://smarttravel24-c8fad-default-rtdb.firebaseio.com",
    storageBucket: "smarttravel24-c8fad.appspot.com",
  });
}

exports.postRegisterDriver = async (req, res) => {
  try {
    const formData = req.fields;

    const driverInfo = JSON.parse(formData.driverInfo);
    const carInfo = JSON.parse(formData.carInfo);
    const documentUrls = JSON.parse(formData.documentUrls);
    const location = JSON.parse(formData.location);

    const driverId = driverInfo.driverId;

    const db = admin.database();
    const dbResponse = await db
      .ref("Drivers")
      .child("Profiles")
      .child(driverId)
      .set({
        driverInfo: driverInfo,
        carInfo: carInfo,
        documentUrls: documentUrls,
        location: location,
      });

    const dbResponseData = await dbResponse.json();

    res.status(200).json({
      isDriverAdded: true,
      message: "OK",
    });
  } catch (err) {
    res.status(400).json({
      isDriverAdded: false,
      error: err,
    });
  }
};