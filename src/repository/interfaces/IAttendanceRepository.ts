import { Attendance } from '@prisma/client';
import { AttendanceDomain } from '../../domain/AttendanceDomain';

export interface IAttendanceRepository {
	createAttendance(attendanceData: AttendanceDomain): Promise<Attendance>;
	fetchAttendanceByCpf(studentCpf: string): Promise<Attendance[]>;
	fetchAttendanceById(attendanceId: number): Promise<Attendance | undefined>;
	fetchAttendanceByCpfAndActivity(
		studentCpf: string,
		eventActivityId: number
	): Promise<Attendance | null>;
	fetchAttendanceByEvent(eventId: number): Promise<Attendance[]>;
}
