import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { CreateClubData } from './type/create-club-data.type';
import { ClubData } from './type/club-data.type';
import { ClubDetailData } from './type/club-detail-data.type';

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

  async joinClub(clubId: number, userId: number): Promise<void> {
    await this.prisma.clubJoin.create({
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
}
