import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { CreateClubData } from './type/create-club-data.type';
import { ClubData } from './type/club-data.type';
import { ClubDetailData } from './type/club-detail-data.type';
import { ClubQuery } from './query/club.query';
import { ClubRequestData } from './type/club-request-data.type';

@Injectable()
export class ClubRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createClub(data: CreateClubData): Promise<ClubData> {
    return this.prisma.club.create({
      data: {
        hostId: data.hostId,
        name: data.name,
        description: data.description,
        maxPeople: data.maxPeople,
        clubJoin: {
          create: {
            userId: data.hostId,
          },
        },
      },
      select: {
        id: true,
        hostId: true,
        name: true,
        description: true,
        maxPeople: true,
      },
    });
  }

  async findClubByName(name: string): Promise<ClubData | null> {
    return this.prisma.club.findUnique({
      where: { name },
    });
  }

  async findClubById(id: number): Promise<ClubData | null> {
    return this.prisma.club.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        hostId: true,
        name: true,
        description: true,
        maxPeople: true,
      },
    });
  }

  async getJoinedUsersIds(clubId: number): Promise<number[]> {
    const data = await this.prisma.clubJoin.findMany({
      where: {
        clubId,
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

  async getRequestedUsersIds(clubId: number): Promise<number[]> {
    const data = await this.prisma.clubRequest.findMany({
      where: {
        clubId,
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

  async requestClub(clubId: number, userId: number): Promise<void> {
    await this.prisma.clubRequest.create({
      data: {
        clubId,
        userId,
      },
    });
  }

  async findClubDetailById(id: number): Promise<ClubDetailData | null> {
    return this.prisma.club.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        hostId: true,
        name: true,
        description: true,
        maxPeople: true,
        clubJoin: {
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
        /*event: {
          select: {
            id: true,
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
          },
        },*/
      },
    });
  }

  async getClubs(query: ClubQuery): Promise<ClubData[]> {
    return this.prisma.club.findMany({
      where: {
        name: query.name,
        host: {
          id: query.hostId,
          deletedAt: null,
        },
      },
      select: {
        id: true,
        hostId: true,
        name: true,
        description: true,
        maxPeople: true,
      },
    });
  }

  async getClubRequests(clubId: number): Promise<ClubRequestData[]> {
    return this.prisma.clubRequest.findMany({
      where: {
        clubId,
      },
      select: {
        id: true,
        userId: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findClubRequest(requestId: number) {
    return this.prisma.clubRequest.findUnique({
      where: {
        id: requestId,
      },
      select: {
        id: true,
        userId: true,
        club: {
          select: {
            id: true,
            hostId: true,
          },
        },
      },
    });
  }

  async approveClubRequest(
    requestId: number,
    clubId: number,
    userId: number,
  ): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.clubJoin.create({
        data: {
          clubId,
          userId,
        },
      }),
      this.prisma.clubRequest.delete({
        where: {
          id: requestId,
        },
      }),
    ]);
  }

  async rejectClubRequest(requestId: number): Promise<void> {
    await this.prisma.clubRequest.delete({
      where: {
        id: requestId,
      },
    });
  }
}
