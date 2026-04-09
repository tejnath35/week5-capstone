import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import { userRoute } from "./APIS/User-Api.js";
import { adminRoute } from "./APIS/Admin-Api.js";
import { authorRoute } from "./APIS/Author-Api.js";
import { commonRoute } from "./APIS/Common-Api.js";

// Load env variables
dotenv.config();

const app = express();
app.set("trust proxy", 1);

// ✅ CORS (important for Vercel frontend)
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://week5-capstone.vercel.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/user-api", userRoute);
app.use("/author-api", authorRoute);
app.use("/admin-api", adminRoute);
app.use("/common-api", commonRoute);

// Health check route (VERY IMPORTANT for Render)
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// ✅ Connect DB and start server
const startServer = async () => {
  try {
    if (!process.env.DB_URL) {
      throw new Error("DB_URL is missing in environment variables");
    }

    await mongoose.connect(process.env.DB_URL);
    console.log("✅ MongoDB connected");

    const PORT = process.env.PORT || 4000;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1); // force crash so Render shows error
  }
};

startServer();

// ❌ Invalid route
app.use((req, res) => {
  res.status(404).json({ message: "Invalid path" });
});

// ❌ Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);

  if (err.name === "ValidationError" || err.name === "CastError") {
    return res.status(400).json({ error: err.message });
  }

  if (err.code === 11000) {
    return res.status(409).json({ error: "Duplicate field value" });
  }

  res.status(500).json({ error: "Internal Server Error" });
});