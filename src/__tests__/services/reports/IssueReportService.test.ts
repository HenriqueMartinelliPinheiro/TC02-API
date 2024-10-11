import { describe, it, expect, beforeEach, vi } from 'vitest';
import { IssueReportService } from '../../../services/report/IssueReportsService';
import { IEventActivityRepository } from '../../../repository/interfaces/IEventActivityRepository';
import { IAttendanceRepository } from '../../../repository/interfaces/IAttendanceRepository';
import { AppError } from '../../../utils/errors/AppError';

// Mock dependencies
let eventActivityRepository: IEventActivityRepository;
let attendanceRepository: IAttendanceRepository;
let issueReportService: IssueReportService;

beforeEach(() => {
	eventActivityRepository = {
		fetchEventActivitiesByEventId: vi.fn(),
	} as unknown as IEventActivityRepository;

	attendanceRepository = {
		fetchAttendancesByActivity: vi.fn(),
	} as unknown as IAttendanceRepository;

	issueReportService = new IssueReportService(
		eventActivityRepository,
		attendanceRepository
	);
});

describe('IssueReportService', () => {
	it('should throw an error if no event activities are found', async () => {
		(eventActivityRepository.fetchEventActivitiesByEventId as any).mockResolvedValue([]);

		await expect(issueReportService.execute(1, 'test@example.com')).rejects.toThrow(
			new AppError('Nenhuma atividade para o evento', 400)
		);
	});

	it('should throw an error if no classes are found for the event year', async () => {
		(eventActivityRepository.fetchEventActivitiesByEventId as any).mockResolvedValue([
			{ eventActivityStartDate: new Date('2024-09-01T00:00:00Z') },
		]);
		vi.spyOn(
			issueReportService['getAllClassesYearService'],
			'getAllClassesByYear'
		).mockResolvedValue([]);

		await expect(issueReportService.execute(1, 'test@example.com')).rejects.toThrow(
			new AppError('Nenhuma turma encontrada para o ano fornecido', 400)
		);
	});

	it('should process classes and generate reports', async () => {
		(eventActivityRepository.fetchEventActivitiesByEventId as any).mockResolvedValue([
			{
				eventActivityId: 1,
				eventActivityStartDate: new Date('2024-09-01T08:00:00Z'),
				eventActivityEndDate: new Date('2024-09-01T10:00:00Z'),
				eventActivityTitle: 'Activity 1',
			},
		]);
		vi.spyOn(
			issueReportService['getAllClassesYearService'],
			'getAllClassesByYear'
		).mockResolvedValue([
			{
				'id-turma': 1,
				'descricao-horario':
					'23M12345 7M45 7T12 (29/07/2024 - 10/08/2024), 3M12345 7M45 7T1234 (13/08/2024 - 26/08/2024), 4M3 (02/10/2024 - 27/11/2024)',
				'codigo-turma': 'A1',
				'id-docente': '1',
			},
		]);
		vi.spyOn(
			issueReportService['fetchStudentByClassService'],
			'execute'
		).mockResolvedValue([{ 'cpf-cnpj': '12345678900', name: 'Student 1' }]);
		(attendanceRepository.fetchAttendancesByActivity as any).mockResolvedValue([
			{
				studentCpf: '12345678900',
				createdAt: new Date('2024-09-01T08:30:00Z'),
			},
		]);
		vi.spyOn(
			issueReportService['pdfReportGenerator'],
			'generateReport'
		).mockResolvedValue('path/to/report.pdf');
		vi.spyOn(issueReportService['fetchTeacherById'], 'getTeacherById').mockResolvedValue({
			email: 'teacher@example.com',
		});
		vi.spyOn(
			issueReportService,
			'sendReportsToTeachers' as keyof IssueReportService
		).mockResolvedValue(await Promise.resolve());
		vi.spyOn(
			issueReportService,
			'sendReportsToOrganizer' as keyof IssueReportService
		).mockResolvedValue(await Promise.resolve());

		await expect(
			issueReportService.execute(1, 'organizer@example.com')
		).resolves.not.toThrow();
	});

	it('should throw an error if class schedule processing fails', async () => {
		(eventActivityRepository.fetchEventActivitiesByEventId as any).mockResolvedValue([
			{ eventActivityStartDate: new Date('2024-09-01T00:00:00Z') },
		]);
		vi.spyOn(
			issueReportService['getAllClassesYearService'],
			'getAllClassesByYear'
		).mockResolvedValue([
			{
				'id-turma': 1,
				'descricao-horario': 'Invalid Schedule',
				'codigo-turma': 'A1',
				'id-docente': '1',
			},
		]);
		vi.spyOn(
			issueReportService['scheduleProcessor'],
			'processSchedule'
		).mockImplementation(() => {
			throw new Error('Invalid schedule format');
		});

		await expect(issueReportService.execute(1, 'test@example.com')).rejects.toThrow(
			new AppError(
				'Erro ao processar cronograma da turma A1: Invalid schedule format',
				500
			)
		);
	});
});
