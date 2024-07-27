import { CourseDomain } from "../../domain/CourseDomain";
import { ICourseRepository } from "../../repository/interfaces/ICourseRepository";

export class CreateCourseService {
    private courseRepository: ICourseRepository;

    constructor(repository: ICourseRepository) {
        this.courseRepository = repository;
    }

    execute = async (): Promise<CourseDomain[]> => {
        try {
            const courses = await this.courseRepository.fetchAllCourses();
            if (!courses) {
                throw new Error("No Courses");
            }
            return courses;

        } catch (error) {
            throw error;
        }
    }
}