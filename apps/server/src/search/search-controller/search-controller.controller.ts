import { Controller, Delete, Get, Query } from '@nestjs/common';
import { SearchServiceService } from '../search-service/search-service.service';

@Controller('search')
export class SearchControllerController {
    constructor(
        private readonly searchService: SearchServiceService
      ) {}

    @Get('/health')
    async getSearchHealth() {
      return this.searchService.searchHealth();
    }

    @Get('/all')
    async getAllSearchResults() {
      return this.searchService.searchAll();
    }

    @Get()
    async getSearchResults(@Query('search') search: string) {
      if (search) {
        return this.searchService.search(search);
      }
      return null;
    }

    @Get('/ingestcsv')
    async ingestCSV(){
      return this.searchService.ingestCSV('/Users/vrindamittal/Downloads/Resume_data_headers.csv');
    }

    @Delete()
    async deleteAllData() {
      return this.searchService.deleteAllDocuments();
    }
  
}
