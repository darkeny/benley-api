import { PrismaClient } from '@prisma/client'
import { Request, Response } from "express"
import ERROR_MESSAGES from '../../constants/error-messages';
import SUCCESS_MESSAGES from '../../constants/success-messages';
const prisma = new PrismaClient();

const RemadminUser = async (request: Request, response: Response) => {
    const id = request.params.id
    try {
        const adminUser = await prisma.adminUser.delete({
            where: {
                id: id
            }
        })
        response.status(200).json({
            message: SUCCESS_MESSAGES.successDeleting,
            payload: adminUser
        })
    } catch (error) {
        response.status(400).json({ error: ERROR_MESSAGES.failedRetrieval })
    }
}

export { RemadminUser }