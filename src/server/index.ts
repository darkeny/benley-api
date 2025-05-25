import express from "express";
import env from 'dotenv';
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import bodyParser from "body-parser";
import ServerRouters from "../router";

env.config();

const app = express();
const prisma = new PrismaClient();
const origins = process.env.KNOWN_ORIGINS?.split(",") || [];

// LOG para debug
app.use((req, res, next) => {
    console.log("Incoming origin:", req.headers.origin);
    console.log("Allowed origins:", origins);
    next();
});

// Trata OPTIONS (preflight) corretamente
app.options('*', cors());

// Middleware CORS completo
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || origins.includes(origin)) {
            callback(null, true);
        } else {
            console.error('Blocked by CORS:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: '*',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

ServerRouters(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server Running on PORT:${PORT}`);
});
