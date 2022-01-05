import express from "express";
import { Application, Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
require("./db/db");

//routes
import contact from "./routes/contact";

const app: Application = express();

var corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
var jsonParser = bodyParser.json();
express.json();
express.urlencoded();
app.use(cors(corsOptions));
app.use(jsonParser);
app.use("/contact", contact);

app.get("/", (req: Request, res: Response) => {
  res.send("hello");
});

app.listen(5001, () => {
  console.log("Server running");
});
