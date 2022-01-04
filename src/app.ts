import express, { Application, Request, Response } from "express";

//routes
import contact from "./routes/contact";

import mongoose from "mongoose";

const uri =
  "mongodb+srv://admin:admin6822@cluster0.w21tb.mongodb.net/test?retryWrites=true&w=majority";

const connection = mongoose
  .connect(uri)
  .then(() => {
    console.log("Connected to database ");
  })
  .catch((err) => {
    console.error(`Error connecting to the database. \n${err}`);
  });

const app: Application = express();
app.use("/contact", contact);

app.get("/", (req: Request, res: Response) => {
  res.send("hello");
});

app.listen(5001, () => {
  console.log("Server running");
});
