import express from "express";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { google } from "googleapis";

const nodemailer = require("nodemailer");
const Vonage = require("@vonage/server-sdk");

import Contact from "../models/Contact";

var router = express.Router();

const sendConfirmMail = async (email: string, name: string) => {
  try {
    const oAuth2CLient = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REDIRECT_URL
    );
    oAuth2CLient.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
    const accesToken = await oAuth2CLient.getAccessToken();

    const transport = nodemailer.createTransport({
      host: process.env.HOST,
      port: process.env.PORT,
      secure: true,
      auth: {
        type: "OAuth2",
        user: "biskup.mateusz.dev@gmail.com",
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accesToken,
      },
    });

    const mailOptions = {
      from: "<biskup.mateusz.dev@gmail.com>",
      to: `${email}`,
      subject: `Hello ${name}, nice to meet you 👾`,
      text: "I am watching you",
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    return error;
  }
};

const sendSMS = async (name: string, email: string) => {
  const vonage = new Vonage({
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET,
    privateKey:
      "/Applications/XAMPP/xamppfiles/htdocs/portfolio-api/private.key",
    applicationId: process.env.APPLICATION_ID,
  });

  const from = "Portfolio";
  const to = Number(process.env.ADMIN_NUMBER);
  const text = `Someone just procces your contact form ${name}, ${email}`;

  vonage.message.sendSms(from, to, text, (err: any, responseData: any) => {
    if (err) {
      console.log(err);
    } else {
      if (responseData.messages[0]["status"] === "0") {
        console.log("Message sent successfully.");
      } else {
        console.log(
          `Message failed with error: ${responseData.messages[0]["error-text"]}`
        );
      }
    }
  });
};

router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, phone, email, message } = req.body;
    const contact = new Contact({
      _id: new mongoose.Types.ObjectId(),
      name,
      phone,
      email,
      message,
    });

    const savedContact = await contact.save();

    if (savedContact) {
      await sendConfirmMail(email, name);
      await sendSMS(name, email);
    }

    res.status(200).json(savedContact);
  } catch (error: any) {
    if (error.name === "ValidationError") {
      const errorMessage = Object.values(error.errors).map(
        (val: any) => val.message
      );
      res.status(400).send({
        errorMessage: errorMessage[0],
      });
    } else if (error.name === "MongoServerError" && error.code === 11000) {
      res.status(400).send({
        errorMessage: "You already sign in, I will contact you soon",
      });
    } else {
      res.status(500).send(error);
    }
  }
});

router.get("/", (req, res) => {
  console.log("key", process.env.PUBLIC_KEY, process.env.PRIVATE_KEY);

  res.send();
});

export default router;
