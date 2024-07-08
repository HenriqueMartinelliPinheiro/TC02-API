import { Request, Response } from "express";
import { isValidEmail } from "../../utils/validations/isValidEmail";
import { isValidPassword } from "../../utils/validations/isValidPassword";
import { isValidRequest } from "../../utils/validations/isValidRequest";
import { generateErrorResponse } from "../../utils/generateErrorResponse";
import { UserDomain } from "../../domain/UserDomain";
import { Logger } from "../../loggers/Logger";
import { userLogPath } from "../../config/logPaths";
import { LoginUserService } from "../../services/user/LoginUserService";
import { loginUserTypes } from "../../@types/user/loginUserTypes";

export class LoginUserController {
        private loginUserService : LoginUserService;
        private logger : Logger;
    constructor(loginUserService: LoginUserService) {
        this.logger = new Logger("LoginUserController", userLogPath);
        this.loginUserService = loginUserService;
        this.loginUser = this.loginUser.bind(this);
    }

    async loginUser(req: Request, res: Response) {
        if (!isValidRequest(req.body, loginUserTypes)) {
            this.logger.warn(`Invalid Data on Login by user email: ${req.body.userEmail}`);
            return generateErrorResponse(res, "Dados Inválidos", 400);
        }

        if (!isValidPassword(req.body.userPassword)) {
            this.logger.warn(`Invalid Password on Login by user email: ${req.body.userEmail}`);
            return generateErrorResponse(res, "Senha Inválida", 400);
        }
        
        if (!isValidEmail(req.body.userEmail)) {
            this.logger.warn(`Invalid Email on Login  by user email: ${req.body.userEmail}`);
            return generateErrorResponse(res, "Email Inválido", 400);
        }

        try {
            const user = await this.loginUserService.execute(new UserDomain({
                userEmail: req.body.userEmail,
                userPassword: req.body.userPassword,
            }));

            if (!user) {
                this.logger.warn("Incorrect Email/Password");
                return res.status(401).json({
                    user: undefined,
                    msg: "Email ou senha incorretos",
                });
            }
            this.logger.info(`User Logged, User ID: ${user.getUserId}`);

            res.setHeader('x-access-token', user.getAccessToken());
            res.setHeader('x-refresh-token', user.getRefreshToken());

            return res.status(201).json({
                user,
                msg: "Usuário logado com sucesso",
            });
        
        } catch (error) {
            this.logger.error("Error when logging user", req.body.requestUserEmail, error);
            return generateErrorResponse(res, "Erro interno do servidor", 500)
        }
    }
}
