import { Request, Response } from "express";
import { CreateUserService } from "../../services/user/CreateUserService";
import { isValidEmail } from "../../services/validations/isValidEmail";
import { isValidPassword } from "../../services/validations/isValidPassword";
import { createUserTypes } from "../../@types/user/createUserTypes";
import { isValidRequest } from "../../services/validations/isValidRequest";
import { generateErrorResponse } from "../../services/user/CreateUserGenerateErrorResponse";

export class CreateUserController {
    private createUserService: CreateUserService;

    constructor(createUserService: CreateUserService) {
        this.createUserService = createUserService;

        this.createUser = this.createUser.bind(this); // Vinculação explícita
    }

    async createUser(req: Request, res: Response) {
        if (!isValidRequest(req.body, createUserTypes)) {
            return  generateErrorResponse(res, "Dados Inválidos", 400);
        }

        if (!isValidPassword(req.body.userPassword)) {
            return generateErrorResponse(res, "Senha Inválida", 400);
        }
        
        if (!isValidEmail(req.body.userEmail)) {
            return generateErrorResponse(res, "Email Inválido", 400);
        }

        try {
            const user = await this.createUserService.execute(req.body);

            return res.status(201).json({
                user,
                msg: "Usuário criado com sucesso",
            });
        
        } catch (error) {
            console.error(error, Date.now());
            return generateErrorResponse(res, "Erro interno do servidor", 500)
        }
    }
}
