const nodemailer = require("nodemailer");
const sendMail = async (req, res) => {
  const transport = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "giovani7@ethereal.email",
      pass: "ba9zkMvugEKevzzfRH",
    },
  });
  const info = await transport.sendMail({
    to: "nazat.mf@gmail.com",
    subject: `About listing, from -${req.body.from}`,
    text: req.body.message,
  });
  res.status(200).json({ msg: "email sent" });
};
module.exports = sendMail;
