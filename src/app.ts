import express, { Application, Request, Response } from "express";
require("./db/db");

//routes
import contact from "./routes/contact";

const app: Application = express();
app.use("/contact", contact);

app.get("/", (req: Request, res: Response) => {
  res.send("hello");
});

app.listen(5001, () => {
  console.log("Server running");
});
