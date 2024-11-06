import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { EventService } from './event.service';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateEventPayload } from './payload/create-event.payload';
import { EventDto, EventListDto } from './dto/event.dto';
import { EventQuery } from './query/event.query';

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

    @Get()
    @ApiOperation({ summary: '여러 이벤트 정보를 가져옵니다' })
    @ApiOkResponse({ type: EventListDto })
    async getEvents(@Query() query: EventQuery): Promise<EventListDto> {
        return this.eventService.getEvents(query);
    }

}
