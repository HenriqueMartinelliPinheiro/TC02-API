import { AppError } from '../../utils/errors/AppError';
import { GetAllClassesYearService } from '../sigaa/sigaaClass/GetAllClassesYear';
import { IEventActivityRepository } from '../../repository/interfaces/IEventActivityRepository';
import { IAttendanceRepository } from '../../repository/interfaces/IAttendanceRepository';
import { ScheduleProcessor } from '../../utils/ScheduleProcess';
import { FetchStudentByClassService } from '../../services/sigaa/sigaaStudent/FetchStudentsByClassService';
import { AttendancePDFReportGenerator } from '../../utils/reports/AttendancePDFReportGenerator';
import { sendEmailWithAttachment } from '../../email/emailService';
import { FetchTeacherById } from '../../services/sigaa/sigaaTeacher/FetchTeacherById';

export class IssueReportService {
	private getAllClassesYearService: GetAllClassesYearService;
	private eventActivityRepository: IEventActivityRepository;
	private attendanceRepository: IAttendanceRepository;
	private scheduleProcessor: ScheduleProcessor = new ScheduleProcessor();
	private fetchStudentByClassService: FetchStudentByClassService =
		new FetchStudentByClassService();
	private pdfReportGenerator: AttendancePDFReportGenerator =
		new AttendancePDFReportGenerator();
	private fetchTeacherById: FetchTeacherById = new FetchTeacherById();

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

	extractTime(date: Date): string {
		return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
	}

	async execute(eventId: number, userEmail: string): Promise<void> {
		try {
			const eventActivities =
				await this.eventActivityRepository.fetchEventActivitiesByEventId(eventId);
			if (eventActivities.length === 0) {
				throw new AppError('Nenhuma atividade para o evento', 400);
			}

			const eventName = eventActivities[0].eventActivityTitle; // Nome do evento
			const eventYear = eventActivities[0].eventActivityStartDate.getFullYear();
			const classes = await this.getAllClassesYearService.getAllClassesByYear(eventYear);
			if (classes.length === 0) {
				throw new AppError('Nenhuma turma encontrada para o ano fornecido', 400);
			}

			const reportDataByClassAndDate: Record<string, any> = {};
			const pdfPaths: string[] = [];

			for (const classItem of classes) {
				const classSchedule = classItem['descricao-horario'];
				let classDays: string[];

				try {
					classDays = this.scheduleProcessor.processSchedule(classSchedule);
					console.log(
						`Cronograma da turma id: ${classItem['id-turma']}, horário: ${classSchedule}`
					);
					console.log(classDays);
				} catch (error) {
					throw new AppError(
						`Erro ao processar cronograma da turma ${classItem['codigo-turma']}: ${error.message}`,
						500
					);
				}

				const participants = await this.fetchStudentByClassService.execute(
					classItem['id-turma']
				);

				for (const activity of eventActivities) {
					const startDate = activity.eventActivityStartDate;
					const endDate = activity.eventActivityEndDate;
					const activityDates = this.generateDateRange(startDate, endDate);

					const activityStartTime = this.extractTime(activity.eventActivityStartDate);
					const activityEndTime = this.extractTime(activity.eventActivityEndDate);

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
										const classKey = `${classItem['codigo-turma']}_${activityDate}`;
										if (!reportDataByClassAndDate[classKey]) {
											reportDataByClassAndDate[classKey] = {
												classCode: classItem['codigo-turma'],
												date: activityDate,
												activities: [],
											};
										}

										reportDataByClassAndDate[classKey].activities.push({
											title: activity.eventActivityTitle,
											startTime: activityStartTime,
											endTime: activityEndTime,
											presentStudents,
										});

										const teacherId = classItem['id-docente'];
										const teacher = await this.fetchTeacherById.getTeacherById(teacherId);
										console.log('ID do Docente', classItem['id-docente']);
										console.log(
											`Dados do professor da turma ${classItem['codigo-turma']}:`,
											teacher
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

			for (const key in reportDataByClassAndDate) {
				const reportData = reportDataByClassAndDate[key];
				const reportFileName = `relatorio_turma_${
					reportData.classCode
				}_${reportData.date.replace(/\//g, '-')}.pdf`;

				const filePath = await this.pdfReportGenerator.generateReport(
					reportData.classCode,
					reportData.date,
					reportData.activities,
					reportFileName
				);

				pdfPaths.push(filePath);
			}

			const emailSubject = `Relatórios de Presença do Evento: ${eventName}`;
			const emailText = `Segue em anexo os relatórios de presença do evento "${eventName}".`;

			await sendEmailWithAttachment(userEmail, emailSubject, emailText, pdfPaths);
		} catch (error) {
			console.log(error);
			throw error;
		}
	}
}
