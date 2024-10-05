import { Request, Response } from 'express';
import { IssueReportService } from '../../services/report/IssueReportsService'; // Assumindo que o serviço esteja nesse caminho
import { Logger } from '../../loggers/Logger';
import { reportLogPath } from '../../config/logPaths';
import { AppError } from '../../utils/errors/AppError';

export class IssueReportController {
	private logger: Logger;
	private issueReportService: IssueReportService;

	constructor(issueReportService: IssueReportService) {
		this.issueReportService = issueReportService;
		this.logger = new Logger('IssueReportController', reportLogPath);
		this.issueReport = this.issueReport.bind(this);
	}

	async issueReport(req: Request, res: Response): Promise<Response> {
		try {
			const { eventId } = req.body;

			if (!eventId) {
				this.logger.error('EventId não fornecido', req.requestEmail);
				return res.status(400).json({
					event: undefined,
					msg: 'EventId é obrigatório',
				});
			}

			await this.issueReportService.execute(Number(eventId));

			this.logger.info(
				`Relatório de evento ${eventId} gerado com sucesso`,
				req.requestEmail
			);
			return res.status(200).json({
				msg: `Relatório de evento ${eventId} gerado com sucesso`,
			});
		} catch (error) {
			if (error instanceof AppError) {
				this.logger.error(error.message, req.requestEmail);
				return res.status(error.statusCode).json({
					msg: error.message,
				});
			}

			this.logger.error(
				'Erro ao gerar o relatório de evento',
				req.requestEmail || 'Desconhecido',
				error
			);
			return res.status(500).json({
				msg: 'Erro interno do Servidor',
			});
		}
	}
}
