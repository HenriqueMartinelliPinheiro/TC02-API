import { sendEmailWithAttachment } from './emailService';

export const enviarEmail = async () => {
	const destinatario = 'henriquepinheiro18@gmail.com';
	const assunto = 'Assunto do Email';
	const mensagem = 'Bom dia';
	const caminhoDoPdf = './caminho/para/seu/arquivo.pdf';

	await sendEmailWithAttachment(destinatario, assunto, mensagem, caminhoDoPdf);
};

