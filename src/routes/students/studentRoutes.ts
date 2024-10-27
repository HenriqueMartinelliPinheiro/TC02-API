import { Router } from 'express';
import { FetchStudentByCpfController } from '../../controllers/student/FetchStudentByCpfController';

const fetchStudentByCpfController = new FetchStudentByCpfController();
export const studentRouter = Router();

studentRouter.get('/students/cpf/:cpf', (req, res) =>
	fetchStudentByCpfController.fetchStudentByCpf(req, res)
);
