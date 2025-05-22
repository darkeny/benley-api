import { Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";
import ERROR_MESSAGES from "../../constants/error-messages";

const prisma = new PrismaClient();

const deleteLoan = async (request: Request, response: Response) => {
    const id  = request.params.id;

    try {
        const companyExists = await prisma.loan.findUnique({
            where: { id: id },
        });

        if (!companyExists) {
            return response.status(404).json({ error: ERROR_MESSAGES.notFound });
        }

        await prisma.$transaction([
            prisma.loan.delete({ where: { id: id } }),
        ]);

        return response.status(200).json({ message: 'Empréstimo eliminado com sucesso' });
    } catch (error) {
        return response.status(400).json({ error: ERROR_MESSAGES.failedDeletion });
    }
};

export { deleteLoan };
