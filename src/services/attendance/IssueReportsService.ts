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

				// Processar o cronograma de cada turma
				const classSchedule = classItem.descricaoHorario; // Supondo que o campo de cronograma seja `descricaoHorario`
				const classDays = this.scheduleProcessor.processSchedule(classSchedule); // Obter as datas de aula da turma

				// Converter as datas de aula da turma para um formato que podemos comparar
				const classDaysSet = new Set(classDays); // Para comparações rápidas

				// Passo 4: Verificar atividades por dia
				for (const activity of eventActivities) {
					const activityDate =
						activity.eventActivityStartDate.toLocaleDateString('pt-BR'); // Converte para o formato `dd/mm/yyyy`

					// Verificar se a atividade está em um dos dias de aula da turma
					if (!classDaysSet.has(activityDate)) {
						continue; // Pular se a atividade não for no dia de aula da turma
					}

					// Aqui você pode processar os alunos da turma para aquela atividade e gerar o relatório
					console.log(
						`Turma ${classItem.name} tem aula no dia ${activityDate} e há uma atividade: ${activity.eventActivityTitle}`
					);

					// Exemplo de como buscar as presenças e processar o relatório
					const attendanceRecords =
						await this.attendanceRepository.fetchAttendancesByActivity(
							activity.eventActivityId
						);
					const studentAttendance = attendanceRecords.filter((att) =>
						participants.some((p) => p.studentRegistration === att.studentRegistration)
					);

					// Aqui você pode fazer algo com essas informações, como gerar o relatório
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
