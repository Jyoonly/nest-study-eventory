import { ApiProperty } from '@nestjs/swagger';
import { ClubRequestData } from '../type/club-request-data.type';

export class ClubRequestDto {
  @ApiProperty({
    description: '클럽 가입 신청 ID',
    type: Number,
  })
  id!: number;

  @ApiProperty({
    description: '유저 ID',
    type: Number,
  })
  userId!: number;

  @ApiProperty({
    description: '이름',
    type: String,
  })
  name!: string;

  @ApiProperty({
    description: '이메일',
    type: String,
  })
  email!: string;

  // 일단 id, userId, name, email 제공했으나 클럽 주최자가 볼 수 있는 정보를 name, email로만 제한해야 하나 고민되긴한다..
  static from(data: ClubRequestData): ClubRequestDto {
    return {
      id: data.id,
      userId: data.userId,
      name: data.user.name,
      email: data.user.email,
    };
  }

  static fromArray(data: ClubRequestData[]): ClubRequestDto[] {
    return data.map((club) => ClubRequestDto.from(club));
  }
}

export class ClubRequestListDto {
  @ApiProperty({
    description: '클럽 가입 신청 목록',
    type: [ClubRequestDto],
  })
  clubRequests!: ClubRequestDto[];

  static from(data: ClubRequestData[]): ClubRequestListDto {
    return {
      clubRequests: ClubRequestDto.fromArray(data),
    };
  }
}
