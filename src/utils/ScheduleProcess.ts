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

	private getDatesByWeekday(
		startDate: Date,
		endDate: Date,
		targetWeekdays: number[]
	): Date[] {
		const dates: Date[] = [];
		let currentDate = new Date(startDate);
		currentDate.setHours(12, 0, 0, 0);

		while (currentDate <= endDate) {
			const currentWeekday = currentDate.getDay() + 1;

			if (targetWeekdays.includes(currentWeekday)) {
				dates.push(new Date(currentDate));
			}

			currentDate.setDate(currentDate.getDate() + 1);
		}

		return dates;
	}

	public processSchedule(schedule: string): string[] {
		const resultDates: string[] = [];

		const scheduleBlocks = schedule.split(/\s*,\s*/);

		scheduleBlocks.forEach((block) => {
			const match = block.match(/\((\d{2}\/\d{2}\/\d{4})\s-\s(\d{2}\/\d{2}\/\d{4})\)/);

			if (!match) {
				throw new Error('Formato de bloco de cronograma inválido');
			}

			const startDateStr = match[1];
			const endDateStr = match[2];

			const startDate = this.parseDateBR(startDateStr);
			const endDate = this.parseDateBR(endDateStr);

			let currentIndex = 0;
			const targetWeekdays: number[] = [];
			while (currentIndex < block.length) {
				const currentChar = block[currentIndex];

				if (/[1234567]/.test(currentChar)) {
					const dayOfWeek = Number(currentChar);
					if (!targetWeekdays.includes(dayOfWeek)) {
						targetWeekdays.push(dayOfWeek);
					}
				} else if (/[A-Za-z]/.test(currentChar)) {
					while (currentIndex < block.length && !/[\s()]/.test(block[currentIndex])) {
						currentIndex++;
					}
				} else if (block[currentIndex] === '(') {
					break;
				}
				currentIndex++;
			}

			const filteredDates = this.getDatesByWeekday(startDate, endDate, targetWeekdays);

			filteredDates.forEach((date) => {
				resultDates.push(date.toLocaleDateString('pt-BR'));
			});
		});

		return resultDates;
	}
}
