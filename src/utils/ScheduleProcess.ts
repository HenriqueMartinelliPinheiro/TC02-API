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
		currentDate.setHours(12, 0, 0, 0);

		while (currentDate <= endDate) {
			const currentWeekday = currentDate.getDay() + 1;

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

		const scheduleBlocks = schedule.split(/\s*,\s*/);
		console.log(`Schedule blocks: ${scheduleBlocks}`);

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

			let currentIndex = 0;
			const targetWeekdays: number[] = [];
			while (currentIndex < block.length) {
				const currentChar = block[currentIndex];

				if (/[1234567]/.test(currentChar)) {
					const dayOfWeek = Number(currentChar);
					console.log(`Found day of week: ${dayOfWeek}`);
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

		console.log(`Resulting dates: ${resultDates}`);
		return resultDates;
	}
}
