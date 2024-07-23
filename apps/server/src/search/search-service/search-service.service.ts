import { Injectable } from '@nestjs/common';
import { SearchResult } from '../interfaces/SearchResult.interface';
import {client} from '../../elasticSearchConfig/elasticSearchConfig';

@Injectable()
export class SearchServiceService {
  private readonly index = 'resume-data';

async insertDocument(data: any){
  try {
    const response : SearchResult = await client.index({
      index: this.index,
      body: data
    });
    console.log('Data Ingested Successfully', response);
    return response;
  } catch (error) {
    console.error(error);
  }
}

async updateDocument(data: any) {
  try {
    const response : SearchResult = await client.update({
      index: this.index,
      body: {
        doc: data,
      }
    });
    console.log('Data Updated Successfully', response);
  } catch (error) {
    console.error(error);
  }
}

  async search(text: string) {
    try {
      const response = await client.search({
        index: this.index,
        body: {
          query: {
            query_string: {
              query: text,
            },
          },
        },
      });
      const parsedData : SearchResult[] = response.hits.hits;
      return parsedData;
    } catch (error) {
      console.error('Elasticsearch search error:', error);
      throw error;
    }
  }
}
