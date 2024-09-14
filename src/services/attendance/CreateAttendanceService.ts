import { Attendance } from '@prisma/client';
import { AttendanceDomain } from '../../domain/AttendanceDomain';
import { IAttendanceRepository } from '../../repository/interfaces/IAttendanceRepository';

export class CreateAttendanceService {
	constructor(private attendanceRepository: IAttendanceRepository) {
		this.attendanceRepository = attendanceRepository;
	}

	async execute(attendanceData: AttendanceDomain): Promise<Attendance> {
		return this.attendanceRepository.createAttendance(attendanceData);
	}
}
