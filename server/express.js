import express from "express";
import path from "path";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compress from "compression";
import cors from "cors";
import helmet from "helmet";
import Template from "./../template";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";

// comment out for production
import devBundle from "./devBundle";

const CURRENT_WORKING_DIR = process.cwd();
const app = express();

// comment out for production
//devBundle.compile(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(helmet());
app.use(cors());

// mount routes
app.use("/", userRoutes);
app.use("/", authRoutes);

app.get("/", (req, res) => {
  res.status(200).send(Template());
});

// catch unauthorized errors
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({
      error: err.name + ": " + err.message,
    });
  } else if (err) {
    res.status(400).json({
      error: err.name + ": " + err.message,
    });
    console.log(err);
  }
});

export default app;
