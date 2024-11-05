import { ApiProperty } from "@nestjs/swagger";
import { EventData } from "../type/event-data.type";

export class EventDto {
    @ApiProperty({
        description: '모임 ID',
        type: Number,
    })
    id!: number;

    @ApiProperty({
        description: '호스트 ID',
        type: Number,
    })
    hostId!: number;

    @ApiProperty({
        description: '모임 제목',
        type: String,
    })
    title!: string;

    @ApiProperty({
        description: '모임 설명',
        type: String,
    })
    description!: string;

    @ApiProperty({
        description: '카테고리 ID',
        type: Number,
    })
    categoryId!: number;

    @ApiProperty({
        description: '도시 ID',
        type: Number,
    })
    cityId!: number;

    @ApiProperty({
        description: '시작 시각',
        type: Date,
    })
    startTime!: Date;

    @ApiProperty({
        description: '종료 시각',
        type: Date,
    })
    endTime!: Date;

    @ApiProperty({
        description: '최대 정원',
        type: Number,
    })
    maxPeople!: number;

    static from(event: EventData): EventDto {
        return {
            id: event.id,
            hostId: event.hostId,
            title: event.title,
            description: event.description,
            categoryId: event.categoryId,
            cityId: event.cityId,
            startTime: event.startTime,
            endTime: event.endTime,
            maxPeople: event.maxPeople,
        };
    }

    static fromArray(events: EventData[]): EventDto[] {
        return events.map((event) => this.from(event));
    }
}

