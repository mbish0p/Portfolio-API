import express, { Request, Response } from "express";

var router = express.Router();

router.post("/", (req: Request, res: Response) => {
  const body = req.body;
  console.log(body);
});

router.get("/", (req: Request, res: Response) => {
  res.send("contact");
});

export default router;
