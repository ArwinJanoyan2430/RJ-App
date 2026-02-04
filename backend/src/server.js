import express from "express";
import path from "path";
import {ENV} from "./config/env.js";
import { connectDB } from "./config/db.js";
import {clerkMiddleware } from '@clerk/express';
import {serve} from "inngest/express";
import {functions,inngest} from "./config/inngest.js";

const app = express();
const __dirname = path.resolve();

// middleware
app.use(express.json());

// test route
app.get("/api/health", (req, res) => {
    res.status(200).json({ message: "Success" });
});

app.use(express.json());
app.use("/api/inngest", serve({client:inngest, functions}));
app.use(clerkMiddleware())

// make app ready for deployment
if (ENV.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../admin/dist")));

    app.get("/{*any}", (req, res) => {
        res.sendFile(path.join(__dirname, "../admin","dist", "index.html"));
    });
}

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    await connectDB();
    app.listen(ENV.PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

startServer();  
