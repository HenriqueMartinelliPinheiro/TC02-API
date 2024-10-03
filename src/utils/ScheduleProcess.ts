export class ScheduleProcessor {
	// Função utilitária para converter uma data no formato brasileiro para Date
	private parseDateBR(dateStr: string): Date {
		console.log('dateStr: ', dateStr);
		if (!dateStr) {
			throw new Error('Data inválida fornecida');
		}

		const [day, month, year] = dateStr.split('/').map(Number);

		if (isNaN(day) || isNaN(month) || isNaN(year)) {
			throw new Error('Formato de data inválido');
		}

		return new Date(year, month - 1, day);
	}

	// Função para gerar as datas dentro de um intervalo
	private generateDateRange(startDate: Date, endDate: Date): Date[] {
		const dates: Date[] = [];
		let currentDate = new Date(startDate);

		while (currentDate <= endDate) {
			dates.push(new Date(currentDate));
			currentDate.setDate(currentDate.getDate() + 1);
		}

		return dates;
	}

	// Função principal para processar a string de cronograma e retornar as datas de aula
	public processSchedule(schedule: string): string[] {
		const resultDates: string[] = [];

		// Separar múltiplos cronogramas, se houver, retirando espaços extras
		const scheduleBlocks = schedule.split(', ');

		scheduleBlocks.forEach((block) => {
			console.log('Processing block: ', block);

			// Usando regex para garantir que estamos capturando o cronograma e as datas corretamente
			const match = block.match(
				/([7MT\d]+)\s\((\d{2}\/\d{2}\/\d{4})\s-\s(\d{2}\/\d{2}\/\d{4})\)/
			);

			if (!match) {
				throw new Error('Formato de bloco de cronograma inválido');
			}

			const schedulePart = match[1]; // Exemplo: "7M123"
			const startDateStr = match[2]; // Exemplo: "29/07/2024"
			const endDateStr = match[3]; // Exemplo: "31/08/2024"

			console.log('schedulePart: ', schedulePart);
			console.log('startDateStr: ', startDateStr);
			console.log('endDateStr: ', endDateStr);

			const startDate = this.parseDateBR(startDateStr);
			const endDate = this.parseDateBR(endDateStr);

			const datesInRange = this.generateDateRange(startDate, endDate);

			const dayMatch = schedulePart.match(/(\d)([MT])(\d+)?/);
			if (dayMatch) {
				const dayOfWeek = parseInt(dayMatch[1]);

				const filteredDates = datesInRange.filter((date) => {
					return date.getDay() === (dayOfWeek === 7 ? 6 : dayOfWeek - 1); // Ajustando para Date.getDay() (0 = domingo, 6 = sábado)
				});

				// Adicionando as datas no formato 'dd/mm/yyyy' no array resultDates
				filteredDates.forEach((date) => {
					resultDates.push(date.toLocaleDateString('pt-BR'));
				});
			}
		});

		return resultDates;
	}
}
