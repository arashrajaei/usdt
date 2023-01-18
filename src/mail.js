const { MailtrapClient } = require("mailtrap");

const TOKEN = process.env.MAILTRAP_API_TOKEN;
const SENDER_EMAIL = process.env.SENDER_EMAIL;
const RECIPIENT_EMAIL = process.env.MAIL_TO;

const client = new MailtrapClient({ token: TOKEN });

const sender = { name: "Tron USDT Watcher", email: SENDER_EMAIL };

module.exports = function sendEmail({amount, balance}){
  return client
    .send({
      from: sender,
      to: [{ email: RECIPIENT_EMAIL }],
      subject: "Balance Change",
      text: `Your balance has been changed. Changed Amount: ${amount}, Balance: ${balance}`,
    })
    .then(console.log, console.error);
}