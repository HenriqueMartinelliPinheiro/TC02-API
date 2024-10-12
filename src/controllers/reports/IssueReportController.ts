import { Request, Response } from 'express';
import { IssueReportService } from '../../services/report/IssueReportsService';
import { Logger } from '../../loggers/Logger';
import { reportLogPath } from '../../config/logPaths';
import { AppError } from '../../utils/errors/AppError';
import { issueReportTypes } from '../../@types/report/IssueReportType';

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
			req.body.userEmail = req.requestEmail;
			const { error } = issueReportTypes.validate(req.body);
			if (error) {
				this.logger.error('Erro de validação', req.requestEmail);
				return res.status(400).json({
					msg: error.details[0].message,
				});
			}

			const { eventId } = req.body;
			const userEmail = req.requestEmail;

			await this.issueReportService.execute(Number(eventId), userEmail);

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
