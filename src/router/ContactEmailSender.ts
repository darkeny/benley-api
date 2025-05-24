import { Router } from "express";
import RegisterController from "../controllers/contactEmailSender/mailConfig";

const router = Router();

router.post('/', async (req, res) => {
    const { email, subject, message } = req.body;

    const registerController = new RegisterController();

    try {
        await registerController.registerUser(email, subject, message);

        res.status(200).send({ message: 'Email sent successfully.' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ message: 'Failed to send email.' });
    }
});

export { router as SendMessage };
