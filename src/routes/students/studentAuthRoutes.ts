import { Router } from 'express';
import { StudentAuthController } from '../../controllers/student/auth/StudentAuthController';
import { AuthExchangeController } from '../../controllers/student/auth/StudentAuthExchangeController';
import { StudentLoginService } from '../../services/student/StudentLoginService';
import { StudentExchangeService } from '../../services/student/StudentAuthExchangeService';

export const    studentAuthRouter = Router();

const loginService = new StudentLoginService();
const exchangeService = new StudentExchangeService();
const authLoginController = new StudentAuthController(loginService);
const authExchangeController = new AuthExchangeController(exchangeService);

studentAuthRouter.get('/auth/login', authLoginController.login);
studentAuthRouter.post('/auth/exchange', authExchangeController.exchange);
