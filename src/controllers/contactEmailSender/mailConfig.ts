import fs from 'fs';
import path from 'path';
import Mailer from '../../service/mail/mailer';
import dotenv from 'dotenv';
dotenv.config();
const emailList = process.env.EMAIL_LIST?.split(',') || [];

class RegisterController {
    private mailer: Mailer;

    constructor() {
        this.mailer = new Mailer();
    }

    public async registerUser(email: string, subject: string, message: string) {

        const htmlPath = path.resolve(__dirname, 'index.html');

        if (!fs.existsSync(htmlPath)) {
            throw new Error(`Arquivo HTML não encontrado em: ${htmlPath}`);
        }

        const html = fs.readFileSync(htmlPath, 'utf8');

        let personalizedHtml = html.replace('subject', subject);
        personalizedHtml = personalizedHtml.replace('message', message);
        personalizedHtml = personalizedHtml.replace('email', email);

        for (const email of emailList) {
            await this.mailer.send(email, subject, message, personalizedHtml);
        }
    }
}

export default RegisterController;
