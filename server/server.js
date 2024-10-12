import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectToMongoDb } from "./config/DbConfig.js";

import authRouter from "./routers/authRouter.js";

const app = express();
const PORT = process.env.PORT || 8000;

// Configure CORS options
const corsOptions = {
  origin: process.env.CLIENT_ROOT_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Authorization",
  ],
};

// Apply CORS middleware globally
app.use(cors(corsOptions));

// Middleware to parse JSON request bodies
app.use(express.json());

// check  route
app.get("/", (req, res) => {
  res.send(" hello node JS");
});

// connect to mongo
connectToMongoDb();

//routes
app.use("/api/user", authRouter);

// start server
app.listen(PORT, (error) => {
  error
    ? console.log(error)
    : console.log(`server is running at  'http://localhost:${PORT}'`);
});
