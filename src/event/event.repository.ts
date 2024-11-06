import { Injectable } from "@nestjs/common";
import { PrismaService } from "../common/services/prisma.service";
import { CreateEventData } from "./type/create-event-data.type";
import { EventData } from "./type/event-data.type";
import { User, Category, City } from '@prisma/client';

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

    // 호스트가 모임 참여
    async joinEvent(Id: number, hostId: number): Promise<void> {
        await this.prisma.eventJoin.create({
            data: {
                eventId: Id,
                userId: hostId,
            },
        });
    }

    // 예외처리
    async getUserById(userId: number): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
    }

    async getCategoryById(categoryId: number): Promise<Category | null> {
        return this.prisma.category.findUnique({
            where: {
                id: categoryId,
            },
        });
    }

    async getCityById(cityId: number): Promise<City | null> {
        return this.prisma.city.findUnique({
            where: {
                id: cityId,
            },
        });
    }


    // 이벤트 1개 조회
    async getEventById(eventId: number): Promise<EventData | null> {
        return this.prisma.event.findUnique({
            where: {
                id: eventId,
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