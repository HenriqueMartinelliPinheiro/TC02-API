import { PrismaClient } from '@prisma/client';
import { AttendanceRepository } from '../repository/implementation/AttendanceRepository';
import { Router } from 'express';
import { CreateAttendanceService } from '../services/attendance/CreateAttendanceService';
import { CreateAttendanceController } from '../controllers/attendance/CreateAttendanceController';
import { EventCourseRepository } from '../repository/implementation/EventCourseRepository';
import { EventLocationRepository } from '../repository/implementation/EventLocationRepository';
import { EventActivityRepository } from '../repository/implementation/EventActivityRepository';

export const attendanceRouter = Router();

const prismaClient = new PrismaClient();

const attendanceRepository = new AttendanceRepository(prismaClient);
const eventCourseRepository = new EventCourseRepository(prismaClient);
const eventActivityRepository = new EventActivityRepository(prismaClient);

const eventLocationRepository = new EventLocationRepository(prismaClient);
const createAttendanceService = new CreateAttendanceService(
	attendanceRepository,
	eventCourseRepository,
	eventLocationRepository,
	eventActivityRepository
);
const createAttendanceController = new CreateAttendanceController(
	createAttendanceService
);

attendanceRouter.post('/createAttendance', createAttendanceController.createAttendance);
