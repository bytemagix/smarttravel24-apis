const accountSid = 'AC70e6a6112693ed86ae88f43499900ccc'; 
const authToken = '[Redacted]'; 
const client = require('twilio')(); 
 
client.messages 
      .create({ 
         body: 'Your appointment is coming up on July 21 at 3PM', 
         from: 'whatsapp:+14155238886',       
         to: 'whatsapp:+919864143674' 
       }) 
      .then(message => console.log(message.sid)) 
      .done();