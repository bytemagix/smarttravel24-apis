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
  let selectedCoordinate;
  try {
    selectedCoordinate = JSON.parse(formData.selectedCoordinate);
  } catch (err) {}

  console.log("Selected Coordinate", selectedCoordinate);
  console.log(formData);

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
          console.log("Driver Coordinate", driverCoordinate);
          //   console.log(selectedCoordinate, driverCoordinate);
          if (!selectedCoordinate) {
            if (carType === "All") {
              filteredData.push(item);
            } else if (item.carType === carType) {
              filteredData.push(item);
            }
          } else {
            const distance = haversine(selectedCoordinate, driverCoordinate);
            console.log(distance);
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
  console.log("list", list);
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
