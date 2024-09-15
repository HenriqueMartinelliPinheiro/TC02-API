import { Attendance, PrismaClient } from '@prisma/client';
import { AttendanceDomain } from '../../domain/AttendanceDomain';
import { IAttendanceRepository } from '../interfaces/IAttendanceRepository';

export class AttendanceRepository implements IAttendanceRepository {
	private prismaClient: PrismaClient;
	constructor(prismaClient: PrismaClient) {
		this.prismaClient = prismaClient;
	}
	async createAttendance(attendanceData: AttendanceDomain): Promise<Attendance> {
		return this.prismaClient.attendance.create({
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
