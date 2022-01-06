import express from "express";
import { Request, Response } from "express";
import mongoose from "mongoose";
import Contact from "../models/Contact";

var router = express.Router();

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

router.get("/", (req: Request, res: Response) => {
  res.send("contact");
});

export default router;
