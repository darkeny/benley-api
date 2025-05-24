import { Express } from "express";
import { IbuildRouter } from "./IbuildRouter";
import { SendMail } from "./WelcomeEmailSender";
import { IbuildRouterLoan } from "./ibuildRouterLoan";
import { AdminRouter } from "./adminUser";
import { AdminLogin } from "./AdminLogin";
import { NewsletterRouter } from "./Newsletter";
import { UserLogin } from "./ClientsLogin";
import { UserAuthRouter } from "./UserRoutes";
import { SendMessage } from "./ContactEmailSender";
import { SendMessageToClient } from "./LoansEmailSender";
import { SendMessageToAdmins } from "./LoansEmailSenders";
import { SendAprovedMail } from "./LoansEmailSenderAproved";
import { SendRefusedMail } from "./LoansEmailSenderRefused";
import { SendPaydMail } from "./LoansEmailsSenderPayd";
import { PdfBuilder } from "./pdfBuilder";



const ServerRouters = (server: Express): void => {
    server.use('/SendMail', SendMail)
    server.use('/sendLoansMail', SendMessageToClient)
    server.use('/sendLoansMailAprove', SendAprovedMail)
    server.use('/sendLoansMailRefused', SendRefusedMail)
    server.use('/sendLoansMailPayd', SendPaydMail)
    server.use('/sendLoansMailToAdmins', SendMessageToAdmins)
    server.use('/sendMessage', SendMessage)
    server.use('/ibuildCustomer', IbuildRouter) // endeponit dos usuarios
    server.use('/ibuildLoan', IbuildRouterLoan) // endeponit dos emprestimos dos usuarios
    server.use('/admin/users', AdminRouter)
    server.use('/admin/login', AdminLogin)
    server.use('/user/login', UserLogin) // endeponit de login que leva os usuarios para o painel deles
    server.use('/newsletter', NewsletterRouter);
    server.use('/pdfBuilder', PdfBuilder);
    server.use('/me', UserAuthRouter);
};

export default ServerRouters;
