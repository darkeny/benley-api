import { Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";
import ERROR_MESSAGES from "../../constants/error-messages";

const prisma = new PrismaClient();

const getAll = async (request: Request, response: Response) => {
    try {
        const loans = await prisma.loan.findMany({
            include: {
                customer: {
                    select: {
                        fullName: true, // Inclui apenas o campo fullName
                        email: true
                    },
                },
            },
        });

        if (loans.length === 0) {
            return response.status(404).json({ error: ERROR_MESSAGES.notFound });
        }

        return response.status(200).json(loans);
    } catch (error) {
        return response.status(400).json({ error: ERROR_MESSAGES.failedRetrieval });
    }
};

export { getAll };
