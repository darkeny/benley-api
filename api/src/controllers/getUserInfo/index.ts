// src/controllers/userController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client'; // Importar o cliente Prisma

const prisma = new PrismaClient(); // Instanciar o cliente Prisma

const getUserData = async (req: Request, res: Response) => {
    try {
        // Obter o payload JWT
        //@ts-ignore
        const user = req.user;
        const userId = user?.userId;
        const userRole = user?.role; // Supondo que o token contém um campo `role` para indicar o tipo de usuário

        if (!user) {
            return res.status(401).json({ message: 'Usuário não autenticado' });
        }

        if (userRole === 'ADMIN') {
            // Caso o usuário seja um administrador
            const adminUser = await prisma.adminUser.findUnique({
                where: { id: userId },
                select: { // Selecionar apenas os campos desejados
                    id: true,
                    username: true,
                    email: true,
                    role: true,
                },
            });

            if (!adminUser) {
                return res.status(404).json({ message: 'Administrador não encontrado' });
            }

            // Retornar dados do administrador
            return res.status(200).json({
                user: {
                    userId: adminUser.id,
                    username: adminUser.username,
                    email: adminUser.email,
                    role: adminUser.role,
                },
            });

        } else if (userRole === 'USER') {
            // Caso o usuário seja um cliente
            const customer = await prisma.customer.findUnique({
                where: { id: userId },
                include: { loan: true }, // Incluir dados do empréstimo na busca
            });

            if (!customer) {
                return res.status(404).json({ message: 'Cliente não encontrado' });
            }

            // Retornar dados do cliente
            return res.status(200).json({
                user: {
                    userId: customer.id,
                    email: customer.email,
                    fullName: customer.fullName,
                    incomeSource: customer.incomeSource,
                    profession: customer.profession,
                    role: customer.role,
                    gender: customer.gender,
                    loan: customer.loan ? {
                        loanAmount: customer.loan.loanAmount,
                        balanceDue: customer.loan.balanceDue,
                        isActive: customer.loan.isActive,
                        createdAt: customer.loan.createdAt,
                        totalDays: 30
                    } : null,
                    //@ts-ignore
                    iat: user.iat,
                    //@ts-ignore
                    exp: user.exp,
                },
            });
        } else {
            return res.status(400).json({ message: 'Tipo de usuário inválido' });
        }
    } catch (error) {
        console.error('Erro ao obter informações do usuário:', error);
        return res.status(500).json({ message: 'Erro no servidor' });
    }
};

export { getUserData };
