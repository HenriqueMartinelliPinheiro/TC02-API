import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ICourseRepository } from '../../../repository/interfaces/ICourseRepository';
import { GetCourseByIdService } from '../../../services/course/GetCourseByIdService';
import { Course } from '@prisma/client';

describe('GetCourseByIdService', () => {
	let getCourseByIdService: GetCourseByIdService;
	let courseRepository: ICourseRepository;

	beforeEach(() => {
		courseRepository = {
			getCourseById: vi.fn(),
		} as unknown as ICourseRepository;

		getCourseByIdService = new GetCourseByIdService(courseRepository);
	});

	it('should return the course if found', async () => {
		const course = {
			courseId: 123,
			courseName: 'Test Course',
			courseCoordinatorEmail: 'coordinator@example.com',
		} as Course;

		(courseRepository.getCourseById as any).mockResolvedValue(course);

		const result = await getCourseByIdService.execute(123);

		expect(courseRepository.getCourseById).toHaveBeenCalledWith(123);
		expect(result).toEqual(course);
	});

	it('should return undefined if course is not found', async () => {
		(courseRepository.getCourseById as any).mockResolvedValue(undefined);

		const result = await getCourseByIdService.execute(123);

		expect(courseRepository.getCourseById).toHaveBeenCalledWith(123);
		expect(result).toBeUndefined();
	});

	it('should throw an error if an exception is thrown', async () => {
		const error = new Error('Unexpected error');
		(courseRepository.getCourseById as any).mockRejectedValue(error);

		await expect(getCourseByIdService.execute(123)).rejects.toThrow(error);
		expect(courseRepository.getCourseById).toHaveBeenCalledWith(123);
	});
});
