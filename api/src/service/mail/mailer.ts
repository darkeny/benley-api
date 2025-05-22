// src/services/Mailer.ts
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

class Mailer {
  private emailSender: string = process.env.EMAIL_SENDER as string;
  private transporter: nodemailer.Transporter;

  constructor() {
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
      throw new Error("SMTP credentials are missing");
    }

    // Configuração do transportador Nodemailer
    this.transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort),
      secure: smtpPort === '465', // true para 465, false para outras portas
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
  }

  public async send(to: string, subject: string, text: string, html: string ,email?: string, attachments?: any[]) {
    const mailOptions = {
      from: this.emailSender,
      to,
      subject,
      text,
      html,
      email,
      attachments,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}

export default Mailer;
