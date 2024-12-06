import { ApiProperty } from '@nestjs/swagger';
import { EventDto } from 'src/event/dto/event.dto';
import { ClubDetailData } from '../type/club-detail-data.type';

export class SimpleUserDto {
  @ApiProperty({
    description: '유저 ID',
    type: Number,
  })
  id!: number;

  @ApiProperty({
    description: '유저 이름',
    type: String,
  })
  name!: string;
}

export class ClubDetailDto {
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

  @ApiProperty({
    description: '참가자',
    type: [SimpleUserDto],
  })
  participants!: SimpleUserDto[];
  /*
  @ApiProperty({
    description: '클럽 전용 모임',
    type: [EventDto],
  })
  events!: EventDto[];
 */
  static from(data: ClubDetailData): ClubDetailDto {
    return {
      id: data.id,
      hostId: data.hostId,
      name: data.name,
      description: data.description,
      maxPeople: data.maxPeople,
      //events: data.event.map(EventDto.from),
      participants: data.clubJoin.map((join) => ({
        id: join.user.id,
        name: join.user.name,
      })), 
    };
  }
}
