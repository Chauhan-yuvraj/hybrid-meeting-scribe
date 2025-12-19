import dotenv from "dotenv";
dotenv.config(); // 👈 MUST BE CALLED BEFORE IMPORTING ROUTES

import express, { Application } from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import summaryRoutes from "./routes/summaryRoutes";

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/upload", userRoutes);
app.use("/api/summary", summaryRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

export default app;