const admin = require("firebase-admin");
const serviceAccount = require("../../config/smarttravel24-c8fad-firebase-adminsdk-erorc-d149407dfe.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://smarttravel24-c8fad-default-rtdb.firebaseio.com",
    storageBucket: "smarttravel24-c8fad.appspot.com",
  });
}

exports.uploadDocument = async (req, res) => {
  const localId = req.fields.localId;
  const documentTitle = req.fields.documentTitle;
  const documentFile = req.files.file;
  console.log(documentTitle);
  console.log(documentFile);

  const bucket = admin.storage().bucket();
  try {
    const response = await bucket.upload(documentFile.path, {
      predefinedAcl: "publicRead",
      contentType: documentFile.type,
      destination: "DriverDocuments/"+localId+"/"+ documentTitle,
    });

    const url = await response[0].metadata.mediaLink;
    console.log(url);

    res.status(200).json({
      isUploaded: true,
      documentUrl: url,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      isUploaded: false,
      error : err
    });
  }
};