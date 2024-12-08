import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorator/user.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { UserBaseInfo } from 'src/auth/type/user-base-info.type';
import { ClubDto, ClubListDto } from './dto/club.dto';
import { CreateClubPayload } from './payload/create-club.payload';
import { ClubService } from './club.service';
import { ClubDetailDto } from './dto/club-detail.dto';
import { ClubQuery } from './query/club.query';
import { ClubRequestListDto } from './dto/club.request.dto';

@Controller('clubs')
@ApiTags('Club API')
export class ClubController {
  constructor(private readonly clubService: ClubService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '클럽 생성' })
  @ApiCreatedResponse({ type: ClubDto })
  async createClub(
    @Body() payload: CreateClubPayload,
    @CurrentUser() user: UserBaseInfo,
  ): Promise<ClubDto> {
    return this.clubService.createClub(payload, user);
  }

  @Get()
  @ApiOperation({ summary: '클럽 전체 조회' })
  @ApiOkResponse({ type: ClubListDto })
  async getClubs(@Query() query: ClubQuery): Promise<ClubListDto> {
    return this.clubService.getClubs(query);
  }

  @Get(':clubId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '클럽 상세 조회' })
  @ApiCreatedResponse({ type: ClubDetailDto })
  async getClubById(
    @Param('clubId', ParseIntPipe) clubId: number,
  ): Promise<ClubDetailDto> {
    return this.clubService.getClubById(clubId);
  }

  @Post(':clubId/request')
  @HttpCode(204) // No Content
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '클럽 가입 신청' })
  @ApiNoContentResponse()
  async requestClub(
    @Param('clubId', ParseIntPipe) clubId: number,
    @CurrentUser() user: UserBaseInfo,
  ): Promise<void> {
    return this.clubService.requestClub(clubId, user);
  }

  @Get(':clubId/request')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '클럽 가입 신청 목록 조회' })
  @ApiOkResponse({ type: ClubRequestListDto })
  async getClubRequests(
    @Param('clubId', ParseIntPipe) clubId: number,
    @CurrentUser() user: UserBaseInfo,
  ): Promise<ClubRequestListDto> {
    return this.clubService.getClubRequests(clubId, user);
  }

  // 고민1)
  // dto를 따로 만들기
  // vs
  // 그냥 userId만 가져오기

  // => dto안만들고 user정보만 가져올수 있나? 애초에 클럽장은 어디까지 볼 수 있지? 유저이름? 유저이메일? .. 흠..

  // dto를 따로 만들고, 만약 클럽장 권한이 생각보다 작으면 dto 안의 요소를 줄이는 방법도 괜찮지 않을까?

  // => 결론: dto를 사용합시다. 필요에 따라 정보노출을 조절하자.
  // 호스트만 조회 가능한 로직!!!!
}
