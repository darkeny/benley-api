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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
    origin: origins,
    methods: '*', // Permitir todos os métodos
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

ServerRouters(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server Running on http://127.0.0.1:${PORT}`);
});
