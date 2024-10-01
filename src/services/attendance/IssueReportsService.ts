import { AppError } from '../../utils/errors/AppError';
import { GetAllClassesYearService } from '../sigaa/sigaaClass/GetAllClassesYear';
import { IEventActivityRepository } from '../../repository/interfaces/IEventActivityRepository';
import { FetchStudentByClassService } from '../sigaa/sigaaStudent/FetchStudentsByClassService';

export class IssueReportService {
	private getAllClassesYearService: GetAllClassesYearService;
	private eventActivityRepository: IEventActivityRepository;
	private fetchStuentByClassIdService: FetchStudentByClassService;

	constructor(eventActivityRepository: IEventActivityRepository) {
		this.getAllClassesYearService = new GetAllClassesYearService();
		this.eventActivityRepository = eventActivityRepository;
		this.fetchStuentByClassIdService = new FetchStudentByClassService();
	}

	async execute(eventId: number): Promise<any> {
		try {
			const eventActivity = await this.eventActivityRepository.fetchEventActivityById(
				eventId
			);
			const eventYear = eventActivity.eventActivityStartDate.getFullYear();
			const classes = await this.getAllClassesYearService.getAllClassesByYear(eventYear);

			if (classes.length === 0) {
				throw new AppError('Nenhuma turma encontrada para o ano fornecido', 400);
			}

			for (const classItem of classes) {
				const participants = await this.fetchStuentByClassIdService.execute(classItem.id);
				console.log(`Participantes da turma ${classItem.id}:`, participants);
			}
		} catch (error) {
			if (error instanceof AppError) {
				throw error;
			}
			throw new AppError('Erro ao processar o relatório', 500);
		}
	}
}
