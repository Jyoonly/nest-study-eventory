import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ReviewRepository } from './review.repository';
import { CreateReviewPayload } from './payload/create-review.payload';
import { ReviewDto, ReviewListDto } from './dto/review.dto';
import { CreateReviewData } from './type/create-review-data.type';
import { ReviewQuery } from './query/review.query';

@Injectable()
export class ReviewService {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  async createReview(payload: CreateReviewPayload): Promise<ReviewDto> {

    //예외처리
    // 409 conflict :400도 404도 아닌 경우
    //4. 같은 모임에 같은 사람이 리뷰를 두 개 달려는 요청
    const isReviewExist = await this.reviewRepository.isReviewExist(
      payload.userId,
      payload.eventId,
    );
    if (isReviewExist) {
      throw new ConflictException('해당 유저의 리뷰가 이미 존재합니다.');
    }

    //2. 해당 모임에 참석한 유저도 아닌데 리뷰를 달려는 요청
    const isUserJoinedEvent = await this.reviewRepository.isUserJoinedEvent(
      payload.userId,
      payload.eventId,
    );
    if (!isUserJoinedEvent) {
      throw new ConflictException('해당 유저가 이벤트에 참가하지 않았습니다.');
    }

    // 404 Not Found (1)
    const event = await this.reviewRepository.getEventById(payload.eventId);
    if (!event) {
      throw new NotFoundException('Event가 존재하지 않습니다.');
    }

    //1. 리뷰는 모임이 끝난 후에 작성할 수 있는데, 끝나기도 전에 리뷰를 생성하려는 요청
    if (event.endTime > new Date()) {
      throw new ConflictException(
        'Event가 종료되지 않았습니다. 아직 리뷰를 작성할 수 없습니다.',
      );
    }

    // 3. 호스트가 리뷰를 생성하려는 요청
    if (event.hostId === payload.userId) {
      throw new ConflictException(
        '자신이 주최한 이벤트에는 리뷰를 작성 할 수 없습니다.',
      );
    }

    // 404 Not Found (2)
    const user = await this.reviewRepository.getUserById(payload.userId);
    if (!user) {
      throw new NotFoundException('User가 존재하지 않습니다.');
    }
      
    const createData: CreateReviewData = {
      userId: payload.userId,
      eventId: payload.eventId,
      score: payload.score,
      title: payload.title,
      description: payload.description,
    };

    const review = await this.reviewRepository.createReview(createData);

    return ReviewDto.from(review);
  }

  async getReviewById(reviewId: number): Promise<ReviewDto> {
    const review = await this.reviewRepository.getReviewById(reviewId);

    if (!review) {
      throw new NotFoundException('Review가 존재하지 않습니다.');
    }

    return ReviewDto.from(review);
  }

  async getReviews(query: ReviewQuery): Promise<ReviewListDto> {
    const reviews = await this.reviewRepository.getReviews(query);

    return ReviewListDto.from(reviews);
  }
    
}
  
