const admin = require("firebase-admin");
const serviceAccount = require("../../../config/smarttravel24-c8fad-firebase-adminsdk-erorc-d149407dfe.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://smarttravel24-c8fad-default-rtdb.firebaseio.com",
    storageBucket: "smarttravel24-c8fad.appspot.com",
  });
}

exports.driverEmailSignup = async (req, res) => {
    const formData = req.fields;
    console.log(formData);

    admin.auth().createUser({
        email: formData.email,
        emailVerified: false,
        password: formData.password,
    }).then(userRecord => {
        console.log(userRecord);
        res.status(200).json({
            user : {
                uid : userRecord.uid
            }
        })
    }).catch(error => {
        console.log(error);
        res.status(400).json({
            error : error
        })
    });
}