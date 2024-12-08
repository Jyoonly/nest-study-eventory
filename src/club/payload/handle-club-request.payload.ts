import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ClubRequestAction } from '../enum/club.enum';

export class HandleClubRequestPayload {
  @ApiProperty({
    description: '승인 또는 거절 여부 (APPROVE | REJECT)',
    enum: ClubRequestAction,
  })
  @IsEnum(ClubRequestAction, {
    message: 'action 값은 APPROVE 또는 REJECT 여야 합니다.',
  })
  action!: ClubRequestAction;
}
