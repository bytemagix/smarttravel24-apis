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

exports.getFilteredDrivers = async (req, res) => {
  const formData = req.fields;
  console.log("filter Called");
  const carType = formData.selectedCarType;
  // console.log(formData);
  const selectedCoordinate = formData.selectedCoordinate;

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
          const driverCoordinate = {
            latitude: item.latitude,
            longitude: item.longitude,
          };
          //   console.log(selectedCoordinate, driverCoordinate);
          if (!selectedCoordinate) {
            if (carType === "All") {
              filteredData.push(item);
            } else if (item.carType === carType) {
              filteredData.push(item);
            }
          } else {
            const distance = haversine(selectedCoordinate, driverCoordinate);
            console.log(haversine(selectedCoordinate, driverCoordinate));
            if (carType === "All" && distance < 50000) {
              filteredData.push(item);
            } else if (item.carType === carType && distance < 50000) {
              filteredData.push(item);
            }
          }
        }

        excludeSelected(filteredData, formData.bookingId, res);

        // res.status(200).json(filteredData);
      },
      (errorObject) => {
        res.status(400).json({
          error: errorObject,
        });
      }
    );
  } catch (error) {}
};

const excludeSelected = async (list, bookingId, res) => {
  try {
    const db = admin.database();
    const ref = db.ref(`Bookings/TempBookings/${bookingId}`);

    ref.once(
      "value",
      (snapshot) => {
        const data = snapshot.val();
        let selectedList = [];
        for (const key in data) {
          const item = data[key];
          selectedList.push(item);
        }

        // console.log(selectedList);
        // console.log(selectedList);
        // Exclude Selected
        // const filteredData = list.filter((item) => {
        //   selectedList.map((selected) => {
        //     return item.driverId !== selected.driverId;
        //   });
        // });
        let result = list.filter(
          (o1) => !selectedList.some((o2) => o1.driverId === o2.driverId)
        );
        res.status(200).json(result);
      },
      (errorObject) => {
        res.status(400).json({
          error: errorObject,
        });
      }
    );
  } catch (error) {}
};
