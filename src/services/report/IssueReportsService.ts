import axios from 'axios';
import { AppError } from '../../utils/errors/AppError';
import { GetAllClassesYearService } from '../sigaa/sigaaClass/GetAllClassesYear';
import { IEventActivityRepository } from '../../repository/interfaces/IEventActivityRepository';
import { IAttendanceRepository } from '../../repository/interfaces/IAttendanceRepository';
import { ScheduleProcessor } from '../../utils/ScheduleProcess';
import { FetchStudentByClassService } from '../../services/sigaa/sigaaStudent/FetchStudentsByClassService';

export class IssueReportService {
	private getAllClassesYearService: GetAllClassesYearService;
	private eventActivityRepository: IEventActivityRepository;
	private attendanceRepository: IAttendanceRepository;
	private scheduleProcessor: ScheduleProcessor = new ScheduleProcessor();
	private fetchStudentByClassService: FetchStudentByClassService =
		new FetchStudentByClassService();

	constructor(
		eventActivityRepository: IEventActivityRepository,
		attendanceRepository: IAttendanceRepository
	) {
		this.getAllClassesYearService = new GetAllClassesYearService();
		this.eventActivityRepository = eventActivityRepository;
		this.attendanceRepository = attendanceRepository;
	}

	normalizeDate(date: Date): Date {
		return new Date(date.getFullYear(), date.getMonth(), date.getDate());
	}

	generateDateRange(startDate: Date, endDate: Date): string[] {
		const dateRange: string[] = [];
		let currentDate = this.normalizeDate(startDate);
		const normalizedEndDate = this.normalizeDate(endDate);

		while (currentDate <= normalizedEndDate) {
			dateRange.push(
				currentDate.toLocaleDateString('pt-BR', {
					year: 'numeric',
					month: '2-digit',
					day: '2-digit',
				})
			);
			currentDate.setDate(currentDate.getDate() + 1);
		}

		return dateRange;
	}

	async execute(eventId: number): Promise<void> {
		try {
			const eventActivities =
				await this.eventActivityRepository.fetchEventActivitiesByEventId(eventId);
			if (eventActivities.length === 0) {
				throw new AppError('Nenhuma atividade para o evento', 400);
			}

			const eventYear = eventActivities[0].eventActivityStartDate.getFullYear();
			const classes = await this.getAllClassesYearService.getAllClassesByYear(eventYear);
			if (classes.length === 0) {
				throw new AppError('Nenhuma turma encontrada para o ano fornecido', 400);
			}

			for (const classItem of classes) {
				const classSchedule = classItem['descricao-horario'];
				let classDays: string[];

				try {
					classDays = this.scheduleProcessor.processSchedule(classSchedule);
					// console.log(
					// 	`Processando turma ${classItem['codigo-turma']} com cronograma:`,
					// 	classDays
					// );
				} catch (error) {
					throw new AppError(
						`Erro ao processar cronograma da turma ${classItem['codigo-turma']}: ${error.message}`,
						500
					);
				}

				const participants = await this.fetchStudentByClassService.execute(
					classItem['id-turma']
				);

				// console.log(`Participantes da turma ${classItem['codigo-turma']}:`, participants);

				for (const activity of eventActivities) {
					const startDate = activity.eventActivityStartDate;
					const endDate = activity.eventActivityEndDate;
					const activityDates = this.generateDateRange(startDate, endDate);

					for (const activityDate of activityDates) {
						if (classDays.includes(activityDate)) {
							try {
								const attendances =
									await this.attendanceRepository.fetchAttendancesByActivity(
										activity.eventActivityId
									);
								if (attendances.length > 0) {
									const presentStudents = attendances.filter((attendance) => {
										const attendanceDate = new Date(
											attendance.createdAt
										).toLocaleDateString('pt-BR', {
											year: 'numeric',
											month: '2-digit',
											day: '2-digit',
										});
										return (
											participants.some(
												(participant) => participant['cpf-cnpj'] === attendance.studentCpf
											) && attendanceDate === activityDate
										);
									});

									if (presentStudents.length > 0) {
										console.log(
											`Relatório de presenças para a turma ${classItem['codigo-turma']} no dia ${activityDate}:`,
											presentStudents
										);
									}
								}
							} catch (error) {
								console.error(`Erro ao buscar presenças: ${error.message}`);
							}
						}
					}
				}
			}
		} catch (error) {
			console.log(error);
			throw error;
		}
	}
}
