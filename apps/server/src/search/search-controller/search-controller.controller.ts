import { Controller, Get, Query } from '@nestjs/common';
import { SearchServiceService } from '../search-service/search-service.service';

@Controller('search')
export class SearchControllerController {
    constructor(
        private readonly searchService: SearchServiceService
      ) {}

    @Get()
    async getAllSearchResults(@Query('search') search: string) {
      if (search) {
        return this.searchService.search(search);
      }
      return null;
    }
}
