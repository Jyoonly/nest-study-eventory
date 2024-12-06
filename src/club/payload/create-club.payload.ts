import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsInt,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreateClubPayload {
<<<<<<< HEAD
    /*
    @IsInt()
    @IsPositive()
    @ApiProperty({
        description: '호스트 ID',
        type: Number,
    })
    hostId!: number;
    */
    @IsString()
    @ApiProperty({
        description: '이름',
        type: String,
    })
    name!: string;
=======
  @IsInt()
  @IsPositive()
  @ApiProperty({
    description: '호스트 ID',
    type: Number,
  })
  hostId!: number;

  @IsString()
  @ApiProperty({
    description: '이름',
    type: String,
  })
  name!: string;
>>>>>>> 88836ec2e0e8152b2709dc5b4d7fd1879cba7f01

  @IsString()
  @ApiProperty({
    description: '설명',
    type: String,
  })
  description!: string;

  @Min(2)
  @IsInt()
  @ApiProperty({
    description: '최대 인원',
    type: Number,
  })
  maxPeople!: number;
}
