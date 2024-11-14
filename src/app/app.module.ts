import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configModule } from './modules/config.module';
import { LoggerMiddleware } from '../common/middlewares/logger.middleware';
import { CategoryModule } from 'src/category/category.module';
import { RegionModule } from '../region/region.module';
import { CommonModule } from '../common/common.module';
import { ReviewModule } from '../review/review.module';

@Module({
  imports: [
    configModule,
    CategoryModule,
    RegionModule,
    ReviewModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
