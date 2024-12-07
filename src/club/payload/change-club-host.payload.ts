import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class ChangeClubHostPayload {
  @IsInt()
  @ApiProperty({
    description: '새로운 클럽 주최자의 ID',
    type: Number,
  })
  newHostId!: number;
}
