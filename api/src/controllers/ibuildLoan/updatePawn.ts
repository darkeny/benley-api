import { Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";
import ERROR_MESSAGES from "../../constants/error-messages";

const prisma = new PrismaClient();

// Função para atualizar o estado do Pawn (Penhor)
const updatePawnStatus = async (request: Request, response: Response) => {
    const id = request.params.id; // ID do empréstimo
    const { pawn } = request.body; // Novo estado de 'Pawn' (Sim ou NO)

    try {
        // Verifica se o empréstimo existe
        const loanExists = await prisma.loan.findUnique({
            where: { id: id },
        });

        if (!loanExists) {
            return response.status(404).json({ error: ERROR_MESSAGES.notFound });
        }

        // Atualiza o estado do Pawn
        const updatedLoan = await prisma.loan.update({
            where: { id: id },
            data: {
                pawn: pawn, // Atualizando o campo 'Pawn' para "Sim" ou "NO"
            },
        });

        return response.status(200).json({
            message: 'Estado do penhor atualizado com sucesso',
            payload: updatedLoan
        });
    } catch (error) {
        console.error(error); // Para depuração
        return response.status(400).json({ error: ERROR_MESSAGES.failedUpdate });
    }
};

export { updatePawnStatus };
