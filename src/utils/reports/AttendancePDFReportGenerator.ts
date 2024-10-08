import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export class AttendancePDFReportGenerator {
	generateReport(turma: string, date: string, activities: any[], fileName?: string) {
		const doc = new PDFDocument();

		const sanitizedDate = date.replace(/\//g, '-');
		const finalFileName = fileName ?? `relatorio_turma_${turma}_${sanitizedDate}.pdf`;
		console.log('finalFileName:', finalFileName);

		const filePath = path.resolve(__dirname, '../../../relatorios', finalFileName);

		const directory = path.dirname(filePath);
		if (!fs.existsSync(directory)) {
			fs.mkdirSync(directory, { recursive: true });
		}

		const writeStream = fs.createWriteStream(filePath);
		doc.pipe(writeStream);

		// Conteúdo do PDF
		doc
			.fontSize(20)
			.font('Helvetica-Bold')
			.text(`Relatório de presenças - Turma ${turma}`, {
				align: 'center',
			});
		doc.moveDown();
		doc.fontSize(16).text(`Data: ${date}`, { align: 'center' });
		doc.moveDown();

		activities.forEach((activity, index) => {
			const yPositionBeforeText = doc.y;
			const text = `Atividade: ${activity.title}  Horário: ${activity.startTime} - ${activity.endTime}`;
			const textHeight = doc.heightOfString(text);
			const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
			const rectYOffset = 5;
			const rectHeightAdjustment = index > 0 ? 5 : 0; // Reduz a altura da linha cinza a partir da segunda linha

			doc
				.rect(
					doc.page.margins.left,
					yPositionBeforeText - rectYOffset,
					pageWidth,
					textHeight + rectYOffset + rectHeightAdjustment
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
				activity.presentStudents.forEach((student, studentIndex) => {
					doc.text(
						`${studentIndex + 1}. ${student.studentName} (Matrícula: ${
							student.studentRegistration
						}, CPF: ${student.studentCpf})`
					);
				});
			} else {
				doc.text('Nenhum estudante presente.');
			}

			// Adiciona linha separadora entre atividades
			if (index < activities.length - 1) {
				doc.moveDown();
				doc
					.strokeColor('#000000')
					.lineWidth(1)
					.moveTo(doc.page.margins.left, doc.y)
					.lineTo(pageWidth + doc.page.margins.left, doc.y)
					.stroke();
				doc.moveDown();
			}
		});

		// Adiciona rodapé com data e hora de emissão do relatório
		doc.fontSize(10).font('Helvetica').fillColor('black');
		doc.text(
			`Emitido em: ${new Date().toLocaleString('pt-BR')}`,
			doc.page.margins.left,
			doc.page.height - 40,
			{
				align: 'center',
				lineBreak: false,
			}
		);

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
