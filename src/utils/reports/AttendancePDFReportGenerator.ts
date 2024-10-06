import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export class AttendancePDFReportGenerator {
	generateReport(turma: string, date: string, activity: any) {
		const doc = new PDFDocument();

		const sanitizedDate = date.replace(/\//g, '-');

		const fileName = `relatorio_turma_${turma}_${sanitizedDate}.pdf`;

		const filePath = path.resolve(__dirname, '../../../relatorios', fileName);

		const directory = path.dirname(filePath);
		if (!fs.existsSync(directory)) {
			fs.mkdirSync(directory, { recursive: true });
		}

		const writeStream = fs.createWriteStream(filePath);
		doc.pipe(writeStream);

		doc.fontSize(20).text(`Relatório de presenças - Turma ${turma}`, {
			align: 'center',
		});
		doc.moveDown();
		doc.fontSize(16).text(`Data: ${date}`, { align: 'center' });
		doc.moveDown();

		const yPositionBeforeText = doc.y;

		const text = `Atividade: ${activity.title}  Horário: ${activity.startTime} - ${activity.endTime}`;

		const textHeight = doc.heightOfString(text);

		const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
		const rectYOffset = 5;

		doc
			.rect(
				doc.page.margins.left,
				yPositionBeforeText - rectYOffset,
				pageWidth,
				textHeight + rectYOffset
			)
			.fill('#A9A9A9');

		doc.fillColor('black');

		doc.fontSize(16).font('Helvetica-Bold').text(text, {
			align: 'center',
			continued: false,
		});

		doc.moveDown();

		doc.fontSize(12).font('Helvetica');

		if (activity.presentStudents.length > 0) {
			activity.presentStudents.forEach((student, index) => {
				doc.text(
					`${index + 1}. ${student.studentName} (Matrícula: ${
						student.studentRegistration
					}, CPF: ${student.studentCpf})`
				);
			});
		} else {
			doc.text('Nenhum estudante presente.');
		}

		doc.end();

		return new Promise<void>((resolve, reject) => {
			writeStream.on('finish', () => {
				console.log(`Relatório gerado e salvo em: ${filePath}`);
				resolve();
			});

			writeStream.on('error', (error) => {
				console.error('Erro ao salvar o PDF:', error);
				reject(error);
			});
		});
	}
}
