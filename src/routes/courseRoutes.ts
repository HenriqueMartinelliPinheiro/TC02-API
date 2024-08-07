import { Router } from 'express';
import { CreateCourseController } from '../controllers/course/CreateCourseController';
import { CreateCourseService } from '../services/course/CreateCourseService';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middlewares/authMiddleware';
import { adminRoleMiddleware } from '../middlewares/adminRoleMiddleware';
import { CourseRepository } from '../repository/implementation/CourseRepository';
import { FetchAllCoursesController } from '../controllers/course/FetchAllCoursesController';
import { FetchAllCoursesService } from '../services/course/FetchAllCoursesService';
import { EditCourseController } from '../controllers/course/EditCourseController';
import { EditCourseService } from '../services/course/EditCourseService';
import { GetCourseByIdController } from '../controllers/course/GetCourseByIdController';
import { GetCourseByIdService } from '../services/course/GetCourseByIdService';

export const courseRouter = Router();

const courseRepository = new CourseRepository(new PrismaClient());

const createCourseService = new CreateCourseService(courseRepository);
const createCourseController = new CreateCourseController(createCourseService);

const fetchAllCoursesService = new FetchAllCoursesService(courseRepository);
const fetchAllCoursesController = new FetchAllCoursesController(fetchAllCoursesService);

const editCourseService = new EditCourseService(courseRepository);
const editCourseController = new EditCourseController(editCourseService);

const getCourseByIdService = new GetCourseByIdService(courseRepository);
const getCourseByIdController = new GetCourseByIdController(getCourseByIdService);

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

courseRouter.get(
	'/getCourse/:courseId',
	authMiddleware,
	adminRoleMiddleware,
	getCourseByIdController.getCourseById
);

courseRouter.put(
	'/editCourse/:courseId',
	authMiddleware,
	adminRoleMiddleware,
	editCourseController.editCourse
);
