import { PrismaClient } from "@prisma/client";
import { UserRepository } from "../../repository/implementation/UserRepository";
import { IUserRepository } from "../../repository/interfaces/IUserRepository";
import { Request, Response } from "express";
import { createUserTypes } from "../../@types/user/createUserTypes";
import { CreateUserService } from "../../services/user/CreateUserService";
import { UserDomain } from "../../domain/UserDomain";

export class CreateUserController {
    private repository: IUserRepository;

    constructor() {
        const prismaClient = new PrismaClient();
        this.repository = new UserRepository(prismaClient);
        this.createUser = this.createUser.bind(this); // Vinculação explícita
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    private isValidPassword(password: string): boolean {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        return passwordRegex.test(password);
    }

    private generateErrorResponse(res: Response, message: string, errorCode: number): Response {
        return res.status(400).json({
            user: undefined,
            msg: message,
            errorCode: errorCode,
        });
    }

    private validateRequest(req: Request, res: Response): Response | null {
        const { error, value } = createUserTypes.validate(req.body);

        if (error) {
            return this.generateErrorResponse(res, "Dados Inválidos", 5);
        }
        if (!this.isValidEmail(value.userEmail)) {
            return this.generateErrorResponse(res, "Email Inválido", 5);
        }
        if (!this.isValidPassword(value.userPassword)) {
            return this.generateErrorResponse(res, "Senha Inválida", 5);
        }

        return null;
    }

    async createUser(req: Request, res: Response) {
        const validationResult = this.validateRequest(req, res);
        if (validationResult) {
            return validationResult;
        }

        try {
            const createUserService = new CreateUserService(this.repository);

            const user = await createUserService.execute(new UserDomain({
                userEmail: req.body.userEmail,
                userName: req.body.userName,
                userPassword: req.body.userPassword,
            }));

            return res.status(201).json({
                user,
                msg: "Usuário criado com sucesso",
                errorCode: 0,
            });
        } catch (error) {
            return res.status(500).json({
                user: undefined,
                msg: "Erro interno do servidor",
                errorCode: 1,
            });
        }
    }
}
