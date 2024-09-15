import { Request, Response } from 'express';
import { FetchStudentByCpfService } from '../../services/student/FetchStudentByCpfService';

export class FetchStudentByCpfController {
	private fetchStudentByCpfService: FetchStudentByCpfService;

	constructor() {
		this.fetchStudentByCpfService = new FetchStudentByCpfService();
	}

	// Método para buscar o estudante por CPF
	async fetchStudentByCpf(req: Request, res: Response) {
		const { cpf } = req.params;

		try {
			const students = await this.fetchStudentByCpfService.fetchStudentByCpf(cpf);
			res.status(200).json(students); // Retorna o array de discentes encontrados
		} catch (error) {
			res.status(404).json({ error: error.message });
		}
	}
}
