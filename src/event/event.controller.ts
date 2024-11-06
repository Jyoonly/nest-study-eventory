import { Body, Controller, Post } from '@nestjs/common';
import { EventService } from './event.service';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReviewDto } from 'src/review/dto/review.dto';
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

}
