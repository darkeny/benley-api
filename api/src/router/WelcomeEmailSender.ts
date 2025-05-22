import { Router } from "express";
import RegisterController from "../controllers/welcome/mailConfig";
import { generatePassword } from "../utils";
const router = Router();

router.post('/', async (req, res) => {
    const { email, fullName, generatedPassword } = req.body;

    const registerController = new RegisterController();

    try {
        await registerController.registerUser(email, fullName, generatedPassword);

        res.status(200).send({ message: 'Email sent successfully.' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ message: 'Failed to send email.' });
    }
});

export { router as SendMail };
