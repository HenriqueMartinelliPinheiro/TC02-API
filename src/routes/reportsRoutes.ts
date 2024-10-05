import { PrismaClient } from '@prisma/client';
import express from 'express';
import { IssueReportController } from '../controllers/attendance/IssueReportController';
import { IssueReportService } from '../services/report/IssueReportsService';
import { EventActivityRepository } from '../repository/implementation/EventActivityRepository';
import { AttendanceRepository } from '../repository/implementation/AttendanceRepository';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';
import { eventRoles } from '../config/roles/event/eventRoles';

const reportsRouter = express.Router();

const prismaClient = new PrismaClient();

const eventActivityRepository = new EventActivityRepository(prismaClient);
const attendanceRepository = new AttendanceRepository(prismaClient);

const issueReportService = new IssueReportService(
	eventActivityRepository,
	attendanceRepository
);
const issueReportController = new IssueReportController(issueReportService);

reportsRouter.post(
	'/issueReport',
	// authMiddleware,
	// roleMiddleware(eventRoles.ISSUE_ATTENDANCE_REPORT),
	issueReportController.issueReport
);

export default reportsRouter;
