import { Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";
import ERROR_MESSAGES from "../../constants/error-messages";

const prisma = new PrismaClient();

const updateLoan = async (request: Request, response: Response) => {
    const id = request.params.id;
    const { isActive } = request.body; // O novo estado do empréstimo

    try {
        // Verifica se o empréstimo existe
        const loanExists = await prisma.loan.findUnique({
            where: { id: id },
        });

        if (!loanExists) {
            return response.status(404).json({ error: ERROR_MESSAGES.notFound });
        }

        // Atualiza o estado do empréstimo
        const updatedLoan = await prisma.loan.update({
            where: { id: id },
            data: {
                isActive: isActive // Atualizando o campo 'isActive'
            },
        });

        return response.status(200).json({
            message: 'Estado do empréstimo atualizado com sucesso',
            payload: updatedLoan
        });
    } catch (error) {
        console.error(error); // Para depuração
        return response.status(400).json({ error: ERROR_MESSAGES.failedUpdate });
    }
};

export { updateLoan };
