import { Request, Response } from 'express';
import { FetchStudentByCpfService } from '../../services/sigaa/sigaaStudent/FetchStudentByCpfService';

export class FetchStudentByCpfController {
	private fetchStudentByCpfService: FetchStudentByCpfService;

	constructor() {
		this.fetchStudentByCpfService = new FetchStudentByCpfService();
	}

	async fetchStudentByCpf(req: Request, res: Response) {
		const { cpf } = req.params;

		try {
			const students = await this.fetchStudentByCpfService.fetchStudentByCpf(cpf);
			res.status(200).json(students);
		} catch (error) {
			res.status(404).json({ error: error.message });
		}
	}
}
