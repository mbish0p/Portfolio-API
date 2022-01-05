import express, { Request, Response } from "express";

var router = express.Router();

router.post("/", (req: Request, res: Response) => {
  const { name, phone, email, message } = req.body;
  console.log(name, phone, email, message);

  res.status(202).send();
});

router.get("/", (req: Request, res: Response) => {
  res.send("contact");
});

export default router;
