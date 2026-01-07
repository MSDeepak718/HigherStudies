import express, { json } from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

import dataRoutes from './data/api.js';
import authRoutes from './auth/api.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5002;
const secret = process.env.SECRET;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

function authMiddleware(req, res, next) {
    const token = req.cookies.access_token;
    if(!token) return res.status(401).json({message: "Not Authenticated"});

    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    }
    catch {
        return res.status(401).json({message: "Invalid token"});
    }
}

app.use(authRoutes);
app.use(authMiddleware, dataRoutes);

connect(process.env.MONGODB_URI, {
    connectTimeoutMS:30000,
    socketTimeoutMS:45000,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error(err));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
