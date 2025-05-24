import { Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";
import ERROR_MESSAGES from "../../constants/error-messages";

const prisma = new PrismaClient();

const deleteSubscriber = async (request: Request, response: Response) => {
    const email  = request.body;

    try {
        const companyExists = await prisma.newsletter.findUnique({
            where: { email: email },
        });

        if (!companyExists) {
            return response.status(404).json({ error: ERROR_MESSAGES.notFound });
        }

        await prisma.$transaction([
            prisma.newsletter.delete({ where: { email: email } }),
        ]);

        return response.status(200).json({ message: 'Email Eliminado com Sucesso!' });
    } catch (error) {
        return response.status(400).json({ error: ERROR_MESSAGES.failedDeletion });
    }
};

export { deleteSubscriber };
