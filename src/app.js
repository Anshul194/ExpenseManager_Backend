import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";
import errorHandler from "./middleware/errorHandler.middleware.js";

const app = express();

const corsOrigin = process.env.CLIENT_URL || "http://localhost:5173";

app.use(cors({
    origin: [corsOrigin, corsOrigin.replace(/\/$/, "")],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/health", (req, res) => {
    res.json({ success: true, message: "Server is running" });
});

app.use("/api", routes);

app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});

app.use(errorHandler);

export default app;
