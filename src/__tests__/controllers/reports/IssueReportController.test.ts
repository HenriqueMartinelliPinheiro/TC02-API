import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Request, Response } from 'express';
import { IssueReportController } from '../../../controllers/reports/IssueReportController';
import { IssueReportService } from '../../../services/report/IssueReportsService';
import { Logger } from '../../../loggers/Logger';
import { AppError } from '../../../utils/errors/AppError';
import { issueReportTypes } from '../../../@types/report/IssueReportType';

vi.mock('../../loggers/Logger', () => {
	return {
		Logger: vi.fn().mockImplementation(() => {
			return {
				error: vi.fn(),
				info: vi.fn(),
			};
		}),
	};
});

vi.mock('../../../@types/report/IssueReportType', () => {
	return {
		issueReportTypes: {
			validate: vi.fn().mockImplementation((data) => {
				if (!data.eventId) {
					return { error: { details: [{ message: 'EventId é obrigatório' }] } };
				}
				return { error: null };
			}),
		},
	};
});

describe('IssueReportController', () => {
	let issueReportController: IssueReportController;
	let req: Partial<Request>;
	let res: Partial<Response>;
	let issueReportService: IssueReportService;

	beforeEach(() => {
		vi.clearAllMocks();

		issueReportService = {
			execute: vi.fn(),
		} as unknown as IssueReportService;

		issueReportController = new IssueReportController(issueReportService);

		req = {
			body: {
				eventId: '123',
			},
			requestEmail: 'user@example.com',
		};

		res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn().mockReturnThis(),
		};
	});

	it('should return 400 if validation fails', async () => {
		req.body.eventId = undefined;

		await issueReportController.issueReport(req as Request, res as Response);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			msg: 'EventId é obrigatório',
		});
		expect(issueReportService.execute).not.toHaveBeenCalled();
	});

	it('should return 200 if report is generated successfully', async () => {
		await issueReportController.issueReport(req as Request, res as Response);

		expect(issueReportService.execute).toHaveBeenCalledWith(123, 'user@example.com');
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			msg: 'Relatório de evento 123 gerado com sucesso',
		});
	});

	it('should return the error status code if an AppError is thrown', async () => {
		const appError = new AppError('Erro específico', 404);
		(issueReportService.execute as any).mockRejectedValue(appError);

		await issueReportController.issueReport(req as Request, res as Response);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({
			msg: 'Erro específico',
		});
	});

	it('should return 500 if there is an internal server error', async () => {
		const error = new Error('Erro ao gerar o relatório de evento');
		(issueReportService.execute as any).mockRejectedValue(error);

		await issueReportController.issueReport(req as Request, res as Response);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			msg: 'Erro interno do Servidor',
		});
	});
});
