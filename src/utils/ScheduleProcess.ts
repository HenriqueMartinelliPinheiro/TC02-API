export class ScheduleProcessor {
	private parseDateBR(dateStr: string): Date {
		if (!dateStr) {
			throw new Error('Data inválida fornecida');
		}

		const [day, month, year] = dateStr.split('/').map(Number);

		if (isNaN(day) || isNaN(month) || isNaN(year)) {
			throw new Error('Formato de data inválido');
		}

		console.log(`Parsing date: ${dateStr} -> ${year}-${month}-${day}`);
		return new Date(year, month - 1, day);
	}

	private getDatesByWeekday(
		startDate: Date,
		endDate: Date,
		targetWeekdays: number[]
	): Date[] {
		console.log(
			`Generating dates between ${startDate.toLocaleDateString(
				'pt-BR'
			)} and ${endDate.toLocaleDateString('pt-BR')} for weekdays: ${targetWeekdays}`
		);
		const dates: Date[] = [];
		let currentDate = new Date(startDate);

		while (currentDate <= endDate) {
			// Em JavaScript, getDay() retorna 0 para domingo e 6 para sábado.
			// Precisamos ajustar para o formato desejado: 1 = domingo, ..., 7 = sábado.
			const currentWeekday = currentDate.getDay() === 0 ? 7 : currentDate.getDay();
			console.log(
				`Current date: ${currentDate.toLocaleDateString(
					'pt-BR'
				)} (Weekday: ${currentWeekday})`
			);

			if (targetWeekdays.includes(currentWeekday)) {
				console.log(`Adding date: ${currentDate.toLocaleDateString('pt-BR')}`);
				dates.push(new Date(currentDate));
			}

			currentDate.setDate(currentDate.getDate() + 1);
		}

		return dates;
	}

	public processSchedule(schedule: string): string[] {
		const resultDates: string[] = [];

		// Quebrar o cronograma por intervalos de datas
		const scheduleBlocks = schedule.split(/\s*,\s*/);
		console.log(`Schedule blocks: ${scheduleBlocks}`);

		// Processar cada bloco separadamente
		scheduleBlocks.forEach((block) => {
			console.log(`Processing block: ${block}`);
			const match = block.match(/\((\d{2}\/\d{2}\/\d{4})\s-\s(\d{2}\/\d{2}\/\d{4})\)/);

			if (!match) {
				throw new Error('Formato de bloco de cronograma inválido');
			}

			const startDateStr = match[1];
			const endDateStr = match[2];

			console.log(`Found date range: ${startDateStr} - ${endDateStr}`);

			const startDate = this.parseDateBR(startDateStr);
			const endDate = this.parseDateBR(endDateStr);

			// Extrair a sequência de dias da semana ignorando outros caracteres
			let currentIndex = 0;
			while (currentIndex < block.length) {
				const currentChar = block[currentIndex];

				if (/[1234567]/.test(currentChar)) {
					// Encontramos um dia da semana
					const dayOfWeek = Number(currentChar);
					console.log(`Found day of week: ${dayOfWeek}`);

					// Avançar até encontrar uma letra ou um parêntese
					while (currentIndex < block.length && !/[A-Za-z()]/.test(block[currentIndex])) {
						currentIndex++;
					}
				} else if (block[currentIndex] === '(') {
					// Encontramos o período de datas, parar o loop
					break;
				} else {
					// Continuar para o próximo caractere
					currentIndex++;
				}
			}

			// Obter todas as datas no intervalo que correspondem aos dias da semana fornecidos
			const filteredDates = this.getDatesByWeekday(startDate, endDate, [2, 3, 7]);

			filteredDates.forEach((date) => {
				resultDates.push(date.toLocaleDateString('pt-BR'));
			});
		});

		console.log(`Resulting dates: ${resultDates}`);
		return resultDates;
	}
}

// Exemplo de uso:
const scheduleProcessor = new ScheduleProcessor();
const schedule =
	'23M12345 7M45 7T12 (29/07/2024 - 10/08/2024), 3M12345 7M45 7T1234 (13/08/2024 - 26/08/2024), 4M3 (02/10/2024 - 27/11/2024)';
const result = scheduleProcessor.processSchedule(schedule);
console.log(result);
