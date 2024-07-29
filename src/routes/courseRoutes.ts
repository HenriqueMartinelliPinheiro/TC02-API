import { Router } from 'express';
import { CreateCourseController } from '../controllers/course/CreateCourseController';
import { CreateCourseService } from '../services/course/CreateCourseService';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middlewares/authMiddleware';
import { adminRoleMiddleware } from '../middlewares/adminRoleMiddleware';
import { CourseRepository } from '../repository/implementation/CourseRepository';

export const courseRouter = Router();

const courseRepository = new CourseRepository(new PrismaClient);
const createCourseService = new CreateCourseService(courseRepository);
const createCourseController = new CreateCourseController(createCourseService);

courseRouter.post("/createCourse",authMiddleware, adminRoleMiddleware, createCourseController.createCourse);