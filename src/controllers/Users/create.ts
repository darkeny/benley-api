import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import ERROR_MESSAGES from '../../constants/error-messages';
import SUCCESS_MESSAGES from '../../constants/success-messages';

dotenv.config();

const prisma = new PrismaClient();

const createAdminUser = async (request: Request, response: Response) => {
    const { username, email, password } = request.body;

    if (!username || !email || !password) {
        return response.status(400).json({ error: ERROR_MESSAGES.requiredFields });
    }

    const existingAdminUser = await prisma.adminUser.findUnique({
        where: { email }
    });

    if (existingAdminUser) {
        return response.status(400).json({ error: ERROR_MESSAGES.duplicatedData });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdminUser = await prisma.adminUser.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });
        return response.status(201).json({
            message: SUCCESS_MESSAGES.successCreating,
            payload: newAdminUser
        });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: ERROR_MESSAGES.errorCreating });
    }
};

const createDefaultAdminUser = async () => {
    try {
        const adminUsers = await prisma.adminUser.findMany();

        if (adminUsers.length === 0) {
            const defaultUsername = process.env.DEFAULT_ADMIN_USERNAME;
            const defaultEmail = process.env.DEFAULT_ADMIN_EMAIL;
            const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD;

            if (!defaultUsername || !defaultEmail || !defaultPassword) {
                throw new Error('Default admin user environment variables are not set');
            }

            const hashedPassword = await bcrypt.hash(defaultPassword, 10);
            await prisma.adminUser.create({
                data: {
                    username: defaultUsername,
                    email: defaultEmail,
                    password: hashedPassword,
                },
            });
            console.log('Default admin user created');
        } else {
            console.log('Admin users already exist, default user not created');
        }
    } catch (error) {
        console.error('Error creating default admin user:', error);
    }
};

// Call createDefaultAdminUser when the server starts
createDefaultAdminUser();

export { createAdminUser };
