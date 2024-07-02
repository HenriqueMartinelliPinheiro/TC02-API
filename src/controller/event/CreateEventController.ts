import { EventRepository } from "../../repository/implementation/EventRepository";
import { IEventRepository } from "../../repository/interfaces/IEventRepository";
import { PrismaClient } from "@prisma/client";
import { CreateEventService } from "../../services/event/CreateEventService";
import { Request, Response } from "express";
import { createEventTypes } from "../../@types/event/createEventTypes";
import { EventDomain } from "../../domain/EventDomain";

export class CreateEventController {
    private repository: IEventRepository;

    constructor() {
        this.repository = new EventRepository(new PrismaClient);
    }

    createEvent = async (req: Request, res: Response) => {
        const { error, value } = createEventTypes.validate(req.body);

        if (error || !value.title) {
            return res.status(400).json({
                "event": undefined,
                "msg": "Dados Inválidos",
            });
        }

        const createEventService = new CreateEventService(this.repository);
        try {
            const createdEvent = await createEventService.execute(new EventDomain({
                title: value.title,
                eventStatus: value.eventStatus,
                eventStartDate: value.eventStartDate,
                eventEndDate: value.eventEndDate,
            }));

            console.log("Evento criado com sucesso.");
            return res.status(201).json({
                success: true,
                event: createdEvent,
                msg: "Evento criado com sucesso",
            });
        } catch (error) {
            console.error("Erro ao executar CreateEventController", error);
            return res.status(500).json({
                success: false,
                event: undefined,
                msg: error.message || "Erro ao criar Evento",
            });
        }
    }
}
