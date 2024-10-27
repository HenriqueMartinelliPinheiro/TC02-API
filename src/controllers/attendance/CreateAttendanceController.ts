import { Request, Response } from 'express';
import { AttendanceDomain } from '../../domain/AttendanceDomain';
import { EventActivityDomain } from '../../domain/EventActivityDomain';
import { CreateAttendanceService } from '../../services/attendance/CreateAttendanceService';
import { FetchStudentByCpfService } from '../../services/sigaa/sigaaStudent/FetchStudentByCpfService';
import { isValidRequest } from '../../utils/validations/isValidRequest';
import { createAttendanceTypes } from '../../@types/attendance/createAttendanceTypes';
import { attendanceLogPath } from '../../config/logPaths';
import { Logger } from '../../loggers/Logger';
import { AppError } from '../../utils/errors/AppError';

export class CreateAttendanceController {
	private logger: Logger;
	private fetchStudentByCpfService: FetchStudentByCpfService;

	constructor(private createAttendanceService: CreateAttendanceService) {
		this.createAttendanceService = createAttendanceService;
		this.logger = new Logger('CreateAttendanceController', attendanceLogPath);
		this.fetchStudentByCpfService = new FetchStudentByCpfService();
		this.createAttendance = this.createAttendance.bind(this);
	}

	async createAttendance(req: Request, res: Response): Promise<Response> {
		try {
			const { eventActivityId, studentCpf, eventId, latitude, longitude } = req.body;

			const error = isValidRequest(req.body, createAttendanceTypes);

			if (typeof error === 'string') {
				this.logger.error(error, req.requestEmail);
				return res.status(400).json({
					event: undefined,
					msg: error,
				});
			}

			const studentData = await this.fetchStudentByCpfService.fetchStudentByCpf(
				studentCpf
			);
			if (!studentData || studentData.length === 0) {
				this.logger.error(
					`Aluno não encontrado com CPF: ${studentCpf}`,
					req.requestEmail
				);
				return res.status(404).json({
					event: undefined,
					msg: 'Aluno não encontrado',
				});
			}

			const { 'nome-discente': nomeDiscente, matricula } = studentData[0];

			const attendanceData = new AttendanceDomain({
				studentCpf,
				studentName: nomeDiscente,
				studentRegistration: matricula,
				eventActivity: new EventActivityDomain({
					eventActivityId,
				}),
			});

			const attendance = await this.createAttendanceService.execute(
				attendanceData,
				eventId,
				latitude,
				longitude
			);

			this.logger.info(
				`Presença registrada com sucesso para o aluno ${studentCpf}`,
				req.requestEmail
			);
			return res.status(201).json({
				event: attendance,
				msg: 'Presença registrada com sucesso',
			});
		} catch (error) {
			if (error instanceof AppError) {
				this.logger.error(error.message, req.requestEmail);
				return res.status(error.statusCode).json({
					event: undefined,
					msg: error.message,
				});
			}

			this.logger.error(
				'Erro ao registrar presença',
				req.requestEmail || 'Desconhecido',
				error
			);
			return res.status(500).json({
				event: undefined,
				msg: 'Erro interno do Servidor',
			});
		}
	}
}
