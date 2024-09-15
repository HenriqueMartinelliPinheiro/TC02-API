import { Attendance } from '@prisma/client';
import { AttendanceDomain } from '../../domain/AttendanceDomain';
import { IAttendanceRepository } from '../../repository/interfaces/IAttendanceRepository';
import { FetchStudentByCpfService } from '../student/FetchStudentByCpfService';
import { EventCourseRepository } from '../../repository/implementation/EventCourseRepository';
import { EventLocationRepository } from '../../repository/implementation/EventLocationRepository';
import { calculateDistance } from '../../utils/calculateDistance';

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
			throw new Error(`Localização do evento não encontrada para o evento ${eventID}`);
		}

		const distance = calculateDistance(
			eventLocation.latitude,
			eventLocation.longitude,
			studentLatitude,
			studentLongitude
		);

		if (distance > eventLocation.radius) {
			throw new Error('A localização do aluno está fora do raio permitido para o evento');
		}
	}

	private async validateStudentCourse(eventID: number, courseId: number): Promise<void> {
		const eventCourse = await this.eventCourseRepository.findEventCourse(
			eventID,
			courseId
		);

		if (!eventCourse) {
			throw new Error(`Curso não encontrado para o evento ${eventID}`);
		}
	}

	async execute(
		attendanceData: AttendanceDomain,
		eventID: number,
		studentLatitude: number,
		studentLongitude: number
	): Promise<Attendance> {
		const students = await this.fetchStudentByCpfService.fetchStudentByCpf(
			attendanceData.getStudentCpf()
		);

		if (students.length === 0) {
			throw new Error('Estudante não encontrado com o CPF fornecido');
		}

		const student = students[0];
		const courseId = student.idCurso;

		await this.validateStudentCourse(eventID, courseId);

		await this.validateStudentLocation(eventID, studentLatitude, studentLongitude);

		return this.attendanceRepository.createAttendance(attendanceData);
	}
}
