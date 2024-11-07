import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class JoinEventPayload {
    @IsInt()
    @ApiProperty({
        description: '유저 ID',
        type: Number,
    })
    userId!: number;
}