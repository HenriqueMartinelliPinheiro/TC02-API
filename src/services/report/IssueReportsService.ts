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
			const eventActivities = await this.fetchEventActivities(eventId);
			const classes = await this.fetchClassesByEventYear(
				eventActivities[0].eventActivityStartDate.getFullYear()
			);
			const { reportDataByClassAndDate, pdfPathsByTeacher } = await this.processClasses(
				eventActivities,
				classes
			);
			await this.sendReportsToTeachers(
				pdfPathsByTeacher,
				eventActivities[0].eventActivityTitle
			);
			await this.sendReportsToOrganizer(
				userEmail,
				eventActivities[0].eventActivityTitle,
				pdfPathsByTeacher
			);
		} catch (error) {
			throw error;
		}
	}

	private async fetchEventActivities(eventId: number) {
		const eventActivities =
			await this.eventActivityRepository.fetchEventActivitiesByEventId(eventId);
		if (eventActivities.length === 0) {
			throw new AppError('Nenhuma atividade para o evento', 400);
		}
		return eventActivities;
	}

	private async fetchClassesByEventYear(eventYear: number) {
		const classes = await this.getAllClassesYearService.getAllClassesByYear(eventYear);
		if (classes.length === 0) {
			throw new AppError('Nenhuma turma encontrada para o ano fornecido', 400);
		}
		return classes;
	}

	private async processClasses(eventActivities: any[], classes: any[]) {
		const reportDataByClassAndDate: Record<string, any> = {};
		const pdfPathsByTeacher: Record<string, string[]> = {};

		for (const classItem of classes) {
			const classSchedule = classItem['descricao-horario'];
			const classDays = this.processClassSchedule(
				classSchedule,
				classItem['codigo-turma']
			);
			const participants = await this.fetchStudentByClassService.execute(
				classItem['id-turma']
			);
			const teacherId = classItem['id-docente'];

			await this.processEventActivitiesForClass(
				eventActivities,
				classDays,
				participants,
				classItem,
				reportDataByClassAndDate,
				pdfPathsByTeacher,
				teacherId
			);
		}

		return { reportDataByClassAndDate, pdfPathsByTeacher };
	}

	private processClassSchedule(classSchedule: string, classCode: string): string[] {
		try {
			return this.scheduleProcessor.processSchedule(classSchedule);
		} catch (error) {
			throw new AppError(
				`Erro ao processar cronograma da turma ${classCode}: ${error.message}`,
				500
			);
		}
	}

	private async processEventActivitiesForClass(
		eventActivities: any[],
		classDays: string[],
		participants: any[],
		classItem: any,
		reportDataByClassAndDate: Record<string, any>,
		pdfPathsByTeacher: Record<string, string[]>,
		teacherId: string
	) {
		for (const activity of eventActivities) {
			const activityDates = this.generateDateRange(
				activity.eventActivityStartDate,
				activity.eventActivityEndDate
			);
			const activityStartTime = this.extractTime(activity.eventActivityStartDate);
			const activityEndTime = this.extractTime(activity.eventActivityEndDate);

			for (const activityDate of activityDates) {
				if (classDays.includes(activityDate)) {
					await this.processAttendances(
						activity,
						activityDate,
						participants,
						classItem,
						activityStartTime,
						activityEndTime,
						reportDataByClassAndDate
					);
				}
			}
		}

		await this.generatePDFReports(reportDataByClassAndDate, pdfPathsByTeacher, teacherId);
	}

	private async processAttendances(
		activity: any,
		activityDate: string,
		participants: any[],
		classItem: any,
		activityStartTime: string,
		activityEndTime: string,
		reportDataByClassAndDate: Record<string, any>
	) {
		try {
			const attendances = await this.attendanceRepository.fetchAttendancesByActivity(
				activity.eventActivityId
			);

			if (attendances.length > 0) {
				const presentStudents = attendances.filter((attendance) => {
					const attendanceDate = new Date(attendance.createdAt).toLocaleDateString(
						'pt-BR',
						{
							year: 'numeric',
							month: '2-digit',
							day: '2-digit',
						}
					);
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
				}
			}
		} catch (error) {
			throw error;
		}
	}

	private async generatePDFReports(
		reportDataByClassAndDate: Record<string, any>,
		pdfPathsByTeacher: Record<string, string[]>,
		teacherId: string
	) {
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

			if (!pdfPathsByTeacher[teacherId]) {
				pdfPathsByTeacher[teacherId] = [];
			}
			pdfPathsByTeacher[teacherId].push(filePath);
		}
	}

	private async sendReportsToTeachers(
		pdfPathsByTeacher: Record<string, string[]>,
		eventName: string
	) {
		for (const teacherId in pdfPathsByTeacher) {
			const teacher = await this.fetchTeacherById.getTeacherById(parseInt(teacherId));
			const pdfPaths = pdfPathsByTeacher[teacherId];
			const emailSubject = `Relatórios de Presença do Evento: ${eventName}`;
			const emailText = `Segue em anexo os relatórios de presença das turmas do evento "${eventName}".`;

			await sendEmailWithAttachment(teacher.email, emailSubject, emailText, pdfPaths);
		}
	}

	private async sendReportsToOrganizer(
		userEmail: string,
		eventName: string,
		pdfPathsByTeacher: Record<string, string[]>
	) {
		const emailSubjectOrganizer = `Relatórios de Presença do Evento: ${eventName}`;
		const emailTextOrganizer = `Segue em anexo os relatórios de presença do evento "${eventName}".`;
		const allPdfPaths = Object.values(pdfPathsByTeacher).flat();

		await sendEmailWithAttachment(
			userEmail,
			emailSubjectOrganizer,
			emailTextOrganizer,
			allPdfPaths
		);
	}
}
