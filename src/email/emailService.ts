import nodemailer from 'nodemailer';

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
	pdfPath: string
) => {
	try {
		const mailOptions = {
			from: 'seu-email@gmail.com',
			to,
			subject,
			text,
			// attachments: [
			// 	{
			// 		filename: 'arquivo.pdf',
			// 		content: createReadStream(pdfPath),
			// 	},
			// ],
		};

		const info = await transporter.sendMail(mailOptions);
		console.log('Email enviado: ', info.response);
	} catch (error) {
		console.error('Erro ao enviar o email: ', error);
	}
};
