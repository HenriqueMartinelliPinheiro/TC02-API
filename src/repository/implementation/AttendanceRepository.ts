import { Attendance, PrismaClient } from '@prisma/client';
import { AttendanceDomain } from '../../domain/AttendanceDomain';
import { IAttendanceRepository } from '../interfaces/IAttendanceRepository';

export class AttendanceRepository implements IAttendanceRepository {
	private prismaClient: PrismaClient;
	constructor(prismaClient: PrismaClient) {
		this.prismaClient = prismaClient;
	}
	async createAttendance(attendanceData: AttendanceDomain): Promise<Attendance> {
		try {
			return await this.prismaClient.attendance.create({
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
		} catch (error) {
			throw new Error('Erro ao criar a presença: ' + error.message);
		}
	}

	async fetchAttendanceByCpf(studentCpf: string): Promise<Attendance[]> {
		try {
			const attendances = await this.prismaClient.attendance.findMany({
				where: { studentCpf },
				include: {
					eventActivity: true,
				},
			});

			if (attendances.length === 0) {
				throw new Error('Nenhuma presença encontrada para o CPF fornecido');
			}
			return attendances;
		} catch (error) {
			throw error;
		}
	}

	async fetchAttendanceById(attendanceId: number): Promise<Attendance | undefined> {
		try {
			const attendance = await this.prismaClient.attendance.findUnique({
				where: { AttendanceId: attendanceId },
				include: {
					eventActivity: true,
				},
			});

			if (!attendance) {
				throw new Error('Presença não encontrada para o ID fornecido');
			}
			return attendance;
		} catch (error) {
			throw error;
		}
	}

	async fetchAttendanceByCpfAndActivity(
		studentCpf: string,
		eventActivityId: number
	): Promise<Attendance | null> {
		try {
			const attendance = await this.prismaClient.attendance.findFirst({
				where: {
					studentCpf,
					eventActivityId,
				},
			});
			return attendance;
		} catch (error) {
			throw error;
		}
	}
}
