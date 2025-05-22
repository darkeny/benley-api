import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ERROR_MESSAGES from '../../constants/error-messages';
import SUCCESS_MESSAGES from '../../constants/success-messages';
import env from 'dotenv';

// Carrega as variáveis de ambiente
env.config();

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET não está configurado. Verifique o arquivo .env.');
}

const loginAdminUser = async (request: Request, response: Response) => {
    const { email, password } = request.body;

    // Validação de campos obrigatórios
    if (!email || !password) {
        return response.status(400).json({ error: ERROR_MESSAGES.requiredFields });
    }

    try {
        // Verificar se o usuário admin existe
        const adminUser = await prisma.adminUser.findUnique({
            where: { email },
        });

        if (!adminUser) {
            return response.status(401).json({ error: ERROR_MESSAGES.invalidCredentials });
        }

        // Verificar se a senha está correta
        const isPasswordValid = await bcrypt.compare(password, adminUser.password);

        if (!isPasswordValid) {
            return response.status(401).json({ error: ERROR_MESSAGES.invalidCredentials });
        }

        // Gerar o token JWT
        const token = jwt.sign(
            { userId: adminUser.id, email: adminUser.email, role: adminUser.role }, // Adiciona mais informações ao payload do token
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Resposta de sucesso com o token
        return response.status(200).json({
            message: SUCCESS_MESSAGES.successLogin,
            token,
        });
    } catch (error) {
        console.error('Erro ao efetuar login do usuário admin:', error);
        return response.status(500).json({ error: ERROR_MESSAGES.errorLogin });
    }
};

export { loginAdminUser };
