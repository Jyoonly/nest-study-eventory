import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class UpdateClubPayload {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '클럽 이름',
    type: String,
  })
  name?: string | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '클럽 설명',
    type: String,
  })
  description?: string | null;

  @IsOptional()
  @Min(1)
  @IsInt()
  @ApiPropertyOptional({
    description: '클럽 최대 인원',
    type: Number,
  })
  maxPeople?: number | null;
}
