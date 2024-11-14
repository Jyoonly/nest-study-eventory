import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { CreateEventData } from './type/create-event-data.type';
import { EventData } from './type/event-data.type';
import { User, Category, City } from '@prisma/client';
import { ReviewQuery } from 'src/review/query/review.query';
import { EventQuery } from './query/event.query';

@Injectable()
export class EventRepository {
  constructor(private readonly prisma: PrismaService) {}

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

  // 유저가 모임 참여
  async joinEvent(eventId: number, userId: number): Promise<void> {
    await this.prisma.eventJoin.create({
      data: {
        eventId: eventId,
        userId: userId,
      },
    });
  }

  // 유저가 모임 나가기
  async outEvent(eventId: number, userId: number): Promise<void> {
    await this.prisma.eventJoin.delete({
      where: {
        eventId_userId: {
          eventId: eventId,
          userId: userId,
        },
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

  // 이벤트 여러개 조회
  async getEvents(query: EventQuery): Promise<EventData[]> {
    return this.prisma.event.findMany({
      where: {
        hostId: query.hostId,
        cityId: query.cityId,
        categoryId: query.categoryId,
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

  // 예외처리
  // 이미 참여한 이벤트인지
  async isUserJoinedEvent(eventId: number, userId: number): Promise<boolean> {
    const eventJoin = await this.prisma.eventJoin.findUnique({
      where: {
        eventId_userId: {
          eventId: eventId,
          userId: userId,
        },
      },
    });

    return !!eventJoin;
  }

  // 최대 인원수 초과했는지
  async isOverMaxPeople(eventId: number): Promise<boolean> {
    const event = await this.prisma.event.findUnique({
      where: {
        id: eventId,
      },
      select: {
        maxPeople: true,
      },
    });

    const eventJoinCount = await this.prisma.eventJoin.count({
      where: {
        eventId: eventId,
      },
    });

    return eventJoinCount >= event!.maxPeople;
    // 이미 service에서 event 존재여부를 확인했기 때문에 event가 null일 수 없음
    // 비교작업 repository에서 해도 괜찮은가? repository는 데베와 소통만 하는게 나은거아닌가?
  }

  // 이벤트 시작시간
  async getStartTime(eventId: number): Promise<Date> {
    const event = await this.prisma.event.findUnique({
      where: {
        id: eventId,
      },
      select: {
        startTime: true,
      },
    });

    return event!.startTime;
  }

  // 이벤트 종료시간
  async getEndTime(eventId: number): Promise<Date> {
    const event = await this.prisma.event.findUnique({
      where: {
        id: eventId,
      },
      select: {
        endTime: true,
      },
    });

    return event!.endTime;
  }
}
