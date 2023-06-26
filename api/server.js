const express = require("express");
const app = express();
const { body, validationResult } = require("express-validator");
const cors = require("cors");
const nodemailer = require("nodemailer");
const port = 3001;
require("dotenv").config();

app.use(cors());
app.use(express.json());



app.post(
  "/contacto",
  [
    body("firstName").notEmpty().isString(),
    body("lastName").notEmpty().isString(),
    body("tel").notEmpty().isMobilePhone("any"),
    body("email").notEmpty().isEmail(),
    body("message").notEmpty().isString(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, tel, email, message } = req.body;

    let mailTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    let mailDetails = {
      from: `${email}`,
      to: "psic.andreacstantinoweb@gmail.com",
      subject: `${firstName} ${lastName}`,
      text: `${tel} ${message}`,
    };

    mailTransporter.sendMail(mailDetails, function (err, data) {
      if (err) {
        console.log("Error Occurs");
      } else {
        console.log("email sent");
      }
    });

    res.send("Data received successfully");
  }
);

app.listen(port, () => {
  console.log(`Express server listening at http://localhost:${port}`);
});
