import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Codveda Task Management System API",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "success",
    message: "Backend server is running",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
