import { describe, it, expect, beforeEach, vi } from 'vitest';
import axios from 'axios';
import { FetchStudentByCpfService } from '../../../services/sigaa/sigaaStudent/FetchStudentByCpfService';
import { AppError } from '../../../utils/errors/AppError';

vi.mock('axios');

describe('FetchStudentByCpfService', () => {
	let fetchStudentByCpfService: FetchStudentByCpfService;

	beforeEach(() => {
		vi.clearAllMocks();
		fetchStudentByCpfService = new FetchStudentByCpfService();
	});

	it('should return student data if student is found', async () => {
		const studentData = [
			{
				nome: 'Test Student',
				cpf: '12345678900',
			},
		];

		(axios.get as any).mockResolvedValue({ data: studentData });

		const result = await fetchStudentByCpfService.fetchStudentByCpf('12345678900');
		expect(axios.get).toHaveBeenCalledWith(fetchStudentByCpfService['apiUrl'], {
			params: { cpf: '12345678900' },
		});
		expect(result).toEqual(studentData);
	});

	it('should throw AppError if student is not found', async () => {
		(axios.get as any).mockResolvedValue({ data: [] });

		await expect(
			fetchStudentByCpfService.fetchStudentByCpf('12345678900')
		).rejects.toThrow(AppError);
		await expect(
			fetchStudentByCpfService.fetchStudentByCpf('12345678900')
		).rejects.toThrow('Estudante não encontrado com o CPF fornecido');
	});

	it('should throw AppError if axios throws an error', async () => {
		const error = new Error('Network Error');
		(axios.get as any).mockRejectedValue(error);

		await expect(
			fetchStudentByCpfService.fetchStudentByCpf('12345678900')
		).rejects.toThrow(AppError);
		await expect(
			fetchStudentByCpfService.fetchStudentByCpf('12345678900')
		).rejects.toThrow(`Erro ao buscar estudante por CPF: ${error.message}`);
	});
});
