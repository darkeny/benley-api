import { Router } from "express";
import RegisterController from "../controllers/LoansEmailsSenderRefused/mailConfig";

const router = Router();

router.post('/', async (req, res) => {
    const { email, fullName } = req.body;

    const registerController = new RegisterController();

    try {
        await registerController.registerUser(email, fullName);

        res.status(200).send({ message: 'Email sent successfully.' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ message: 'Failed to send email.' });
    }
});

export { router as SendRefusedMail };

