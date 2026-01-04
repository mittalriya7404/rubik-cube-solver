import express from "express";
import cors from "cors";
import cubeRoutes from "./routes/cube.routes.js";
import errorHandler from "./middlewares/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/cube", cubeRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
