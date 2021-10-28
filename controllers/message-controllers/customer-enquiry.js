const admin = require("firebase-admin");
const serviceAccount = require("../../config/smarttravel24-c8fad-firebase-adminsdk-erorc-d149407dfe.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://smarttravel24-c8fad-default-rtdb.firebaseio.com",
    storageBucket: "smarttravel24-c8fad.appspot.com",
  });
}

exports.sendCustomerEnquiry = async (req, res) => {
  try {
    const formData = req.fields;

    const enquiryId = "EN"+(new Date().getTime());

    const db = admin.database();
    db.ref("Users").child("Enquiries").child(enquiryId).set({
        enquiryId : enquiryId,
        name : formData.name,
        mobileNo: formData.mobileNo,
        emailId: formData.emailId,
        message: formData.message,
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