import { Attendance } from '@prisma/client';
import { AttendanceDomain } from '../../domain/AttendanceDomain';

export interface IAttendanceRepository {
	createAttendance(attendanceData: AttendanceDomain): Promise<Attendance>;
}
