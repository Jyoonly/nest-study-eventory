import { ConflictException, Injectable } from '@nestjs/common';
import { CreateClubData } from './type/create-club-data.type';
import { CreateClubPayload } from './payload/create-club.payload';
import { UserBaseInfo } from 'src/auth/type/user-base-info.type';
import { ClubDto } from './dto/club.dto';
import { ClubRepository } from './club.repository';

@Injectable()
export class ClubService {
  constructor(private readonly clubRepository: ClubRepository) {}

  async createClub(
    payload: CreateClubPayload,
    user: UserBaseInfo,
  ): Promise<ClubDto> {
    // 에러 처리 로직
    const existingClub = await this.clubRepository.findClubByName(payload.name);
    if (existingClub) {
      throw new ConflictException('이미 같은 이름의 클럽이 있습니다.');
    }

    const data: CreateClubData = {
      hostId: user.id, 
      name: payload.name,
      description: payload.description,
      maxPeople: payload.maxPeople,
    };

    const club = await this.clubRepository.createClub(data);

    return ClubDto.from(club);
  }
}
