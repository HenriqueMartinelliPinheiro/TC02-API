import nodemailer from 'nodemailer';
import { createReadStream } from 'fs';

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'eventosifcvideira@gmail.com',
		pass: process.env.EMAIL_SERVICE_PASSWORD,
	},
});

export const sendEmailWithAttachment = async (
	to: string,
	subject: string,
	text: string,
	pdfPaths: string[]
) => {
	try {
		const attachments = pdfPaths.map((path) => ({
			filename: path.split('/').pop(),
			content: createReadStream(path),
		}));

		const mailOptions = {
			from: 'eventosifcvideira@gmail.com',
			to,
			subject,
			text,
			attachments,
		};

		const info = await transporter.sendMail(mailOptions);
		console.log('Email enviado: ', info.response);
	} catch (error) {
		console.error('Erro ao enviar o email: ', error);
	}
};
