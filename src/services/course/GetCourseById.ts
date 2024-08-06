import { ICourseRepository } from "../../repository/interfaces/ICourseRepository";

export class GetCourseById {
    private courseRepository : ICourseRepository;


    constructor(courseRepository : ICourseRepository){
        this.courseRepository = courseRepository;
    }

    
}
