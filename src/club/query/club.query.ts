import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional } from 'class-validator';

export class ClubQuery {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @ApiPropertyOptional({
    description: '호스트 ID',
    type: Number,
  })
  hostId?: number;

  @IsOptional()
  @ApiPropertyOptional({
    description: '클럽 이름',
    type: String,
  })
  name?: string;
}
