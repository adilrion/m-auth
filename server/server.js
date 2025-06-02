const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./config/db");
const authRoutes = require("./routes/auth");
const shopRoutes = require("./routes/shop");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS configuration for subdomains
app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests from localhost with any subdomain
            if (
                !origin ||
                origin.match(/^https?:\/\/([a-z0-9-]+\.)?localhost(:\d+)?$/)
            ) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/shop", shopRoutes);

// Database connection
try {
    connectDB();
    console.log("Database connected successfully");
} catch (error) {
    console.error("Database connection failed:", error);
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.get("/", (req, res) => {
    res.send("Welcome to the Multi-Shop API");
});

// unhandled error handling
process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    process.exit(1); // Exit the process to avoid running in an unstable state
});

// 404 error handling
app.use((req, res, next) => {
    res.status(404).json({ message: "Not Found" });
});
