import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateClubData } from './type/create-club-data.type';
import { CreateClubPayload } from './payload/create-club.payload';
import { UserBaseInfo } from 'src/auth/type/user-base-info.type';
import { ClubDto, ClubListDto } from './dto/club.dto';
import { ClubRepository } from './club.repository';
import { ClubDetailDto } from './dto/club-detail.dto';
import { ClubQuery } from './query/club.query';
import { ClubRequestListDto } from './dto/club.request.dto';

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

  async getClubById(clubId: number): Promise<ClubDetailDto> {
    const club = await this.clubRepository.findClubDetailById(clubId);
    if (!club) {
      throw new NotFoundException('클럽을 찾을 수 없습니다.');
    }

    return ClubDetailDto.from(club);
  }

  async getClubs(query: ClubQuery): Promise<ClubListDto> {
    const clubs = await this.clubRepository.getClubs(query);

    return ClubListDto.from(clubs);
  }

  async requestClub(clubId: number, user: UserBaseInfo): Promise<void> {
    const club = await this.clubRepository.findClubById(clubId);

    if (!club) {
      throw new NotFoundException('클럽을 찾을 수 없습니다.');
    }
    // Error Handling
    // 1. clubJoin
    const joineduUsersIds = await this.clubRepository.getJoinedUsersIds(clubId);
    // 1-1. 이미 가입한 클럽인지 확인
    if (joineduUsersIds.includes(user.id)) {
      throw new ConflictException('이미 가입한 클럽입니다.');
    }
    // 1-2. 인원이 다 찼는지 확인
    if (club.maxPeople <= joineduUsersIds.length) {
      throw new ConflictException('인원이 다 찼습니다.');
    }
    // 2. clubRequest
    const requestedUsersIds =
      await this.clubRepository.getRequestedUsersIds(clubId);
    // 2-1. 이미 가입신청한 클럽인지 확인
    if (requestedUsersIds.includes(user.id)) {
      throw new ConflictException('이미 가입 신청한 클럽입니다.');
    }

    await this.clubRepository.requestClub(clubId, user.id);
  }

  async getClubRequests(
    clubId: number,
    user: UserBaseInfo,
  ): Promise<ClubRequestListDto> {
    const requests = await this.clubRepository.getClubRequests(clubId);

    const club = await this.clubRepository.findClubById(clubId);
    if (!club) {
      throw new NotFoundException('클럽을 찾을 수 없습니다.');
    }
    if (club.hostId !== user.id) {
      throw new ConflictException('클럽 주최자만 조회할 수 있습니다.');
    }

    return ClubRequestListDto.from(requests);
  }

  async handleClubRequest(
    requestId: number,
    action: 'APPROVE' | 'REJECT',
    user: UserBaseInfo,
  ): Promise<void> {
    const request = await this.clubRepository.findClubRequest(requestId);
    if (!request) {
      throw new NotFoundException('해당 클럽의 가입 신청을 찾을 수 없습니다.');
    }
    if (request.club.hostId !== user.id) {
      throw new ForbiddenException(
        '클럽 주최자만 가입 신청을 처리할 수 있습니다.',
      );
    }

    if (action === 'APPROVE') {
      await this.clubRepository.approveClubRequest(
        requestId,
        request.club.id,
        request.userId,
      );
    } else if (action === 'REJECT') {
      await this.clubRepository.rejectClubRequest(requestId);
    }
  }
}
