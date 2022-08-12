const admin = require("firebase-admin");
const serviceAccount = require("../../config/smarttravel24-c8fad-firebase-adminsdk-erorc-d149407dfe.json");
const { Expo } = require("expo-server-sdk");
const haversine = require("haversine-distance");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://smarttravel24-c8fad-default-rtdb.firebaseio.com",
    storageBucket: "smarttravel24-c8fad.appspot.com",
  });
}

exports.getAllDrivers = async (req, res) => {
  const formData = req.fields;
  
  try {
    const db = admin.database();
    const ref = db.ref(`Drivers/Profiles`);

    ref.once(
      "value",
      (snapshot) => {
        const data = snapshot.val();
        let arr = [];
        for (const key in data) {
          const item = data[key];
            arr.push(item);
        }   
        res.status(200).json(arr);
      },
      (errorObject) => {
        res.status(400).json({
          error: errorObject,
        });
      }
    );
  } catch (error) {}
};