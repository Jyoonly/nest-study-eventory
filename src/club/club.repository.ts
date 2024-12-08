import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { CreateClubData } from './type/create-club-data.type';
import { ClubData } from './type/club-data.type';
import { ClubDetailData } from './type/club-detail-data.type';
import { ClubQuery } from './query/club.query';
import { ClubRequestData } from './type/club-request-data.type';
import { UpdateClubData } from './type/update-club-data.type';

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

  async updateClub(id: number, data: UpdateClubData): Promise<ClubData> {
    return this.prisma.club.update({
      where: {
        id,
      },
      data: {
        name: data.name,
        description: data.description,
        maxPeople: data.maxPeople,
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

  async deleteClub(clubId: number): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      // 시작되지 않은 모임 삭제 (연관된 데이터도 삭제)
      await tx.eventCity.deleteMany({
        where: {
          event: {
            clubId,
            startTime: { gt: new Date() },
          },
        },
      });

      await tx.eventJoin.deleteMany({
        where: {
          event: {
            clubId,
            startTime: { gt: new Date() },
          },
        },
      });

      await tx.event.deleteMany({
        where: {
          clubId,
          startTime: { gt: new Date() },
        },
      });

      await tx.event.updateMany({
        // 시작된 모임 아카이브
        where: {
          clubId,
          startTime: { lte: new Date() },
        },
        data: {
          clubId: null, //클럽 의존성 제거
          isArchived: true,
        },
      });

      await tx.clubJoin.deleteMany({
        where: {
          clubId,
        },
      });

      await tx.clubRequest.deleteMany({
        where: {
          clubId,
        },
      });

      await tx.club.delete({
        where: {
          id: clubId,
        },
      });
    });
  }

  async findUserById(userId: number): Promise<{ id: number } | null> {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
      },
    });
  }

  async isJoinedUser(clubId: number, userId: number): Promise<boolean> {
    const clubJoin = await this.prisma.clubJoin.findFirst({
      where: {
        clubId,
        userId,
      },
    });

    return !!clubJoin;
  }

  async changeHost(clubId: number, newHostId: number): Promise<void> {
    await this.prisma.club.update({
      where: {
        id: clubId,
      },
      data: {
        hostId: newHostId,
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

  async leaveClub(clubId: number, userId: number): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      // 모임 참가 정보 삭제 (호스트 또는 참가자)
      await tx.eventJoin.deleteMany({
        where: {
          OR: [
            // 모임의 호스트
            {
              event: {
                hostId: userId,
                startTime: {
                  gt: new Date(),
                },
              },
            },
            // 모임의 참가자
            {
              userId,
              event: {
                startTime: {
                  gt: new Date(),
                },
              },
            },
          ],
        },
      });
      // 모임 도시 정보 삭제 (호스트인 경우만)
      await tx.eventCity.deleteMany({
        where: {
          event: {
            hostId: userId,
            startTime: {
              gt: new Date(),
            },
          },
        },
      });
      // 모임 삭제 (호스트인 경우만)
      await tx.event.deleteMany({
        where: {
          hostId: userId,
          startTime: {
            gt: new Date(),
          },
        },
      });

      // 클럽 탈퇴
      await tx.clubJoin.delete({
        where: {
          clubId_userId: {
            clubId,
            userId,
          },
        },
      });
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
