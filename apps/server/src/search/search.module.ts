import { Module } from '@nestjs/common';
import { SearchControllerController } from './search-controller/search-controller.controller';
import { SearchServiceService } from './search-service/search-service.service';

@Module({
  controllers: [SearchControllerController],
  providers: [SearchServiceService]
})
export class SearchModule {}
