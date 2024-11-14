import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ReviewDto, ReviewListDto } from './dto/review.dto';
import { CreateReviewPayload } from './payload/create-review.payload';
import { ReviewQuery } from './query/review.query';

@Controller('reviews')
@ApiTags('Review API')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @ApiOperation({ summary: '리뷰를 생성합니다' })
  @ApiCreatedResponse({ type: ReviewDto })
  async createReview(@Body() payload: CreateReviewPayload): Promise<ReviewDto> {
    return this.reviewService.createReview(payload);
  }

  @Get(':reviewId')
  @ApiOperation({ summary: '리뷰 상세 정보를 가져옵니다' })
  @ApiOkResponse({ type: ReviewDto })
  async getReviewById(
    @Param('reviewId', ParseIntPipe) reviewId: number,
  ): Promise<ReviewDto> {
    return this.reviewService.getReviewById(reviewId);
  }

  @Get()
  @ApiOperation({ summary: '여러 리뷰 정보를 가져옵니다' })
  @ApiOkResponse({ type: ReviewListDto })
  async getReviews(@Query() query: ReviewQuery): Promise<ReviewListDto> {
    return this.reviewService.getReviews(query);
  }
}
