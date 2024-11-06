import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { EventRepository } from './event.repository';
import { CreateEventPayload } from './payload/create-event.payload';
import { EventDto } from './dto/event.dto';
import { CreateEventData } from './type/create-event-data.type';

@Injectable()
export class EventService {
    constructor(private readonly eventRepository: EventRepository) { }

    async createEvent(payload: CreateEventPayload): Promise<EventDto> {

        // 예외처리

        // 404 not found
        const user = await this.eventRepository.getUserById(payload.hostId);
        if (!user) {
            throw new NotFoundException('호스트가 유저목록에 존재하지 않습니다.');
        }

        const category = await this.eventRepository.getCategoryById(payload.categoryId);
        if (!category) {
            throw new NotFoundException('카테고리가 존재하지 않습니다.');
        }

        const city = await this.eventRepository.getCityById(payload.cityId);
        if (!city) {
            throw new NotFoundException('도시가 존재하지 않습니다.');
        }

        // 409 error
        // 1. 시작 시간이 끝나는 시간보다 늦은 경우
        if (payload.startTime > payload.endTime) {
            throw new ConflictException('시작 시간이 끝나는 시간보다 늦습니다.');
        }
        // 2. 시작 시간이 과거인 경우
        if (payload.startTime < new Date()) {
            throw new ConflictException('시작 시간이 과거입니다.');
        }

        const createData: CreateEventData = {
            hostId: payload.hostId,
            title: payload.title,
            description: payload.description,
            categoryId: payload.categoryId,
            cityId: payload.cityId,
            startTime: payload.startTime,
            endTime: payload.endTime,
            maxPeople: payload.maxPeople,
        };

        const event = await this.eventRepository.createEvent(createData);

        if (!event) {
            throw new ConflictException('이벤트 생성에 실패했습니다.');
        }
        // 호스트 이벤트 참가
        await this.eventRepository.joinEvent(event.id, event.hostId);

        return EventDto.from(event);
    }
}
