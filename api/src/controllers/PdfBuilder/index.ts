import { Response, Request } from 'express';
import { prisma } from '../../database/prisma';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import extenso from 'extenso';
import { calcEndDate, calculateAge, formatDateForToday } from '../../utils';

const PdfBuilder = async (request: Request, response: Response) => {
    const { id } = request.params;
    
    try {
        const loan = await prisma.loan.findUnique({
            where: { id: id },
            include: {
                customer: true, // Inclui os dados do cliente
            },
        });

        if (!loan || !loan.customer) {
            return response.status(404).json({ error: 'Empréstimo ou cliente não encontrado' });
        }

        // Caminho para o arquivo HTML
        const htmlFilePath = path.join(__dirname, './views/index.html');
        if (!fs.existsSync(htmlFilePath)) {
            return response.status(500).json({ error: 'Arquivo HTML não encontrado' });

        }

        const loanAmount = loan.loanAmount;
        const loanAmountInWords = extenso(loanAmount).toString();

        const balanceDue = loan.balanceDue;
        const balanceDueInWords = extenso(balanceDue).toString();

        // Calcular a idade com base na data de nascimento do cliente
        const age = String(calculateAge(loan.customer.dateOfBirth));

        const htmlTemplate = fs.readFileSync(htmlFilePath, 'utf-8');
        const formattedDate = loan.createdAt.toLocaleDateString('pt-BR'); // Formata a data como dd/MM/yyyy



        // Substituir as variáveis no template HTML com os dados do empréstimo e cliente
        const html = htmlTemplate
            .replace('{{ customerFullName }}', loan.customer.fullName)
            .replace('{{ customerSignature }}', loan.customer.fullName)
            .replace('{{ customerEmail }}', loan.customer.email)
            .replace('{{ customerIDNumber }}', loan.customer.identityNumber)
            .replace('{{ customerMaritalStatus }}', loan.customer.marital_status)
            .replace('{{ customerContact }}', loan.customer.contact)
            .replace('{{ customerAddress }}', loan.customer.address)
            .replace('{{ customerAge }}', age)
            .replace('{{ loanAmount }}', loan.loanAmount.toFixed(2))
            .replace('{{ loanAmountInWords }}', loanAmountInWords)
            .replace('{{ loanAmountII }}', loan.loanAmount.toFixed(2))
            .replace('{{ balanceDue }}', loan.balanceDue.toFixed(2))
            .replace('{{ balanceDueInWords }}', balanceDueInWords)
            .replace('{{ paymentTerm }}', `${loan.paymentTerm} meses`)
            .replace('{{ paymentMethod }}', loan.paymentMethod)
            .replace('{{ paymentProfession }}', loan.customer.profession)
            .replace('{{ Date }}', formattedDate)
            .replace('{{ EndDate }}', calcEndDate(loan.createdAt))
            .replace('{{ Today }}', formatDateForToday())
            .replace('{{ collateral }}', loan.collateral || 'Nenhum')


        // Gerar o PDF usando Puppeteer
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });

        const pdf = await page.pdf({ format: 'A4', printBackground: true });
        await browser.close();

        // Definir o cabeçalho para o download do arquivo PDF
        const filename = `${encodeURIComponent(loan.customer.fullName)}-Contracto-Financeiro.pdf`;
        response.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        response.setHeader('Content-Type', 'application/pdf');
        return response.end(pdf);
    } catch (error) {
        console.error('Erro ao gerar o PDF:', error);
        return response.status(500).json({ error: 'Erro ao gerar o PDF' });
    }
};

export { PdfBuilder };
