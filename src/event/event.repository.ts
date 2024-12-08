import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { CreateEventData } from './type/create-event-data.type';
import { Category, City, Club } from '@prisma/client';
import { EventDetailData } from './type/event-detail-data.type';
import { EventQuery } from './query/event.query';
import { EventData } from './type/event-data.type';
import { UpdateEventData } from './type/update-event-data.type';
import { UserBaseInfo } from 'src/auth/type/user-base-info.type';

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
        startTime: data.startTime,
        endTime: data.endTime,
        maxPeople: data.maxPeople,
        eventCity: {
          createMany: {
            data: data.cityIds.map((cityId) => ({
              cityId,
            })),
          },
        },
        eventJoin: {
          create: {
            userId: data.hostId,
          },
        },
        clubId: data.clubId,
      },
      select: {
        id: true,
        hostId: true,
        title: true,
        description: true,
        categoryId: true,
        eventCity: {
          select: {
            cityId: true,
          },
        },
        startTime: true,
        endTime: true,
        maxPeople: true,
        clubId: true,
      },
    });
  }

  async updateEvent(id: number, data: UpdateEventData): Promise<EventData> {
    return this.prisma.event.update({
      where: {
        id,
      },
      data: {
        title: data.title,
        description: data.description,
        categoryId: data.categoryId,
        eventCity: data.cityIds
          ? {
              deleteMany: {},
              createMany: {
                data: data.cityIds.map((cityId) => ({
                  cityId,
                })),
              },
            }
          : undefined,
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
        eventCity: {
          select: {
            cityId: true,
          },
        },
        startTime: true,
        endTime: true,
        maxPeople: true,
        clubId: true,
      },
    });
  }

  async deleteEvent(id: number): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.eventJoin.deleteMany({
        where: {
          eventId: id,
        },
      }),
      this.prisma.eventCity.deleteMany({
        where: {
          eventId: id,
        },
      }),
      this.prisma.event.delete({
        where: {
          id,
        },
      }),
    ]);
  }

  async findCategoryById(id: number): Promise<Category | null> {
    return this.prisma.category.findUnique({
      where: {
        id,
      },
    });
  }

  async findCitiesByIds(ids: number[]): Promise<City[]> {
    return this.prisma.city.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async findClubById(clubId: number): Promise<Club | null> {
    return this.prisma.club.findUnique({
      where: {
        id: clubId,
      },
    });
  }

  async isUserJoinedClub(clubId: number, userId: number): Promise<boolean> {
    const clubJoin = await this.prisma.clubJoin.findFirst({
      where: {
        clubId,
        userId,
      },
    });

    return !!clubJoin;
  }

  async findEventById(id: number): Promise<EventData | null> {
    return this.prisma.event.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        hostId: true,
        title: true,
        description: true,
        categoryId: true,
        eventCity: {
          select: {
            cityId: true,
          },
        },
        startTime: true,
        endTime: true,
        maxPeople: true,
        clubId: true,
      },
    });
  }
  async getJoinedClubIds(userId: number): Promise<number[]> {
    const data = await this.prisma.clubJoin.findMany({
      where: {
        userId,
      },
      select: {
        clubId: true,
      },
    });

    return data.map((d) => d.clubId);
  }

  async getEvents(query: EventQuery, userId: number): Promise<EventData[]> {
    const joinedClubs = await this.getJoinedClubIds(userId);
    return this.prisma.event.findMany({
      where: {
        OR: [
          { clubId: null , isArchived: false}, //일반모임
          { clubId: { in: joinedClubs} }, //내가 가입한 클럽 모임
          {
            isArchived: true,
            eventJoin: {
              some: {
                userId,
              },// 내가 참여한 아카이브된 모임
            }
          }
        ],
        categoryId: query.categoryId,
        eventCity: {
          some: {
            cityId: query.cityId,
          },
        },
        host: {
          id: query.hostId,
          deletedAt: null,
        },
        clubId: query.clubId,
      },
      select: {
        id: true,
        hostId: true,
        title: true,
        description: true,
        categoryId: true,
        eventCity: {
          select: {
            cityId: true,
          },
        },
        startTime: true,
        endTime: true,
        maxPeople: true,
        clubId: true,
      },
    });
  }

  async getEventsJoinedBy(userId: number): Promise<EventData[]> {
    return this.prisma.event.findMany({
      where: {
        eventJoin: {
          some: {
            userId,
          },
        },
      },
      select: {
        id: true,
        hostId: true,
        title: true,
        description: true,
        categoryId: true,
        eventCity: {
          select: {
            cityId: true,
          },
        },
        startTime: true,
        endTime: true,
        maxPeople: true,
        clubId: true,
      },
    });
  }

  async getParticipantsIds(eventId: number): Promise<number[]> {
    const data = await this.prisma.eventJoin.findMany({
      where: {
        eventId,
        user: {
          deletedAt: null,
        },
      },
      select: {
        userId: true,
      },
    });

    return data.map((d) => d.userId);
  }

  async joinEvent(eventId: number, userId: number): Promise<void> {
    await this.prisma.eventJoin.create({
      data: {
        eventId,
        userId,
      },
    });
  }

  async leaveEvent(eventId: number, userId: number): Promise<void> {
    await this.prisma.eventJoin.delete({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
    });
  }

  async findEventDetailById(id: number): Promise<EventDetailData | null> {
    return this.prisma.event.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        hostId: true,
        title: true,
        description: true,
        categoryId: true,
        eventCity: {
          select: {
            cityId: true,
          },
        },
        startTime: true,
        endTime: true,
        maxPeople: true,
        eventJoin: {
          where: {
            user: {
              deletedAt: null,
            },
          },
          select: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        review: {
          select: {
            id: true,
            userId: true,
            eventId: true,
            score: true,
            title: true,
            description: true,
          },
        },
        clubId: true,
      },
    });
  }
}
