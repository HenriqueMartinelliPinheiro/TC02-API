import { IEventRepository } from "../interfaces/IEventRepository";
import { PrismaClient } from "@prisma/client";
import { EventDomain } from "../../domain/EventDomain";

export class EventRepository implements IEventRepository {
    private prismaClient: PrismaClient;
    
    constructor(prismaClient : PrismaClient){
        this.prismaClient = prismaClient; 
    }

    createEvent = async (event : EventDomain) : Promise<EventDomain | undefined> => {
        try {
            const createdEvent = await this.prismaClient.event.create({
                data: {
                    title: event.getTitle(),
                    eventStatus: event.getEventStatus(),
                    eventStartDate: event.getEventStartDate(),
                    eventEndDate: event.getEventEndDate()
                }
            });
            
            return new EventDomain({
                eventId: createdEvent.eventId,
                title: createdEvent.title,
                eventStatus: createdEvent.eventStatus,
                eventStartDate: createdEvent.eventStartDate,
                eventEndDate: createdEvent.eventEndDate,
            });

        } catch (error) {
            return undefined;
        }
    }

    getAllEvents = async () : Promise<EventDomain[]|undefined> =>{
        try {
            const returnedEvents = await this.prismaClient.event.findMany();
            const eventList : EventDomain [] = returnedEvents.map((event)=>{
                return new EventDomain({
                    eventId: event.eventId,
                    title: event.title,
                    eventStatus: event.eventStatus,
                    eventStartDate: event.eventStartDate,
                    eventEndDate: event.eventEndDate,
                });
           });
           return eventList;
        }
        catch(err) {
            return undefined;
        }
    }
}
