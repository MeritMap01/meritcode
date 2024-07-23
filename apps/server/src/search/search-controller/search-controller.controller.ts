import { TwoFactorGuard } from '@/server/auth/guards/two-factor.guard';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SearchServiceService } from '../search-service/search-service.service';

@Controller('search')
export class SearchControllerController {
    constructor(
        private readonly searchService: SearchServiceService
      ) {}

    @Get()
    @UseGuards(TwoFactorGuard)
    async getAllSearchResults(@Query('search') search: string) {
      if (search) {
        return this.searchService.search(search);
      }
      return null;
    }
}
