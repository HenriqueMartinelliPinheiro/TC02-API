import { Attendance } from '@prisma/client';
import { AttendanceDomain } from '../../domain/AttendanceDomain';
import { IAttendanceRepository } from '../../repository/interfaces/IAttendanceRepository';
import { FetchStudentByCpfService } from '../sigaa/sigaaStudent/FetchStudentByCpfService';
import { calculateDistance } from '../../utils/calculateDistance';
import { AppError } from '../../utils/errors/AppError';
import { IEventActivityRepository } from '../../repository/interfaces/IEventActivityRepository';
import { IEventCourseRepository } from '../../repository/interfaces/IEventCourseRepository';
import { IEventLocationRepository } from '../../repository/interfaces/IEventLocationRepository';
import { IEventRepository } from '../../repository/interfaces/IEventRepository';

export class CreateAttendanceService {
	private attendanceRepository: IAttendanceRepository;
	private fetchStudentByCpfService: FetchStudentByCpfService;
	private eventCourseRepository: IEventCourseRepository;
	private eventLocationRepository: IEventLocationRepository;
	private eventActivityRepository: IEventActivityRepository;
	private eventRepository: IEventRepository;

	constructor(
		attendanceRepository: IAttendanceRepository,
		eventCourseRepository: IEventCourseRepository,
		eventLocationRepository: IEventLocationRepository,
		eventActivityRepository: IEventActivityRepository,
		eventRepository: IEventRepository
	) {
		this.attendanceRepository = attendanceRepository;
		this.fetchStudentByCpfService = new FetchStudentByCpfService();
		this.eventCourseRepository = eventCourseRepository;
		this.eventLocationRepository = eventLocationRepository;
		this.eventActivityRepository = eventActivityRepository;
		this.eventRepository = eventRepository;
	}

	private async validateStudentLocation(
		eventID: number,
		studentLatitude: number,
		studentLongitude: number
	): Promise<void> {
		const eventLocation = await this.eventLocationRepository.findEventLocationByEventId(
			eventID
		);

		if (!eventLocation) {
			throw new AppError(
				`Localização do evento não encontrada para o evento ${eventID}`,
				404
			);
		}

		const distance = calculateDistance(
			eventLocation.latitude,
			eventLocation.longitude,
			studentLatitude,
			studentLongitude
		);

		if (distance > eventLocation.radius) {
			throw new AppError(
				'A localização do aluno está fora do raio permitido para o evento',
				400
			);
		}
	}

	private async validateActivityTime(
		eventActivityId: number,
		currentTime: Date
	): Promise<void> {
		const eventActivity = await this.eventActivityRepository.fetchEventActivityById(
			eventActivityId
		);

		if (!eventActivity) {
			throw new AppError('Atividade não encontrada', 404);
		}

		const { eventActivityStartDate, eventActivityEndDate } = eventActivity;

		if (currentTime < eventActivityStartDate || currentTime > eventActivityEndDate) {
			throw new AppError(
				'O horário de registro está fora do intervalo permitido para esta atividade',
				400
			);
		}
	}

	private async validateStudentCourse(eventID: number, courseId: number): Promise<void> {
		const eventCourse = await this.eventCourseRepository.findEventCourse(
			eventID,
			courseId
		);

		if (!eventCourse) {
			throw new AppError(`Curso não encontrado para o evento ${eventID}`, 400);
		}
	}

	private async validateExistingAttendance(
		studentCpf: string,
		eventActivityId: number
	): Promise<void> {
		const existingAttendance =
			await this.attendanceRepository.fetchAttendanceByCpfAndActivity(
				studentCpf,
				eventActivityId
			);

		if (existingAttendance) {
			throw new AppError(
				'O aluno já tem uma presença registrada para esta atividade',
				400
			);
		}
	}

	private async validateEventStatus(eventID: number): Promise<void> {
		const event = await this.eventRepository.fetchEventById(eventID);
		if (!event) {
			throw new AppError(`Evento não encontrado para o ID ${eventID}`, 404);
		}

		if (event.eventStatus !== 'EM_ANDAMENTO') {
			throw new AppError(
				'O evento não está em andamento. Registro de presença não permitido.',
				400
			);
		}
	}

	async execute(
		attendanceData: AttendanceDomain,
		eventID: number,
		studentLatitude: number,
		studentLongitude: number
	): Promise<Attendance> {
		try {
			const students = await this.fetchStudentByCpfService.fetchStudentByCpf(
				attendanceData.getStudentCpf()
			);

			if (students.length === 0) {
				throw new AppError('Estudante não encontrado com o CPF fornecido', 404);
			}

			const student = students[0];
			const courseId = student.idCurso;

			await this.validateEventStatus(eventID);

			await this.validateExistingAttendance(
				attendanceData.getStudentCpf(),
				attendanceData.getEventActivity().getEventActivityId()
			);

			await this.validateStudentCourse(eventID, courseId);
			await this.validateStudentLocation(eventID, studentLatitude, studentLongitude);

			const currentTime = new Date();
			await this.validateActivityTime(
				attendanceData.getEventActivity().getEventActivityId(),
				currentTime
			);

			return this.attendanceRepository.createAttendance(attendanceData);
		} catch (error) {
			if (error instanceof AppError) {
				throw error;
			}
			throw new AppError('Erro ao processar a presença do aluno', 500);
		}
	}
}
