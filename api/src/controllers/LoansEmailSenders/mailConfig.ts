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

    public async registerUser(email: string, fullName: string) {

        // Obtém o caminho absoluto para o arquivo HTML
        const htmlPath = path.resolve(__dirname, 'index.html');

        // Verifica se o arquivo HTML existe antes de tentar lê-lo
        if (!fs.existsSync(htmlPath)) {
            throw new Error(`Arquivo HTML não encontrado em: ${htmlPath}`);
        }

        // Ler o conteúdo do arquivo HTML
        const html = fs.readFileSync(htmlPath, 'utf8');

        // Substituir placeholders pelo nome do usuário e pela senha gerada
        let personalizedHtml = html.replace('Nome', fullName);
        // Enviar email de boas-vindas
        const subject = 'Equipe - Nova solicitação de Crédito';
        const text = 'Saudações'; // Define um texto simples para o corpo do email

        // Envia o email utilizando o serviço Nodemailer
        for (const email of emailList) {
            await this.mailer.send(email, subject, text, personalizedHtml);
        }
    }
}

export default RegisterController;
