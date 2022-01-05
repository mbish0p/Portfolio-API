import mongoose from "mongoose";

const uri =
  "mongodb+srv://admin:admin6822@cluster0.w21tb.mongodb.net/test?retryWrites=true&w=majority";

mongoose
  .connect(uri)
  .then(() => {
    console.log("Connected to database ");
  })
  .catch((err) => {
    console.error(`Error connecting to the database. \n${err}`);
  });
