import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ICourseRepository } from '../../../repository/interfaces/ICourseRepository';
import { CourseDomain } from '../../../domain/CourseDomain';
import { CreateCourseService } from '../../../services/course/CreateCourseService';
import { Course } from '@prisma/client';
import { AppError } from '../../../utils/errors/AppError';

describe('CreateCourseService', () => {
	let createCourseService: CreateCourseService;
	let courseRepository: ICourseRepository;

	beforeEach(() => {
		courseRepository = {
			createCourse: vi.fn(),
		} as unknown as ICourseRepository;

		createCourseService = new CreateCourseService(courseRepository);
	});

	it('should create the course successfully', async () => {
		const course = new CourseDomain({
			courseName: 'Test Course',
			courseCoordinatorEmail: 'coordinator@example.com',
		});

		const createdCourse = {
			courseId: 123,
			courseName: 'Test Course',
			courseCoordinatorEmail: 'coordinator@example.com',
		} as Course;

		(courseRepository.createCourse as any).mockResolvedValue(createdCourse);

		const result = await createCourseService.execute(course);

		expect(courseRepository.createCourse).toHaveBeenCalledWith(course);
		expect(result).toEqual(createdCourse);
	});

	it('should throw an AppError if course creation fails', async () => {
		const course = new CourseDomain({
			courseName: 'Test Course',
			courseCoordinatorEmail: 'coordinator@example.com',
		});

		(courseRepository.createCourse as any).mockResolvedValue(null);

		await expect(createCourseService.execute(course)).rejects.toThrow(
			`Erro ao criar Curso, ID: ${course.getCourseId()}`
		);
		expect(courseRepository.createCourse).toHaveBeenCalledWith(course);
	});

	it('should throw an error if an exception is thrown', async () => {
		const course = new CourseDomain({
			courseName: 'Test Course',
			courseCoordinatorEmail: 'coordinator@example.com',
		});

		const error = new Error('Unexpected error');
		(courseRepository.createCourse as any).mockRejectedValue(error);

		await expect(createCourseService.execute(course)).rejects.toThrow(error);
		expect(courseRepository.createCourse).toHaveBeenCalledWith(course);
	});
});
