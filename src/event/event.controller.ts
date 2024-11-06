import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { EventService } from './event.service';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateEventPayload } from './payload/create-event.payload';
import { EventDto } from './dto/event.dto';

@Controller('event')
@ApiTags('Event API')
export class EventController {
    constructor(private readonly eventService: EventService) { }

    @Post()
    @ApiOperation({ summary: '이벤트를 생성합니다' })
    @ApiCreatedResponse({ type: EventDto })
    async createEvent(@Body() payload: CreateEventPayload): Promise<EventDto> {
        return this.eventService.createEvent(payload);
    }

    @Get(':eventId')
    @ApiOperation({ summary: '이벤트 상세 정보를 가져옵니다' })
    @ApiOkResponse({ type: EventDto })
    async getEventById(
        @Param('eventId', ParseIntPipe) eventId: number,
    ): Promise<EventDto> {
        return this.eventService.getEventById(eventId);
    }

}
