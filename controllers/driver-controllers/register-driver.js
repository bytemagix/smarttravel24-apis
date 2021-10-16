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

    const driverId = formData.driverId;

    const db = admin.database();
    db.ref("Drivers").child("Profiles").child(driverId).set({
      driverId: formData.driverId,
      driverName: formData.driverName,
      driverMobileNo: formData.driverMobileNo,
      driverEmailId: formData.driverEmailId,
      driverDOB: formData.driverDOB,
      driverIdType: formData.driverIdType,

      carNo: formData.carNo,
      carType: formData.carType,
      carName: formData.carName,
      carModel: formData.carModel,
      fuelType: formData.fuelType,
      noPlateType: formData.noPlateType,
      insuranceExpiryDate: formData.insuranceExpiryDate,

      dlFrontUrl: formData.dlFrontUrl,
      dlBackUrl: formData.dlBackUrl,
      idFrontUrl: formData.idFrontUrl,
      idBackUrl: formData.idBackUrl,
      rcUrl: formData.rcUrl,
      insuranceUrl: formData.insuranceUrl,
      pollutionUrl: formData.pollutionUrl,

      city: formData.city,
      district: formData.district,
      state: formData.state,
      latitude: formData.latitude,
      longitude: formData.longitude,

      driverStatus: formData.driverStatus,
      verificationStatus: formData.verificationStatus,
    });

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