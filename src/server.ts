import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { config } from "dotenv";

config();

const app = express();
const port = process.env.PORT || 7000;

app.use(bodyParser.json());
app.use(cors());

app.use("/auth", require("./modules/auth/auth.routes"));
app.use("/waitlist", require("./modules/waitlist/waitlist.routes"));

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

