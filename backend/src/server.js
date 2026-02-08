import express from "express";
import path from "path";
import {ENV} from "./config/env.js";
import { connectDB } from "./config/db.js";
import {clerkMiddleware } from '@clerk/express';
import authRoutes from "./routes/auth.routes.js";
import {serve} from "inngest/express";
import {functions,inngest} from "./config/inngest.js";
import aminRoutes from "./routes/admin.route.js";
import userRoutes from "./routes/user.routes.js";
import orderRoutes from "./routes/order.route.js";

const app = express();
const __dirname = path.resolve();

// middleware
app.use(express.json());

// simple CORS to allow dev Admin/Mobile origins to call API (adjust origin as needed)
app.use((req, res, next) => {
    const origin = process.env.CORS_ORIGIN || "http://localhost:5173";
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") return res.sendStatus(200);
    next();
});

// test route
app.get("/api/health", (req, res) => {
    res.status(200).json({ message: "Success" });
});

app.use(express.json());
app.use("/api/inngest", serve({client:inngest, functions}));
app.use(clerkMiddleware())

// auth routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', aminRoutes);
app.use('/api/users', userRoutes);
app.use("/api/orders", orderRoutes);

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
