import { Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";
import ERROR_MESSAGES from "../../constants/error-messages";

const prisma = new PrismaClient();

const getAll = async (request: Request, response: Response) => {
    try {
        const adminUser = await prisma.adminUser.findMany();

        if (adminUser.length === 0) {
            return response.status(404).json({ error: ERROR_MESSAGES.notFound });
        }

        return response.status(200).json(adminUser);
    } catch (error) {
        return response.status(400).json({ error: ERROR_MESSAGES.failedRetrieval });
    }
};

export { getAll };
