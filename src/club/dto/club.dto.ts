import { ApiProperty } from '@nestjs/swagger';
import { ClubData } from '../type/club-data.type';

export class ClubDto {
  @ApiProperty({
    description: '클럽 ID',
    type: Number,
  })
  id!: number;

  @ApiProperty({
    description: '호스트 ID',
    type: Number,
  })
  hostId!: number;

  @ApiProperty({
    description: '이름',
    type: String,
  })
  name!: string;

  @ApiProperty({
    description: '설명',
    type: String,
  })
  description!: string;

  @ApiProperty({
    description: '최대 인원',
    type: Number,
  })
  maxPeople!: number;

  static from(data: ClubData): ClubDto {
    return {
      id: data.id,
      hostId: data.hostId,
      name: data.name,
      description: data.description,
      maxPeople: data.maxPeople,
    };
  }

  static fromArray(data: ClubData[]): ClubDto[] {
    return data.map((club) => ClubDto.from(club));
  }
}

export class ClubListDto {
  @ApiProperty({
    description: '클럽 목록',
    type: [ClubDto],
  })
  clubs!: ClubDto[];

  static from(data: ClubData[]): ClubListDto {
    return {
      clubs: ClubDto.fromArray(data),
    };
  }
}
