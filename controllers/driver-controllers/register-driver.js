const admin = require("firebase-admin")
const serviceAccount = require("../../config/smarttravel24-c8fad-firebase-adminsdk-erorc-d149407dfe.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://smarttravel24-c8fad-default-rtdb.firebaseio.com",
    storageBucket: "smarttravel24-c8fad.appspot.com",
  });
}


exports.postRegisterDriver = async (req,res) => {
    const formData = req.fields;

    const driverId = "D"+(new Date().getTime());

    const db = admin.database();
    const dbResponse = await db.ref("Drivers").child("Profiles").child(driverId).set({
        driverId : driverId,
        driverName : formData.driverName,
        driverPhoneNo : formData.driverPhoneNo,
        driverDOB : formData.driverDOB,
        driverDLNo : formData.driverDLNo,
        driverIdType : formData.driverIdType,
        driverIdNo : formData.driverIdNo
    });

    const dbResponseData = await dbResponse.json();
    console.log(dbResponseData);

    res.status(200).json({
        message : "OK"
    });
}