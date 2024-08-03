import { IEventRepository } from "../../repository/interfaces/IEventRepository";
import { EventDomain } from "../../domain/EventDomain";

export class CreateEventService {
    private eventRepository: IEventRepository;

    constructor(repository: IEventRepository) {
        this.eventRepository = repository;
    }

    async execute(event: EventDomain): Promise<EventDomain> {
        try {
            const createdEvent = await this.eventRepository.createEvent(event);
            if (!createdEvent) {
                throw new Error("Erro ao Cadastrar Evento");
            }
            return createdEvent;
        } catch (error) {
            throw error;
        }
    }
}
