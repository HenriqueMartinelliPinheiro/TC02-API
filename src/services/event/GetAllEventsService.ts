import { IEventRepository } from "../../repository/interfaces/IEventRepository";
import { EventDomain } from "../../domain/EventDomain";

export class GetAllEventsService {
    private eventRepository : IEventRepository;

    constructor(repository : IEventRepository){
        this.eventRepository = repository;
    }

    execute = async () => {
        //necessário verificar se já existe antes de cadastrado
        try{
            const events : EventDomain[] | undefined = await this.eventRepository.getAllEvents();
            if(events){
                return {
                    success: true,
                    events: events,
                    msg: "Eventos Retornados com sucesso",
                }
            } else{
                return{
                    success: false,
                    events: null,
                    msg: "Erro ao consultar Eventos",
                }
            }
        } catch(error){
            return{
                success: false,
                event: null,
                msg: "Erro ao consultar Eventos",
            }
        }   
    }
}