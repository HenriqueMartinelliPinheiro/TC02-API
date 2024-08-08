import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ICourseRepository } from '../../../repository/interfaces/ICourseRepository';
import { CourseDomain } from '../../../domain/CourseDomain';
import { EditCourseService } from '../../../services/course/EditCourseService';
import { Course } from '@prisma/client';

describe('EditCourseService', () => {
	let editCourseService: EditCourseService;
	let courseRepository: ICourseRepository;

	beforeEach(() => {
		courseRepository = {
			editCourse: vi.fn(),
		} as unknown as ICourseRepository;

		editCourseService = new EditCourseService(courseRepository);
	});

	it('should edit the course successfully', async () => {
		const course = new CourseDomain({
			courseName: 'Test Course',
			courseCoordinatorEmail: 'coordinator@example.com',
			courseId: 123,
		});

		const editedCourse = {
			courseId: 123,
			courseName: 'Test Course',
			courseCoordinatorEmail: 'coordinator@example.com',
		} as Course;

		(courseRepository.editCourse as any).mockResolvedValue(editedCourse);

		const result = await editCourseService.execute(course);

		expect(courseRepository.editCourse).toHaveBeenCalledWith(course);
		expect(result).toEqual(editedCourse);
	});

	it('should throw an error if course editing fails', async () => {
		const course = new CourseDomain({
			courseName: 'Test Course',
			courseCoordinatorEmail: 'coordinator@example.com',
			courseId: 123,
		});

		(courseRepository.editCourse as any).mockResolvedValue(null);

		await expect(editCourseService.execute(course)).rejects.toThrow(
			'Error on edit Course'
		);
		expect(courseRepository.editCourse).toHaveBeenCalledWith(course);
	});

	it('should throw an error if an exception is thrown', async () => {
		const course = new CourseDomain({
			courseName: 'Test Course',
			courseCoordinatorEmail: 'coordinator@example.com',
			courseId: 123,
		});

		const error = new Error('Unexpected error');
		(courseRepository.editCourse as any).mockRejectedValue(error);

		await expect(editCourseService.execute(course)).rejects.toThrow(error);
		expect(courseRepository.editCourse).toHaveBeenCalledWith(course);
	});
});
