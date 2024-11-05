import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsInt, IsString } from "class-validator";

export class CreateEventPayload {
    @IsInt()
    @ApiProperty({
        description: '호스트 ID',
        type: Number,
    })
    hostId!: number;

    @IsString()
    @ApiProperty({
        description: '모임 제목',
        type: String,
    })
    title!: string;

    @IsString()
    @ApiProperty({
        description: '모임 설명',
        type: String,
    })
    description!: string;

    // 카테고리는 조건 더 필요하지 않나..? 흠 이건 나중에 생각해보자 => service에서 처리. 더불어 service에서 쓰는 함수?메서드?는 repository에 제작. 
    @IsInt()
    @ApiProperty({
        description: '카테고리 ID',
        type: Number,
    })
    categoryId!: number;

    @IsInt()
    @ApiProperty({
        description: '도시 ID',
        type: Number,
    })
    cityId!: number;

    @IsDate()
    @ApiProperty({
        description: '시작 시각',
        type: Date,
    })
    startTime!: Date;

    @IsDate()
    @ApiProperty({
        description: '종료 시각',
        type: Date,
    })
    endTime!: Date;

    @IsInt()
    @ApiProperty({
        description: '최대 정원',
        type: Number,
    })
    maxPeople!: number;
}