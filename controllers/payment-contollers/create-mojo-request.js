const admin = require("firebase-admin");
const request = require("request");
const keys = require("../../config/keys");
const serviceAccount = require("../../config/smarttravel24-c8fad-firebase-adminsdk-erorc-d149407dfe.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://smarttravel24-c8fad-default-rtdb.firebaseio.com",
    storageBucket: "smarttravel24-c8fad.appspot.com",
  });
}

exports.createMojoRequest = async (req, res) => {
  const formData = req.fields;

  const bookingId = formData.bookingId;
  console.log(formData);

  try {
    const headers = {
      "X-Api-Key": keys.MOJO_TEST_X_API_KEY,
      "X-Auth-Token": keys.MOJO_TEST_X_AUTH_TOKEN,
    };
    const payload = {
      purpose: bookingId,
      amount: formData.bookingAmount,
      redirect_url: "https://www.smarttravel24.com/users/payment-status",
      send_email: false,
      webhook:
        "https://smarttravel24-apis.herokuapp.com/payments/mojo-web-hook",
      send_sms: false,
      email: formData.emailId,
      allow_repeated_payments: false,
    };

    request.post(
      "https://test.instamojo.com/api/1.1/payment-requests/",
      { form: payload, headers: headers },
      function (error, response, body) {
        if (!error && response.statusCode == 201) {
          storeOrder(formData);
          res.status(200).json(body);
        } else {
          console.log(error);
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
};

const storeOrder = (formData) => {
  const db = admin.database();
  const ref = db.ref("Users").child("TempOrders").child(formData.bookingId);
  ref.set({
    bookingId: formData.bookingId,
    bookingAmount: formData.bookingAmount,
    driverName: formData.driverName,
    driverMobileNo: formData.driverMobileNo
  });
};

//"https://smarttravel24-apis.herokuapp.com/payments/mojo-web-hook"