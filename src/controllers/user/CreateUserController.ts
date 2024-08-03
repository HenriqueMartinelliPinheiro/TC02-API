import { Request, Response } from "express";
import { CreateUserService } from "../../services/user/CreateUserService";
import { isValidEmail } from "../../utils/validations/isValidEmail";
import { isValidPassword } from "../../utils/validations/isValidPassword";
import { createUserTypes } from "../../@types/user/createUserTypes";
import { isValidRequest } from "../../utils/validations/isValidRequest";
import { generateUserErrorResponse } from "../../utils/generateUserErrorResponse";
import { UserDomain } from "../../domain/UserDomain";
import { RoleDomain } from "../../domain/RoleDomain";
import { Logger } from "../../loggers/Logger";
import { userLogPath } from "../../config/logPaths";

export class CreateUserController {
        private createUserService : CreateUserService;
        private logger : Logger;
    constructor(createUserService: CreateUserService) {
        this.logger = new Logger("CreateUserController", userLogPath);
        this.createUserService = createUserService;
        this.createUser = this.createUser.bind(this);
    }

    async createUser(req: Request, res: Response) {
        if (!isValidRequest(req.body, createUserTypes)) {
            this.logger.warn(`Invalid Data on create user ${req.body.userEmail}`, req.body.requestEmail);
            return  generateUserErrorResponse(res, "Dados Inválidos", 400);
        }

        if (!isValidPassword(req.body.userPassword)) {
            this.logger.warn(`Invalid Password on create user ${req.body.userEmail}`, req.body.requestEmail);
            return generateUserErrorResponse(res, "Senha Inválida", 400);
        }
        
        if (!isValidEmail(req.body.userEmail)) {
            this.logger.warn(`Invalid Email on create user ${req.body.userEmail}`, req.body.requestEmail);
            return generateUserErrorResponse(res, "Email Inválido", 400);
        }
        try {
            const user = await this.createUserService.execute(new UserDomain({
                userName: req.body.userName,
                userEmail: req.body.userEmail,
                userPassword: req.body.userPassword,
                role: new RoleDomain({
                    roleId: req.body.roleId,
                    roleTitle: req.body.roleTitle,
                })
            }));

            this.logger.info(`User Id ${user.getUserId()} created`,req.body.requestUserId);
            return res.status(201).json({
                user,
                msg: "Usuário criado com sucesso",
            });
        } catch (error) {
            this.logger.error("Error when creating user", req.body.requestEmail, error);
            console.log(error);
            return generateUserErrorResponse(res, "Erro ao criar usuário", 500)
        }
    }
}
