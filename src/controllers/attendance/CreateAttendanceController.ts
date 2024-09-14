import { Request, Response } from 'express';
import { AttendanceDomain } from '../../domain/AttendanceDomain';
import { EventActivityDomain } from '../../domain/EventActivityDomain';
import { CreateAttendanceService } from '../../services/attendance/CreateAttendanceService';
import { isValidRequest } from '../../utils/validations/isValidRequest';
import { createAttendanceTypes } from '../../@types/attendance/createAttendanceTypes';
import { attendanceLogPath } from '../../config/logPaths';
import { Logger } from '../../loggers/Logger';

export class CreateAttendanceController {
	private logger: Logger;

	constructor(private createAttendanceService: CreateAttendanceService) {
		this.createAttendanceService = createAttendanceService;
		this.logger = new Logger('CreateAttendanceController', attendanceLogPath);
		this.createAttendance = this.createAttendance.bind(this);
	}

	async createAttendance(req: Request, res: Response): Promise<Response> {
		const { studentName, studentRegistration, eventActivityId } = req.body;

		const error = isValidRequest(req.body, createAttendanceTypes);

		if (typeof error === 'string') {
			this.logger.error(error, req.requestEmail);
			return res.status(400).json({
				event: undefined,
				msg: error,
			});
		}

		const attendanceData = new AttendanceDomain({
			studentName,
			studentRegistration,
			eventActivity: new EventActivityDomain({
				eventActivityId,
			}),
		});

		const attendance = await this.createAttendanceService.execute(attendanceData);

		return res.status(201).json(attendance);
	}
}
