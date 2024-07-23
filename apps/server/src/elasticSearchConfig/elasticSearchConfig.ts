const { Client } = require('@elastic/elasticsearch');
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