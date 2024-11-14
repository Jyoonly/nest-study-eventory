import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { EventRepository } from './event.repository';
import { CreateEventPayload } from './payload/create-event.payload';
import { EventDto, EventListDto } from './dto/event.dto';
import { CreateEventData } from './type/create-event-data.type';
import { EventQuery } from './query/event.query';

@Injectable()
export class EventService {
    constructor(private readonly eventRepository: EventRepository) { }

    // feat14: 이벤트 생성
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

    // feat16: 이벤트 한 개 조회
    async getEventById(eventId: number): Promise<EventDto> {
        const event = await this.eventRepository.getEventById(eventId);

        if (!event) {
            throw new NotFoundException('이벤트가 존재하지 않습니다.');
        }

        return EventDto.from(event);
    }

    // feat17: 이벤트 여러 개 조회
    async getEvents(query: EventQuery): Promise<EventListDto> {
        const events = await this.eventRepository.getEvents(query);

        return EventListDto.from(events);
    }

    // feat18: 유저가 모임에 참여
    async joinEvent(eventId: number, userId: number): Promise<void> {

        // 예외처리

        // 404 not found
        // 1. 유저가 존재하지 않는 경우
        const user = await this.eventRepository.getUserById(userId);
        if (!user) {
            throw new NotFoundException('유저가 존재하지 않습니다.');
        }

        // 2. 이벤트가 존재하지 않는 경우
        const event = await this.eventRepository.getEventById(eventId);
        if (!event) {
            throw new NotFoundException('이벤트가 존재하지 않습니다.');
        }

        // 409 error
        // 1. 이미 참가한 경우
        const isJoined = await this.eventRepository.isUserJoinedEvent(eventId, userId);
        if (isJoined) {
            throw new ConflictException('이미 참가한 이벤트입니다.');
        }

        // 2. 참가 인원이 초과된 경우
        const isOverMaxPeople = await this.eventRepository.isOverMaxPeople(eventId);
        if (isOverMaxPeople) {
            throw new ConflictException('참가 인원이 초과되었습니다.');
        }

        // 3. 이벤트가 시작된 경우
        const StartTime = await this.eventRepository.getStartTime(eventId);
        if (StartTime < new Date()) {
            throw new ConflictException('이미 시작된 이벤트입니다.');
        }

        // 4. 이벤트가 종료된 경우
        const endTime = await this.eventRepository.getEndTime(eventId);
        if (endTime < new Date()) {
            throw new ConflictException('이미 종료된 이벤트입니다.');
        }
        // 3번만 있어도 될지도.. 불필요한 코드인가? 

        await this.eventRepository.joinEvent(eventId, userId);
    }

    // feat19: 유저가 모임에서 나가기
    async outEvent(eventId: number, userId: number): Promise<void> {
        // 예외처리
        // 404 not found
        // 1. 유저가 존재하지 않는 경우
        const user = await this.eventRepository.getUserById(userId);
        if (!user) {
            throw new NotFoundException('유저가 존재하지 않습니다.');
        }

        // 2. 이벤트가 존재하지 않는 경우
        const event = await this.eventRepository.getEventById(eventId);
        if (!event) {
            throw new NotFoundException('이벤트가 존재하지 않습니다.');
        }

        // 409 error
        // 1. 호스트가 나가려는 경우
        if (event.hostId === userId) {
            throw new ConflictException('호스트는 이벤트에서 나갈 수 없습니다.');
        }

        // 2. 참가하지 않은 경우
        const isJoined = await this.eventRepository.isUserJoinedEvent(eventId, userId);
        if (!isJoined) {
            throw new ConflictException('참가하지 않은 이벤트입니다.');
        }

        // 3. 이벤트가 시작된 경우
        const StartTime = await this.eventRepository.getStartTime(eventId);
        if (StartTime < new Date()) {
            throw new ConflictException('이미 시작된 이벤트입니다.');
        }

        await this.eventRepository.outEvent(eventId, userId);

    }
}
