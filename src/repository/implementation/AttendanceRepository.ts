import { Attendance, PrismaClient } from '@prisma/client';
import { AttendanceDomain } from '../../domain/AttendanceDomain';
import { IAttendanceRepository } from '../interfaces/IAttendanceRepository';

const prisma = new PrismaClient();

export class AttendanceRepository implements IAttendanceRepository {
	async createAttendance(attendanceData: AttendanceDomain): Promise<Attendance> {
		return prisma.attendance.create({
			data: {
				studentName: attendanceData.getStudentName(),
				studentRegistration: attendanceData.getStudentRegistration(),
				studentCpf: attendanceData.getStudentCpf(),
				eventActivity: {
					connect: {
						eventActivityId: attendanceData.getEventActivity()?.getEventActivityId(),
					},
				},
			},
		});
	}
}
