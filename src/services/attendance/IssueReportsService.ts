import axios from 'axios';
import { AppError } from '../../utils/errors/AppError';
import { GetAllClassesYearService } from '../sigaa/sigaaClass/GetAllClassesYear';
import { IEventRepository } from '../../repository/interfaces/IEventRepository';

export class IssueReportService {
	private getAllClassesYearService: GetAllClassesYearService;
	private eventRepository: IEventRepository;

	constructor(eventRepository: IEventRepository) {
		this.getAllClassesYearService = new GetAllClassesYearService();
		this.eventRepository = eventRepository;
	}

	async execute(eventYear: number): Promise<any> {
		try {
			const classes = await this.getAllClassesYearService.getAllClassesByYear(eventYear);

			if (classes.length === 0) {
				throw new AppError('Nenhuma turma encontrada para o ano fornecido', 400);
			}
		} catch (error) {
			if (error instanceof AppError) {
				throw error;
			}

			throw new AppError('Erro ao processar o relatório', 500);
		}
	}
}
