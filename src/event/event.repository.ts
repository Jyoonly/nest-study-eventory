import { Injectable } from "@nestjs/common";
import { PrismaService } from "../common/services/prisma.service";
import { CreateEventData } from "./type/create-event-data.type";
import { EventData } from "./type/event-data.type";

@Injectable()
export class EventRepository {
    constructor(private readonly prisma: PrismaService) { }

    async createEvent(data: CreateEventData): Promise<EventData> {
        return this.prisma.event.create({
            data: {
                hostId: data.hostId,
                title: data.title,
                description: data.description,
                categoryId: data.categoryId,
                cityId: data.cityId,
                startTime: data.startTime,
                endTime: data.endTime,
                maxPeople: data.maxPeople,
            },
            select: {
                id: true,
                hostId: true,
                title: true,
                description: true,
                categoryId: true,
                cityId: true,
                startTime: true,
                endTime: true,
                maxPeople: true,
            },
        });
    }
}