export function getAllEventStatusValues(): string[] {
	try {
		return ['Nao Iniciado', 'Em Andamento', 'Encerrado', 'Cancelado'];
	} catch (error) {
		throw error;
	}
}
