import { CourseDomain } from "../../domain/CourseDomain";

export interface ICourseRepository{
    //getCourseById(courseId:number) : Promise<CourseDomain | null>;
    createCourse(course:CourseDomain) : Promise<CourseDomain>;
}
