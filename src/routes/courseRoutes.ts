import { Router } from 'express';
import { CreateCourseController } from '../controllers/course/CreateCourseController';
import { CreateCourseService } from '../services/course/CreateCourseService';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middlewares/authMiddleware';
import { adminRoleMiddleware } from '../middlewares/adminRoleMiddleware';
import { CourseRepository } from '../repository/implementation/CourseRepository';
import { FetchAllCoursesController } from '../controllers/course/FetchAllCoursesController';
import { FetchAllCoursesService } from '../services/course/FetchAllCoursesService';

export const courseRouter = Router();

const courseRepository = new CourseRepository(new PrismaClient());

const createCourseService = new CreateCourseService(courseRepository);
const createCourseController = new CreateCourseController(createCourseService);

const fetchAllCoursesService = new FetchAllCoursesService(courseRepository);
const fetchAllCoursesController = new FetchAllCoursesController(fetchAllCoursesService);

courseRouter.post(
	'/createCourse',
	authMiddleware,
	adminRoleMiddleware,
	createCourseController.createCourse
);

courseRouter.get(
	'/fetchAllCourses',
	authMiddleware,
	adminRoleMiddleware,
	fetchAllCoursesController.fetchAllCourses
);
