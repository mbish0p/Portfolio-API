import express from "express";
import { Application, Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
require("./db/db");
//routes
import contact from "./routes/contact";

var corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const app: Application = express();
dotenv.config();
var jsonParser = bodyParser.json();
express.json();
express.urlencoded();
app.use(cors(corsOptions));
app.use(jsonParser);
app.use("/contact", contact);

app.listen(process.env.APPLICATION_PORT, () => {
  console.log("Server running on port", process.env.APPLICATION_PORT);
});
