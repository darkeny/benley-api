import { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import ERROR_MESSAGES from '../../constants/error-messages';
import SUCCESS_MESSAGES from '../../constants/success-messages';
import env from 'dotenv';

env.config();

const prisma = new PrismaClient();

const IBuildNews = async (request: Request, response: Response) => {
    const { email } = request.body;

    try {
        // Verificar se o e-mail já está inscrito na newsletter
        const existingSubscriber = await prisma.newsletter.findUnique({
            where: { email },
        });

        if (existingSubscriber) {
            return response.status(400).json({ error: ERROR_MESSAGES.duplicateEmail });
        }

        // Criar a inscrição na newsletter
        const newSubscriber = await prisma.newsletter.create({
            data: {
                email,
            },
        });

        return response.status(201).json({
            message: SUCCESS_MESSAGES.successCreating,
            payload: newSubscriber,
        });
    } catch (error: any) {
        console.error('Error subscribing to newsletter:', error);

        return response.status(500).json({ error: ERROR_MESSAGES.errorCreating });
    }
};

export { IBuildNews };
