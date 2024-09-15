import { Attendance } from '@prisma/client';
import { AttendanceDomain } from '../../domain/AttendanceDomain';
import { IAttendanceRepository } from '../../repository/interfaces/IAttendanceRepository';
import { FetchStudentByCpfService } from '../student/FetchStudentByCpfService';
import { EventCourseRepository } from '../../repository/implementation/EventCourseRepository';
import { EventLocationRepository } from '../../repository/implementation/EventLocationRepository';
import { calculateDistance } from '../../utils/calculateDistance';
import { AppError } from '../../utils/errors/AppError';

export class CreateAttendanceService {
	private attendanceRepository: IAttendanceRepository;
	private fetchStudentByCpfService: FetchStudentByCpfService;
	private eventCourseRepository: EventCourseRepository;
	private eventLocationRepository: EventLocationRepository;

	constructor(
		attendanceRepository: IAttendanceRepository,
		eventCourseRepository: EventCourseRepository,
		eventLocationRepository: EventLocationRepository
	) {
		this.attendanceRepository = attendanceRepository;
		this.fetchStudentByCpfService = new FetchStudentByCpfService();
		this.eventCourseRepository = eventCourseRepository;
		this.eventLocationRepository = eventLocationRepository;
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

	private async validateStudentCourse(eventID: number, courseId: number): Promise<void> {
		const eventCourse = await this.eventCourseRepository.findEventCourse(
			eventID,
			courseId
		);

		if (!eventCourse) {
			throw new AppError(`Curso não encontrado para o evento ${eventID}`, 400);
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

			await this.validateStudentCourse(eventID, courseId);

			await this.validateStudentLocation(eventID, studentLatitude, studentLongitude);

			return this.attendanceRepository.createAttendance(attendanceData);
		} catch (error) {
			if (error instanceof AppError) {
				throw error;
			}

			throw new Error('Erro ao processar a presença do aluno');
		}
	}
}
