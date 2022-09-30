import express, { Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import HomeRoute from "../routes/Home";
import SearchRoute from "../routes/Search";
import DetailRoute from "../routes/Detail";
dotenv.config();

const app = express();

app.use(bodyParser.json({ limit: "50mb" }));

app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Server datisekai is running....");
});

app.use("/home", HomeRoute);
app.use("/search", SearchRoute);
app.use("/detail", DetailRoute);

const PORT = process.env.PORT || 6060;

app.listen(PORT, () => {
  console.log("Server running...." + PORT);
});
