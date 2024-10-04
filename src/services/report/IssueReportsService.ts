import { AppError } from '../../utils/errors/AppError';
import { GetAllClassesYearService } from '../sigaa/sigaaClass/GetAllClassesYear';
import { IEventActivityRepository } from '../../repository/interfaces/IEventActivityRepository';
import { FetchStudentByClassService } from '../sigaa/sigaaStudent/FetchStudentsByClassService';
import { IAttendanceRepository } from '../../repository/interfaces/IAttendanceRepository';
import { ScheduleProcessor } from '../../utils/ScheduleProcess';

export class IssueReportService {
	private getAllClassesYearService: GetAllClassesYearService;
	private eventActivityRepository: IEventActivityRepository;
	private fetchStudentByClassIdService: FetchStudentByClassService;
	private attendanceRepository: IAttendanceRepository;

	private classParticipantsCache: Map<number, any[]> = new Map();
	private scheduleProcessor: ScheduleProcessor = new ScheduleProcessor();

	constructor(
		eventActivityRepository: IEventActivityRepository,
		attendanceRepository: IAttendanceRepository
	) {
		this.getAllClassesYearService = new GetAllClassesYearService();
		this.eventActivityRepository = eventActivityRepository;
		this.fetchStudentByClassIdService = new FetchStudentByClassService();
		this.attendanceRepository = attendanceRepository;
	}

	async execute(eventId: number): Promise<void> {
		try {
			const eventActivities =
				await this.eventActivityRepository.fetchEventActivitiesByEventId(eventId);

			if (eventActivities.length === 0) {
				throw new AppError('No activities found for the given event', 400);
			}

			const eventYear = eventActivities[0].eventActivityStartDate.getFullYear();

			const classes = await this.getAllClassesYearService.getAllClassesByYear(eventYear);

			if (classes.length === 0) {
				throw new AppError('No classes found for the provided year', 400);
			}

			for (const classItem of classes) {
				let participants = this.classParticipantsCache.get(classItem.id);
				if (!participants) {
					participants = await this.fetchStudentByClassIdService.execute(classItem.id);
					this.classParticipantsCache.set(classItem.id, participants);
				}

				const classSchedule = classItem.descricaoHorario;
				const classDays = this.scheduleProcessor.processSchedule(classSchedule);
				const classDaysSet = new Set(classDays);

				for (const activity of eventActivities) {
					const activityDate =
						activity.eventActivityStartDate.toLocaleDateString('pt-BR');

					if (!classDaysSet.has(activityDate)) {
						continue;
					}

					console.log(
						`Turma ${classItem.name} tem aula no dia ${activityDate} e há uma atividade: ${activity.eventActivityTitle}`
					);

					const attendanceRecords =
						await this.attendanceRepository.fetchAttendancesByActivity(
							activity.eventActivityId
						);
					const studentAttendance = attendanceRecords.filter((att) =>
						participants.some((p) => p.studentRegistration === att.studentRegistration)
					);

					console.log(
						`Participantes na atividade:`,
						studentAttendance.map((s) => s.studentName)
					);
				}
			}

			console.log('Classes and activities processed successfully!');
		} catch (error) {
			if (error instanceof AppError) {
				throw error;
			}
			throw new AppError('Error processing the report', 500);
		}
	}
}
