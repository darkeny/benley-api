import { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import ERROR_MESSAGES from '../../constants/error-messages';
import SUCCESS_MESSAGES from '../../constants/success-messages';
import env from 'dotenv';
import axios from 'axios';

env.config();

const prisma = new PrismaClient();
const API_URL = String(process.env.API_BASE_URL);

const IBuildLoan = async (request: Request, response: Response) => {
    const {
        customerId,
        loanAmount,
        paymentTerm,
        paymentMethod,
        accountNumber,
        collateral,
        installments,
    } = request.body;

    // Verifique se customerId está presente
    if (!customerId) {
        return response.status(400).json({ error: ERROR_MESSAGES.requiredCustomer });
    }

    try {
        // Verificar se o cliente existe e buscar email e fullName
        const customer = await prisma.customer.findUnique({
            where: { id: customerId },
            select: { id: true, email: true, fullName: true }, // Incluir email e fullName
        });

        if (!customer) {
            return response.status(404).json({ error: 'Cliente não encontrado.' });
        }

        // Verificar se o cliente já tem um empréstimo ativo
        const activeLoan = await prisma.loan.findFirst({
            where: { customerId: customer.id, isActive: "ACTIVE" },
        });

        if (activeLoan) {
            return response.status(400).json({ error: ERROR_MESSAGES.duplicateActiveLoan });
        }

        const balanceDue = loanAmount * 1.30;

        // Criação do empréstimo
        const createLoanData: Prisma.LoanCreateInput = {
            loanAmount: parseFloat(loanAmount),
            paymentTerm,
            paymentMethod,
            accountNumber,
            collateral,
            installments,
            balanceDue: balanceDue,
            customer: {
                connect: { id: customer.id }, // Associando o empréstimo ao cliente
            },
        };

        const BuildLoan = await prisma.loan.create({
            data: createLoanData,
        });

        // Enviar um email de boas-vindas aos cliente
        await axios.post(`${API_URL}/sendLoansMail`, {
            email: customer.email,
            fullName: customer.fullName,
        });

        await axios.post(`${API_URL}/sendLoansMailToAdmins`, {
            email: customer.email,
            fullName: customer.fullName,
        });

        // Enviar um email avisando aos administradores sobre o emprestimo
        return response.status(201).json({
            message: SUCCESS_MESSAGES.successCreating,
            payload: BuildLoan,
        });
    } catch (error: any) {
        console.error('Error creating loan:', error);
        return response.status(500).json({ error: ERROR_MESSAGES.errorCreating });
    }
};

export { IBuildLoan };
