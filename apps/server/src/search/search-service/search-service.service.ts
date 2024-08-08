import { Injectable } from '@nestjs/common';
import { SearchResult } from '../interfaces/SearchResult.interface';
const { Client } = require('@elastic/elasticsearch');
import * as fs from 'fs';
import csvParser = require('csv-parser');

export const client = new Client({
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

  async ingestCSV(filePath: string) {
    const bulkOperations: { index: { _index: string; }; }[] = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row) => {
          // Prepare each row as an index operation in Elasticsearch
          bulkOperations.push({ index: { _index: this.index } });
          bulkOperations.push(row);
        })
        .on('end', async () => {
          try {
            // Bulk index the data into Elasticsearch
            const response = await client.bulk({
              refresh: true, // Ensures the documents are available for search immediately
              body: bulkOperations,
            });

            if (response.errors) {
              console.error('Errors occurred while indexing:', response.items);
              reject('Errors occurred while indexing');
            } else {
              console.log('CSV data successfully ingested');
              resolve('CSV data successfully ingested');
            }
          } catch (error) {
            console.error('Error ingesting CSV data:', error);
            reject(error);
          }
        })
        .on('error', (error) => {
          console.error('Error reading CSV file:', error);
          reject(error);
        });
    });
  }

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

async deleteAllDocuments() {
  try {
    const response = await client.deleteByQuery({
      index: this.index,
      body: {
        query: {
          match_all: {},
        },
      },
      refresh: true, // Optional: ensures that the deletion is immediately reflected in searches
    });
    return response;
  } catch (error) {
    console.error('Error deleting all documents:', error);
    throw error;
  }
}

async searchHealth(){
  const resp = await client.info();
  console.log(resp);
  return resp;
}

async searchAll() {
  try {
    const response = await client.search({
      index: this.index,
      body: {
        query: {
          match_all: {},
        },
      },
      size: 5, // Adjust the size to retrieve more documents if needed (default is 10)
      scroll: '1m', // Use scrolling if the index has more documents than the size limit
    });
    const parsedData : SearchResult[] = response.hits.hits;
    return parsedData;
  } catch (error) {
    console.error('Elasticsearch search error:', error);
    throw error;
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
