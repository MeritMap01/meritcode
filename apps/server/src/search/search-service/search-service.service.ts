import { Injectable } from '@nestjs/common';
import { InputJson, OutputJson } from '../interfaces/Result.interface';
import { SearchResult } from '../interfaces/searchResult.interface';

const { Client } = require('@elastic/elasticsearch');
const client = new Client({
  node: 'https://localhost:9200',
  auth: {
    username: 'elastic',
    password: 'changeme'
  },
  tls: {
    rejectUnauthorized: false
  }
});

@Injectable()
export class SearchServiceService {
  private readonly index = 'resume-data';

 extractBasicsAndSections(input: InputJson): OutputJson {
  const { basics, sections } = input;
  return { basics, sections };
}

async insertDocument(data: OutputJson) {
  try {
    const response = await client.index({
      index: 'resume-data',
      body: data
    });
    console.log('Data Ingested Successfully', response);
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
      for (var i = 0; i < parsedData.length; i++) {
        const data = parsedData[i]._source?.data;
        // const outputJson = this.extractBasicsAndSections(JSON.parse(data));
        // this.insertDocument(outputJson);
    }
      return parsedData;
    } catch (error) {
      console.error('Elasticsearch search error:', error);
      throw error;
    }
  }
}
