import express from "express";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { google } from "googleapis";

const nodemailer = require("nodemailer");

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

    if (contact) {
      await sendConfirmMail(email, name);
    }

    const savedContact = await contact.save();
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

export default router;
