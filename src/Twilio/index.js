require('dotenv').config();

// loads the Twilio library, which can find your environment variables automatically
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

client.messages.create({
  from: 'whatsapp:+14155238886', // shared WhatsApp number
  body: 'Ahoy world!',
  to: 'whatsapp:+573122594219' // change this to your personal WhatsApp number
}).then(message => console.log(`Message sent: ${message.sid}`));

