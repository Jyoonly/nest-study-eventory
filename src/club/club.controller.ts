import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
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
import { HandleClubRequestPayload } from './payload/handle-club-request.payload';
import { UpdateClubPayload } from './payload/update-club.payload';

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

  @Patch(':clubId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '클럽 정보 수정' })
  @ApiOkResponse({ type: ClubDto })
  async updateClub(
    @Param('clubId', ParseIntPipe) clubId: number,
    @Body() payload: UpdateClubPayload,
    @CurrentUser() user: UserBaseInfo,
  ): Promise<ClubDto> {
    return this.clubService.updateClub(clubId, payload, user);
  }

  @Delete(':clubId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '클럽 삭제' })
  @ApiNoContentResponse()
  async deleteClub(
    @Param('clubId', ParseIntPipe) clubId: number,
    @CurrentUser() user: UserBaseInfo,
  ): Promise<void> {
    return this.clubService.deleteClub(clubId, user);
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

  @Patch(':clubId/request/:requestId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '클럽 가입 신청 승인/거절' })
  @ApiNoContentResponse()
  async handleClubRequest(
    @Param('clubId', ParseIntPipe) clubId: number,
    @Param('requestId', ParseIntPipe) requestId: number,
    @Body() payload: HandleClubRequestPayload,
    @CurrentUser() user: UserBaseInfo,
  ): Promise<void> {
    return this.clubService.handleClubRequest(requestId, payload.action, user);
  }
}
