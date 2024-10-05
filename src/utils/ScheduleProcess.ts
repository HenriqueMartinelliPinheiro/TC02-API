export class ScheduleProcessor {
	private parseDateBR(dateStr: string): Date {
		if (!dateStr) {
			throw new Error('Data inválida fornecida');
		}

		const [day, month, year] = dateStr.split('/').map(Number);

		if (isNaN(day) || isNaN(month) || isNaN(year)) {
			throw new Error('Formato de data inválido');
		}

		return new Date(year, month - 1, day);
	}

	private generateDateRange(startDate: Date, endDate: Date): Date[] {
		const dates: Date[] = [];
		let currentDate = new Date(startDate);

		while (currentDate <= endDate) {
			dates.push(new Date(currentDate));
			currentDate.setDate(currentDate.getDate() + 1);
		}

		return dates;
	}

	public processSchedule(schedule: string): string[] {
		const resultDates: string[] = [];

		const scheduleBlocks = schedule.split(/\s*,\s*/);

		scheduleBlocks.forEach((block) => {
			const match = block.match(
				/([1234567MT\d]+)\s\((\d{2}\/\d{2}\/\d{4})\s-\s(\d{2}\/\d{2}\/\d{4})\)/
			);

			if (!match) {
				throw new Error('Formato de bloco de cronograma inválido');
			}

			const schedulePart = match[1];
			const startDateStr = match[2];
			const endDateStr = match[3];

			const startDate = this.parseDateBR(startDateStr);
			const endDate = this.parseDateBR(endDateStr);

			const datesInRange = this.generateDateRange(startDate, endDate);

			// Extrair a sequência de dias da semana
			const dayMatch = schedulePart.match(/([1234567]+)/);
			if (dayMatch) {
				const daysOfWeek = dayMatch[1].split('').map(Number); // Converte os dias para números

				const filteredDates = datesInRange.filter((date) => {
					// O getDay() retorna 0 para domingo, então ajustamos aqui
					const weekDay = date.getDay() === 0 ? 7 : date.getDay();
					return daysOfWeek.includes(weekDay);
				});

				filteredDates.forEach((date) => {
					resultDates.push(date.toLocaleDateString('pt-BR'));
				});
			}
		});

		return resultDates;
	}
}
