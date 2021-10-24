const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const EMAIL= "services.smarttravel24@gmail.com";
const REFRESH_TOKEN= "1//04cUNMVM5QyS7CgYIARAAGAQSNwF-L9IrEtEsuITpephJ4UljIr29orDylAXAXYuaneRNNXaczG7UhwhHNhSbd6B5dUCKlixKxZw";
const CLIENT_SECRET= "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";
const CLIENT_ID= "934526704033-kp5skiepcqfd4gr0ke1u6474r2qcvvmj.apps.googleusercontent.com";
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';


const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMail() {
  try {
    const accessToken = await oAuth2Client.getAccessToken();


    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: EMAIL,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: EMAIL,
      to: 'pranjalwit@gmail.com',
      subject: 'Hello from gmail using API',
      text: 'Hello from gmail email using API',
      html: '<h1>Hello from gmail email using API</h1>',
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    return error;
  }
}

sendMail()
  .then((result) => console.log('Email sent...jooo', result))
  .catch((error) => {});
