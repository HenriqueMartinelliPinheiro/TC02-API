import { Router } from 'express';
import { FetchStudentByCpfController } from '../../controllers/student/FetchStudentByCpfController';
import verifyHttpOnlyTokenMiddleware from '../../middlewares/studentAuthMiddleware';

const fetchStudentByCpfController = new FetchStudentByCpfController();
export const studentRouter = Router();

studentRouter.get('/students/cpf/:cpf', verifyHttpOnlyTokenMiddleware, (req, res) =>
	fetchStudentByCpfController.fetchStudentByCpf(req, res)
);
