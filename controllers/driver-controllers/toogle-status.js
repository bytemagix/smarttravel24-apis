const admin = require("firebase-admin");
const serviceAccount = require("../../config/smarttravel24-c8fad-firebase-adminsdk-erorc-d149407dfe.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://smarttravel24-c8fad-default-rtdb.firebaseio.com",
    storageBucket: "smarttravel24-c8fad.appspot.com",
  });
}

exports.toogleStatus = async (req, res) => {
  try {
    const formData = req.fields;

    const driverId = formData.driverId;
    let status = formData.status;
    console.log(status);
    console.log(formData);
    let data;
    if(status === "true"){
      data = "false";
    }else{
      data = "true";
    }
    console.log(data);

    const db = admin.database();
    const ref = await db
      .ref("Drivers")
      .child("Profiles")
      .child(driverId)
      .update({
        driverStatus: data
      });

    res.status(200).json({
      isStatusChanged: true,
      message: "OK",
    });
  } catch (err) {
    res.status(400).json({
      isStatusChanged: false,
      error: err,
    });
  }
};
