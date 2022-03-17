const admin = require("firebase-admin");
const serviceAccount = require("../../config/smarttravel24-c8fad-firebase-adminsdk-erorc-d149407dfe.json");
const { Expo } = require("expo-server-sdk");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://smarttravel24-c8fad-default-rtdb.firebaseio.com",
    storageBucket: "smarttravel24-c8fad.appspot.com",
  });
}

exports.getFilteredDrivers = async (req, res) => {
  const formData = req.fields;
  console.log("filter Called");
  try {
    const db = admin.database();
    const ref = db.ref(`Drivers/Profiles`);

    ref.once(
      "value",
      (snapshot) => {
        const data = snapshot.val();
        let filteredData = [];
        for (const key in data) {
          const item = data[key];
          filteredData.push(item);
        }
        // const excluded = await excludeSelected(
        //   filteredData,
        //   formData.bookingId
        // );
        res.status(200).json(filteredData);
      },
      (errorObject) => {
        res.status(400).json({
          error: errorObject,
        });
      }
    );
  } catch (error) {}
};

// const excludeSelected = async (list, bookingId) => {
//   try {
//     const db = admin.database();
//     const ref = db.ref(`Bookings/TempBookings/${bookingId}`);

//     ref.once(
//       "value",
//       (snapshot) => {
//         const data = snapshot.val();
//         let selectedList = [];
//         for (const key in data) {
//           const item = data[key];
//           selectedList.push(item);
//         }

//         // Exclude Selected
//         const filteredData = list.filter((item) => {
//           selectedList.map((selected) => {
//             if (item.driverId === selected.driverId) {
//               return true;
//             }
//           });
//         });
//         return filteredData;
//       },
//       (errorObject) => {
//         res.status(400).json({
//           error: errorObject,
//         });
//       }
//     );
//   } catch (error) {}
// };
