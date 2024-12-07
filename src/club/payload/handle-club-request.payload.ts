import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class HandleClubRequestPayload {
  @ApiProperty({
    description: '승인 또는 거절 여부 (APPROVE | REJECT)',
    enum: ['APPROVE', 'REJECT'],
  })
  @IsEnum(['APPROVE', 'REJECT'], {
    message: 'action 값은 APPROVE 또는 REJECT 여야 합니다.',
  })
  action!: 'APPROVE' | 'REJECT';
}
