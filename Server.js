import exp from "express";
import { connect } from "mongoose";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRoute } from "./APIS/User-Api.js";
import { adminRoute } from "./APIS/Admin-Api.js";
import { authorRoute } from "./APIS/Author-Api.js";
import { commonRoute } from "./APIS/Common-Api.js";

config(); // load environment variables

// Create express application
const app = exp();

// enable CORS
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

// body parser middleware
app.use(exp.json());

// cookie parser middleware
app.use(cookieParser());

// connect APIs
app.use("/user-api", userRoute);
app.use("/author-api", authorRoute);
app.use("/admin-api", adminRoute);
app.use("/common-api", commonRoute);

// connect to MongoDB
const connectDB = async () => {
  try {
    await connect(process.env.DB_URL);
    console.log("DB connection success");

    // start server
    app.listen(process.env.PORT, () =>
      console.log(`Server started on port ${process.env.PORT}`)
    );
  } catch (err) {
    console.log("Err in DB connection", err);
  }
};

connectDB();

// invalid path middleware
app.use((req, res, next) => {
  res.status(404).json({ message: "Invalid path" });
});

// error handling middleware
app.use((err, req, res, next) => {
  console.log("Error name:", err.name);
  console.log("Error code:", err.code);
  console.log("Full error:", err);

  // mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "error occurred",
      error: err.message,
    });
  }

  // mongoose cast error
  if (err.name === "CastError") {
    return res.status(400).json({
      message: "error occurred",
      error: err.message,
    });
  }

  const errCode = err.code ?? err.cause?.code ?? err.errorResponse?.code;
  const keyValue =
    err.keyValue ?? err.cause?.keyValue ?? err.errorResponse?.keyValue;

  // duplicate key error
  if (errCode === 11000) {
    const field = Object.keys(keyValue)[0];
    const value = keyValue[field];

    return res.status(409).json({
      message: "error occurred",
      error: `${field} "${value}" already exists`,
    });
  }

  // custom errors
  if (err.status) {
    return res.status(err.status).json({
      message: "error occurred",
      error: err.message,
    });
  }

  // default server error
  res.status(500).json({
    message: "error occurred",
    error: "Server side error",
  });
});