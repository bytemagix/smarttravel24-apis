const admin = require("firebase-admin");
const serviceAccount = require("../../config/smarttravel24-c8fad-firebase-adminsdk-erorc-d149407dfe.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://smarttravel24-c8fad-default-rtdb.firebaseio.com",
    storageBucket: "smarttravel24-c8fad.appspot.com",
  });
}

exports.getNotifications = async (req, res) => {
  try {
    const formData = req.fields;

    const userId = formData.userId;

    console.log(formData);

    const db = admin.database();
    const ref = db
      .ref("Users")
      .child("Notifications")
      .child(userId)
      .once(
        "value",
        (snapshot) => {
          const data = snapshot.val();

          const list = [];
          let unread = 0;
          for (const key in data) {
            for (const qId in data[key]) {
              const item = data[key][qId];

              if (item.qRead === false) {
                unread++;
              }
              list.push(item);
            }
          }

          res.status(200).json({
            list: list,
            unread: unread,
          });
        },
        (errorObj) => {
          console.log("Having Error", errorObj);
          res.status(400).json({
            error: errorObj,
          });
        }
      );
  } catch (err) {
    console.log("Special Error ", err);
    res.status(400).json({
      error: err,
    });
  }
};

const fetchProposals = async () => {};
