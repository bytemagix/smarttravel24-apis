const accountSid = 'AC70e6a6112693ed86ae88f43499900ccc'; 
const authToken = '43022cc302874395bc5e4673b6ec5d0a'; 
const client = require('twilio')(accountSid, authToken); 
 
client.messages 
      .create({ 
         body: 'Your Twilio code is 1238432', 
         from: '+19034004981',       
         to: '+919864143674' 
       }) 
      .then(message => console.log(message)) 
      .done();
