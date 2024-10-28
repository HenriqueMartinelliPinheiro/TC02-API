import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Request, Response } from 'express';
import { FetchStudentByCpfController } from '../../../controllers/student/FetchStudentByCpfController';
import { FetchStudentByCpfService } from '../../../services/sigaa/sigaaStudent/FetchStudentByCpfService';

vi.mock('../../../services/sigaa/sigaaStudent/FetchStudentByCpfService');

describe('FetchStudentByCpfController', () => {
	let fetchStudentByCpfController: FetchStudentByCpfController;
	let req: Partial<Request>;
	let res: Partial<Response>;
	let fetchStudentByCpfService: FetchStudentByCpfService;

	beforeEach(() => {
		vi.clearAllMocks();

		fetchStudentByCpfService = new FetchStudentByCpfService();
		fetchStudentByCpfService.fetchStudentByCpf = vi.fn();

		fetchStudentByCpfController = new FetchStudentByCpfController();
		(fetchStudentByCpfController as any).fetchStudentByCpfService =
			fetchStudentByCpfService;

		req = {
			params: {
				cpf: '12345678900',
			},
		};

		res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn().mockReturnThis(),
		};
	});

	it('should return 200 with student data if student is found', async () => {
		const studentData = [
			{
				nome: 'Test Student',
				cpf: '12345678900',
			},
		];

		(fetchStudentByCpfService.fetchStudentByCpf as any).mockResolvedValue(studentData);

		await fetchStudentByCpfController.fetchStudentByCpf(req as Request, res as Response);

		expect(fetchStudentByCpfService.fetchStudentByCpf).toHaveBeenCalledWith(
			req.params.cpf
		);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(studentData);
	});

	it('should return 404 if student is not found', async () => {
		const error = new Error('Estudante não encontrado com o CPF fornecido');

		(fetchStudentByCpfService.fetchStudentByCpf as any).mockRejectedValue(error);

		await fetchStudentByCpfController.fetchStudentByCpf(req as Request, res as Response);

		expect(fetchStudentByCpfService.fetchStudentByCpf).toHaveBeenCalledWith(
			req.params.cpf
		);
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ error: error.message });
	});
});
