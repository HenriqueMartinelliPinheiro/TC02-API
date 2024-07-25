import { isValidEmail } from "../../utils/validations/isValidEmail";
import { isValidRequest } from "../../utils/validations/isValidRequest";
import { createCourseTypes } from "../../@types/course/createCourseTypes";
import { CreateCourseService } from "../../services/course/CreateCourseService";
import { CourseDomain } from "../../domain/CourseDomain";

export class CreateCourseController {
    private createCourseService : CreateCourseService;
    constructor(createCourseService) {
        this.createCourseService = createCourseService;
    }
    async createCourse(req, res) {
        try {

            if (!isValidRequest(req.body, createCourseTypes)) {
                return res.status(400).json({
                    course: undefined,
                    msg: 'Dados Inválidos',
                });
            }

            if (!isValidEmail(req.body.courseEmailCoordinator)) {
                return res.status(400).json({
                    course: undefined,
                    msg: 'Email Inválido',
                });
            }
            const course = new CourseDomain({
                courseName: req.body.courseName,
                courseCoordinatorEmail: req.body.courseEmailCoordinator,
            })

            const createdCourse = await this.createCourseService.execute(course);

            return res.status(201).json({
                course: createdCourse,
                msg: 'Curso criado com sucesso',
            });
        }
        catch (error) {
            return res.status(400).json({
                course: undefined,
                msg: 'Erro ao criar curso',
            });
        }
    }
}