import { describe, it, expect, beforeEach, vi } from 'vitest';
import { IAttendanceRepository } from '../../../repository/interfaces/IAttendanceRepository';
import { IEventCourseRepository } from '../../../repository/interfaces/IEventCourseRepository';
import { IEventLocationRepository } from '../../../repository/interfaces/IEventLocationRepository';
import { IEventActivityRepository } from '../../../repository/interfaces/IEventActivityRepository';
import { CreateAttendanceService } from '../../../services/attendance/CreateAttendanceService';
import { FetchStudentByCpfService } from '../../../services/student/FetchStudentByCpfService';
import { AttendanceDomain } from '../../../domain/AttendanceDomain';
import { AppError } from '../../../utils/errors/AppError';
import { calculateDistance } from '../../../utils/calculateDistance';
import { Attendance } from '@prisma/client';

vi.mock('../../../utils/calculateDistance');

describe('CreateAttendanceService', () => {
	let createAttendanceService: CreateAttendanceService;
	let attendanceRepository: IAttendanceRepository;
	let eventCourseRepository: IEventCourseRepository;
	let eventLocationRepository: IEventLocationRepository;
	let eventActivityRepository: IEventActivityRepository;

	beforeEach(() => {
		attendanceRepository = {
			createAttendance: vi.fn(),
			fetchAttendanceByCpfAndActivity: vi.fn(),
		} as unknown as IAttendanceRepository;

		eventCourseRepository = {
			findEventCourse: vi.fn(),
		} as unknown as IEventCourseRepository;

		eventLocationRepository = {
			findEventLocationByEventId: vi.fn(),
		} as unknown as IEventLocationRepository;

		eventActivityRepository = {
			fetchEventActivityById: vi.fn(),
		} as unknown as IEventActivityRepository;

		createAttendanceService = new CreateAttendanceService(
			attendanceRepository,
			eventCourseRepository,
			eventLocationRepository,
			eventActivityRepository
		);

		vi.spyOn(FetchStudentByCpfService.prototype, 'fetchStudentByCpf').mockResolvedValue(
			[]
		);
	});

	it('should throw an error if the student is not found', async () => {
		const attendanceData = new AttendanceDomain({
			studentCpf: '12345678900',
			eventActivity: { getEventActivityId: () => 1 },
		} as any);

		await expect(
			createAttendanceService.execute(attendanceData, 1, 123.45, 678.9)
		).rejects.toThrow('Estudante não encontrado com o CPF fornecido');

		expect(FetchStudentByCpfService.prototype.fetchStudentByCpf).toHaveBeenCalledWith(
			'12345678900'
		);
	});
});
