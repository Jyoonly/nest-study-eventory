import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { CreateClubData } from './type/create-club-data.type';
import { ClubData } from './type/club-data.type';

@Injectable()
export class ClubRepository {
    constructor(private readonly prisma: PrismaService) { }

    async createClub(data: CreateClubData): Promise<ClubData> {
        return this.prisma.club.create({
            data: {
                hostId: data.hostId,
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

    async findClubByName(name: string): Promise<ClubData | null> {
        return this.prisma.club.findUnique({
            where: { name },
        });
    }


}